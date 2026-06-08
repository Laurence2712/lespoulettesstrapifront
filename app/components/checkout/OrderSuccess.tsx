import { Link } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { useLocalePath } from '../../hooks/useLocalePath';

interface OrderSuccessProps {
  sessionId: string | null;
}

export default function OrderSuccess({ sessionId }: OrderSuccessProps) {
  const { t } = useTranslation();
  const lp = useLocalePath();
  const isPaid = Boolean(sessionId);

  return (
    <div className="py-6 sm:py-8 md:py-[60px] px-6 sm:px-10 md:px-16 lg:px-24 mt-16 sm:mt-20 md:mt-24 min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-lg">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isPaid ? 'bg-benin-vert/15' : 'bg-benin-jaune/15'}`}>
          <svg className={`w-10 h-10 ${isPaid ? 'text-benin-vert' : 'text-benin-jaune'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h1 className="font-basecoat text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 uppercase">
          {isPaid ? t('cart.paid_title') : t('cart.order_sent_title')}
        </h1>
        <p className="font-basecoat text-gray-600 dark:text-gray-400 mb-3 text-sm sm:text-base leading-relaxed">
          {isPaid ? t('cart.paid_desc') : t('cart.order_sent_desc')}
        </p>
        {isPaid && (
          <p className="font-basecoat text-gray-600 dark:text-gray-400 mb-3 text-sm sm:text-base">
            {t('cart.dispatch_soon')}
          </p>
        )}
        {!isPaid && (
          <p className="font-basecoat text-gray-500 dark:text-gray-400 mb-3 text-sm sm:text-base">
            {t('cart.pending_payment')}
          </p>
        )}
        {sessionId && (
          <p className="font-basecoat text-xs text-gray-400 dark:text-gray-500 mb-6 break-all px-2">
            {t('cart.reference')} {sessionId}
          </p>
        )}
        <Link
          to={lp("/")}
          className="font-basecoat inline-block border-2 border-benin-jaune text-gray-900 dark:text-gray-100 hover:bg-benin-jaune hover:text-black px-8 sm:px-10 py-3 sm:py-4 rounded-xl font-bold uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] hover:shadow-lg text-sm sm:text-base"
        >
          {t('cart.back_to_home')}
        </Link>
      </div>
    </div>
  );
}
