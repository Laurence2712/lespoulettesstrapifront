import { useState, useEffect } from 'react';
import { useSearchParams, useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import { useCartStore } from '../store/cartStore';
import { getApiUrl, getImageUrl } from '../config/api';
import { useScrollAnimations } from '../hooks/useScrollAnimations';
import { useTranslation } from 'react-i18next';
import CartView from '../components/checkout/CartView';
import CheckoutForm from '../components/checkout/CheckoutForm';
import OrderSuccess from '../components/checkout/OrderSuccess';

export function meta() {
  return [
    { title: "Mon panier — Les Poulettes" },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

interface FeaturedProduct {
  id: string;
  title: string;
  image_url?: string;
  prix?: string | number;
}

export async function loader() {
  try {
    const API_URL = getApiUrl();
    const response = await fetch(`${API_URL}/api/realisations?populate=*`);
    if (!response.ok) return json({ featuredProducts: [] });
    const data = await response.json();
    const featuredProducts: FeaturedProduct[] = (data?.data ?? []).slice(0, 4).map((r: any) => ({
      id: r.documentId,
      title: r.Titre || 'Titre indisponible',
      image_url: r.ImagePrincipale?.url
        ? getImageUrl(r.ImagePrincipale.url)
        : r.Images?.[0]?.url
          ? getImageUrl(r.Images[0].url)
          : undefined,
      prix: r.Prix,
    }));
    return json({ featuredProducts });
  } catch {
    return json({ featuredProducts: [] });
  }
}

export default function Panier() {
  const { featuredProducts } = useLoaderData<{ featuredProducts: FeaturedProduct[] }>();
  const items = useCartStore((state) => state.items);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);

  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [showCheckout, setShowCheckout] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { t } = useTranslation();
  const scrollRef = useScrollAnimations([mounted, items.length]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (sessionId) {
      clearCart();
      setOrderSuccess(true);
    }
  }, [sessionId, clearCart]);

  if (orderSuccess) {
    return <OrderSuccess sessionId={sessionId} />;
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center mt-16">
        <p className="text-xl font-basecoat text-gray-400 dark:text-gray-500">{t('common.loading')}...</p>
      </div>
    );
  }

  if (showCheckout) {
    return (
      <>
        <CheckoutForm
          cart={items}
          total={getTotalPrice()}
          onBack={() => setShowCheckout(false)}
          onSuccess={() => setOrderSuccess(true)}
        />
      </>
    );
  }

  return (
    <CartView
      items={items}
      total={mounted ? getTotalPrice() : 0}
      featuredProducts={featuredProducts}
      onUpdateQuantity={updateQuantity}
      onRemove={removeFromCart}
      onCheckout={() => setShowCheckout(true)}
      scrollRef={scrollRef}
    />
  );
}
