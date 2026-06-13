import { Link } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import BagIcon from '../BagIcon';
import ProductCard from '../ProductCard';
import { useLocalePath } from '../../hooks/useLocalePath';
import { useCartStore } from '../../store/cartStore';

interface CartItem {
  id: string;
  title: string;
  prix: string | number;
  quantity: number;
  image_url: string;
  stock?: number;
}

interface FeaturedProduct {
  id: string;
  title: string;
  image_url?: string;
  prix?: string | number;
}

interface CartViewProps {
  items: CartItem[];
  total: number;
  featuredProducts: FeaturedProduct[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
  scrollRef?: React.RefObject<HTMLDivElement>;
}

export default function CartView({
  items,
  total,
  featuredProducts,
  onUpdateQuantity,
  onRemove,
  onCheckout,
  scrollRef,
}: CartViewProps) {
  const { t } = useTranslation();
  const lp = useLocalePath();
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const getMinutesUntilExpiry = useCartStore((s) => s.getMinutesUntilExpiry);
  const minutesLeft = getMinutesUntilExpiry();
  const showExpiryWarning = minutesLeft !== null && minutesLeft <= 120;

  if (items.length === 0) {
    return (
      <div className="py-6 sm:py-8 md:py-[60px] px-6 sm:px-10 md:px-16 lg:px-24 mt-16 sm:mt-20 md:mt-24">
        <div className="text-center py-12 sm:py-16">
          <BagIcon className="w-20 h-20 text-gray-200 mx-auto mb-6" />
          <h1 className="font-basecoat text-lg sm:text-xl md:text-2xl font-bold uppercase text-gray-900 dark:text-gray-100 mb-3">
            {t('cart.empty_title')}
          </h1>
          <p className="font-basecoat text-gray-500 dark:text-gray-400 text-base mb-8">
            {t('cart.empty_subtitle')}
          </p>
          <Link
            to={lp("/realisations")}
            className="font-basecoat border-2 border-benin-jaune text-gray-900 dark:text-gray-100 hover:bg-benin-jaune hover:text-black px-10 py-4 rounded-xl font-bold uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] hover:shadow-lg text-sm sm:text-base inline-block"
          >
            {t('cart.see_all_shop')}
          </Link>
        </div>

        {featuredProducts.length > 0 && (
          <div className="mt-10 sm:mt-14">
            <h2 className="font-basecoat text-lg sm:text-xl font-bold uppercase text-gray-900 dark:text-gray-100 mb-2 text-center">
              {t('cart.featured_title')}
            </h2>
            <p className="font-basecoat text-gray-500 dark:text-gray-400 text-sm text-center mb-6 sm:mb-8">
              {t('cart.featured_subtitle')}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  image_url={product.image_url}
                  prix={product.prix}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="py-6 sm:py-8 md:py-[60px] px-6 sm:px-10 md:px-16 lg:px-24 mt-16 sm:mt-20 md:mt-24">
      {showExpiryWarning && (
        <div role="alert" className="mb-6 flex items-center gap-3 bg-wax-orange/10 border border-wax-orange/30 text-wax-orange rounded-xl px-4 py-3 text-sm font-basecoat">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          {minutesLeft === 0
            ? 'Votre panier a expiré et sera vidé au prochain rechargement.'
            : `Votre panier expire dans ${minutesLeft < 60 ? `${minutesLeft} min` : `${Math.floor(minutesLeft / 60)}h`}.`}
        </div>
      )}

      <nav className="anim-fade-up font-basecoat mb-6 sm:mb-8 text-xs" aria-label="Fil d'Ariane">
        <Link to={lp("/")} className="text-benin-jaune hover:text-benin-terre font-medium transition">{t('common.home')}</Link>
        <span className="mx-1.5 sm:mx-2 text-gray-400 dark:text-gray-500" aria-hidden="true">/</span>
        <span className="text-gray-600 dark:text-gray-400">{t('cart.breadcrumb')}</span>
      </nav>

      <h1 className="anim-fade-up font-basecoat text-lg sm:text-xl md:text-2xl font-bold uppercase text-gray-900 dark:text-gray-100" data-delay="0.1">
        {t('cart.your_cart')}
      </h1>
      <div className="anim-expand-line w-24 sm:w-28 h-[2px] bg-gradient-to-r from-benin-jaune via-benin-jaune/60 to-transparent mt-3 sm:mt-4" data-delay="0.15" aria-hidden="true" />
      <p className="anim-fade-up font-basecoat text-gray-500 dark:text-gray-400 text-sm sm:text-base mt-3 mb-8 sm:mb-10 md:mb-12" data-delay="0.2">
        {t('cart.items_count', { count: totalItems })}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
        {/* Items */}
        <div className="lg:col-span-2 order-2 lg:order-1 anim-stagger space-y-5" data-stagger="0.1">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 sm:gap-5 p-4 sm:p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 shadow-sm">
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.title}
                  width={160}
                  height={160}
                  className="w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 object-cover rounded-lg flex-shrink-0"
                  loading="lazy"
                />
              )}

              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <h3 className="font-basecoat text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 leading-tight">
                    {item.title}
                  </h3>
                  <p className="font-basecoat text-benin-jaune font-bold text-lg sm:text-xl mt-1">
                    {item.prix} €
                  </p>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="inline-flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden" role="group" aria-label={`Quantité pour ${item.title}`}>
                    <button
                      onClick={() => item.quantity === 1 ? onRemove(item.id) : onUpdateQuantity(item.id, item.quantity - 1)}
                      aria-label="Diminuer la quantité"
                      className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition font-bold"
                    >
                      -
                    </button>
                    <span className="w-10 h-10 flex items-center justify-center font-basecoat font-bold text-gray-900 dark:text-gray-100 text-sm border-x border-gray-200 dark:border-gray-700" aria-live="polite">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      disabled={item.stock !== undefined && item.quantity >= item.stock}
                      aria-label="Augmenter la quantité"
                      className="w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => onRemove(item.id)}
                    aria-label={`Supprimer ${item.title} du panier`}
                    className="w-10 h-10 rounded-xl bg-benin-rouge/10 hover:bg-benin-rouge/20 flex items-center justify-center text-benin-rouge transition flex-shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1 order-1 lg:order-2 anim-fade-left" data-delay="0.3">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 sm:p-7 shadow-sm lg:sticky lg:top-[100px]">
            <h2 className="font-basecoat text-xl sm:text-2xl font-bold uppercase text-gray-900 dark:text-gray-100 mb-5">
              {t('cart.summary')}
            </h2>

            <div className="space-y-3 mb-5">
              <div className="font-basecoat flex justify-between text-base text-gray-600 dark:text-gray-400">
                <span>{t('cart.subtotal')} ({t('cart.items_count', { count: totalItems })})</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">{total.toFixed(2)} €</span>
              </div>
              <div className="font-basecoat flex justify-between text-sm text-gray-400 dark:text-gray-500">
                <span>{t('cart.shipping')}</span>
                <span>{t('cart.shipping_next_step')}</span>
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700 pt-5 mb-6">
              <div className="font-basecoat flex justify-between items-center">
                <div>
                  <span className="font-bold text-gray-900 dark:text-gray-100 text-base">{t('cart.estimated_total')}</span>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{t('cart.excl_shipping')}</p>
                </div>
                <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{total.toFixed(2)} €</span>
              </div>
            </div>

            <button
              onClick={onCheckout}
              className="font-basecoat w-full border-2 border-benin-jaune text-gray-900 dark:text-gray-100 hover:bg-benin-jaune hover:text-black py-4 rounded-xl font-bold uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] hover:shadow-lg mb-3 text-sm sm:text-base"
            >
              {t('cart.place_order')}
            </button>

            <Link
              to={lp("/realisations")}
              className="font-basecoat block w-full text-center py-3 rounded-xl font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-200 dark:border-gray-700 hover:border-gray-300 transition text-sm sm:text-base"
            >
              {t('cart.continue_shopping')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
