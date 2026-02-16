import { useState } from 'react';
import { useParams, Link, useNavigate, useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { getImageUrl } from '../config/api';
import { useCartStore } from '../store/cartStore';
import { useScrollAnimations } from '../hooks/useScrollAnimations';

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
  const API_URL =
    import.meta.env.VITE_API_URL ||
    (typeof process !== 'undefined' && process.env?.VITE_API_URL) ||
    'http://localhost:1337';

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
                      large: imgData.formats.large
                        ? { url: getImageUrl(imgData.formats.large.url) }
                        : undefined,
                      medium: imgData.formats.medium
                        ? { url: getImageUrl(imgData.formats.medium.url) }
                        : undefined,
                      small: imgData.formats.small
                        ? { url: getImageUrl(imgData.formats.small.url) }
                        : undefined,
                      thumbnail: imgData.formats.thumbnail
                        ? { url: getImageUrl(imgData.formats.thumbnail.url) }
                        : undefined,
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
                large: img.formats.large
                  ? { url: getImageUrl(img.formats.large.url) }
                  : undefined,
                medium: img.formats.medium
                  ? { url: getImageUrl(img.formats.medium.url) }
                  : undefined,
                small: img.formats.small
                  ? { url: getImageUrl(img.formats.small.url) }
                  : undefined,
                thumbnail: img.formats.thumbnail
                  ? { url: getImageUrl(img.formats.thumbnail.url) }
                  : undefined,
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

    return json<LoaderData>({
      realisation: null,
      error: 'Catégorie introuvable',
    });
  } catch (err: any) {
    console.error('Loader error:', err);
    return json<LoaderData>({
      realisation: null,
      error: 'Erreur lors du chargement de la catégorie',
    });
  }
}

