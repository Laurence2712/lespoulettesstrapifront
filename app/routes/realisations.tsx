import { useEffect, useState } from 'react';
import { Link } from '@remix-run/react';
import { gsap } from 'gsap';

interface Realisation {
  id: number;
  title: string;
  image_url?: string;
  description?: string;
}

export default function Realisations() {
  const [realisations, setRealisations] = useState<Realisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRealisations() {
      try {
        const response = await fetch('https://lespoulettesstrapi.onrender.com/api/realisations?populate=*');
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
        const data = await response.json();

        if (data && data.data) {
          const realisationsData: Realisation[] = data.data.map((realisation: any) => ({
            id: realisation.id,
            title: realisation.Titre || 'Titre indisponible',
            image_url: realisation.Images?.[0]?.url,
            description: realisation.Description || 'Description indisponible',
          }));
          setRealisations(realisationsData);
        } else {
          setError('Aucune réalisation trouvée.');
        }
      } catch (error: any) {
        console.error('Erreur lors du chargement des réalisations :', error);
        setError('Erreur lors du chargement des réalisations');
      } finally {
        setLoading(false);
      }
    }

    fetchRealisations();
  }, []);

  useEffect(() => {
    gsap.from('.realisation-card', {
      opacity: 0,
      y: 50,
      stagger: { amount: 0.6, from: 'start' },
      duration: 0.8,
      ease: 'power3.out',
      onComplete: () => {
        gsap.to('.realisation-card', { opacity: 1, duration: 0.1 });
      },
    });
  }, [realisations]);

  return (
    
    <div className="container mx-auto py-8 px-4 max-w-7xl mt-[70px]">
      {/* Breadcrumb */}
      <nav className="font-basecoat mb-8 text-sm">
        <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
          Accueil
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-600">Réalisations</span>
      </nav>

      {/* Bouton retour */}
      <Link
        to="/"
        className="font-basecoat inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
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
      </Link>

      <h1 className="text-4xl md:text-5xl text-center mb-12 text-gray-900 tracking-wide">Découvrez les réalisations</h1>

      {loading && <p className="text-center text-xl">Chargement...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {realisations.map((realisation) => (
          <div
            key={realisation.id}
            className="bg-white rounded-lg shadow-md overflow-hidden realisation-card hover:shadow-xl transition-shadow"
            style={{ transform: 'scale(1)', transition: 'transform 0.3s' }}
          >
            <div className="relative">
              {realisation.image_url ? (
                <img
                  src={`http://lespoulettesstrapi.onrender.com${realisation.image_url}`}
                  alt={realisation.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Aucune image disponible</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-basecoat text-lg font-semibold text-gray-900">{realisation.title}</h3>
              <p className="font-basecoat text-gray-700 mt-2 line-clamp-3">{realisation.description}</p>
            </div>
            <div className="p-4 pt-0">
              <Link
                to={`/realisations/${realisation.id}`}
                className="font-basecoat inline-flex items-center text-yellow-600 hover:text-yellow-700 font-medium transition"
              >
                Voir plus
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}