import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLoaderData, useSearchParams } from '@remix-run/react';
import { json } from '@remix-run/node';
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { apiEndpoints, getImageUrl } from '../config/api';
import { useCartStore } from '../store/cartStore';
import { useScrollAnimations } from '../hooks/useScrollAnimations';
import { useToast } from '../components/ToastProvider';
import CartDrawer from '../components/CartDrawer';
import { useLocalePath } from '../hooks/useLocalePath';
import { useTranslation } from 'react-i18next';

export const meta: MetaFunction<typeof loader> = ({ data, params }) => {
  const title = data?.realisation?.title;
  const description = data?.realisation?.description;
  const prix = data?.realisation?.prix;
  // Préférer le format large pour les partages sociaux (meilleure qualité)
  const imageUrl =
    data?.realisation?.mainImages?.[0]?.formats?.large?.url ||
    data?.realisation?.mainImages?.[0]?.url;

  if (!title) {
    return [{ title: "Réalisation — Les Poulettes" }];
  }

  const metaDescription =
    description?.trim() ||
    `${title} — Accessoire wax fait main au Bénin par Les Poulettes.${prix ? ` À partir de ${prix} €.` : ''}`;

  const pageUrl = `https://lespoulettes.be/realisations/${params.id}`;

  return [
    { title: `${title} — Les Poulettes` },
    { name: "description", content: metaDescription },
    { property: "og:title", content: `${title} — Les Poulettes` },
    { property: "og:description", content: metaDescription },
    { property: "og:type", content: "product" },
    { property: "og:url", content: pageUrl },
    { property: "og:site_name", content: "Les Poulettes" },
    ...(imageUrl ? [
      { property: "og:image", content: imageUrl },
      { property: "og:image:alt", content: `${title} — Les Poulettes` },
    ] : []),
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: `${title} — Les Poulettes` },
    { name: "twitter:description", content: metaDescription },
    ...(imageUrl ? [{ name: "twitter:image", content: imageUrl }] : []),
  ];
};

interface ImageData {
  id: number;
  url: string;
  formats?: {
    large?: { url: string };
    medium?: { url: string };
    small?: { url: string };
    thumbnail?: { url: string };
  };
}

interface Declinaison {
  id: number;
  Image: ImageData;
  Stock: number;
  Description?: string;
}

interface Realisation {
  id: number;
  title: string;
  description?: string;
  prix?: string | number;
  mainImages: ImageData[];
  declinaisons: Declinaison[];
  dimensions?: string;
  categorie?: string;
}

interface RelatedProduct {
  id: string;
  title: string;
  image_url: string;
  prix?: string | number;
}

