import { useState } from 'react';
import { Link, useLoaderData, useNavigate } from '@remix-run/react';
import { json } from '@remix-run/node';
import { apiEndpoints, getImageUrl } from '../config/api';
import { useScrollAnimations } from '../hooks/useScrollAnimations';

interface Realisation {
  id: string;
  title: string;
  image_url?: string;
  description?: string;
  prix?: string | number;
}

interface LoaderData {
  realisations: Realisation[];
  error: string | null;
}

export async function loader() {
  try {
    const response = await fetch(apiEndpoints.realisations);
    if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
    const data = await response.json();

    if (data?.data) {
      const realisations: Realisation[] = data.data.map((realisation: any) => ({
        id: realisation.documentId,
        title: realisation.Titre || 'Titre indisponible',
        image_url: realisation.Images?.[0]?.url ? getImageUrl(realisation.Images[0].url) : undefined,
        description: realisation.Description || 'Description indisponible',
        prix: realisation.Prix,
      }));
      return json<LoaderData>({ realisations, error: null });
    }
    return json<LoaderData>({ realisations: [], error: 'Aucune réalisation trouvée.' });
  } catch (err: any) {
    console.error('Loader error:', err);
    return json<LoaderData>({ realisations: [], error: 'Erreur lors du chargement des réalisations' });
  }
}

export default function Realisations() {
  const { realisations, error } = useLoaderData<LoaderData>();
  const [showPopup, setShowPopup] = useState(true);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const navigate = useNavigate();

  const scrollRef = useScrollAnimations([showPopup]);

  const handleBelgiqueClick = () => {
    setShowPopup(false);
  };

const handleBeninClick = () => {
  window.location.href = '/#ou-nous-trouver';
};

  return (
    <>
      {/* Popup plein écran */}
      {showPopup && (
        <div className="fixed inset-0 bg-beige z-50 flex items-center justify-center p-4">
          <div className="text-center max-w-5xl w-full">
            {/* Titre */}
            <h1 className="font-basecoat text-2xl sm:text-3xl md:text-[44px] font-bold uppercase mb-16 sm:mb-20 md:mb-24 tracking-wide text-gray-900">
              Je commande depuis
            </h1>

            {/* Boutons */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 justify-center items-stretch max-w-3xl mx-auto">
              {/* Bouton Belgique/Europe */}
              <button
                onClick={handleBelgiqueClick}
                className="font-basecoat flex-1 bg-yellow-400 hover:bg-yellow-500 text-white px-8 py-8 rounded-xl text-xl sm:text-2xl md:text-3xl font-medium uppercase transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg"
              >
                La Belgique<br className="hidden sm:block" />
                <span className="sm:hidden"> / </span>
                <span className="font-light">ou</span> l'Europe
              </button>

              {/* Bouton Bénin */}
              <button
                onClick={handleBeninClick}
                className="font-basecoat flex-1 bg-gray-900 hover:bg-black text-white px-8 py-8 rounded-xl text-xl sm:text-2xl md:text-3xl font-medium uppercase transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg"
              >
                Le Bénin
              </button>
            </div>

            {/* Note discrète */}
            <p className="font-basecoat text-gray-400 mt-16 sm:mt-20 text-xs sm:text-sm font-light tracking-wider">
              Sélectionnez votre région pour continuer
            </p>
          </div>
        </div>
      )}

      {/* Contenu principal (masqué si popup visible) */}
      <div ref={scrollRef} className={`${showPopup ? 'hidden' : 'block'} py-6 sm:py-8 md:py-[60px] px-4 sm:px-6 md:px-[60px] lg:px-[120px] mt-[60px] sm:mt-[70px] md:mt-[80px]`}>
        {/* Breadcrumb */}
        <nav className="anim-fade-up font-basecoat mb-6 sm:mb-8 text-xs sm:text-sm">
          <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium transition">
            Accueil
          </Link>
          <span className="mx-1.5 sm:mx-2 text-gray-400">/</span>
          <span className="text-gray-600">Réalisations</span>
        </nav>

        {/* Bouton retour */}
        <Link
          to="/"
          className="anim-fade-up font-basecoat inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 sm:mb-8 transition text-sm sm:text-base"
          data-delay="0.05"
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

        {/* Titre + Filtre */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6">
          <div>
            <h1 className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-[44px] font-bold uppercase text-gray-900" data-delay="0.1">
              Nos réalisations
            </h1>
            <div className="anim-fade-up w-16 sm:w-20 h-1 bg-yellow-400 mt-3 sm:mt-4" data-delay="0.15"></div>
          </div>
          <div className="anim-fade-up flex items-center gap-2" data-delay="0.2">
            <label htmlFor="sort-price" className="font-basecoat text-sm text-gray-600 whitespace-nowrap">Trier par :</label>
            <select
              id="sort-price"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="font-basecoat text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
            >
              <option value="asc">Prix croissant</option>
              <option value="desc">Prix décroissant</option>
            </select>
          </div>
        </div>
        <div className="mb-8 sm:mb-10 md:mb-12"></div>

        {/* Error state */}
        {error && (
          <div className="flex items-center justify-center py-12 sm:py-16 md:py-20">
            <p className="font-basecoat text-red-500 text-center text-base sm:text-lg md:text-xl">{error}</p>
          </div>
        )}

        {/* Grid */}
<div className="anim-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6" data-stagger="0.12">
  {[...realisations].sort((a, b) => {
    const prixA = typeof a.prix === 'string' ? parseFloat(a.prix) : (a.prix ?? 0);
    const prixB = typeof b.prix === 'string' ? parseFloat(b.prix) : (b.prix ?? 0);
    return sortOrder === 'asc' ? prixA - prixB : prixB - prixA;
  }).map((realisation) => (
    <div
      key={realisation.id}
      className="bg-white rounded-lg shadow-md overflow-hidden realisation-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
    >
      <div className="relative overflow-hidden h-56 sm:h-60 md:h-64 flex-shrink-0">
        {realisation.image_url ? (
          <img
            src={realisation.image_url}
            alt={realisation.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="font-basecoat text-gray-500 text-sm sm:text-base">Aucune image disponible</span>
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4 md:p-5 flex-grow flex flex-col">
        <h3 className="font-basecoat text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {realisation.title}
        </h3>

        {/* Prix */}
        <p className="font-basecoat text-yellow-600 text-lg sm:text-xl md:text-2xl font-bold mb-2">
          {realisation.prix ? `${realisation.prix} €` : 'Prix sur demande'}
        </p>

     <p className="font-basecoat text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed flex-grow">
  {realisation.description}
</p>

        <div className="mt-4">
   <div className="mt-4 overflow-hidden">
  <Link
    to={`/realisations/${realisation.id}`}
    className="font-basecoat inline-flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 text-black px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold transition text-sm sm:text-base gap-2 group"
  >
    Choisir
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1"
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
    </div>
  ))}
</div>

        {/* Empty state */}
        {!error && realisations.length === 0 && (
          <div className="flex items-center justify-center py-12 sm:py-16 md:py-20">
            <p className="font-basecoat text-gray-600 text-center text-base sm:text-lg md:text-xl">
              Aucune réalisation disponible pour le moment.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
