import { useState } from 'react';
import { useParams, Link, useNavigate, useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { getImageUrl } from '../config/api';
import { useCartStore } from '../store/cartStore';
import { useScrollAnimations } from '../hooks/useScrollAnimations';

/* =========================
   Types
========================= */

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

/* =========================
   Loader
========================= */

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

          return {
            id: decl.id,
            Stock: decl.Stock ?? 0,
            Description: decl.Description ?? '',
            Image: imgData
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
              : { id: 0, url: '' },
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

    return json<LoaderData>({ realisation: null, error: 'Catégorie introuvable' });
  } catch (err) {
    return json<LoaderData>({
      realisation: null,
      error: 'Erreur lors du chargement de la catégorie',
    });
  }
}

/* =========================
   Component
========================= */

export default function RealisationDetail() {
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);
  const { realisation, error } = useLoaderData<LoaderData>();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const scrollRef = useScrollAnimations([]);

  if (error || !realisation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const hasDeclinaisons = realisation.declinaisons.length > 0;

  const allImages = [...realisation.mainImages, ...realisation.declinaisons.map((d) => d.Image)];
  const currentImage = allImages[selectedImageIndex];

  const isOnCategoryImage = selectedImageIndex < realisation.mainImages.length;
  const declinaisonIndex = selectedImageIndex - realisation.mainImages.length;
  const currentDeclinaison =
    !isOnCategoryImage && declinaisonIndex >= 0
      ? realisation.declinaisons[declinaisonIndex]
      : null;

  const isInStock = currentDeclinaison ? currentDeclinaison.Stock > 0 : false;

  const handleAddToCart = () => {
    if (!currentDeclinaison || !isInStock) return;

    addToCart({
      id: `${realisation.id}-${currentDeclinaison.id}`,
      title: `${realisation.title}${currentDeclinaison.Description ? ` - ${currentDeclinaison.Description}` : ''}`,
      prix: realisation.prix || 0,
      quantity,
      image_url: currentImage?.url || '',
      categorieId: realisation.id,
      declinaisonId: currentDeclinaison.id,
      stock: currentDeclinaison.Stock,
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  return (
    <div
      ref={scrollRef}
      className="py-6 sm:py-8 md:py-[60px] mt-[80px] px-4 sm:px-6 md:px-[60px] lg:px-[120px]"
    >
      {/* Retour */}
      <button onClick={() => navigate(-1)} className="mb-6 text-sm text-gray-600 hover:text-gray-900">
        ← Retour
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* IMAGE */}
        <div>
         <div className="relative w-full h-[420px] sm:h-[480px] md:h-[540px] lg:h-[600px] rounded-xl overflow-hidden shadow-lg bg-gray-200">
  {currentImage?.url ? (
    <img
      src={currentImage.formats?.large?.url || currentImage.url}
      alt={realisation.title}
      className="absolute inset-0 w-full h-full object-cover object-center"
    />
  ) : (
    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
      Aucune image disponible
    </div>
  )}
</div>
        </div>

        {/* INFOS */}
        <div className="font-basecoat">
          <h1 className="text-3xl md:text-[44px] font-bold uppercase">{realisation.title}</h1>
          <div className="w-20 h-1 bg-yellow-400 my-4"></div>

          <p className="text-3xl font-bold text-yellow-600 mb-6">
            {realisation.prix ? `${realisation.prix} €` : 'Prix sur demande'}
          </p>

          {/* Aucune déclinaison */}
          {!hasDeclinaisons && (
            <div className="p-5 rounded-xl bg-yellow-50 border border-yellow-200 text-center">
              <p className="font-semibold text-yellow-900 mb-1">
                ✨ Cette création arrive très bientôt
              </p>
              <p className="text-yellow-800">
                Nos petites mains y travaillent avec soin 💛<br />
                Revenez très vite pour découvrir les modèles disponibles.
              </p>
            </div>
          )}

          {/* Description */}
          {realisation.description && realisation.description.trim() !== '' && (
            <div className="mt-6">
              <h2 className="font-bold uppercase mb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{realisation.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}