export default function RealisationDetail() {
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);
  const { realisation, error } = useLoaderData<LoaderData>();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const scrollRef = useScrollAnimations([]);

  if (error || !realisation)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Link to="/realisations" className="text-indigo-600 hover:text-indigo-800">
            Retour aux catégories
          </Link>
        </div>
      </div>
    );

  const allImages = [
    ...realisation.mainImages,
    ...realisation.declinaisons.map((d) => d.Image),
  ];

  const currentImage = allImages[selectedImageIndex];

  const isOnCategoryImage =
    selectedImageIndex < realisation.mainImages.length;

  const declinaisonIndex =
    selectedImageIndex - realisation.mainImages.length;

  const currentDeclinaison =
    !isOnCategoryImage && declinaisonIndex >= 0
      ? realisation.declinaisons[declinaisonIndex]
      : null;

  const isInStock = currentDeclinaison
    ? currentDeclinaison.Stock > 0
    : false;

  const handleAddToCart = () => {
    if (currentDeclinaison && currentDeclinaison.Stock > 0) {
      addToCart({
        id: `${realisation.id}-${currentDeclinaison.id}`,
        title: `${realisation.title}${
          currentDeclinaison.Description
            ? ` - ${currentDeclinaison.Description}`
            : ''
        }`,
        prix: realisation.prix || 0,
        quantity,
        image_url: currentImage?.url || '',
        categorieId: realisation.id,
        declinaisonId: currentDeclinaison.id,
        stock: currentDeclinaison.Stock,
      });

      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2500);
    }
  };

  return (
    <div
      ref={scrollRef}
      className="py-6 sm:py-8 md:py-[60px] mt-[60px] sm:mt-[70px] md:mt-[80px] px-4 sm:px-6 md:px-[60px] lg:px-[120px]"
    >
      {/* Breadcrumb */}
      <nav className="anim-fade-up mb-6 text-xs sm:text-sm font-basecoat">
        <Link to="/" className="text-indigo-600 hover:text-indigo-800">
          Accueil
        </Link>{' '}
        /{' '}
        <Link to="/realisations" className="text-indigo-600 hover:text-indigo-800">
          Catégories
        </Link>{' '}
        / <span className="text-gray-600 uppercase">{realisation.title}</span>
      </nav>

      {/* Retour */}
      <button
        onClick={() => navigate(-1)}
        className="anim-fade-up font-basecoat inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 sm:mb-8 transition"
      >
        ← Retour
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
        {/* IMAGES */}
        <div className="anim-fade-right">
          {/* IMAGE PRINCIPALE AGRANDIE */}
          <div className="relative rounded-xl overflow-hidden shadow-lg mb-4 bg-gray-100">
            {currentImage?.url ? (
              <img
                src={
                  currentImage.formats?.large?.url || currentImage.url
                }
                alt={realisation.title}
                className="w-full h-[360px] sm:h-[440px] md:h-[520px] lg:h-[600px] object-cover object-center"
              />
            ) : (
              <div className="w-full h-[360px] flex items-center justify-center text-gray-400">
                Aucune image disponible
              </div>
            )}
          </div>

          {/* MINIATURES (DÉCLINAISONS INCLUSES) */}
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedImageIndex(idx);
                  setQuantity(1);
                }}
                className={`rounded-lg overflow-hidden transition-all ${
                  selectedImageIndex === idx
                    ? 'ring-3 ring-yellow-400 scale-105'
                    : 'ring-1 ring-gray-200 hover:ring-yellow-300'
                }`}
              >
                <img
                  src={img.formats?.thumbnail?.url || img.url}
                  alt=""
                  className="w-full h-16 sm:h-20 object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* INFOS */}
        <div className="anim-fade-left flex flex-col font-basecoat">
          <h1 className="text-2xl sm:text-3xl md:text-[44px] font-bold uppercase">
            {realisation.title}
          </h1>

          <div className="w-16 h-1 bg-yellow-400 mt-3 mb-4"></div>

          <p className="text-2xl font-bold text-yellow-600 mb-4">
            {realisation.prix ? `${realisation.prix} €` : 'Prix sur demande'}
          </p>

          {currentDeclinaison?.Description && (
            <p className="italic text-gray-600 mb-4">
              {currentDeclinaison.Description}
            </p>
          )}


    {/* STOCK */}
{(
  // Cas 1 : pas de déclinaisons du tout
  realisation.declinaisons.length === 0 ||

  // Cas 2 : on est sur une déclinaison
  !isOnCategoryImage
) && (
  <div className="mb-4">
    {realisation.declinaisons.length === 0 ? (
      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
        Rupture de stock
      </span>
    ) : isInStock ? (
      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
       {currentDeclinaison?.Stock} en stock 
      </span>
    ) : (
      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
        Rupture de stock
      </span>
    )}
  </div>
)}


          {/* DESCRIPTION – UNIQUEMENT SI NON VIDE */}
          {realisation.description &&
            realisation.description.trim() !== '' && (
              <div className="mb-6">
                <h2 className="font-bold uppercase mb-2">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">
                  {realisation.description}
                </p>
              </div>
            )}

      {/* MESSAGE CATÉGORIE */}
{isOnCategoryImage && (
  realisation.declinaisons.length > 0 ? (
    <div className="mb-4 p-4 bg-blue-50 border border-blue-300 rounded-lg">
      <p className="text-blue-800 font-semibold text-center text-sm sm:text-base">
        Sélectionnez un modèle ci-dessous pour voir le stock
      </p>
    </div>
  ) : (
    <div className="mb-4 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
      <p className="text-yellow-800 font-semibold text-center text-sm sm:text-base">
        Les petites mains sont en train de le fabriquer 🧵✨
      </p>
    </div>
  )
)}

          {/* QUANTITÉ */}
          {!isOnCategoryImage && isInStock && (
            <div className="mb-4">
              <label className="block mb-2 font-medium">Quantité</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  className="bg-gray-200 w-10 h-10 rounded-lg font-bold"
                >
                  -
                </button>
                <span className="w-12 text-center font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    currentDeclinaison &&
                    quantity < currentDeclinaison.Stock &&
                    setQuantity(quantity + 1)
                  }
                  className="bg-gray-200 w-10 h-10 rounded-lg font-bold"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* AJOUT PANIER */}
          {!isOnCategoryImage && (
            <button
              onClick={handleAddToCart}
              disabled={!isInStock}
              className={`w-full py-3 rounded-lg font-bold uppercase ${
                isInStock
                  ? 'bg-yellow-400 hover:bg-yellow-500'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {isInStock ? 'Ajouter au panier' : 'Rupture de stock'}
            </button>
          )}

          {addedToCart && (
            <div className="mt-3 text-center text-green-700 font-semibold">
              ✔ Ajouté au panier
            </div>
          )}
        </div>
      </div>
    </div>
  );
}