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
        const response = await fetch('http://localhost:1337/api/realisations?populate=*');
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
        const data = await response.json();

        console.log(data); // Pour vérifier la structure

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
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-semibold text-center mb-6">Nos Réalisations</h1>

      {loading && <p>Chargement...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {realisations.map((realisation) => (
          <div
            key={realisation.id}
            className="bg-white rounded-lg shadow-md overflow-hidden realisation-card"
            style={{ transform: 'scale(1)', transition: 'transform 0.3s' }}
          >
            <div className="relative">
              {realisation.image_url ? (
                <img
                  src={`http://localhost:1337${realisation.image_url}`}
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
              <h3 className="text-lg font-semibold text-gray-900">{realisation.title}</h3>
              <p className="text-gray-700 mt-2">{realisation.description}</p>
            </div>
            <div className="p-4">
              <Link
                to={`/realisations/${realisation.id}`}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Voir plus
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
