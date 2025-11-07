import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from '@remix-run/react';
import { CartUtils, CartItem } from '../utils/cart';
import { STRAPI_URL, getApiUrl } from '../utils/env'; 

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
        const response = await fetch(getApiUrl('/api/realisations?populate=*'));
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        const item = data.data.find((r: any) => r.id === parseInt(id || '0'));

        if (!item) {
          setError('Réalisation introuvable');
          setLoading(false);
          return;
        }

        const imagesUrls = item.Images?.map((img: any) =>
          `${STRAPI_URL}${img.url}`
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

  // ✅ Ajout au panier sans alert, avec redirection
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
    navigate('/panier'); // ✅ redirection directe
  };

  if (loading) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <p className="text-xl">Chargement...</p>
      </div>
    );
  }

  if (error || !realisation) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <p className="text-red-500 text-xl mb-4">{error || 'Réalisation introuvable'}</p>
        <Link to="/realisations" className="text-indigo-600 hover:text-indigo-800 font-medium">
          ← Retour aux réalisations
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl mt-[70px]">
      {/* Breadcrumb */}
      <nav className="font-basecoat mb-8 text-sm">
        <Link to="/" className="text-indigo-600 hover:text-indigo-800">Accueil</Link>
        <span className="mx-2">/</span>
        <Link to="/realisations" className="font-basecoat text-indigo-600 hover:text-indigo-800">Réalisations</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-600">{realisation.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Galerie */}
        <div>
          {realisation.images.length > 0 ? (
            <div>
              <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src={realisation.images[selectedImage]}
                  alt={realisation.title}
                  className="w-full h-96 object-cover"
                />
              </div>
              {realisation.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {realisation.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`border-2 rounded-md overflow-hidden transition ${
                        selectedImage === index
                          ? 'border-yellow-400'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${realisation.title} ${index + 1}`}
                        className="w-full h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
              <span className="text-gray-500">Aucune image disponible</span>
            </div>
          )}
        </div>

        {/* Détails */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{realisation.title}</h1>
          <p className="text-3xl font-bold text-yellow-600 mb-6">
            {realisation.prix ? `${realisation.prix} €` : 'Prix sur demande'}
          </p>

          <div className="border-t border-b border-gray-200 py-6 mb-6">
            <h2 className="font-basecoat text-xl font-semibold mb-3">Description</h2>
            <p className="font-basecoat text-gray-700 whitespace-pre-line leading-relaxed">
              {realisation.description}
            </p>
          </div>

          {/* Quantité + Bouton */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="font-medium text-gray-700">Quantité:</label>
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100 transition"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-6 py-2 border-l border-r border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-gray-100 transition"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full py-4 rounded-lg font-semibold text-lg transition transform hover:scale-105 bg-yellow-400 text-black hover:bg-yellow-500"
            >
              Ajouter au panier
            </button>

            <Link
              to="/realisations"
              className="block w-full py-4 text-center border-2 border-gray-800 text-gray-800 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              ← Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
