import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getApiUrl } from '../../config/api';
import { SHIPPING_COSTS, PICKUP_LOCATIONS, buildPickupAddress, type PickupLocationId } from '../../config/site';
import { BELGIAN_CITIES } from '../../data/belgianCities';
import { useScrollAnimations } from '../../hooks/useScrollAnimations';

interface CartItem {
  id: string;
  title: string;
  prix: string | number;
  quantity: number;
  image_url: string;
  stock?: number;
}

interface CheckoutFormProps {
  cart: CartItem[];
  total: number;
  onBack: () => void;
  onSuccess: () => void;
}

const INPUT_CLASS = "font-basecoat w-full rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm sm:text-base focus:ring-2 focus:ring-benin-jaune focus:border-transparent outline-none transition bg-white dark:bg-gray-900";
const LABEL_CLASS = "font-basecoat block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2";

export default function CheckoutForm({ cart, total, onBack, onSuccess }: CheckoutFormProps) {
  const [formData, setFormData] = useState({ nom: '', email: '', telephone: '', notes: '' });
  const [deliveryMode, setDeliveryMode] = useState<'livraison' | 'retrait'>('livraison');
  const [country, setCountry] = useState('belgique');
  const [pickupLocation, setPickupLocation] = useState<PickupLocationId>('grimbergen');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState('');
  const isSubmittingRef = useRef(false);
  const { t } = useTranslation();
  const scrollRef = useScrollAnimations([deliveryMode]);

  const API_URL = getApiUrl();
  const shippingCost = deliveryMode === 'retrait' ? 0 : (SHIPPING_COSTS[country]?.cost ?? 12);
  const shippingLabel = deliveryMode === 'retrait' ? 'GRATUIT' : `${shippingCost.toFixed(2)} €`;
  const grandTotal = total + shippingCost;
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    fetch(`${API_URL}/api/commandes`, { method: 'HEAD', mode: 'no-cors' }).catch(() => {});
  }, [API_URL]);

  const handlePostalCodeChange = (val: string) => {
    setPostalCode(val);
    if (country === 'belgique' && val.length === 4) {
      const found = BELGIAN_CITIES[val];
      if (found) setCity(found);
    }
  };

  const handleCountryChange = (val: string) => {
    setCountry(val);
    setPostalCode('');
    setCity('');
  };

  const buildAdresse = (): string => {
    if (deliveryMode === 'retrait') return buildPickupAddress(pickupLocation);
    const countryLabel = SHIPPING_COSTS[country]?.label ?? country;
    return [street, `${postalCode} ${city}`.trim(), countryLabel].filter(Boolean).join(', ');
  };

  const validateStock = async (): Promise<string | null> => {
    try {
      const checks = await Promise.all(
        cart.map(async (item) => {
          const res = await fetch(`${API_URL}/api/realisations/${item.id}?populate[0]=Declinaison`, {
            signal: AbortSignal.timeout(8000),
          });
          if (!res.ok) return null;
          const data = await res.json();
          const r = data?.data;
          if (!r) return null;
          // Check total stock across all declinaisons, or direct Stock field
          const totalStock: number = Array.isArray(r.Declinaison) && r.Declinaison.length > 0
            ? r.Declinaison.reduce((sum: number, d: any) => sum + (d.Stock ?? 0), 0)
            : (r.Stock ?? Infinity);
          if (item.quantity > totalStock) {
            return `"${item.title}" : seulement ${totalStock} disponible(s).`;
          }
          return null;
        })
      );
      const errors = checks.filter(Boolean) as string[];
      return errors.length > 0 ? errors.join(' ') : null;
    } catch {
      return null; // Network error during stock check → let Stripe backend handle it
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setLoading(true);
    setLoadingMessage(t('cart.redirecting'));
    setError('');

    const stockError = await validateStock();
    if (stockError) {
      setError(stockError);
      setLoading(false);
      isSubmittingRef.current = false;
      return;
    }

    const slowTimer = setTimeout(() => setLoadingMessage(t('cart.server_starting')), 5000);
    const verySlowTimer = setTimeout(() => setLoadingMessage(t('cart.server_waking')), 15000);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const adresse = buildAdresse();
    const notesCompose = [
      formData.notes,
      `Mode: ${deliveryMode === 'retrait' ? 'Retrait gratuit' : `Livraison — ${SHIPPING_COSTS[country]?.label ?? country}`}`,
      `Frais livraison: ${shippingLabel}`,
      `Total TTC: ${grandTotal.toFixed(2)} €`,
    ].filter(Boolean).join(' | ');

    try {
      const response = await fetch(`${API_URL}/api/commandes/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          email: formData.email,
          nom: formData.nom,
          telephone: formData.telephone,
          adresse,
          notes: notesCompose,
        }),
        signal: controller.signal,
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch {
        throw new Error(`Erreur serveur (${response.status}). Veuillez réessayer.`);
      }

      if (!response.ok) {
        throw new Error(
          responseData?.error?.message ||
          responseData?.message ||
          `Erreur ${response.status}. Veuillez réessayer.`
        );
      }

      const checkoutUrl = responseData.url;
      if (!checkoutUrl) throw new Error('URL de paiement manquante');
      window.location.href = checkoutUrl;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError(t('cart.error_timeout'));
      } else if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
        setError(t('cart.error_network'));
      } else {
        setError(err.message || 'Erreur inconnue');
      }
    } finally {
      clearTimeout(timeoutId);
      clearTimeout(slowTimer);
      clearTimeout(verySlowTimer);
      setLoading(false);
      setLoadingMessage('');
      isSubmittingRef.current = false;
    }
  };

  return (
    <div ref={scrollRef} className="py-6 sm:py-8 md:py-[60px] px-6 sm:px-10 md:px-16 lg:px-24 mt-16 sm:mt-20 md:mt-24">
      <button
        onClick={onBack}
        className="anim-fade-up font-basecoat text-benin-jaune hover:text-benin-terre mb-6 sm:mb-8 flex items-center gap-2 text-sm sm:text-base font-medium transition"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {t('cart.back_to_cart')}
      </button>

      <h1 className="anim-fade-up font-basecoat text-lg sm:text-xl md:text-2xl font-bold uppercase text-gray-900 dark:text-gray-100" data-delay="0.1">
        {t('cart.finalize')}
      </h1>
      <div className="anim-fade-up w-16 sm:w-20 h-1 bg-benin-jaune mt-3 sm:mt-4 mb-8 sm:mb-10 md:mb-12" data-delay="0.15" aria-hidden="true" />

      {/* Recap + secure payment */}
      <div className="anim-fade-up grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 sm:mb-10" data-delay="0.15">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 sm:p-6 shadow-sm">
          <h2 className="font-basecoat font-bold text-gray-900 dark:text-gray-100 text-sm sm:text-base mb-4">{t('cart.recap')}</h2>
          <div className="space-y-2">
            <div className="font-basecoat flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>{t('cart.subtotal')} ({t('cart.items_count', { count: totalItems })})</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">{total.toFixed(2)} €</span>
            </div>
            <div className="font-basecoat flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>
                {deliveryMode === 'retrait'
                  ? `${t('cart.pickup_label')} — ${PICKUP_LOCATIONS.find(p => p.id === pickupLocation)?.label ?? pickupLocation}`
                  : `${t('cart.home_delivery')} — ${SHIPPING_COSTS[country]?.label ?? country}`}
              </span>
              <span className={`font-semibold ${shippingCost === 0 ? 'text-benin-vert' : 'text-gray-900 dark:text-gray-100'}`}>
                {shippingLabel}
              </span>
            </div>
            <div className="border-t border-gray-100 dark:border-gray-700 pt-3 mt-3 font-basecoat flex justify-between items-center">
              <span className="font-bold text-gray-900 dark:text-gray-100 text-base">{t('cart.total')}</span>
              <span className="font-bold text-2xl text-gray-900 dark:text-gray-100">{grandTotal.toFixed(2)} €</span>
            </div>
          </div>
        </div>

        <div className="bg-benin-vert/10 border border-benin-vert/20 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-5 h-5 text-benin-vert flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <span className="font-basecoat font-bold text-gray-900 dark:text-gray-100 text-sm sm:text-base">{t('cart.secure_payment')}</span>
          </div>
          <div className="flex gap-2 flex-wrap items-center" aria-label="Moyens de paiement acceptés">
            <svg viewBox="0 0 48 30" className="h-8 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 bg-white" aria-label="Visa">
              <rect width="48" height="30" rx="3" fill="#1A1F71"/>
              <text x="24" y="20" textAnchor="middle" fill="white" fontSize="13" fontStyle="italic" fontFamily="Arial, sans-serif" fontWeight="bold">VISA</text>
            </svg>
            <svg viewBox="0 0 48 30" className="h-8 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 bg-white" aria-label="Mastercard">
              <rect width="48" height="30" rx="3" fill="#fff"/>
              <circle cx="19" cy="15" r="9" fill="#EB001B"/>
              <circle cx="29" cy="15" r="9" fill="#F79E1B"/>
              <path d="M24 7.7 a9 9 0 0 1 0 14.6 a9 9 0 0 1 0-14.6z" fill="#FF5F00"/>
            </svg>
            <svg viewBox="0 0 48 30" className="h-8 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 bg-white" aria-label="Carte Bancaire">
              <rect width="48" height="30" rx="3" fill="#0052A5"/>
              <text x="24" y="20" textAnchor="middle" fill="white" fontSize="14" fontFamily="Arial, sans-serif" fontWeight="bold">CB</text>
            </svg>
            <svg viewBox="0 0 48 30" className="h-8 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 bg-white" aria-label="American Express">
              <rect width="48" height="30" rx="3" fill="#007BC1"/>
              <text x="24" y="14" textAnchor="middle" fill="white" fontSize="7.5" fontFamily="Arial, sans-serif" fontWeight="bold">AMERICAN</text>
              <text x="24" y="23" textAnchor="middle" fill="white" fontSize="7.5" fontFamily="Arial, sans-serif" fontWeight="bold">EXPRESS</text>
            </svg>
          </div>
        </div>
      </div>

      <form onSubmit={handleCheckout} className="space-y-5 sm:space-y-6 max-w-2xl" noValidate>

        <div className="anim-fade-up" data-delay="0.15">
          <label htmlFor="checkout-nom" className={LABEL_CLASS}>{t('cart.full_name')} *</label>
          <input
            id="checkout-nom"
            type="text"
            required
            aria-required="true"
            autoComplete="name"
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            className={INPUT_CLASS}
          />
        </div>

        <div className="anim-fade-up" data-delay="0.2">
          <label htmlFor="checkout-email" className={LABEL_CLASS}>{t('cart.email')} *</label>
          <input
            id="checkout-email"
            type="email"
            required
            aria-required="true"
            autoComplete="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={INPUT_CLASS}
          />
        </div>

        <div className="anim-fade-up" data-delay="0.25">
          <label htmlFor="checkout-tel" className={LABEL_CLASS}>{t('cart.phone')} *</label>
          <input
            id="checkout-tel"
            type="tel"
            required
            aria-required="true"
            autoComplete="tel"
            value={formData.telephone}
            onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
            className={INPUT_CLASS}
          />
        </div>

        {/* Delivery mode */}
        <fieldset className="anim-fade-up" data-delay="0.3">
          <legend className="font-basecoat text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{t('cart.delivery_mode')} *</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setDeliveryMode('livraison')}
              aria-pressed={deliveryMode === 'livraison'}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition text-left ${
                deliveryMode === 'livraison'
                  ? 'border-benin-jaune bg-benin-jaune/10'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl" aria-hidden="true">🚚</span>
              <div>
                <p className="font-basecoat font-bold text-gray-900 dark:text-gray-100 text-sm">{t('cart.home_delivery')}</p>
                <p className="font-basecoat text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('cart.delivery_be_desc')}</p>
                <p className="font-basecoat text-xs text-gray-400 dark:text-gray-500">{t('cart.delivery_eu_desc')}</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setDeliveryMode('retrait')}
              aria-pressed={deliveryMode === 'retrait'}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition text-left ${
                deliveryMode === 'retrait'
                  ? 'border-benin-vert bg-benin-vert/10'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl" aria-hidden="true">🤝</span>
              <div>
                <p className="font-basecoat font-bold text-gray-900 dark:text-gray-100 text-sm">{t('cart.pickup_label')}</p>
                <p className="font-basecoat text-xs text-benin-vert font-semibold mt-0.5">{t('cart.pickup_free_desc')}</p>
              </div>
            </button>
          </div>
        </fieldset>

        {/* Pickup locations */}
        {deliveryMode === 'retrait' && (
          <fieldset className="anim-fade-up">
            <legend className="font-basecoat text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">{t('cart.pickup_location_label')} *</legend>
            <div className="space-y-3">
              {PICKUP_LOCATIONS.map((loc) => (
                <label
                  key={loc.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${
                    pickupLocation === loc.id ? 'border-benin-vert bg-benin-vert/10' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
                  }`}
                >
                  <input
                    type="radio"
                    name="pickup"
                    value={loc.id}
                    checked={pickupLocation === loc.id}
                    onChange={() => setPickupLocation(loc.id)}
                    className="accent-benin-vert w-4 h-4"
                  />
                  <span className="text-xl" aria-hidden="true">{loc.flag}</span>
                  <div>
                    <p className="font-basecoat font-bold text-gray-900 dark:text-gray-100 text-sm">{loc.label}</p>
                    <p className="font-basecoat text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t(loc.descKey)}</p>
                  </div>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {/* Home delivery address */}
        {deliveryMode === 'livraison' && (
          <div className="anim-fade-up space-y-4">
            <div>
              <label htmlFor="checkout-country" className={LABEL_CLASS}>{t('cart.delivery_country')} *</label>
              <select
                id="checkout-country"
                value={country}
                aria-required="true"
                onChange={(e) => handleCountryChange(e.target.value)}
                className={INPUT_CLASS}
              >
                <option value="belgique">{t('cart.country_be_option')}</option>
                <option value="europe">{t('cart.country_eu_option')}</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="checkout-postal" className={LABEL_CLASS}>{t('cart.postal_code')} *</label>
                <input
                  id="checkout-postal"
                  type="text"
                  required
                  aria-required="true"
                  autoComplete="postal-code"
                  value={postalCode}
                  onChange={(e) => handlePostalCodeChange(e.target.value)}
                  placeholder={country === 'belgique' ? 'ex: 4000' : ''}
                  maxLength={10}
                  className={INPUT_CLASS}
                />
              </div>
              <div>
                <label htmlFor="checkout-city" className={LABEL_CLASS}>
                  {t('cart.city')} *
                  {country === 'belgique' && <span className="text-gray-400 font-normal ml-1">(auto)</span>}
                </label>
                <input
                  id="checkout-city"
                  type="text"
                  required
                  aria-required="true"
                  autoComplete="address-level2"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder={t('cart.city')}
                  className={INPUT_CLASS}
                />
              </div>
            </div>

            <div>
              <label htmlFor="checkout-street" className={LABEL_CLASS}>{t('cart.street')} *</label>
              <input
                id="checkout-street"
                type="text"
                required
                aria-required="true"
                autoComplete="street-address"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder={t('cart.street_placeholder')}
                className={INPUT_CLASS}
              />
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="anim-fade-up" data-delay="0.35">
          <label htmlFor="checkout-notes" className={LABEL_CLASS}>{t('cart.notes_optional')}</label>
          <textarea
            id="checkout-notes"
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className={`${INPUT_CLASS} resize-none`}
            placeholder={t('cart.notes_optional_placeholder')}
          />
        </div>

        {error && (
          <div role="alert" className="font-basecoat bg-benin-rouge/10 border-l-4 border-benin-rouge text-benin-rouge px-5 py-4 rounded-r-xl text-sm sm:text-base">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="anim-fade-up font-basecoat w-full border-2 border-benin-jaune text-gray-900 dark:text-gray-100 hover:bg-benin-jaune hover:text-black py-4 rounded-xl font-bold uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base"
          data-delay="0.4"
        >
          {loading ? (
            <span className="inline-flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {loadingMessage}
            </span>
          ) : t('cart.pay_online', { amount: `${grandTotal.toFixed(2)} €` })}
        </button>

        {loading && (
          <button
            type="button"
            onClick={() => {
              setLoading(false);
              setLoadingMessage('');
              isSubmittingRef.current = false;
              setError(t('cart.cancelled'));
            }}
            className="font-basecoat w-full text-center py-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm font-medium transition"
          >
            {t('cart.cancel')}
          </button>
        )}
      </form>
    </div>
  );
}
