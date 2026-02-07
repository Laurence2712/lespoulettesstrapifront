import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from '@remix-run/react';
import { apiEndpoints, getImageUrl } from '../config/api';
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
  mainImage?: string;
  declinaisons: Declinaison[];
  mainImages: ImageData[];
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
        const baseUrl = apiEndpoints.realisations.replace(/\?populate=\*$/, '');
const url = `${baseUrl}/${id}?populate[Declinaison][populate]=Image&populate=Images`;        const response = await fetch(url);

        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
        const data = await response.json();
        console.log('DATA STRAPI DETAIL 👉', data);

        if (data && data.data) {
          const item = data.data;

         // 🔹 Déclinaisons
const declinaisons: Declinaison[] = item.Declinaison?.map((decl: any) => {
  // L'image est dans decl.Image qui est un objet media Strapi
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

          // 🔹 Images principales
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

          // 🔹 Image principale affichée par défaut
          const mainImageUrl = mainImages[0]?.url || declinaisons[0]?.Image?.url;

          setRealisation({
            id: item.id,
            title: item.Titre || 'Titre indisponible',
            description: item.Description || '',
            prix: item.Prix,
            mainImage: mainImageUrl,
            declinaisons,
            mainImages,
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

  // 🔹 Toutes les images à afficher dans la galerie
  const allImages = [
    ...realisation.mainImages,
    ...realisation.declinaisons.map((d) => d.Image),
  ];

  const currentImage = allImages[selectedImageIndex];
  const isInStock = realisation.declinaisons[selectedImageIndex]?.Stock > 0;
  const currentDeclinaison = realisation.declinaisons[selectedImageIndex];

  const handleAddToCart = () => {
  if (currentDeclinaison && currentDeclinaison.Stock > 0) {
    addToCart({
      id: realisation.id,
      title: `${realisation.title}${currentDeclinaison.Description ? ` - ${currentDeclinaison.Description}` : ''}`,
      prix: realisation.prix || 0,
      quantity,
      image_url: currentImage?.url,
      categorieId: realisation.id,  // ← NOUVEAU
      declinaisonId: currentDeclinaison.id,  // ← NOUVEAU
    });
    alert('Produit ajouté au panier !');
  }
};

  return (
    <div className="container mx-auto py-6 sm:py-8 md:py-12 lg:py-16 px-4 sm:px-6 md:px-8 max-w-7xl mt-[60px] sm:mt-[70px] md:mt-[80px]">
      {/* Breadcrumb */}
      <nav className="mb-6 text-xs sm:text-sm font-basecoat">
        <Link to="/" className="text-indigo-600 hover:text-indigo-800">Accueil</Link> /{' '}
        <Link to="/realisations" className="text-indigo-600 hover:text-indigo-800">Catégories</Link> /{' '}
        <span className="text-gray-600 uppercase">{realisation.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="relative rounded-2xl overflow-hidden shadow-xl mb-6 bg-gray-100">
            {currentImage?.url ? (
              <img src={currentImage.url} alt={realisation.title} className="w-full h-[500px] object-cover" />
            ) : (
              <div className="w-full h-[500px] flex items-center justify-center">
                <span>Aucune image disponible</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`rounded-lg overflow-hidden ${
                  selectedImageIndex === idx ? 'ring-4 ring-yellow-400 scale-105' : 'ring-2 ring-gray-200'
                }`}
              >
                <img
                  src={img.formats?.thumbnail?.url || img.url}
                  alt={`Image ${idx + 1}`}
                  className="w-full h-20 sm:h-24 object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Infos produit */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-light uppercase mb-4 font-basecoat">{realisation.title}</h1>
          {currentDeclinaison?.Description && <p className="italic mb-4 font-basecoat">{currentDeclinaison.Description}</p>}
          <p className="text-4xl font-bold text-yellow-600 mb-6 font-basecoat">{realisation.prix ? `${realisation.prix} €` : 'Prix sur demande'}</p>

          {isInStock ? (
            <div className="mb-6">
              <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-basecoat">✓ En stock</span>{' '}
              <span className='font-basecoat'>{currentDeclinaison.Stock} {currentDeclinaison.Stock > 1 ? 'unités' : 'unité'}</span>
            </div>
          ) : (
            <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full font-basecoat">✗ Rupture de stock</span>
          )}

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 font-basecoat">Description</h2>
            <p className="whitespace-pre-line font-basecoat">{realisation.description}</p>
          </div>

          {isInStock && (
            <div className="mb-8">
              <label className="block mb-3 font-basecoat">Quantité :</label>
              <div className="flex items-center gap-4">
                <button onClick={() => quantity > 1 && setQuantity(quantity - 1)} className="w-12 h-12 font-basecoat">-</button>
                <span className="w-16 text-center">{quantity}</span>
                <button
                  onClick={() => quantity < currentDeclinaison.Stock && setQuantity(quantity + 1)}
                  className="w-12 h-12"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={!isInStock}
            className={`w-full py-4 rounded-xl uppercase font-bold ${isInStock ? 'bg-yellow-400 font-basecoat' : 'bg-gray-300 text-gray-500 font-basecoat'}`}
          >
            {isInStock ? 'Ajouter au panier' : 'Rupture de stock'}
          </button>
        </div>
      </div>
    </div>
  );
}