import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from '@remix-run/react';
import { getApiUrl, getImageUrl } from '../config/api';
import { useCartStore } from '../store/cartStore';

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

export default function RealisationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);

  const [realisation, setRealisation] = useState<Realisation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchRealisation() {
      try {
        const url = `${getApiUrl()}/api/realisations/${id}?populate[0]=Images&populate[1]=Declinaison&populate[2]=Declinaison.Image`;
        const response = await fetch(url);

        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
        const data = await response.json();

        if (data && data.data) {
          const item = data.data;

          // 🔹 Déclinaisons
          const declinaisons: Declinaison[] = item.Declinaison?.map((decl: any) => {
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

          // 🔹 Images principales (catégorie)
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

          setRealisation({
            id: item.id,
            title: item.Titre || 'Titre indisponible',
            description: item.Description || '',
            prix: item.Prix,
            mainImages,
            declinaisons,
          });
        } else {
          setError('Catégorie introuvable');
        }
      } catch (error: any) {
        console.error('Erreur lors du chargement :', error);
        setError('Erreur lors du chargement de la catégorie');
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchRealisation();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  if (error || !realisation)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Catégorie introuvable'}</p>
          <Link to="/realisations" className="text-indigo-600 hover:text-indigo-800">
            Retour aux catégories
          </Link>
        </div>
      </div>
    );

  // 🔹 Toutes les images à afficher
  const allImages = [...realisation.mainImages, ...realisation.declinaisons.map((d) => d.Image)];
  const currentImage = allImages[selectedImageIndex];
  
  // 🔹 Déterminer si on est sur l'image de catégorie ou sur une déclinaison
  const isOnCategoryImage = selectedImageIndex < realisation.mainImages.length;
  const declinaisonIndex = selectedImageIndex - realisation.mainImages.length;
  const currentDeclinaison = !isOnCategoryImage && declinaisonIndex >= 0 
    ? realisation.declinaisons[declinaisonIndex] 
    : null;

  const isInStock = currentDeclinaison ? currentDeclinaison.Stock > 0 : false;

  const handleAddToCart = () => {
    if (currentDeclinaison && currentDeclinaison.Stock > 0) {
      addToCart({
        id: `${realisation.id}-${currentDeclinaison.id}`,
        title: `${realisation.title}${currentDeclinaison.Description ? ` - ${currentDeclinaison.Description}` : ''}`,
        prix: realisation.prix || 0,
        quantity,
        image_url: currentImage?.url || '',
        categorieId: realisation.id,
        declinaisonId: currentDeclinaison.id,
      });
      
    }
  };

  return (
    <div className="container mx-auto py-6 sm:py-8 md:py-10 max-w-7xl mt-[60px] sm:mt-[70px] md:mt-[80px] px-4 sm:px-6 md:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-xs sm:text-sm font-basecoat">
        <Link to="/" className="text-indigo-600 hover:text-indigo-800">Accueil</Link> /{' '}
        <Link to="/realisations" className="text-indigo-600 hover:text-indigo-800">Catégories</Link> /{' '}
        <span className="text-gray-600 uppercase">{realisation.title}</span>
      </nav>

      {/* Bouton retour */}
      <button
        onClick={() => navigate(-1)}
        className="font-basecoat inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 sm:mb-8 transition text-sm sm:text-base"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Retour
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
        {/* Images */}
        <div>
          {/* Grande image - hauteur réduite */}
          <div className="relative rounded-xl overflow-hidden shadow-lg mb-4 bg-gray-100">
            {currentImage?.url ? (
              <img src={currentImage.formats?.large?.url || currentImage.url} alt={realisation.title} className="w-full h-[280px] sm:h-[320px] md:h-[380px] object-cover" />
            ) : (
              <div className="w-full h-[280px] sm:h-[320px] md:h-[380px] flex items-center justify-center">
                <span className="font-basecoat text-gray-400">Aucune image disponible</span>
              </div>
            )}
          </div>

          {/* Galerie de miniatures - plus grandes */}
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedImageIndex(idx);
                  setQuantity(1);
                }}
                className={`rounded-lg overflow-hidden transition-all duration-300 ${
                  selectedImageIndex === idx ? 'ring-3 ring-yellow-400 scale-105' : 'ring-1 ring-gray-200 hover:ring-yellow-300'
                }`}
              >
                <img
                  src={img.formats?.thumbnail?.url || img.url}
                  alt={`Image ${idx + 1}`}
                  className="w-full h-16 sm:h-20 object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Infos produit */}
        <div className="flex flex-col font-basecoat">
          <h1 className="text-2xl sm:text-3xl md:text-[44px] font-bold uppercase text-gray-900 leading-tight">{realisation.title}</h1>
          <div className="w-16 sm:w-20 h-1 bg-yellow-400 mt-3 mb-4"></div>

          {/* Prix */}
          <p className="text-2xl sm:text-3xl font-bold text-yellow-600 mb-4">
            {realisation.prix ? `${realisation.prix} €` : 'Prix sur demande'}
          </p>

          {/* Description du modèle sélectionné */}
          {currentDeclinaison?.Description && (
            <p className="italic text-gray-600 mb-4 text-sm sm:text-base">{currentDeclinaison.Description}</p>
          )}

          {/* Message bleu uniquement sur l'image de catégorie */}
          {isOnCategoryImage && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-300 rounded-lg">
              <p className="text-blue-800 font-semibold text-center text-sm sm:text-base">
                Sélectionnez un modèle ci-dessous pour voir le stock et ajouter au panier
              </p>
            </div>
          )}

          {/* Stock (uniquement sur déclinaison) */}
          {!isOnCategoryImage && (
            <div className="mb-4">
              {isInStock ? (
                <div className="flex items-center gap-2">
                  <span className="bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold">
                    En stock
                  </span>
                  <span className="text-gray-500 text-sm">
                    {currentDeclinaison?.Stock} {currentDeclinaison && currentDeclinaison.Stock > 1 ? 'unités' : 'unité'}
                  </span>
                </div>
              ) : (
                <span className="inline-block bg-red-100 text-red-800 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold">
                  Rupture de stock
                </span>
              )}
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-base sm:text-lg font-bold uppercase mb-2">Description</h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {realisation.description}
            </p>
          </div>

          {/* Sélecteur de quantité (uniquement sur déclinaison avec stock) */}
          {!isOnCategoryImage && isInStock && (
            <div className="mb-4">
              <label className="block mb-2 font-medium text-sm">Quantité :</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  className="font-basecoat bg-gray-200 hover:bg-gray-300 w-10 h-10 rounded-lg font-bold text-lg transition"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => currentDeclinaison && quantity < currentDeclinaison.Stock && setQuantity(quantity + 1)}
                  className="font-basecoat bg-gray-200 hover:bg-gray-300 w-10 h-10 rounded-lg font-bold text-lg transition"
                  disabled={!currentDeclinaison || quantity >= currentDeclinaison.Stock}
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Bouton Ajouter au panier */}
          {!isOnCategoryImage && (
            <button
              onClick={handleAddToCart}
              disabled={!isInStock}
              className={`font-basecoat w-full py-3 rounded-lg text-sm sm:text-base font-bold uppercase tracking-wide transition transform ${
                isInStock
                  ? 'bg-yellow-400 hover:bg-yellow-500 text-black hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isInStock ? 'Ajouter au panier' : 'Rupture de stock'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}