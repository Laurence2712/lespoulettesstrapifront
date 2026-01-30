import { useEffect, useState } from 'react';
import { Link } from '@remix-run/react';
import { gsap } from 'gsap';
import { apiEndpoints, getImageUrl } from '../config/api';

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
        const response = await fetch(apiEndpoints.realisations);
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
        const data = await response.json();

        if (data && data.data) {
          const realisationsData: Realisation[] = data.data.map((realisation: any) => ({
            id: realisation.id,
            title: realisation.Titre || 'Titre indisponible',
            image_url: realisation.Images?.[0]?.url ? getImageUrl(realisation.Images[0].url) : undefined,
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
    if (realisations.length > 0) {
      gsap.fromTo('.realisation-card',
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          stagger: { amount: 0.6, from: 'start' },
          duration: 0.8,
          ease: 'power3.out',
          clearProps: 'all',
        }
      );
    }
  }, [realisations]);

  return (
    <div className="container mx-auto py-6 sm:py-8 md:py-10 px-4 sm:px-6 md:px-8 max-w-7xl mt-[60px] sm:mt-[70px] md:mt-[80px]">
      {/* Breadcrumb - Responsive */}
      <nav className="font-basecoat mb-6 sm:mb-8 text-xs sm:text-sm">
        <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium transition">
          Accueil
        </Link>
        <span className="mx-1.5 sm:mx-2 text-gray-400">/</span>
        <span className="text-gray-600">Réalisations</span>
      </nav>

      {/* Bouton retour - Responsive */}
      <Link
        to="/"
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
      </Link>

      {/* Titre - Responsive */}
      <h1 className="font-ogg text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center mb-8 sm:mb-10 md:mb-12 text-gray-900 tracking-wide font-light uppercase">
        Découvrez les réalisations
      </h1>

      {/* Loading & Error states */}
      {loading && (
        <div className="flex items-center justify-center py-12 sm:py-16 md:py-20">
          <p className="font-basecoat text-lg sm:text-xl md:text-2xl text-gray-600">Chargement...</p>
        </div>
      )}
      
      {error && (
        <div className="flex items-center justify-center py-12 sm:py-16 md:py-20">
          <p className="font-basecoat text-red-500 text-center text-base sm:text-lg md:text-xl">{error}</p>
        </div>
      )}

      {/* Grid - Responsive columns avec hauteur uniforme */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
        {realisations.map((realisation) => (
          <div
            key={realisation.id}
            className="bg-white rounded-lg shadow-md overflow-hidden realisation-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
          >
            {/* Image Container - Hauteur FIXE */}
            <div className="relative overflow-hidden h-56 sm:h-60 md:h-64 flex-shrink-0">
              {realisation.image_url ? (
                <img
                  src={realisation.image_url}
                  alt={realisation.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="font-basecoat text-gray-500 text-sm sm:text-base">Aucune image disponible</span>
                </div>
              )}
            </div>

            {/* Content - flex-grow pour remplir l'espace */}
            <div className="p-3 sm:p-4 md:p-5 flex-grow flex flex-col">
              <h3 className="font-basecoat text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                {realisation.title}
              </h3>
              <p className="font-basecoat text-gray-700 text-xs sm:text-sm md:text-base line-clamp-3 leading-relaxed flex-grow">
                {realisation.description}
              </p>
              
              {/* Link en bas */}
              <div className="mt-4">
                <Link
                  to={`/realisations/${realisation.id}`}
                  className="font-basecoat inline-flex items-center text-yellow-600 hover:text-yellow-700 font-medium transition text-sm sm:text-base group"
                >
                  Voir plus
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1 group-hover:translate-x-1 transition-transform"
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
          </div>
        ))}
      </div>

      {/* Empty state */}
      {!loading && !error && realisations.length === 0 && (
        <div className="flex items-center justify-center py-12 sm:py-16 md:py-20">
          <p className="font-basecoat text-gray-600 text-center text-base sm:text-lg md:text-xl">
            Aucune réalisation disponible pour le moment.
          </p>
        </div>
      )}
    </div>
  );
}