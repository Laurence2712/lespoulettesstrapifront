import { useState, useEffect, useRef } from 'react';
import { Link } from '@remix-run/react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useCartStore } from '../store/cartStore';
import { getApiUrl } from '../config/api';
import { useScrollAnimations } from '../hooks/useScrollAnimations';

const API_URL = getApiUrl();

export default function Panier() {
  const items = useCartStore((state) => state.items);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);

  const [showCheckout, setShowCheckout] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  const scrollRef = useScrollAnimations([mounted, items.length]);

  useEffect(() => {
    setMounted(true);
    // Pre-warm Render backend on page load
    fetch(`${API_URL}/api/commandes`, { method: 'HEAD', mode: 'no-cors' }).catch(() => {});
  }, []);

  const total = mounted ? getTotalPrice() : 0;
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  // Success screen
  if (orderSuccess) {
    return (
      <div className="py-6 sm:py-8 md:py-[60px] px-4 sm:px-6 md:px-[60px] lg:px-[120px] mt-16 sm:mt-20 md:mt-24 min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-lg">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="font-basecoat text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 uppercase">
            Commande envoyée !
          </h1>
          <p className="font-basecoat text-gray-600 mb-3 text-base sm:text-lg leading-relaxed">
            Nous avons bien reçu votre commande. Vous recevrez un email de confirmation.
          </p>
          <p className="font-basecoat text-gray-500 mb-8 text-sm sm:text-base">
            Attention : La commande ne sera préparée et expédiée qu'à la réception du paiement.
          </p>
          <Link
            to="/"
            className="font-basecoat inline-block bg-yellow-400 hover:bg-yellow-500 text-black px-8 sm:px-10 py-3 sm:py-4 rounded-xl font-bold uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] shadow-md hover:shadow-lg text-sm sm:text-base"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center mt-16">
        <p className="text-xl font-basecoat text-gray-400">Chargement...</p>
      </div>
    );
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="py-6 sm:py-8 md:py-[60px] px-4 sm:px-6 md:px-[60px] lg:px-[120px] mt-16 sm:mt-20 md:mt-24 min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <ShoppingCartIcon className="w-20 h-20 text-gray-200" strokeWidth={1} />
        <h1 className="font-basecoat text-2xl sm:text-3xl md:text-4xl font-bold uppercase text-gray-900">
          Votre panier est vide
        </h1>
        <p className="font-basecoat text-gray-500 text-base">
          Découvrez nos créations !
        </p>
        <Link
          to="/realisations"
          className="font-basecoat bg-yellow-400 hover:bg-yellow-500 text-black px-8 sm:px-10 py-3 sm:py-4 rounded-xl font-bold uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] shadow-md hover:shadow-lg text-sm sm:text-base mt-2"
        >
          Voir nos créations
        </Link>
      </div>
    );
  }

  if (showCheckout) {
    return <CheckoutForm cart={items} total={total} clearCart={clearCart} onBack={() => setShowCheckout(false)} onSuccess={() => setOrderSuccess(true)} />;
  }

  return (
    <div ref={scrollRef} className="py-6 sm:py-8 md:py-[60px] px-4 sm:px-6 md:px-[60px] lg:px-[120px] mt-16 sm:mt-20 md:mt-24">
      {/* Breadcrumb */}
      <nav className="anim-fade-up font-basecoat mb-6 sm:mb-8 text-xs sm:text-sm">
        <Link to="/" className="text-yellow-600 hover:text-yellow-700 font-medium transition">Accueil</Link>
        <span className="mx-1.5 sm:mx-2 text-gray-400">/</span>
        <span className="text-gray-600">Panier</span>
      </nav>

      <h1 className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-[44px] font-bold uppercase text-gray-900" data-delay="0.1">
        Votre panier
      </h1>
      <div className="anim-fade-up w-16 sm:w-20 h-1 bg-yellow-400 mt-3 sm:mt-4" data-delay="0.15"></div>
      <p className="anim-fade-up font-basecoat text-gray-500 text-sm sm:text-base mt-3 mb-8 sm:mb-10 md:mb-12" data-delay="0.2">
        {totalItems} article{totalItems > 1 ? 's' : ''}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
        {/* Liste des articles */}
        <div className="lg:col-span-2 anim-stagger space-y-5" data-stagger="0.1">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 sm:gap-5 p-4 sm:p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 object-cover rounded-xl flex-shrink-0"
                />
              )}

              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <h3 className="font-basecoat text-base sm:text-lg font-bold text-gray-900 leading-tight">
                    {item.title}
                  </h3>
                  <p className="font-basecoat text-yellow-500 font-bold text-lg sm:text-xl mt-1">
                    {item.prix} €
                  </p>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 mt-3">
                  <div className="inline-flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span className="w-10 h-10 flex items-center justify-center font-basecoat font-bold text-gray-900 text-sm border-x border-gray-200">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.stock !== undefined && item.quantity >= item.stock}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>

                  {item.stock !== undefined && item.quantity >= item.stock && (
                    <span className="font-basecoat text-orange-500 text-xs sm:text-sm font-semibold">
                      Stock max : {item.stock}
                    </span>
                  )}

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="w-10 h-10 rounded-xl bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-400 hover:text-red-600 transition ml-auto"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="hidden sm:flex items-start pt-1">
                <p className="font-basecoat text-xl lg:text-2xl font-bold text-gray-900 whitespace-nowrap">
                  {(Number(item.prix) * item.quantity).toFixed(2)} €
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Résumé */}
        <div className="lg:col-span-1 anim-fade-left" data-delay="0.3">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-7 shadow-sm lg:sticky lg:top-[100px]">
            <h2 className="font-basecoat text-xl sm:text-2xl font-bold uppercase text-gray-900 mb-5">
              Résumé
            </h2>

            <div className="space-y-3 mb-5">
              <div className="font-basecoat flex justify-between text-base text-gray-600">
                <span>Sous-total ({totalItems} article{totalItems > 1 ? 's' : ''})</span>
                <span className="font-semibold text-gray-900">{total.toFixed(2)} €</span>
              </div>
              <div className="font-basecoat flex justify-between text-sm text-gray-400">
                <span>Livraison</span>
                <span>Calculée après commande</span>
              </div>
              <p className="font-basecoat text-xs text-gray-400 leading-relaxed">
                Les frais de livraison vous seront communiqués par email.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-5 mb-6">
              <div className="font-basecoat flex justify-between items-center">
                <span className="text-base text-gray-500">Total</span>
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">{total.toFixed(2)} €</span>
              </div>
            </div>

            <button
              onClick={() => setShowCheckout(true)}
              className="font-basecoat w-full bg-yellow-400 hover:bg-yellow-500 text-black py-4 rounded-xl font-bold uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] shadow-md hover:shadow-lg mb-3 text-sm sm:text-base"
            >
              Passer commande
            </button>

            <Link
              to="/realisations"
              className="font-basecoat block w-full text-center py-3 rounded-xl font-semibold text-gray-500 hover:text-gray-900 border border-gray-200 hover:border-gray-300 transition text-sm sm:text-base"
            >
              Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== CHECKOUT FORM (client-side fetch, no Vercel timeout) ==========
