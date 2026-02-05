import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from '@remix-run/react';
import { apiEndpoints, getImageUrl } from '../config/api';
import { useCartStore } from '../store/cartStore';

interface Realisation {
  id: number;
  title: string;
  description?: string;
  prix?: string | number;
  stock?: number;
  images: Array<{
    id: number;
    url: string;
    formats?: {
      large?: { url: string };
      medium?: { url: string };
      small?: { url: string };
      thumbnail?: { url: string };
    };
  }>;
}

export default function RealisationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);
  
  const [realisation, setRealisation] = useState<Realisation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    async function fetchRealisation() {
      try {
        const response = await fetch(`${apiEndpoints.realisations}/${id}?populate=*`);
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
        const data = await response.json();

        if (data && data.data) {
          const item = data.data;
          const images = item.Images?.map((img: any) => ({
            id: img.id,
            url: getImageUrl(img.url),
            formats: img.formats ? {
              large: img.formats.large ? { url: getImageUrl(img.formats.large.url) } : undefined,
              medium: img.formats.medium ? { url: getImageUrl(img.formats.medium.url) } : undefined,
              small: img.formats.small ? { url: getImageUrl(img.formats.small.url) } : undefined,
              thumbnail: img.formats.thumbnail ? { url: getImageUrl(img.formats.thumbnail.url) } : undefined,
            } : undefined,
          })) || [];

          setRealisation({
            id: item.id,
            title: item.Titre || 'Titre indisponible',
            description: item.Description || '',
            prix: item.Prix,
            stock: item.Stock || 0,
            images,
          });
        } else {
          setError('Réalisation introuvable');
        }
      } catch (error: any) {
        console.error('Erreur lors du chargement :', error);
        setError('Erreur lors du chargement de la réalisation');
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchRealisation();
  }, [id]);

  const handleAddToCart = () => {
    if (realisation && realisation.stock && realisation.stock > 0) {
      addToCart({
        id: realisation.id,
        title: realisation.title,
        prix: realisation.prix || 0,
        quantity: quantity,
        image_url: realisation.images[0]?.url || '',
      });
      alert('Produit ajouté au panier !');
    }
  };

  const incrementQuantity = () => {
    if (realisation?.stock && quantity < realisation.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-basecoat text-xl text-gray-600">Chargement...</p>
      </div>
    );
  }

  if (error || !realisation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-basecoat text-red-500 text-xl mb-4">{error || 'Réalisation introuvable'}</p>
          <Link to="/realisations" className="font-basecoat text-indigo-600 hover:text-indigo-800">
            Retour aux catégories
          </Link>
        </div>
      </div>
    );
  }

  const mainImage = realisation.images[selectedImageIndex]?.formats?.large?.url || realisation.images[selectedImageIndex]?.url;

  return (
    <div className="container mx-auto py-6 sm:py-8 md:py-10 px-4 sm:px-6 md:px-8 max-w-7xl mt-[60px] sm:mt-[70px] md:mt-[80px]">
      {/* Breadcrumb */}
      <nav className="font-basecoat mb-6 sm:mb-8 text-xs sm:text-sm">
        <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium transition">
          Accueil
        </Link>
        <span className="mx-1.5 sm:mx-2 text-gray-400">/</span>
        <Link to="/realisations" className="text-indigo-600 hover:text-indigo-800 font-medium transition">
          Catégories
        </Link>
        <span className="mx-1.5 sm:mx-2 text-gray-400">/</span>
        <span className="text-gray-600 uppercase">{realisation.title}</span>
      </nav>

      {/* Bouton retour */}
      <button
        onClick={() => navigate(-1)}
        className="font-basecoat inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 sm:mb-8 transition text-sm sm:text-base"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Retour
      </button>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Colonne gauche - Images */}
        <div>
          {/* Grande image principale */}
          <div className="relative overflow-hidden rounded-2xl shadow-xl mb-6 bg-gray-100">
            {mainImage ? (
              <img
                src={mainImage}
                alt={realisation.title}
                className="w-full h-[400px] sm:h-[500px] md:h-[600px] object-cover"
              />
            ) : (
              <div className="w-full h-[400px] sm:h-[500px] md:h-[600px] flex items-center justify-center">
                <span className="font-basecoat text-gray-400 text-lg">Aucune image disponible</span>
              </div>
            )}
          </div>

          {/* Galerie de miniatures */}
          {realisation.images.length > 1 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4">
              {realisation.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative overflow-hidden rounded-lg transition-all duration-300 ${
                    selectedImageIndex === index
                      ? 'ring-4 ring-yellow-400 scale-105'
                      : 'ring-2 ring-gray-200 hover:ring-yellow-300'
                  }`}
                >
                  <img
                    src={image.formats?.thumbnail?.url || image.url}
                    alt={`${realisation.title} - ${index + 1}`}
                    className="w-full h-20 sm:h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Colonne droite - Informations */}
        <div className="flex flex-col">
          {/* Titre */}
          <h1 className="font-basecoat text-3xl sm:text-4xl md:text-5xl font-light uppercase mb-4 sm:mb-6 tracking-wide">
            {realisation.title}
          </h1>

          {/* Prix */}
          <p className="font-basecoat text-4xl sm:text-5xl font-bold text-yellow-600 mb-6 sm:mb-8">
            {realisation.prix ? `${realisation.prix} €` : 'Prix sur demande'}
          </p>

          {/* Stock */}
          <div className="mb-6 sm:mb-8">
            {realisation.stock && realisation.stock > 0 ? (
              <div className="flex items-center gap-3">
                <span className="font-basecoat inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                  ✓ En stock
                </span>
                <span className="font-basecoat text-gray-600 text-sm">
                  {realisation.stock} {realisation.stock > 1 ? 'unités disponibles' : 'unité disponible'}
                </span>
              </div>
            ) : (
              <span className="font-basecoat inline-block bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-semibold">
                ✗ Rupture de stock
              </span>
            )}
          </div>

          {/* Description */}
          <div className="mb-8 sm:mb-10">
            <h2 className="font-basecoat text-xl sm:text-2xl font-semibold mb-4">Description</h2>
            <p className="font-basecoat text-gray-700 text-base sm:text-lg leading-relaxed whitespace-pre-line">
              {realisation.description}
            </p>
          </div>

          {/* Sélecteur de quantité */}
          {realisation.stock && realisation.stock > 0 && (
            <div className="mb-8">
              <label className="font-basecoat block text-base sm:text-lg font-medium mb-3">
                Quantité :
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={decrementQuantity}
                  className="font-basecoat bg-gray-200 hover:bg-gray-300 text-gray-800 w-12 h-12 rounded-lg font-bold text-xl transition"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="font-basecoat text-2xl font-semibold w-16 text-center">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="font-basecoat bg-gray-200 hover:bg-gray-300 text-gray-800 w-12 h-12 rounded-lg font-bold text-xl transition"
                  disabled={quantity >= (realisation.stock || 0)}
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Bouton Ajouter au panier */}
          <button
            onClick={handleAddToCart}
            disabled={!realisation.stock || realisation.stock <= 0}
            className={`font-basecoat w-full py-4 sm:py-5 rounded-xl text-lg sm:text-xl font-bold uppercase transition-all duration-300 ${
              realisation.stock && realisation.stock > 0
                ? 'bg-yellow-400 hover:bg-yellow-500 text-black transform hover:scale-105 shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {realisation.stock && realisation.stock > 0 ? 'Ajouter au panier' : 'Rupture de stock'}
          </button>
        </div>
      </div>
    </div>
  );
}