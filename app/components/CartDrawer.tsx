import { useCartStore } from '../store/cartStore';
import { useState, useEffect, useRef } from 'react';
import { Link } from '@remix-run/react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useLocalePath } from '../hooks/useLocalePath';

export default function CartDrawer() {
  const cart = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const lp = useLocalePath();

  const [isOpen, setIsOpen] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const prevCartLength = useRef(cart.length);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Open drawer when new item added
  useEffect(() => {
    if (cart.length > prevCartLength.current) {
      setIsOpen(true);
    }
    prevCartLength.current = cart.length;
  }, [cart]);

  // Escape + focus management
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    setTimeout(() => closeButtonRef.current?.focus(), 50);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen]);

  const handleRemove = (id: string) => {
    setRemovingId(id);
    setTimeout(() => {
      removeFromCart(id);
      setRemovingId(null);
    }, 300);
  };

  const total = cart.reduce((acc, item) => acc + (Number(item.prix) || 0) * item.quantity, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999] animate-fade-in"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Panier"
        className="fixed top-0 right-0 h-full w-full sm:w-[480px] md:w-[520px] bg-white dark:bg-gray-900 shadow-2xl z-[1000] flex flex-col animate-drawer-in"
      >
        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-benin-jaune via-wax-orange to-benin-terre flex-shrink-0" />

        {/* Header */}
        <div className="flex justify-between items-center px-6 sm:px-8 py-5 border-b border-gray-100 dark:border-gray-700">
          <div>
            <h2 className="font-basecoat font-bold text-xl sm:text-2xl uppercase text-gray-900 dark:text-gray-100">
              Votre panier
            </h2>
            <p className="font-basecoat text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {totalItems} article{totalItems > 1 ? 's' : ''}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            aria-label="Fermer le panier"
            className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition"
            onClick={() => setIsOpen(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-5 pb-16">
              <div className="w-20 h-20 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                <ShoppingCartIcon className="w-10 h-10 text-gray-200 dark:text-gray-600" strokeWidth={1} />
              </div>
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400 font-basecoat text-base font-semibold">Votre panier est vide</p>
                <p className="text-gray-400 dark:text-gray-500 font-basecoat text-sm mt-1">Découvrez nos créations wax !</p>
              </div>
              <Link
                to={lp('/realisations')}
                onClick={() => setIsOpen(false)}
                className="font-basecoat text-sm font-bold uppercase tracking-wider border-2 border-benin-jaune px-6 py-2.5 rounded-xl hover:bg-benin-jaune hover:text-black transition-all duration-200"
              >
                Voir la boutique
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className={`flex gap-4 p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 transition-all duration-300 ${
                  removingId === item.id ? 'opacity-0 scale-95 translate-x-4' : 'opacity-100'
                }`}
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
                <div className="flex-1 flex flex-col min-w-0">
                  <h3 className="font-basecoat font-bold text-gray-900 dark:text-gray-100 text-sm sm:text-base leading-tight break-words">
                    {item.title}
                  </h3>
                  <p className="font-basecoat text-benin-jaune font-bold text-base sm:text-lg mt-1">
                    {item.prix} €
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity */}
                    <div className="inline-flex items-center border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden">
                      <button
                        onClick={() => item.quantity > 1 && updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Diminuer la quantité"
                        className="w-9 h-9 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition font-bold"
                      >
                        −
                      </button>
                      <span className="w-9 h-9 flex items-center justify-center font-basecoat font-bold text-gray-900 dark:text-gray-100 text-sm border-x border-gray-200 dark:border-gray-600">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Augmenter la quantité"
                        className="w-9 h-9 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition font-bold"
                      >
                        +
                      </button>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => handleRemove(item.id)}
                      aria-label={`Supprimer ${item.title} du panier`}
                      className="w-9 h-9 rounded-xl bg-benin-rouge/10 hover:bg-benin-rouge/20 flex items-center justify-center text-benin-rouge transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-6 sm:px-8 py-5 border-t border-gray-100 dark:border-gray-700 space-y-3">
            {/* Subtotal */}
            <div className="flex justify-between items-center">
              <span className="font-basecoat text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">Sous-total</span>
              <span className="font-basecoat font-bold text-2xl text-gray-900 dark:text-gray-100">{total.toFixed(2)} €</span>
            </div>

            {/* Livraison note */}
            <p className="font-basecoat text-xs text-gray-400 dark:text-gray-500 text-center">
              Frais de livraison calculés à l&apos;étape suivante
            </p>

            <Link
              to={lp('/panier')}
              onClick={() => setIsOpen(false)}
              className="block w-full bg-benin-jaune text-black text-center py-4 rounded-xl font-basecoat font-bold uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:bg-benin-ocre text-sm sm:text-base"
            >
              Commander →
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-3 rounded-xl font-basecoat font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition text-sm"
            >
              Continuer les achats
            </button>
          </div>
        )}
      </div>
    </>
  );
}