interface LoaderData {
  realisation: Realisation | null;
  relatedProducts: RelatedProduct[];
  error: string | null;
}

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  const locale = params.locale ?? 'fr';
  const endpoints = apiEndpoints(locale);
  const baseUrl = endpoints.realisations.split('?')[0];

  try {
    const productUrl = `${baseUrl}/${id}?populate[0]=Images&populate[1]=Declinaison&populate[2]=Declinaison.Image&locale=${locale}`;
    const relatedUrl = `${baseUrl}?populate[0]=ImagePrincipale&populate[1]=Images&pagination[limit]=5&locale=${locale}`;

    const [response, relatedRes] = await Promise.all([
      fetch(productUrl),
      fetch(relatedUrl).catch(() => null),
    ]);

    if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
    const data = await response.json();

    // Produits similaires
    let relatedProducts: RelatedProduct[] = [];
    if (relatedRes?.ok) {
      const relatedData = await relatedRes.json();
      if (relatedData?.data) {
        relatedProducts = relatedData.data
          .filter((r: any) => r.documentId !== id)
          .slice(0, 4)
          .map((r: any) => ({
            id: r.documentId,
            title: r.Titre || 'Titre indisponible',
            image_url: r.ImagePrincipale?.url
              ? getImageUrl(r.ImagePrincipale.url)
              : r.Images?.[0]?.url
                ? getImageUrl(r.Images[0].url)
                : '',
            prix: r.Prix,
          }));
      }
    }

    if (data?.data) {
      const item = data.data;

      const declinaisons: Declinaison[] =
        item.Declinaison?.map((decl: any) => {
          const imgData = decl.Image;
          const image: ImageData = imgData
            ? {
                id: imgData.id,
                url: getImageUrl(imgData.url),
                formats: imgData.formats
                  ? {
                      large: imgData.formats.large ? { url: getImageUrl(imgData.formats.large.url) } : undefined,
                      medium: imgData.formats.medium ? { url: getImageUrl(imgData.formats.medium.url) } : undefined,
                      small: imgData.formats.small ? { url: getImageUrl(imgData.formats.small.url) } : undefined,
                      thumbnail: imgData.formats.thumbnail ? { url: getImageUrl(imgData.formats.thumbnail.url) } : undefined,
                    }
                  : undefined,
              }
            : { id: 0, url: '' };

          return {
            id: decl.id,
            Stock: decl.Stock ?? 0,
            Description: decl.Description ?? '',
            Image: image,
          };
        }) || [];

      const mainImages: ImageData[] =
        item.Images?.map((img: any) => ({
          id: img.id,
          url: getImageUrl(img.url),
          formats: img.formats
            ? {
                large: img.formats.large ? { url: getImageUrl(img.formats.large.url) } : undefined,
                medium: img.formats.medium ? { url: getImageUrl(img.formats.medium.url) } : undefined,
                small: img.formats.small ? { url: getImageUrl(img.formats.small.url) } : undefined,
                thumbnail: img.formats.thumbnail ? { url: getImageUrl(img.formats.thumbnail.url) } : undefined,
              }
            : undefined,
        })) || [];

      return json<LoaderData>({
        realisation: {
          id: item.id,
          title: item.Titre || 'Titre indisponible',
          description: item.Description || '',
          prix: item.Prix,
          mainImages,
          declinaisons,
          dimensions: item.Dimensions || undefined,
          categorie: item.Categorie || undefined,
        },
        relatedProducts,
        error: null,
      });
    }

    return json<LoaderData>({ realisation: null, relatedProducts: [], error: 'Produit introuvable' });
  } catch (err: any) {
    return json<LoaderData>({ realisation: null, relatedProducts: [], error: 'Erreur lors du chargement du produit' });
  }
}

