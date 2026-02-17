import { useCartStore } from '../store/cartStore';
import { useState, useEffect, useRef } from 'react';
import { FaTrash } from 'react-icons/fa';


export default function CartDrawer() {
  const cart = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const [isOpen, setIsOpen] = useState(false);
  const prevCartLength = useRef(cart.length);

  // Ouvre le drawer si un nouvel item est ajouté
  useEffect(() => {
    if (cart.length > prevCartLength.current) {
      setIsOpen(true);
    }
    prevCartLength.current = cart.length;
  }, [cart]);

  const total = cart.reduce(
    (acc, item) => acc + (Number(item.prix) || 0) * item.quantity,
    0
  );
console.log(useCartStore.getState())
  if (!isOpen) return null;

  return (
    <>
      {/* BACKDROP flou */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-[999]"
        onClick={() => setIsOpen(false)}
      ></div>

      {/* DRAWER */}
      <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-xl z-[1000] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-bold text-lg font-basecoat uppercase">Votre panier</h2>
          <button
            className="text-gray-600 hover:text-gray-900"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center font-basecoat">Votre panier est vide</p>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 border-b pb-2"
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold font-basecoat">{item.title}</h3>
                  <p className="text-yellow-600 font-bold font-basecoat">{item.prix} €</p>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() =>
                        item.quantity > 1 &&
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      className="w-7 h-7 bg-gray-200 rounded font-basecoat"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="w-7 h-7 bg-gray-200 rounded font-basecoat"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 font-basecoat"
                >
                  <FaTrash />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t">
          <p className="font-bold text-lg mb-2 font-basecoat">Total : {total} €</p>
          <button className="w-full bg-yellow-400 hover:bg-yellow-500 py-3 rounded font-bold font-basecoat">
            Passer à la caisse
          </button>
           <button className="w-full mt-3 bg-white hover:bg-yellow-500 py-3 rounded font-bold font-basecoat">
            Continuer les achats
          </button>
        </div>
      </div>
    </>
  );
}