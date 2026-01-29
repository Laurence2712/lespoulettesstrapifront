import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from '@remix-run/react';
import { CartUtils, CartItem } from '../utils/cart';
import { apiEndpoints, getImageUrl } from '../config/api'; 

interface RealisationDetail {
  id: number;
  title: string;
  description?: string;
  prix?: string | number;
  images: string[];
  specifications?: string;
  stock?: number;
}

export default function RealisationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [realisation, setRealisation] = useState<RealisationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchRealisation() {
      try {
        const response = await fetch(apiEndpoints.realisations);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        const item = data.data.find((r: any) => r.id === parseInt(id || '0'));

        if (!item) {
          setError('Réalisation introuvable');
          setLoading(false);
          return;
        }

        const imagesUrls = item.Images?.map((img: any) =>
          getImageUrl(img.url)
        ) || [];

        setRealisation({
          id: item.id,
          title: item.Titre || 'Titre indisponible',
          description: item.Description || 'Description indisponible',
          prix: item.Prix || 'Prix sur demande',
          images: imagesUrls,
          specifications: item.Specifications || '',
          stock: item.Stock || 0,
        });

        if (imagesUrls.length > 0) {
          setSelectedImage(0);
        }
      } catch (err: any) {
        console.error('Erreur:', err);
        setError(`Erreur lors du chargement: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchRealisation();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!realisation) return;

    const item: CartItem = {
      id: realisation.id,
      title: realisation.title,
      prix: Number(realisation.prix) || 0,
      image_url: realisation.images?.[0] || "",
      quantity: quantity,
    };

    CartUtils.addToCart(item);
    navigate('/panier');
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 sm:py-16 md:py-20 px-4 text-center">
        <p className="font-basecoat text-lg sm:text-xl md:text-2xl text-gray-600">Chargement...</p>
      </div>
    );
  }

  if (error || !realisation) {
    return (
      <div className="container mx-auto py-12 sm:py-16 md:py-20 px-4 text-center">
        <p className="font-basecoat text-red-500 text-lg sm:text-xl md:text-2xl mb-4 sm:mb-6">
          {error || 'Réalisation introuvable'}
        </p>
        <Link 
          to="/realisations" 
          className="font-basecoat text-indigo-600 hover:text-indigo-800 font-medium text-sm sm:text-base transition"
        >
          ← Retour aux réalisations
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 sm:py-8 md:py-10 px-4 sm:px-6 md:px-8 max-w-7xl mt-[60px] sm:mt-[70px] md:mt-[80px]">
      {/* Breadcrumb - Responsive */}
      <nav className="font-basecoat mb-6 sm:mb-8 text-xs sm:text-sm">
        <Link to="/" className="text-indigo-600 hover:text-indigo-800 transition">Accueil</Link>
        <span className="mx-1.5 sm:mx-2 text-gray-400">/</span>
        <Link to="/realisations" className="text-indigo-600 hover:text-indigo-800 transition">Réalisations</Link>
        <span className="mx-1.5 sm:mx-2 text-gray-400">/</span>
        <span className="text-gray-600 truncate inline-block max-w-[150px] sm:max-w-none align-bottom">
          {realisation.title}
        </span>
      </nav>

      {/* Grid - Responsive: Stack on mobile, side-by-side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
        
        {/* Galerie - Responsive heights */}
        <div className="order-1">
          {realisation.images.length > 0 ? (
            <div>
              <div className="bg-gray-100 rounded-lg overflow-hidden mb-3 sm:mb-4">
                <img
                  src={realisation.images[selectedImage]}
                  alt={realisation.title}
                  className="w-full h-64 sm:h-80 md:h-96 lg:h-[28rem] object-cover"
                />
              </div>
              {realisation.images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-4 gap-2">
                  {realisation.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`border-2 rounded-md overflow-hidden transition ${
                        selectedImage === index
                          ? 'border-yellow-400 scale-105'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${realisation.title} ${index + 1}`}
                        className="w-full h-16 sm:h-20 md:h-24 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-200 rounded-lg h-64 sm:h-80 md:h-96 flex items-center justify-center">
              <span className="font-basecoat text-gray-500 text-sm sm:text-base">Aucune image disponible</span>
            </div>
          )}
        </div>

        {/* Détails - Responsive text sizes */}
        <div className="order-2">
          <h1 className="font-ogg text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-3 sm:mb-4 leading-tight">
            {realisation.title}
          </h1>
          
          <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-600 mb-4 sm:mb-6">
            {realisation.prix ? `${realisation.prix} €` : 'Prix sur demande'}
          </p>

          {/* Description - Responsive */}
          <div className="border-t border-b border-gray-200 py-4 sm:py-5 md:py-6 mb-4 sm:mb-6">
            <h2 className="font-basecoat text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3">
              Description
            </h2>
            <p className="font-basecoat text-gray-700 text-sm sm:text-base md:text-lg whitespace-pre-line leading-relaxed">
              {realisation.description}
            </p>
          </div>

          {/* Quantité + Boutons - Responsive */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <label className="font-basecoat font-medium text-gray-700 text-sm sm:text-base">
                Quantité:
              </label>
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 sm:px-4 py-2 hover:bg-gray-100 transition text-sm sm:text-base"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 sm:px-6 py-2 border-l border-r border-gray-300 font-medium text-sm sm:text-base">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 sm:px-4 py-2 hover:bg-gray-100 transition text-sm sm:text-base"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="font-basecoat w-full py-3 sm:py-3.5 md:py-4 rounded-lg font-semibold text-base sm:text-lg md:text-xl transition transform hover:scale-105 bg-yellow-400 text-black hover:bg-yellow-500 active:scale-95"
            >
              Ajouter au panier
            </button>

            <Link
              to="/realisations"
              className="font-basecoat block w-full py-3 sm:py-3.5 md:py-4 text-center border-2 border-gray-800 text-gray-800 rounded-lg font-semibold text-base sm:text-lg hover:bg-gray-100 transition"
            >
              ← Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}