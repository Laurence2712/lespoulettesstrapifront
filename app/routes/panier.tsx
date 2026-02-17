import { useState, useEffect, useRef } from 'react';
import { Link } from '@remix-run/react';
import { useCartStore } from '../store/cartStore';
import { apiEndpoints } from '../config/api';
import { loadStripe } from '@stripe/stripe-js';
import { useScrollAnimations } from '../hooks/useScrollAnimations';

const stripePromise = loadStripe('pk_test_51Su85f3f5uvksVoPH7wJNkn1H091R2WqOeo3xxqowooxN7P5aHHAcqvt9fhwxD5wx7BHlNjFY63TVAXGI6AiUSaD00xeG2aK8r');

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
  }, []);

  const total = mounted ? getTotalPrice() : 0;
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  // Success screen
  if (orderSuccess) {
    return (
      <div className="py-6 sm:py-8 md:py-[60px] px-4 sm:px-6 md:px-[60px] lg:px-[120px] mt-[60px] sm:mt-[70px] md:mt-[80px] min-h-[60vh] flex items-center justify-center">
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
      <div className="min-h-screen flex items-center justify-center mt-[60px]">
        <p className="text-xl font-basecoat text-gray-400">Chargement...</p>
      </div>
    );
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="py-6 sm:py-8 md:py-[60px] px-4 sm:px-6 md:px-[60px] lg:px-[120px] mt-[60px] sm:mt-[70px] md:mt-[80px] min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <svg className="w-20 h-20 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
        </svg>
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
    <div ref={scrollRef} className="py-6 sm:py-8 md:py-[60px] px-4 sm:px-6 md:px-[60px] lg:px-[120px] mt-[60px] sm:mt-[70px] md:mt-[80px]">
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
              {/* Image */}
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
                  {/* Quantity */}
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

              {/* Prix total ligne */}
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
                <span>À calculer</span>
              </div>
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

// FORMULAIRE AVEC CHOIX DE PAIEMENT
function CheckoutForm({ cart, total, clearCart, onBack, onSuccess }: {
  cart: any[],
  total: number,
  clearCart: () => void,
  onBack: () => void,
  onSuccess: () => void
}) {
  const [paymentMethod, setPaymentMethod] = useState<'virement' | 'carte' | null>(null);
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

  useEffect(() => {
    fetch(apiEndpoints.commandes, { method: 'HEAD' }).catch(() => {});
  }, []);

  const fetchWithTimeout = async (url: string, options: RequestInit, timeoutMs = 90000) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      return response;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw new Error('Le serveur met du temps à répondre (il est peut-être en train de démarrer). Veuillez réessayer dans 30 secondes.');
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  };

  // PAIEMENT PAR VIREMENT
  const handleVirementCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setLoading(true);
    setLoadingMessage('Envoi en cours...');
    setError('');

    const slowTimer = setTimeout(() => {
      setLoadingMessage('Le serveur démarre, patientez quelques secondes...');
    }, 5000);

    try {
      const payload = {
        items: cart,
        email: formData.email,
        nom: formData.nom,
        telephone: formData.telephone,
        adresse: formData.adresse,
        notes: formData.notes,
      };

      const response = await fetchWithTimeout(apiEndpoints.createBankTransferOrder, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch {
        throw new Error(`Erreur serveur (${response.status}). Veuillez réessayer ou contacter le support.`);
      }

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Accès refusé : les commandes ne sont pas activées sur le serveur. Contactez l\'administrateur.');
        }
        const errorMessage = responseData?.error?.message || responseData?.message || 'Erreur lors de l\'envoi';
        throw new Error(errorMessage);
      }

      if (!responseData.success) {
        throw new Error(responseData.message || 'Erreur lors de l\'enregistrement de la commande');
      }

      onSuccess();
      clearCart();
    } catch (err: any) {
      console.error('Erreur:', err);
      if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
        setError('Impossible de contacter le serveur. Vérifiez votre connexion internet ou réessayez plus tard.');
      } else {
        setError(err.message || 'Erreur inconnue');
      }
    } finally {
      clearTimeout(slowTimer);
      setLoading(false);
      setLoadingMessage('');
      isSubmittingRef.current = false;
    }
  };

  // PAIEMENT PAR CARTE (Stripe)
  const handleStripeCheckout = async () => {
    if (!formData.nom || !formData.email || !formData.telephone || !formData.adresse) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        items: cart,
        email: formData.email,
        nom: formData.nom,
        telephone: formData.telephone,
        adresse: formData.adresse,
        notes: formData.notes,
      };

      const response = await fetchWithTimeout(apiEndpoints.createCheckoutSession, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch {
        if (response.status === 405) {
          throw new Error('Le paiement en ligne n\'est pas encore configuré sur le serveur. Contactez l\'administrateur.');
        }
        throw new Error(`Erreur serveur (${response.status}). Veuillez réessayer ou contacter le support.`);
      }

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Accès refusé : le paiement en ligne n\'est pas activé. Contactez l\'administrateur.');
        }
        throw new Error(responseData?.error?.message || 'Erreur lors de la création de la session de paiement');
      }

      const { url: checkoutUrl } = responseData;
      if (!checkoutUrl) {
        throw new Error('URL de paiement manquante');
      }

      window.location.href = checkoutUrl;
    } catch (err: any) {
      console.error('Erreur:', err);
      if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
        setError('Impossible de contacter le serveur. Vérifiez votre connexion internet ou réessayez plus tard.');
      } else {
        setError(err.message || 'Erreur lors de la création de la session de paiement');
      }
      setLoading(false);
    }
  };

  return (
    <div ref={scrollRef} className="py-6 sm:py-8 md:py-[60px] px-4 sm:px-6 md:px-[60px] lg:px-[120px] mt-[60px] sm:mt-[70px] md:mt-[80px]">
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

      {/* CHOIX DU MODE DE PAIEMENT */}
      {!paymentMethod && (
        <div className="space-y-5 mb-8">
          <h2 className="anim-fade-up font-basecoat text-xl sm:text-2xl font-bold uppercase text-gray-900 mb-2" data-delay="0.2">
            Mode de paiement
          </h2>

          <button
            onClick={() => setPaymentMethod('virement')}
            className="anim-fade-up w-full border border-gray-200 hover:border-yellow-400 rounded-2xl p-6 sm:p-7 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group bg-white"
            data-delay="0.25"
          >
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="w-14 h-14 rounded-xl bg-yellow-50 group-hover:bg-yellow-100 flex items-center justify-center flex-shrink-0 transition-colors">
                <span className="text-2xl">🏦</span>
              </div>
              <div className="flex-1">
                <h3 className="font-basecoat font-bold text-lg sm:text-xl text-gray-900 mb-1 group-hover:text-yellow-600 transition">
                  Virement bancaire
                </h3>
                <p className="font-basecoat text-sm sm:text-base text-gray-500 mb-3">
                  Effectuez un virement sur notre compte bancaire
                </p>
                <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                  Sans frais
                </span>
              </div>
              <svg className="w-5 h-5 text-gray-300 group-hover:text-yellow-400 mt-1 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          <button
            onClick={() => setPaymentMethod('carte')}
            className="anim-fade-up w-full border border-gray-200 hover:border-yellow-400 rounded-2xl p-6 sm:p-7 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group bg-white"
            data-delay="0.35"
          >
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="w-14 h-14 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center flex-shrink-0 transition-colors">
                <span className="text-2xl">💳</span>
              </div>
              <div className="flex-1">
                <h3 className="font-basecoat font-bold text-lg sm:text-xl text-gray-900 mb-1 group-hover:text-yellow-600 transition">
                  Carte bancaire
                </h3>
                <p className="font-basecoat text-sm sm:text-base text-gray-500 mb-3">
                  Paiement immédiat et sécurisé via Stripe
                </p>
                <div className="flex gap-2 flex-wrap">
                  <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                    Sécurisé
                  </span>
                  <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
                    Instantané
                  </span>
                </div>
                <p className="font-basecoat text-xs text-gray-400 mt-2">
                  Frais Stripe : 2,9% + 0,25€ (soit {(total * 1.029 + 0.25).toFixed(2)}€ pour {total.toFixed(2)}€)
                </p>
              </div>
              <svg className="w-5 h-5 text-gray-300 group-hover:text-yellow-400 mt-1 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>
      )}

      {/* FORMULAIRE */}
      {paymentMethod && (
        <form onSubmit={paymentMethod === 'virement' ? handleVirementCheckout : (e) => { e.preventDefault(); handleStripeCheckout(); }} className="space-y-5 sm:space-y-6 max-w-2xl">

          {/* Mode choisi */}
          <div className="anim-fade-up flex items-center justify-between bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center">
                <span className="text-xl">{paymentMethod === 'virement' ? '🏦' : '💳'}</span>
              </div>
              <span className="font-basecoat font-bold text-gray-900">
                {paymentMethod === 'virement' ? 'Virement bancaire' : 'Carte bancaire'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setPaymentMethod(null)}
              className="font-basecoat text-yellow-600 hover:text-yellow-700 text-sm font-semibold transition"
            >
              Changer
            </button>
          </div>

          {/* Instructions */}
          {paymentMethod === 'virement' && (
            <div className="anim-fade-up bg-amber-50 border-l-4 border-yellow-400 rounded-r-xl p-5 sm:p-6" data-delay="0.1">
              <h3 className="font-basecoat font-bold text-gray-900 mb-3 text-sm sm:text-base">
                Instructions de paiement
              </h3>
              <ul className="font-basecoat text-sm text-gray-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 font-bold mt-0.5">1.</span>
                  Remplissez le formulaire ci-dessous
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 font-bold mt-0.5">2.</span>
                  Effectuez un virement sur le compte <strong>BE71 XXXX XXXX XXXX</strong>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 font-bold mt-0.5">3.</span>
                  Votre commande sera préparée dès réception du paiement
                </li>
              </ul>
            </div>
          )}

          {paymentMethod === 'carte' && (
            <div className="anim-fade-up bg-green-50 border-l-4 border-green-400 rounded-r-xl p-5 sm:p-6" data-delay="0.1">
              <h3 className="font-basecoat font-bold text-gray-900 mb-3 text-sm sm:text-base">
                Paiement sécurisé par Stripe
              </h3>
              <ul className="font-basecoat text-sm text-gray-700 space-y-2">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  Carte bancaire (Visa, Mastercard, Amex)
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  Bancontact, iDEAL
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  Paiement instantané et sécurisé
                </li>
              </ul>
            </div>
          )}

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
            {loading
              ? (loadingMessage || (paymentMethod === 'virement' ? 'Envoi en cours...' : 'Redirection vers le paiement...'))
              : (paymentMethod === 'virement' ? 'Envoyer la commande' : 'Payer en ligne')
            }
          </button>
        </form>
      )}
    </div>
  );
}
