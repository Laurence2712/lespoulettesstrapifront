import { useEffect, useState } from 'react';
import { Link, useSearchParams } from '@remix-run/react';
import { useCartStore } from '../store/cartStore';

export function meta() {
  return [
    { title: "Paiement réussi — Les Poulettes" },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const clearCart = useCartStore((state) => state.clearCart);
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    if (!cleared) {
      clearCart();
      setCleared(true);
    }
  }, [clearCart, cleared]);

  return (
    <div className="py-6 sm:py-8 md:py-[60px] px-4 sm:px-6 md:px-[60px] lg:px-[120px] text-center mt-16 sm:mt-20 md:mt-24">
      <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 sm:p-8">
        <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">✓</div>
        <h1 className="font-basecoat text-2xl sm:text-3xl md:text-4xl font-bold text-green-800 mb-3 sm:mb-4 uppercase">
          Paiement réussi !
        </h1>
        <p className="font-basecoat text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
          Votre paiement a été effectué avec succès. Vous allez recevoir un email de confirmation.
        </p>
        <p className="font-basecoat text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
          Votre commande sera préparée et expédiée dans les plus brefs délais.
        </p>
        {sessionId && (
          <p className="font-basecoat text-xs text-gray-500 mb-6 break-all px-2">
            Référence : {sessionId}
          </p>
        )}
        <Link
          to="/"
          className="font-basecoat inline-block bg-yellow-400 hover:bg-yellow-500 text-black px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold transition transform hover:scale-105 text-sm sm:text-base"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}