function CheckoutForm({ cart, total, clearCart, onBack, onSuccess }: {
  cart: any[],
  total: number,
  clearCart: () => void,
  onBack: () => void,
  onSuccess: () => void
}) {
  const [paymentMethod] = useState<'carte'>('carte');
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState('');
  const isSubmittingRef = useRef(false);

  const scrollRef = useScrollAnimations([paymentMethod]);

  // Pre-warm backend when checkout form mounts
  useEffect(() => {
    fetch(`${API_URL}/api/commandes`, { method: 'HEAD', mode: 'no-cors' }).catch(() => {});
  }, []);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current || !paymentMethod) return;

    isSubmittingRef.current = true;
    setLoading(true);
    setLoadingMessage('Redirection vers le paiement...');
    setError('');

    const slowTimer = setTimeout(() => {
      setLoadingMessage('Le serveur démarre, patientez quelques secondes...');
    }, 5000);

    const verySlowTimer = setTimeout(() => {
      setLoadingMessage('Le serveur est en cours de réveil, encore un instant...');
    }, 15000);

    const endpoint = `${API_URL}/api/commandes/create-checkout-session`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          email: formData.email,
          nom: formData.nom,
          telephone: formData.telephone,
          adresse: formData.adresse,
          notes: formData.notes,
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
      if (!checkoutUrl) {
        throw new Error('URL de paiement manquante');
      }
      window.location.href = checkoutUrl;
    } catch (err: any) {
      console.error('Erreur checkout:', err);
      if (err.name === 'AbortError') {
        setError('Le serveur met trop de temps à répondre. Veuillez réessayer.');
      } else if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
        setError('Impossible de contacter le serveur. Vérifiez votre connexion ou réessayez dans quelques secondes.');
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
    <div ref={scrollRef} className="py-6 sm:py-8 md:py-[60px] px-4 sm:px-6 md:px-[60px] lg:px-[120px] mt-16 sm:mt-20 md:mt-24">
      <button
        onClick={onBack}
        className="anim-fade-up font-basecoat text-yellow-600 hover:text-yellow-700 mb-6 sm:mb-8 flex items-center gap-2 text-sm sm:text-base font-medium transition"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Retour au panier
      </button>

      <h1 className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-[44px] font-bold uppercase text-gray-900" data-delay="0.1">
        Finaliser la commande
      </h1>
      <div className="anim-fade-up w-16 sm:w-20 h-1 bg-yellow-400 mt-3 sm:mt-4 mb-8 sm:mb-10 md:mb-12" data-delay="0.15"></div>

      {/* Récapitulatif */}
      <div className="anim-fade-up bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 mb-8 sm:mb-10 shadow-sm" data-delay="0.15">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-basecoat font-bold text-gray-900 text-base sm:text-lg">Récapitulatif</h2>
            <p className="font-basecoat text-sm text-gray-500 mt-0.5">
              {cart.reduce((sum, item) => sum + item.quantity, 0)} article(s)
            </p>
          </div>
          <span className="font-basecoat font-bold text-2xl text-gray-900">{total.toFixed(2)} €</span>
        </div>
      </div>

      {/* FORMULAIRE */}
      <form onSubmit={handleCheckout} className="space-y-5 sm:space-y-6 max-w-2xl">

          {/* En-tête paiement sécurisé */}
          <div className="anim-fade-up bg-green-50 border border-green-100 rounded-2xl p-5 sm:p-6" data-delay="0.1">
            <div className="flex items-center gap-3 mb-4">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
              <span className="font-basecoat font-bold text-gray-900 text-sm sm:text-base">Paiement 100% sécurisé par Stripe</span>
            </div>
            <div className="flex gap-2 flex-wrap items-center">
              {/* Visa */}
              <svg viewBox="0 0 48 30" className="h-8 rounded-md shadow-sm border border-gray-200 bg-white">
                <rect width="48" height="30" rx="3" fill="#1A1F71"/>
                <text x="24" y="20" textAnchor="middle" fill="white" fontSize="13" fontStyle="italic" fontFamily="Arial, sans-serif" fontWeight="bold">VISA</text>
              </svg>
              {/* Mastercard */}
              <svg viewBox="0 0 48 30" className="h-8 rounded-md shadow-sm border border-gray-200 bg-white">
                <rect width="48" height="30" rx="3" fill="#fff"/>
                <circle cx="19" cy="15" r="9" fill="#EB001B"/>
                <circle cx="29" cy="15" r="9" fill="#F79E1B"/>
                <path d="M24 7.7 a9 9 0 0 1 0 14.6 a9 9 0 0 1 0-14.6z" fill="#FF5F00"/>
              </svg>
              {/* CB */}
              <svg viewBox="0 0 48 30" className="h-8 rounded-md shadow-sm border border-gray-200 bg-white">
                <rect width="48" height="30" rx="3" fill="#0052A5"/>
                <text x="24" y="20" textAnchor="middle" fill="white" fontSize="14" fontFamily="Arial, sans-serif" fontWeight="bold">CB</text>
              </svg>
              {/* Amex */}
              <svg viewBox="0 0 48 30" className="h-8 rounded-md shadow-sm border border-gray-200 bg-white">
                <rect width="48" height="30" rx="3" fill="#007BC1"/>
                <text x="24" y="14" textAnchor="middle" fill="white" fontSize="7.5" fontFamily="Arial, sans-serif" fontWeight="bold">AMERICAN</text>
                <text x="24" y="23" textAnchor="middle" fill="white" fontSize="7.5" fontFamily="Arial, sans-serif" fontWeight="bold">EXPRESS</text>
              </svg>
              {/* Bancontact */}
              <svg viewBox="0 0 48 30" className="h-8 rounded-md shadow-sm border border-gray-200 bg-white">
                <rect width="48" height="30" rx="3" fill="#fff"/>
                <rect width="24" height="30" rx="0" fill="#005498"/>
                <rect x="24" width="24" height="30" rx="0" fill="#F7A800"/>
                <text x="24" y="20" textAnchor="middle" fill="white" fontSize="7" fontFamily="Arial, sans-serif" fontWeight="bold">BCT</text>
              </svg>
            </div>
            <p className="font-basecoat text-xs text-gray-400 mt-3">
              Des frais de traitement (2,9% + 0,25€) s'appliquent au paiement en ligne via Stripe.
            </p>
          </div>

          {/* Champs formulaire */}
          <div className="anim-fade-up" data-delay="0.15">
            <label htmlFor="checkout-nom" className="font-basecoat block text-sm font-semibold text-gray-700 mb-2">Nom complet *</label>
            <input
              id="checkout-nom"
              type="text"
              required
              value={formData.nom}
              onChange={(e) => setFormData({...formData, nom: e.target.value})}
              className="font-basecoat w-full rounded-xl border border-gray-200 px-4 py-3 text-sm sm:text-base focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition bg-white"
            />
          </div>

          <div className="anim-fade-up" data-delay="0.2">
            <label htmlFor="checkout-email" className="font-basecoat block text-sm font-semibold text-gray-700 mb-2">Email *</label>
            <input
              id="checkout-email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="font-basecoat w-full rounded-xl border border-gray-200 px-4 py-3 text-sm sm:text-base focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition bg-white"
            />
          </div>

          <div className="anim-fade-up" data-delay="0.25">
            <label htmlFor="checkout-tel" className="font-basecoat block text-sm font-semibold text-gray-700 mb-2">Téléphone *</label>
            <input
              id="checkout-tel"
              type="tel"
              required
              value={formData.telephone}
              onChange={(e) => setFormData({...formData, telephone: e.target.value})}
              className="font-basecoat w-full rounded-xl border border-gray-200 px-4 py-3 text-sm sm:text-base focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition bg-white"
            />
          </div>

          <div className="anim-fade-up" data-delay="0.3">
            <label htmlFor="checkout-adresse" className="font-basecoat block text-sm font-semibold text-gray-700 mb-2">Adresse de livraison *</label>
            <textarea
              id="checkout-adresse"
              required
              rows={3}
              value={formData.adresse}
              onChange={(e) => setFormData({...formData, adresse: e.target.value})}
              className="font-basecoat w-full rounded-xl border border-gray-200 px-4 py-3 text-sm sm:text-base focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition resize-none bg-white"
            />
          </div>

          <div className="anim-fade-up" data-delay="0.35">
            <label htmlFor="checkout-notes" className="font-basecoat block text-sm font-semibold text-gray-700 mb-2">Notes (optionnel)</label>
            <textarea
              id="checkout-notes"
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="font-basecoat w-full rounded-xl border border-gray-200 px-4 py-3 text-sm sm:text-base focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition resize-none bg-white"
              placeholder="Informations complémentaires, préférences de livraison..."
            />
          </div>

          {error && (
            <div className="font-basecoat bg-red-50 border-l-4 border-red-400 text-red-700 px-5 py-4 rounded-r-xl text-sm sm:text-base">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="anim-fade-up font-basecoat w-full bg-yellow-400 hover:bg-yellow-500 text-black py-4 rounded-xl font-bold uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base"
            data-delay="0.4"
          >
            {loading ? (
              <span className="inline-flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-black flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {loadingMessage}
              </span>
            ) : 'Payer en ligne'}
          </button>

          {loading && (
            <button
              type="button"
              onClick={() => {
                setLoading(false);
                setLoadingMessage('');
                isSubmittingRef.current = false;
                setError('Opération annulée. Vous pouvez réessayer.');
              }}
              className="font-basecoat w-full text-center py-3 text-gray-500 hover:text-gray-700 text-sm font-medium transition"
            >
              Annuler
            </button>
          )}
        </form>
    </div>
  );
}
