import { useEffect, useState } from 'react';
import { Link, useSearchParams } from '@remix-run/react';
import { useCartStore } from '../store/cartStore';

export default function PaiementReussi() {
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
    <div className="container mx-auto py-12 sm:py-16 md:py-20 px-4 text-center max-w-2xl mt-[60px] sm:mt-[70px]">
      <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 sm:p-8">
        <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">✓</div>
        <h1 className="font-basecoat text-2xl sm:text-3xl md:text-4xl font-light text-green-800 mb-3 sm:mb-4 uppercase">
          Paiement réussi !
        </h1>
        <p className="font-basecoat text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
          Votre paiement a été effectué avec succès. Vous allez recevoir un email de confirmation.
        </p>
        <p className="font-basecoat text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
          Votre commande sera préparée et expédiée dans les plus brefs délais.
        </p>
        {sessionId && (
          <p className="font-basecoat text-xs text-gray-500 mb-6">
            Référence : {sessionId}
          </p>
        )}
        <Link
          to="/"
          className="font-basecoat inline-block bg-yellow-400 text-black px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-yellow-500 transition text-sm sm:text-base max-w-xs sm:max-w-sm md:max-w-md mx-auto"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
