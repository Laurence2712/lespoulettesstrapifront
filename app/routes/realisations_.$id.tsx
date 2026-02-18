import { useState } from 'react';
import { Link, useNavigate, useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { getApiUrl, getImageUrl } from '../config/api';
import { useCartStore } from '../store/cartStore';
import { useScrollAnimations } from '../hooks/useScrollAnimations';
import CartDrawer from '../components/CartDrawer';

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
}

interface LoaderData {
  realisation: Realisation | null;
  error: string | null;
}

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  const API_URL = getApiUrl();

  try {
    const url = `${API_URL}/api/realisations/${id}?populate[0]=Images&populate[1]=Declinaison&populate[2]=Declinaison.Image`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
    const data = await response.json();

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
        },
        error: null,
      });
    }

    return json<LoaderData>({ realisation: null, error: 'Produit introuvable' });
  } catch (err: any) {
    console.error('Loader error:', err);
    return json<LoaderData>({ realisation: null, error: 'Erreur lors du chargement du produit' });
  }
}

export default function RealisationDetail() {
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);
  const openCart = useCartStore((state) => state.openCart);
  const { realisation, error } = useLoaderData<LoaderData>();

  // ✅ États séparés : index des miniatures du bas / déclinaison sélectionnée
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [selectedDeclinaisonId, setSelectedDeclinaisonId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const scrollRef = useScrollAnimations([]);

  if (error || !realisation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4 font-basecoat">{error}</p>
          <Link to="/realisations" className="text-yellow-600 hover:text-yellow-800 font-basecoat underline">
            ← Retour aux réalisations
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
      setAddedToCart(true);
      openCart();
      setTimeout(() => setAddedToCart(false), 2500);
    }
  };

  return (
    <>
      <div
        ref={scrollRef}
        className="py-6 sm:py-8 md:py-[60px] mt-[60px] sm:mt-[70px] md:mt-[80px] px-4 sm:px-6 md:px-[60px] lg:px-[120px]"
      >
        {/* Breadcrumb */}
        <nav className="anim-fade-up mb-4 text-xs sm:text-sm font-basecoat text-gray-500">
          <Link to="/" className="hover:text-yellow-600 transition">Accueil</Link>
          <span className="mx-2">/</span>
          <Link to="/realisations" className="hover:text-yellow-600 transition">Réalisations</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800 uppercase font-semibold">{realisation.title}</span>
        </nav>

        {/* Bouton retour */}
        <button
          onClick={() => navigate(-1)}
          className="anim-fade-up font-basecoat inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 sm:mb-8 transition text-sm"
        >
          ← Retour
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16">

          {/* ── COLONNE IMAGES ── */}
          <div className="anim-fade-right">

            {/* Image principale */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl mb-4 bg-gray-100 group">
              {currentImage?.url ? (
                <img
                  src={currentImage.formats?.large?.url || currentImage.url}
                  alt={realisation.title}
                  className="w-full h-[380px] sm:h-[460px] md:h-[540px] lg:h-[580px] object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-[380px] flex items-center justify-center text-gray-400 font-basecoat">
                  Aucune image disponible
                </div>
              )}
              <div className="absolute top-4 left-4 bg-yellow-400 text-black text-xs font-basecoat font-bold uppercase px-3 py-1 rounded-full shadow">
                ✂ Fait main
              </div>
            </div>

            {/* Galerie de vignettes — angles de l'image principale */}
            {realisation.mainImages.length >= 1 && (
              <div className="mt-4">
                <p className="text-xs font-basecoat font-semibold uppercase text-gray-400 tracking-widest mb-2">
                  Autres vues
                </p>
                <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-yellow-300 scrollbar-track-gray-100">
                  {realisation.mainImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setMainImageIndex(idx);
                        setSelectedDeclinaisonId(null);
                      }}
                      className={`relative rounded-xl overflow-hidden transition-all flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 ${
                        !selectedDeclinaisonId && mainImageIndex === idx
                          ? 'ring-2 ring-yellow-400 ring-offset-2 scale-105 shadow-md'
                          : 'ring-1 ring-gray-200 hover:ring-yellow-300 opacity-60 hover:opacity-100 hover:scale-105'
                      }`}
                      aria-label={`Vue ${idx + 1}`}
                    >
                      <img
                        src={img.formats?.thumbnail?.url || img.formats?.small?.url || img.url}
                        alt={`Vue ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {!selectedDeclinaisonId && mainImageIndex === idx && (
                        <div className="absolute inset-0 bg-yellow-400/10 rounded-xl" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── COLONNE INFOS ── */}
          <div className="anim-fade-left flex flex-col font-basecoat">

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase text-gray-900 leading-tight">
              {realisation.title}
            </h1>
            <div className="w-16 h-1 bg-yellow-400 mt-3 mb-5"></div>

            <p className="text-3xl font-bold text-yellow-500 mb-5">
              {realisation.prix ? `${realisation.prix} €` : 'Prix sur demande'}
            </p>

            {/* Description */}
            {realisation.description?.trim() && (
              <div className="mb-6 p-4 bg-amber-50 border-l-4 border-yellow-400 rounded-r-xl">
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                  {realisation.description}
                </p>
              </div>
            )}

            {/* ── Sélection déclinaison ── */}
            {hasDeclinaisons && (
              <div className="mb-6">
                <h2 className="font-bold uppercase text-sm text-gray-500 mb-3 tracking-wider">
                  Choisir un motif / coloris
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
                            ? 'ring-2 ring-yellow-400 ring-offset-2 scale-105 shadow-lg'
                            : 'ring-1 ring-gray-200 hover:ring-yellow-300 hover:scale-105 hover:shadow-md'
                        }`}
                        title={decl.Description || ''}
                      >
                        {decl.Image?.url ? (
                          <img
                            src={decl.Image.formats?.thumbnail?.url || decl.Image.url}
                            alt={decl.Description || 'Déclinaison'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-400">
                            ?
                          </div>
                        )}
                        {!inStock && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/40">
                            <span className="text-red-500 font-bold text-lg">✕</span>
                          </div>
                        )}
                        {isSelected && inStock && (
                          <div className="absolute inset-0 flex items-center justify-center bg-yellow-400/20">
                            <span className="text-yellow-600 font-bold text-lg drop-shadow">✓</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {selectedDeclinaison?.Description && (
                  <p className="mt-3 text-sm font-semibold text-gray-700">
                    Motif sélectionné :{' '}
                    <span className="text-yellow-600">{selectedDeclinaison.Description}</span>
                  </p>
                )}
              </div>
            )}

            {/* Badge stock */}
            {selectedDeclinaison && (
              <div className="mb-5">
                {isInStock ? (
                  <span className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-sm font-semibold">
                    <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                    {selectedDeclinaison.Stock} disponible{selectedDeclinaison.Stock > 1 ? 's' : ''}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-1.5 rounded-full text-sm font-semibold">
                    <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
                    Rupture de stock
                  </span>
                )}
              </div>
            )}

      
            {/* Pas de déclinaisons */}
            {!hasDeclinaisons && (
              <div className="mb-5 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <p className="text-yellow-800 text-sm font-semibold text-center">
                  🧵 Les petites mains sont en train de le fabriquer...
                </p>
              </div>
            )}

            {/* Quantité */}
            {selectedDeclinaison && isInStock && (
              <div className="mb-5">
                <label className="block mb-2 text-sm font-bold uppercase text-gray-500 tracking-wider">
                  Quantité
                </label>
                <div className="inline-flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
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
                    className="w-11 h-11 flex items-center justify-center text-xl font-bold text-gray-600 hover:bg-gray-100 transition"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Bouton panier */}
            {hasDeclinaisons && (
              <div className="mt-auto pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedDeclinaison || !isInStock}
                  className={`w-full py-4 rounded-xl font-bold uppercase text-base tracking-wider transition-all duration-200 ${
                    selectedDeclinaison && isInStock
                      ? 'bg-yellow-400 hover:bg-yellow-500 text-black hover:scale-[1.02] shadow-md hover:shadow-lg'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {!selectedDeclinaison
                    ? 'Choisir un motif'
                    : !isInStock
                    ? 'Rupture de stock'
                    : '🛒 Ajouter au panier'}
                </button>

                {addedToCart && (
                  <div className="mt-3 text-center text-green-700 font-semibold bg-green-50 py-2 rounded-lg">
                    ✔ Ajouté au panier !
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      <CartDrawer />
    </>
  );
}