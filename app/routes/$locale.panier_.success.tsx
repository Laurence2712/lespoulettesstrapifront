import { redirect } from '@remix-run/node';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from '@remix-run/react';
import { useCartStore } from '../store/cartStore';
import { useLocalePath } from '../hooks/useLocalePath';
import { useTranslation } from 'react-i18next';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const locale = params.locale ?? 'fr';
  const url = new URL(request.url);
  if (!url.searchParams.get('session_id')) {
    return redirect(`/${locale}/`);
  }
  return null;
}

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
  const lp = useLocalePath();
  const { t } = useTranslation();
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    if (!cleared) {
      clearCart();
      setCleared(true);
    }
  }, [clearCart, cleared]);

  return (
    <div className="py-6 sm:py-8 md:py-[60px] px-4 sm:px-6 md:px-[60px] lg:px-[120px] text-center mt-16 sm:mt-20 md:mt-24">
      <div className="bg-benin-vert/10 border-2 border-benin-vert rounded-lg p-6 sm:p-8">
        <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">✓</div>
        <h1 className="font-basecoat text-2xl sm:text-3xl md:text-4xl font-bold text-benin-vert mb-3 sm:mb-4 uppercase">
          {t('cart.paid_title')}
        </h1>
        <p className="font-basecoat text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
          {t('cart.paid_desc')}
        </p>
        <p className="font-basecoat text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
          {t('cart.dispatch_soon')}
        </p>
        {sessionId && (
          <p className="font-basecoat text-xs text-gray-500 mb-6 px-2">
            {t('cart.reference')} LP-{sessionId.slice(-8).toUpperCase()}
          </p>
        )}
        <Link
          to={lp("/")}
          className="font-basecoat inline-block border-2 border-benin-jaune text-gray-900 hover:bg-benin-jaune hover:text-black px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold transition transform hover:scale-105 text-sm sm:text-base"
        >
          {t('cart.back_to_home')}
        </Link>
      </div>
    </div>
  );
}