export default function RealisationDetail() {
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);
  const { realisation, relatedProducts, error } = useLoaderData<LoaderData>();
  const { showToast } = useToast();
  const lp = useLocalePath();
  const { t } = useTranslation();

  const [searchParams] = useSearchParams();
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [selectedDeclinaisonId, setSelectedDeclinaisonId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [zoomOpen, setZoomOpen] = useState(false);

  useEffect(() => {
    if (!zoomOpen) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setZoomOpen(false); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [zoomOpen]);

  useEffect(() => {
    const declinaisonParam = searchParams.get('declinaison');
    if (declinaisonParam && realisation) {
      const id = parseInt(declinaisonParam, 10);
      const exists = realisation.declinaisons.find((d) => d.id === id);
      if (exists) setSelectedDeclinaisonId(id);
    }
  }, [searchParams, realisation]);

  const imageRef = useRef<HTMLDivElement>(null);
  const scrollRef = useScrollAnimations([]);

  if (error || !realisation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-benin-rouge mb-4 font-basecoat">{error}</p>
          <Link to={lp("/realisations")} className="text-benin-jaune hover:text-benin-terre font-basecoat underline">
            ← {t('products.back_to_shop')}
          </Link>
        </div>
      </div>
    );
  }

  const selectedDeclinaison = selectedDeclinaisonId !== null
    ? realisation.declinaisons.find((d) => d.id === selectedDeclinaisonId) ?? null
    : null;

  // ✅ Image affichée = déclinaison sélectionnée OU angle miniature du bas
  const currentImage = selectedDeclinaison
    ? selectedDeclinaison.Image
    : realisation.mainImages[mainImageIndex] || realisation.mainImages[0];

  const isInStock = selectedDeclinaison ? selectedDeclinaison.Stock > 0 : false;
  const hasDeclinaisons = realisation.declinaisons.length > 0;

  // ✅ Sélectionner une déclinaison ne touche plus à mainImageIndex
  const handleSelectDeclinaison = (decl: Declinaison) => {
    setSelectedDeclinaisonId(decl.id);
    setQuantity(1);
    // Sur mobile/tablet (< 1024px), scroll vers l'image principale pour voir le résultat
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setTimeout(() => {
        imageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  };

  const handleAddToCart = () => {
    if (selectedDeclinaison && selectedDeclinaison.Stock > 0) {
      addToCart({
        id: `${realisation.id}-${selectedDeclinaison.id}`,
        title: `${realisation.title}${selectedDeclinaison.Description ? ` — ${selectedDeclinaison.Description}` : ''}`,
        prix: realisation.prix || 0,
        quantity,
        image_url: currentImage?.url || '',
        categorieId: realisation.id,
        declinaisonId: selectedDeclinaison.id,
        stock: selectedDeclinaison.Stock,
      });
      showToast(`${realisation.title} ajouté au panier !`);
    }
  };

  // JSON-LD données structurées produit (enrichi pour Google Shopping / SEO)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: realisation.title,
    ...(realisation.description?.trim() ? { description: realisation.description } : {}),
    image: realisation.mainImages.map((img) => img.formats?.large?.url || img.url).filter(Boolean),
    brand: { '@type': 'Brand', name: 'Les Poulettes' },
    manufacturer: {
      '@type': 'Organization',
      name: 'Les Poulettes',
      url: 'https://lespoulettes.be',
    },
    offers: {
      '@type': 'Offer',
      url: `https://lespoulettes.be/realisations/${realisation.id}`,
      priceCurrency: 'EUR',
      ...(realisation.prix ? { price: String(realisation.prix) } : {}),
      availability: realisation.declinaisons.some((d) => d.Stock > 0)
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Les Poulettes',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div
        ref={scrollRef}
        className="py-6 sm:py-8 md:py-[60px] mt-16 sm:mt-20 md:mt-24 px-4 sm:px-6 md:px-[60px] lg:px-[120px]"
      >
        {/* Breadcrumb */}
        <nav className="anim-fade-up mb-4 text-xs sm:text-sm font-basecoat text-gray-500">
          <Link to={lp("/")} className="hover:text-benin-jaune transition">{t('common.home')}</Link>
          <span className="mx-2">/</span>
          <Link to={lp("/realisations")} className="hover:text-benin-jaune transition">{t('products.breadcrumb_shop')}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 uppercase font-semibold">{realisation.title}</span>
        </nav>

        {/* Bouton retour */}
        <button
          onClick={() => navigate(-1)}
          className="anim-fade-up font-basecoat inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 sm:mb-8 transition text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('products.back_to_shop')}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16">

          {/* ── COLONNE IMAGES ── */}
          <div className="anim-fade-right" ref={imageRef}>

            {/* Image principale */}
            <div
              className="relative rounded-2xl shadow-xl mb-4 bg-beige group p-3 cursor-zoom-in"
              onClick={() => currentImage?.url && setZoomOpen(true)}
            >
              {currentImage?.url ? (
                <img
                  src={currentImage.formats?.large?.url || currentImage.url}
                  alt={realisation.title}
                  width={800}
                  height={500}
                  className="w-full h-[300px] sm:h-[380px] md:h-[440px] lg:h-[480px] object-contain rounded-xl transition-transform duration-500 group-hover:scale-[1.02]"
                />
              ) : (
                <div className="w-full h-[300px] flex items-center justify-center text-gray-400 font-basecoat">
                  {t('home.no_image')}
                </div>
              )}
              <div className="absolute top-4 left-4 bg-benin-jaune text-black text-xs font-basecoat font-bold uppercase px-3 py-1 rounded-full shadow">
                ✂ {t('home.badge_handmade')}
              </div>
              {currentImage?.url && (
                <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow">
                  <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16zm3-8H8m3-3v6" />
                  </svg>
                </div>
              )}
            </div>

            {/* Lightbox zoom */}
            {zoomOpen && currentImage?.url && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                onClick={() => setZoomOpen(false)}
              >
                <button
                  onClick={() => setZoomOpen(false)}
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition"
                  aria-label="Fermer"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <img
                  src={currentImage.formats?.large?.url || currentImage.url}
                  alt={realisation.title}
                  className="max-w-[92vw] max-h-[90vh] object-contain rounded-xl shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            {/* Galerie de vignettes — angles de l'image principale */}
            {realisation.mainImages.length >= 1 && (
              <div className="mt-4">
                <p className="text-xs font-basecoat font-semibold uppercase text-gray-400 tracking-widest mb-2">
                  {t('products.other_views')}
                </p>
                <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-benin-ocre scrollbar-track-gray-100">
                  {realisation.mainImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setMainImageIndex(idx);
                        setSelectedDeclinaisonId(null);
                      }}
                      className={`relative rounded-xl overflow-hidden transition-all flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 ${
                        !selectedDeclinaisonId && mainImageIndex === idx
                          ? 'ring-2 ring-benin-jaune shadow-md scale-105'
                          : 'ring-1 ring-gray-200 hover:ring-benin-ocre opacity-60 hover:opacity-100 hover:scale-105'
                      }`}
                      aria-label={`Vue ${idx + 1}`}
                    >
                      <img
                        src={img.formats?.small?.url || img.formats?.thumbnail?.url || img.url}
                        alt={`Vue ${idx + 1}`}
                        width={96}
                        height={96}
                        className="w-full h-full object-contain bg-beige rounded-lg"
                      />
                      {!selectedDeclinaisonId && mainImageIndex === idx && (
                        <div className="absolute inset-0 bg-benin-jaune/10 rounded-xl pointer-events-none" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── COLONNE INFOS ── */}
          <div className="anim-fade-left flex flex-col font-basecoat">

            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase text-gray-900 leading-tight">
                {realisation.title}
              </h1>
              <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-benin-jaune whitespace-nowrap flex-shrink-0">
                {realisation.prix ? `${realisation.prix} €` : t('products.on_request')}
              </p>
            </div>
            <div className="anim-expand-line w-24 sm:w-28 h-[2px] bg-gradient-to-r from-benin-jaune via-benin-jaune/60 to-transparent mt-3 mb-5"></div>

            {/* Description */}
            {realisation.description?.trim() && (
              <div className="mb-6 p-5 bg-amber-50 border-l-4 border-benin-jaune rounded-r-xl">
                <p className="text-gray-800 leading-relaxed text-base whitespace-pre-line">
                  {realisation.description}
                </p>
              </div>
            )}

            {/* Dimensions */}
            {realisation.dimensions && (
              <div className="mb-5 flex items-center gap-2 font-basecoat text-sm text-gray-700">
                <svg className="w-4 h-4 text-benin-jaune flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
                <span>{t('products.dimensions')} : <strong>{realisation.dimensions}</strong></span>
              </div>
            )}

            {/* Badge catégorie */}
            {realisation.categorie && (
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="inline-flex items-center gap-1.5 font-basecoat text-xs font-semibold bg-beige text-gray-700 border border-benin-jaune/30 px-3 py-1.5 rounded-full">
                  📦 {realisation.categorie}
                </span>
              </div>
            )}

            {/* ── Sélection déclinaison ── */}
            {hasDeclinaisons && (
              <div className="mb-6">
                <h2 className="font-bold uppercase text-sm text-gray-500 mb-3 tracking-wider">
                  {t('products.choose_variant')}
                </h2>
                <div className="flex flex-wrap gap-3">
                  {realisation.declinaisons.map((decl) => {
                    const isSelected = selectedDeclinaisonId === decl.id;
                    const inStock = decl.Stock > 0;

                    return (
                      <button
                        key={decl.id}
                        onClick={() => handleSelectDeclinaison(decl)}
                        disabled={!inStock}
                        className={`relative rounded-xl overflow-hidden transition-all w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 ${
                          !inStock
                            ? 'opacity-40 cursor-not-allowed grayscale'
                            : isSelected
                            ? 'ring-2 ring-benin-jaune ring-offset-2 scale-105 shadow-lg'
                            : 'ring-1 ring-gray-200 hover:ring-benin-ocre hover:scale-105 hover:shadow-md'
                        }`}
                        title={decl.Description || ''}
                      >
                        {decl.Image?.url ? (
                          <img
                            src={decl.Image.formats?.thumbnail?.url || decl.Image.url}
                            alt={decl.Description || 'Déclinaison'}
                            width={80}
                            height={80}
                            className="w-full h-full object-contain bg-beige rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-400">
                            ?
                          </div>
                        )}
                        {!inStock && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/40">
                            <span className="text-benin-rouge font-bold text-lg">✕</span>
                          </div>
                        )}
                        {isSelected && inStock && (
                          <div className="absolute inset-0 flex items-center justify-center bg-benin-jaune/20">
                            <span className="text-benin-jaune font-bold text-lg drop-shadow">✓</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {selectedDeclinaison?.Description && (
                  <p className="mt-3 text-sm font-semibold text-gray-700">
                    {t('products.variant_label')} :{' '}
                    <span className="text-benin-jaune">{selectedDeclinaison.Description}</span>
                  </p>
                )}
              </div>
            )}

            {/* Badge stock */}
            {selectedDeclinaison && (
              <div className="mb-5">
                {isInStock ? (
                  <span className="inline-flex items-center gap-2 bg-benin-vert/15 text-benin-vert px-4 py-1.5 rounded-full text-sm font-semibold">
                    <span className="w-2 h-2 rounded-full bg-benin-vert/100 inline-block"></span>
                    {selectedDeclinaison.Stock} disponible{selectedDeclinaison.Stock > 1 ? 's' : ''}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 bg-benin-rouge/15 text-benin-rouge px-4 py-1.5 rounded-full text-sm font-semibold">
                    <span className="w-2 h-2 rounded-full bg-benin-rouge/100 inline-block"></span>
                    {t('products.out_of_stock')}
                  </span>
                )}
              </div>
            )}

      
            {/* Pas de déclinaisons */}
            {!hasDeclinaisons && (
              <div className="mb-5">
                <span className="inline-flex items-center gap-2 bg-benin-rouge/15 text-benin-rouge px-4 py-1.5 rounded-full text-sm font-semibold">
                  <span className="w-2 h-2 rounded-full bg-benin-rouge/100 inline-block"></span>
                  {t('products.sold_out')}
                </span>
              </div>
            )}

            {/* Quantité */}
            {selectedDeclinaison && isInStock && (
              <div className="mb-5">
                <label className="block mb-2 text-sm font-bold uppercase text-gray-500 tracking-wider">
                  {t('products.quantity')}
                </label>
                <div className="inline-flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    aria-label="Diminuer la quantité"
                    className="w-11 h-11 flex items-center justify-center text-xl font-bold text-gray-600 hover:bg-gray-100 transition"
                  >
                    −
                  </button>
                  <span className="w-12 h-11 flex items-center justify-center font-bold text-gray-900 border-x border-gray-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      selectedDeclinaison && quantity < selectedDeclinaison.Stock && setQuantity(quantity + 1)
                    }
                    aria-label="Augmenter la quantité"
                    className="w-11 h-11 flex items-center justify-center text-xl font-bold text-gray-600 hover:bg-gray-100 transition"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Lien guide des tailles */}
            <div className="mb-4">
              <Link
                to={lp("/guide-des-tailles")}
                className="font-basecoat text-xs text-benin-jaune hover:text-benin-terre underline transition"
              >
                {t('sizes.title')} →
              </Link>
            </div>

            {/* Bouton panier */}
            {hasDeclinaisons && (
              <div className="mt-auto pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedDeclinaison || !isInStock}
                  className={`w-full py-4 rounded-xl font-bold uppercase text-base tracking-wider transition-all duration-200 ${
                    selectedDeclinaison && isInStock
                      ? 'border-2 border-benin-jaune text-gray-900 hover:bg-benin-jaune hover:text-black hover:scale-[1.02] hover:shadow-lg'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {!selectedDeclinaison
                    ? t('products.choose_variant')
                    : !isInStock
                    ? t('products.out_of_stock')
                    : <span className="inline-flex items-center gap-2"><ShoppingCartIcon className="w-5 h-5" />{t('products.add_to_cart')}</span>}
                </button>
              </div>
            )}

          </div>
        </div>

        {/* ── Produits similaires ── */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 sm:mt-20">
            <h2 className="anim-fade-up font-basecoat text-xl sm:text-2xl md:text-3xl font-bold uppercase text-gray-900 mb-2">
              {t('products.related')}
            </h2>
            <div className="anim-expand-line w-24 sm:w-28 h-[2px] bg-gradient-to-r from-benin-jaune via-benin-jaune/60 to-transparent mb-8" data-delay="0.1"></div>
            <div className="anim-stagger grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5" data-stagger="0.08">
              {relatedProducts.map((product) => (
                <Link
                  key={product.id}
                  to={lp(`/realisations/${product.id}`)}
                  className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 block"
                >
                  <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.title}
                        loading="lazy"
                        width={400}
                        height={300}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="font-basecoat text-gray-400 text-xs">{t('home.no_image')}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    {product.prix && (
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-gray-900 font-basecoat font-bold text-sm px-2.5 py-1 rounded-full shadow">
                        {product.prix} €
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                      <h3 className="font-basecoat text-white text-sm sm:text-base font-bold uppercase leading-tight">
                        {product.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <CartDrawer />
    </>
  );
}