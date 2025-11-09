import { useState, useEffect } from 'react';
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
      <div className="container mx-auto py-16 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Votre panier est vide</h1>
        <p className="text-gray-600 mb-8">Découvrez nos réalisations !</p>
        <Link
          to="/realisations"
          className="inline-block bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition"
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
    <div className="container mx-auto py-8 px-4 max-w-6xl mt-[70px]">
      <nav className="mb-8 text-sm">
        <Link to="/" className="text-indigo-600 hover:text-indigo-800">Accueil</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">Panier</span>
      </nav>

      <h1 className="text-4xl font-bold mb-8">Votre panier</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Liste des articles */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-6 flex gap-4">
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-24 h-24 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-gray-600 mt-1">{item.prix} € l'unité</p>
                
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 border-l border-r">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-xl font-bold">{(item.prix * item.quantity).toFixed(2)} €</p>
              </div>
            </div>
          ))}
        </div>

        {/* Résumé */}
        <div className="lg:col-span-1">
          <div className="bg-gray-100 rounded-lg p-6 sticky top-4">
            <h2 className="text-2xl font-bold mb-4">Résumé</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span>{total.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Livraison</span>
                <span>À calculer</span>
              </div>
            </div>
            
            <div className="border-t border-gray-300 pt-4 mb-6">
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>{total.toFixed(2)} €</span>
              </div>
            </div>

            <button
              onClick={() => setShowCheckout(true)}
              className="w-full bg-yellow-400 text-black py-3 rounded-lg font-semibold hover:bg-yellow-500 transition mb-3"
            >
              Commander
            </button>

            <Link
              to="/realisations"
              className="block w-full text-center border-2 border-gray-800 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              ← Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Formulaire de commande
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      console.log('Envoi de la commande:', payload);

      const response = await fetch(apiEndpoints.commandes, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const responseData = await response.json();
      console.log('Réponse de l\'API:', responseData);

      if (!response.ok) {
        const errorMessage = responseData?.error?.message || 'Erreur lors de l\'envoi de la commande';
        throw new Error(errorMessage);
      }

      CartUtils.clearCart();
      setSuccess(true);
    } catch (err: any) {
      console.error('Erreur complète:', err);
      setError(err.message || 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto py-16 px-4 text-center max-w-2xl">
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-8">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-3xl font-bold text-green-800 mb-4">Commande envoyée !</h1>
          <p className="text-gray-700 mb-6">
            Nous avons bien reçu votre commande. Vous recevrez un email de confirmation à {formData.email}.
          </p>
          <Link
            to="/"
            className="inline-block bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl mt-[70px]">
      <button
        onClick={onBack}
        className="text-indigo-600 hover:text-indigo-800 mb-6 flex items-center"
      >
        ← Retour au panier
      </button>

      <h1 className="text-4xl font-bold mb-8">Finaliser la commande</h1>

      <div className="bg-gray-100 rounded-lg p-6 mb-8">
        <h2 className="font-bold mb-2">Récapitulatif</h2>
        <p className="text-sm text-gray-600 mb-4">{cart.length} article(s) - Total: {total.toFixed(2)} €</p>
        <p className="text-sm">
          Après validation, nous vous contacterons pour confirmer la commande et convenir du mode de paiement et de livraison.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium mb-2">Nom complet *</label>
          <input
            type="text"
            required
            value={formData.nom}
            onChange={(e) => setFormData({...formData, nom: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Email *</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Téléphone *</label>
          <input
            type="tel"
            required
            value={formData.telephone}
            onChange={(e) => setFormData({...formData, telephone: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Adresse de livraison *</label>
          <textarea
            required
            rows={3}
            value={formData.adresse}
            onChange={(e) => setFormData({...formData, adresse: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Notes (optionnel)</label>
          <textarea
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            placeholder="Informations complémentaires, préférences de livraison..."
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-500 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-400 text-black py-4 rounded-lg font-semibold hover:bg-yellow-500 transition disabled:opacity-50"
        >
          {loading ? 'Envoi en cours...' : 'Envoyer la commande'}
        </button>
      </form>
    </div>
  );
}