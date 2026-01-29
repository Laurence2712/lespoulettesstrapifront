import { useState, useEffect, useRef } from 'react';
import { Link } from '@remix-run/react';
import { CartUtils, CartItem } from '../utils/cart';
import { apiEndpoints } from '../config/api';

export default function Panier() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    setCart(CartUtils.getCart());
  }, []);

  const updateQuantity = (id: number, newQuantity: number) => {
    const updatedCart = CartUtils.updateQuantity(id, newQuantity);
    setCart(updatedCart);
  };

  const removeItem = (id: number) => {
    const updatedCart = CartUtils.removeFromCart(id);
    setCart(updatedCart);
  };

  const total = CartUtils.getTotal(cart);

  if (cart.length === 0) {
    return (
      <div className="container mx-auto py-12 sm:py-16 md:py-20 px-4 text-center">
        <h1 className="font-ogg text-2xl sm:text-3xl md:text-4xl font-light mb-3 sm:mb-4 uppercase">
          Votre panier est vide
        </h1>
        <p className="font-basecoat text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
          Découvrez nos réalisations !
        </p>
        <Link
          to="/realisations"
          className="font-basecoat inline-block bg-yellow-400 text-black px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-yellow-500 transition text-sm sm:text-base"
        >
          Voir nos réalisations
        </Link>
      </div>
    );
  }

  if (showCheckout) {
    return <CheckoutForm cart={cart} total={total} onBack={() => setShowCheckout(false)} />;
  }

  return (
    <div className="container mx-auto py-6 sm:py-8 md:py-10 px-4 sm:px-6 md:px-8 max-w-6xl mt-[60px] sm:mt-[70px] md:mt-[80px]">
      {/* Breadcrumb */}
      <nav className="font-basecoat mb-6 sm:mb-8 text-xs sm:text-sm">
        <Link to="/" className="text-indigo-600 hover:text-indigo-800 transition">Accueil</Link>
        <span className="mx-1.5 sm:mx-2 text-gray-400">/</span>
        <span className="text-gray-600">Panier</span>
      </nav>

      <h1 className="font-ogg text-3xl sm:text-4xl md:text-5xl font-light mb-6 sm:mb-8 uppercase">
        Votre panier
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Liste des articles */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-4 sm:p-5 md:p-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* Image - Responsive */}
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full sm:w-20 md:w-24 h-32 sm:h-20 md:h-24 object-cover rounded"
                />
              )}
              
              <div className="flex-1">
                <h3 className="font-basecoat text-base sm:text-lg md:text-xl font-semibold">
                  {item.title}
                </h3>
                <p className="font-basecoat text-gray-600 mt-1 text-sm sm:text-base">
                  {item.prix} € l'unité
                </p>
                
                <div className="flex items-center gap-3 sm:gap-4 mt-3 sm:mt-4">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="font-basecoat px-2.5 sm:px-3 py-1 hover:bg-gray-100 text-sm sm:text-base"
                    >
                      -
                    </button>
                    <span className="font-basecoat px-3 sm:px-4 py-1 border-l border-r text-sm sm:text-base">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="font-basecoat px-2.5 sm:px-3 py-1 hover:bg-gray-100 text-sm sm:text-base"
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    onClick={() => removeItem(item.id)}
                    className="font-basecoat text-red-600 hover:text-red-800 text-xs sm:text-sm font-medium"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
              
              {/* Prix total - Responsive */}
              <div className="text-left sm:text-right">
                <p className="font-basecoat text-lg sm:text-xl md:text-2xl font-bold">
                  {(item.prix * item.quantity).toFixed(2)} €
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Résumé - Sticky on desktop only */}
        <div className="lg:col-span-1">
          <div className="bg-gray-100 rounded-lg p-4 sm:p-5 md:p-6 lg:sticky lg:top-4">
            <h2 className="font-basecoat text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
              Résumé
            </h2>
            
            <div className="space-y-2 mb-3 sm:mb-4">
              <div className="font-basecoat flex justify-between text-sm sm:text-base">
                <span>Sous-total</span>
                <span>{total.toFixed(2)} €</span>
              </div>
              <div className="font-basecoat flex justify-between text-xs sm:text-sm text-gray-600">
                <span>Livraison</span>
                <span>À calculer</span>
              </div>
            </div>
            
            <div className="border-t border-gray-300 pt-3 sm:pt-4 mb-4 sm:mb-6">
              <div className="font-basecoat flex justify-between text-lg sm:text-xl md:text-2xl font-bold">
                <span>Total</span>
                <span>{total.toFixed(2)} €</span>
              </div>
            </div>

            <button
              onClick={() => setShowCheckout(true)}
              className="font-basecoat w-full bg-yellow-400 text-black py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-yellow-500 transition mb-2 sm:mb-3 text-sm sm:text-base"
            >
              Commander
            </button>

            <Link
              to="/realisations"
              className="font-basecoat block w-full text-center border-2 border-gray-800 text-gray-800 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-gray-100 transition text-sm sm:text-base"
            >
              ← Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Formulaire de commande - RESPONSIVE
