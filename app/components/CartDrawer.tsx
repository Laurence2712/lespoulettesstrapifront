import { useCartStore } from '../store/cartStore';
import { useState, useEffect, useRef } from 'react';
import { Link } from '@remix-run/react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';


export default function CartDrawer() {
  const cart = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const [isOpen, setIsOpen] = useState(false);
  const prevCartLength = useRef(cart.length);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Ouvre le drawer si un nouvel item est ajouté
  useEffect(() => {
    if (cart.length > prevCartLength.current) {
      setIsOpen(true);
    }
    prevCartLength.current = cart.length;
  }, [cart]);

  // Fermer avec Escape + focus sur le bouton fermer à l'ouverture
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    // Focus sur le bouton fermer pour accessibilité clavier
    setTimeout(() => closeButtonRef.current?.focus(), 50);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen]);

  const total = cart.reduce(
    (acc, item) => acc + (Number(item.prix) || 0) * item.quantity,
    0
  );

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (!isOpen) return null;

  return (
    <>
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] transition-opacity"
        onClick={() => setIsOpen(false)}
      ></div>

      {/* DRAWER */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Panier"
        className="fixed top-0 right-0 h-full w-[90vw] sm:w-[480px] md:w-[520px] bg-white shadow-2xl z-[1000] flex flex-col"
      >

        {/* Header */}
        <div className="flex justify-between items-center px-6 sm:px-8 py-5 border-b border-gray-100">
          <div>
            <h2 className="font-basecoat font-bold text-xl sm:text-2xl uppercase text-gray-900">
              Votre panier
            </h2>
            <p className="font-basecoat text-sm text-gray-500 mt-0.5">
              {totalItems} article{totalItems > 1 ? 's' : ''}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            aria-label="Fermer le panier"
            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 transition"
            onClick={() => setIsOpen(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <ShoppingCartIcon className="w-16 h-16 text-gray-200" strokeWidth={1} />
              <p className="text-gray-400 font-basecoat text-base">Votre panier est vide</p>
            </div>
          ) : (
            <div className="space-y-5">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100"
                >
                  {/* Image */}
                  <img
                    src={item.image_url}
                    alt={item.title}
                    width={112}
                    height={112}
                    className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl flex-shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h3 className="font-basecoat font-bold text-gray-900 text-sm sm:text-base leading-tight truncate">
                        {item.title}
                      </h3>
                      <p className="font-basecoat text-yellow-500 font-bold text-base sm:text-lg mt-1">
                        {item.prix} €
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity */}
                      <div className="inline-flex items-center border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() =>
                            item.quantity > 1 &&
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          aria-label="Diminuer la quantité"
                          className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition font-bold"
                        >
                          -
                        </button>
                        <span className="w-9 h-9 flex items-center justify-center font-basecoat font-bold text-gray-900 text-sm border-x border-gray-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          aria-label="Augmenter la quantité"
                          className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition font-bold"
                        >
                          +
                        </button>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Supprimer ${item.title} du panier`}
                        className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-400 hover:text-red-600 transition"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-6 sm:px-8 py-5 border-t border-gray-100 space-y-3">
            <div className="flex justify-between items-center mb-2">
              <span className="font-basecoat text-gray-500 text-base">Total</span>
              <span className="font-basecoat font-bold text-2xl text-gray-900">{total.toFixed(2)} €</span>
            </div>
            <Link
              to="/panier"
              onClick={() => setIsOpen(false)}
              className="block w-full border-2 border-yellow-400 text-gray-900 hover:bg-yellow-400 hover:text-black text-center py-4 rounded-xl font-basecoat font-bold uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] hover:shadow-lg text-sm sm:text-base"
            >
              Passer à la caisse
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-3 rounded-xl font-basecoat font-semibold text-gray-500 hover:text-gray-900 border border-gray-200 hover:border-gray-300 transition text-sm sm:text-base"
            >
              Continuer les achats
            </button>
          </div>
        )}
      </div>
    </>
  );
}
