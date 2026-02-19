import { useState, useEffect } from 'react';
import { Link, useLoaderData, useNavigate } from '@remix-run/react';
import { json } from '@remix-run/node';
import { getApiUrl, getImageUrl } from '../config/api';
import { useScrollAnimations } from '../hooks/useScrollAnimations';

export function meta() {
  return [
    { title: "Nos Créations — Les Poulettes" },
    {
      name: "description",
      content:
        "Découvrez toutes nos créations : trousses, sacs et housses en tissu wax authentique, faits main au Bénin par Les Poulettes.",
    },
    { property: "og:title", content: "Nos Créations — Les Poulettes" },
    {
      property: "og:description",
      content: "Trousses, sacs et housses en tissu wax, faits main au Bénin.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://lespoulettes.be/realisations" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Nos Créations — Les Poulettes" },
    { name: "twitter:description", content: "Trousses, sacs et housses en tissu wax, faits main au Bénin." },
  ];
}

interface Realisation {
  id: string;
  title: string;
  image_url?: string;
  description?: string;
  prix?: string | number;
  isNew?: boolean;
  totalStock?: number | null;
}

interface LoaderData {
  realisations: Realisation[];
  error: string | null;
}

export async function loader() {
  const API_URL = getApiUrl();

  try {
    const url = `${API_URL}/api/realisations?populate=*`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    const data = await response.json();

    if (data?.data) {
      const realisations: Realisation[] = data.data.map((realisation: any) => ({
        id: realisation.documentId,
        title: realisation.Titre || 'Titre indisponible',
        image_url: realisation.ImagePrincipale?.url
          ? getImageUrl(realisation.ImagePrincipale.url)
          : realisation.Images?.[0]?.url
            ? getImageUrl(realisation.Images[0].url)
            : undefined,
        description: realisation.Description || '',
        prix: realisation.Prix,
        isNew: realisation.isNew || false,
        totalStock: Array.isArray(realisation.Declinaison)
          ? realisation.Declinaison.reduce((sum: number, d: any) => sum + (d.Stock ?? 0), 0)
          : null,
      }));
      return json<LoaderData>({ realisations, error: null });
    }

    return json<LoaderData>({ realisations: [], error: 'Aucune réalisation trouvée.' });
  } catch (err: any) {
    return json<LoaderData>({
      realisations: [],
      error: 'Erreur lors du chargement des réalisations',
    });
  }
}

const REGION_KEY = 'lespoulettes_region';
const REGION_EXPIRY_DAYS = 30;

function getSavedRegion(): boolean {
  try {
    const raw = localStorage.getItem(REGION_KEY);
    if (!raw) return false;
    const { value, expires } = JSON.parse(raw);
    if (Date.now() > expires) {
      localStorage.removeItem(REGION_KEY);
      return false;
    }
    return value === 'belgique';
  } catch {
    return false;
  }
}

function saveRegion(region: 'belgique' | 'benin') {
  const expires = Date.now() + REGION_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
  localStorage.setItem(REGION_KEY, JSON.stringify({ value: region, expires }));
}

export default function Realisations() {
  const { realisations, error } = useLoaderData<LoaderData>();
  const [showPopup, setShowPopup] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const scrollRef = useScrollAnimations([showPopup]);

  const navigate = useNavigate();

  // Vérifier localStorage au montage côté client
  useEffect(() => {
    const alreadyChosen = getSavedRegion();
    if (!alreadyChosen) setShowPopup(true);
  }, []);

  // Fermer le popup avec Escape
  useEffect(() => {
    if (!showPopup) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        saveRegion('belgique');
        setShowPopup(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [showPopup]);

  const handleBelgiqueClick = () => {
    saveRegion('belgique');
    setShowPopup(false);
  };
  const handleBeninClick = () => {
    saveRegion('benin');
    navigate('/#ou-nous-trouver');
  };

  const sortedRealisations = [...realisations].sort((a, b) => {
    const prixA = typeof a.prix === 'string' ? parseFloat(a.prix) : (a.prix ?? 0);
    const prixB = typeof b.prix === 'string' ? parseFloat(b.prix) : (b.prix ?? 0);
    return sortOrder === 'asc' ? prixA - prixB : prixB - prixA;
  });

  return (
    <>
      {/* ── Popup région ── */}
      {showPopup && (
        <div className="fixed inset-0 bg-beige z-50 flex items-center justify-center p-4">
          <div className="text-center max-w-5xl w-full">
            <h1 className="font-basecoat text-2xl sm:text-3xl md:text-[44px] font-bold uppercase mb-16 sm:mb-20 md:mb-24 tracking-wide text-gray-900">
              Je commande depuis
            </h1>
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 justify-center items-stretch max-w-3xl mx-auto">
              <button
                onClick={handleBelgiqueClick}
                className="font-basecoat flex-1 bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-8 rounded-xl text-xl sm:text-2xl md:text-3xl font-medium uppercase transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg"
              >
                La Belgique
                <br className="hidden sm:block" />
                <span className="sm:hidden"> / </span>
                <span className="font-light">ou</span> l'Europe
              </button>
              <button
                onClick={handleBeninClick}
                className="font-basecoat flex-1 bg-gray-900 hover:bg-black text-white px-8 py-8 rounded-xl text-xl sm:text-2xl md:text-3xl font-medium uppercase transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg"
              >
                Le Bénin
              </button>
            </div>
            <p className="font-basecoat text-gray-400 mt-16 sm:mt-20 text-xs sm:text-sm font-light tracking-wider">
              Sélectionnez votre région pour continuer
            </p>
          </div>
        </div>
      )}

      {/* ── Contenu principal ── */}
      <div
        ref={scrollRef}
        className={`${showPopup ? 'hidden' : 'block'
          } py-6 sm:py-8 md:py-[60px] px-4 sm:px-6 md:px-[60px] lg:px-[120px] mt-16 sm:mt-20 md:mt-24`}
      >
        {/* Breadcrumb */}
        <nav className="anim-fade-up font-basecoat mb-6 sm:mb-8 text-xs sm:text-sm">
          <Link to="/" className="text-yellow-600 hover:text-yellow-700 font-medium transition">
            Accueil
          </Link>
          <span className="mx-1.5 sm:mx-2 text-gray-400">/</span>
          <span className="text-gray-600">Réalisations</span>
        </nav>

        {/* Titre + Tri */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12">
          <div>
            <h1
              className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-[44px] font-bold uppercase text-gray-900"
              data-delay="0.1"
            >
              Nos réalisations
            </h1>
            <div
              className="anim-fade-up w-16 sm:w-20 h-1 bg-yellow-400 mt-3 sm:mt-4"
              data-delay="0.15"
            ></div>
            <p className="anim-fade-up font-basecoat text-gray-500 text-sm sm:text-base mt-3" data-delay="0.2">
              {realisations.length} création{realisations.length > 1 ? 's' : ''} faite{realisations.length > 1 ? 's' : ''} main au Bénin ✂
            </p>
          </div>
          <div className="anim-fade-up flex items-center gap-2" data-delay="0.2">
            <label
              htmlFor="sort-price"
              className="font-basecoat text-sm text-gray-600 whitespace-nowrap"
            >
              Trier par :
            </label>
            <select
              id="sort-price"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="font-basecoat text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
            >
              <option value="asc">Prix croissant</option>
              <option value="desc">Prix décroissant</option>
            </select>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="flex items-center justify-center py-20">
            <p className="font-basecoat text-red-500 text-center text-lg">{error}</p>
          </div>
        )}
        {/* ── Grille produits ── */}
        {!error && (
          <div
            className="anim-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
            data-stagger="0.1"
          >
            {sortedRealisations.map((realisation) => (
              <Link
                key={realisation.id}
                to={`/realisations/${realisation.id}`}
                className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 block"
              >
                {/* Image pleine carte */}
                <div className="relative h-64 sm:h-72 md:h-80 overflow-hidden">
                  {realisation.image_url ? (
                    <img
                      src={realisation.image_url}
                      alt={realisation.title}
                      loading="lazy"
                      width={600}
                      height={400}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="font-basecoat text-gray-400 text-sm">Aucune image</span>
                    </div>
                  )}

                  {/* Overlay gradient — plus marqué pour lisibilité */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  {/* Badge Nouveau */}
                  {realisation.isNew && (
                    <div className="absolute top-3 left-3 bg-yellow-400 text-black text-xs font-basecoat font-bold uppercase px-3 py-1 rounded-full shadow">
                      Nouveau
                    </div>
                  )}

                  {/* Badge stock faible / épuisé */}
                  {!realisation.isNew && realisation.totalStock !== null && realisation.totalStock !== undefined && (
                    realisation.totalStock === 0 ? (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-basecoat font-bold uppercase px-3 py-1 rounded-full shadow">
                        Épuisé
                      </div>
                    ) : realisation.totalStock <= 5 ? (
                      <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-basecoat font-bold uppercase px-3 py-1 rounded-full shadow">
                        Plus que {realisation.totalStock}
                      </div>
                    ) : null
                  )}

                  {/* Prix */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-900 font-basecoat font-bold text-xl px-3 py-1 rounded-full shadow">
                    {realisation.prix ? `${realisation.prix} €` : 'Sur demande'}
                  </div>

                  {/* Contenu bas de carte */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                    <h3 className="font-basecoat text-white text-xl sm:text-2xl font-bold uppercase leading-tight mb-2">
                      {realisation.title}
                    </h3>

                    {realisation.description && (
                      <p className="font-basecoat text-white/80 text-sm sm:text-base leading-relaxed line-clamp-2 mb-3">
                        {realisation.description}
                      </p>
                    )}

                    <div className="inline-flex items-center gap-2 font-basecoat text-yellow-400 font-semibold text-sm sm:text-base transition-transform duration-300 group-hover:translate-x-2">
                      Choisir mon motif
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!error && realisations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="font-basecoat text-gray-500 text-center text-lg">
              Nos créatrices sont à l'œuvre... revenez très vite ! 🧵
            </p>
            <Link
              to="/"
              className="font-basecoat text-yellow-600 hover:text-yellow-700 underline text-sm transition"
            >
              Retour à l'accueil
            </Link>
          </div>
        )}
      </div>
    </>
  );
}