function CheckoutForm({ cart, total, onBack }: { cart: CartItem[], total: number, onBack: () => void }) {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    adresse: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const isSubmittingRef = useRef(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmittingRef.current) {
      console.log('⚠️ Soumission déjà en cours');
      return;
    }

    isSubmittingRef.current = true;
    setLoading(true);
    setError('');

    try {
      const payload = {
        data: {
          Nom: formData.nom,
          Email: formData.email,
          Telephone: formData.telephone,
          adresse: formData.adresse,
          articles: JSON.stringify(cart),
          total: total,
          statut: 'en_attente',
          notes: formData.notes
        }
      };

      const response = await fetch(apiEndpoints.commandes, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage = responseData?.error?.message || 'Erreur lors de l\'envoi';
        throw new Error(errorMessage);
      }

      CartUtils.clearCart();
      setSuccess(true);
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err.message || 'Erreur inconnue');
      isSubmittingRef.current = false;
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto py-12 sm:py-16 md:py-20 px-4 text-center max-w-2xl mt-[60px] sm:mt-[70px]">
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 sm:p-8">
          <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">✓</div>
          <h1 className="font-ogg text-2xl sm:text-3xl md:text-4xl font-light text-green-800 mb-3 sm:mb-4 uppercase">
            Commande envoyée !
          </h1>
          <p className="font-basecoat text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
            Nous avons bien reçu votre commande. Vous recevrez un email de confirmation à {formData.email}.
          </p>
          <Link
            to="/"
            className="font-basecoat inline-block bg-yellow-400 text-black px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-yellow-500 transition text-sm sm:text-base"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 sm:py-8 md:py-10 px-4 sm:px-6 md:px-8 max-w-3xl mt-[60px] sm:mt-[70px]">
      <button
        onClick={onBack}
        className="font-basecoat text-indigo-600 hover:text-indigo-800 mb-4 sm:mb-6 flex items-center text-sm sm:text-base"
      >
        ← Retour au panier
      </button>

      <h1 className="font-ogg text-2xl sm:text-3xl md:text-4xl font-light mb-6 sm:mb-8 uppercase">
        Finaliser la commande
      </h1>

      {/* Récapitulatif */}
      <div className="bg-gray-100 rounded-lg p-4 sm:p-5 md:p-6 mb-6 sm:mb-8">
        <h2 className="font-basecoat font-bold mb-2 text-sm sm:text-base">Récapitulatif</h2>
        <p className="font-basecoat text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
          {cart.reduce((sum, item) => sum + item.quantity, 0)} article(s) - Total: {total.toFixed(2)} €
        </p>
        <p className="font-basecoat text-xs sm:text-sm">
          Après validation, nous vous contacterons pour confirmer la commande et convenir du mode de livraison.
        </p>
      </div>

      {/* Instructions paiement */}
      <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 sm:p-5 md:p-6 mb-6 sm:mb-8">
        <div className="flex items-start gap-2 sm:gap-3">
          <span className="text-2xl sm:text-3xl">💳</span>
          <div>
            <h3 className="font-basecoat font-bold text-yellow-900 mb-2 text-sm sm:text-base">
              Instructions de paiement
            </h3>
            <ul className="font-basecoat text-xs sm:text-sm text-yellow-900 space-y-1.5 sm:space-y-2">
              <li>✅ Vous recevrez un email avec un <strong>QR Code Mobile Money</strong></li>
              <li>✅ Scannez le QR Code avec votre application mobile</li>
              <li>✅ Effectuez le paiement de <strong>{total.toFixed(2)} FCFA</strong></li>
              <li>✅ Votre commande sera validée après réception</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
        <div>
          <label className="font-basecoat block font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">
            Nom complet *
          </label>
          <input
            type="text"
            required
            value={formData.nom}
            onChange={(e) => setFormData({...formData, nom: e.target.value})}
            className="font-basecoat w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base"
          />
        </div>

        <div>
          <label className="font-basecoat block font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">
            Email *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="font-basecoat w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base"
          />
        </div>

        <div>
          <label className="font-basecoat block font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">
            Téléphone *
          </label>
          <input
            type="tel"
            required
            value={formData.telephone}
            onChange={(e) => setFormData({...formData, telephone: e.target.value})}
            className="font-basecoat w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base"
          />
        </div>

        <div>
          <label className="font-basecoat block font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">
            Adresse de livraison *
          </label>
          <textarea
            required
            rows={3}
            value={formData.adresse}
            onChange={(e) => setFormData({...formData, adresse: e.target.value})}
            className="font-basecoat w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base resize-none"
          />
        </div>

        <div>
          <label className="font-basecoat block font-medium mb-1.5 sm:mb-2 text-sm sm:text-base">
            Notes (optionnel)
          </label>
          <textarea
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            className="font-basecoat w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base resize-none"
            placeholder="Informations complémentaires, préférences de livraison..."
          />
        </div>

        {error && (
          <div className="font-basecoat bg-red-50 border border-red-500 text-red-700 px-3 sm:px-4 py-2.5 sm:py-3 rounded text-sm sm:text-base">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="font-basecoat w-full bg-yellow-400 text-black py-3 sm:py-3.5 md:py-4 rounded-lg font-semibold hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {loading ? 'Envoi en cours...' : 'Envoyer la commande'}
        </button>
      </form>
    </div>
  );
}