import { useState, useEffect } from 'react';
import { Link, useLoaderData, useNavigate } from '@remix-run/react';
import { json } from '@remix-run/node';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { apiEndpoints, getImageUrl } from '../config/api';
import { useScrollAnimations } from '../hooks/useScrollAnimations';
import { useTranslation } from 'react-i18next';
import { useLocalePath } from '../hooks/useLocalePath';

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
  categorie?: string;
}

interface CoupDeCoeur {
  id: number;
  productId: string;
  productTitle: string;
  prix?: string | number;
  image_url: string;
  motif?: string;
}

interface LoaderData {
  realisations: Realisation[];
  coupsDeCoeur: CoupDeCoeur[];
  error: string | null;
}

export async function loader({ params }: LoaderFunctionArgs) {
  const locale = params.locale ?? 'fr';
  const endpoints = apiEndpoints(locale);
  const baseUrl = endpoints.realisations.split('?')[0];

  try {
    const url = `${baseUrl}?populate[0]=ImagePrincipale&populate[1]=Images&populate[2]=Declinaison&populate[3]=Declinaison.Image&locale=${locale}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    const data = await response.json();

    if (data?.data) {
      const coupsDeCoeur: CoupDeCoeur[] = [];

      const realisations: Realisation[] = data.data.map((realisation: any) => {
        // Extraire les coups de cœur
        if (Array.isArray(realisation.Declinaison)) {
          realisation.Declinaison.forEach((decl: any) => {
            if (decl.CoupDeCoeur === true) {
              const imgUrl = decl.Image?.url
                ? getImageUrl(decl.Image.url)
                : realisation.ImagePrincipale?.url
                  ? getImageUrl(realisation.ImagePrincipale.url)
                  : realisation.Images?.[0]?.url
                    ? getImageUrl(realisation.Images[0].url)
                    : '';
              coupsDeCoeur.push({
                id: decl.id,
                productId: realisation.documentId,
                productTitle: realisation.Titre || 'Titre indisponible',
                prix: realisation.Prix,
                image_url: imgUrl,
                motif: decl.Description || '',
              });
            }
          });
        }

        return {
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
          categorie: realisation.Categorie || undefined,
        };
      });

      return json<LoaderData>({ realisations, coupsDeCoeur, error: null }, {
        headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' },
      });
    }

    return json<LoaderData>({ realisations: [], coupsDeCoeur: [], error: 'Aucune réalisation trouvée.' });
  } catch (err: any) {
    return json<LoaderData>({
      realisations: [],
      coupsDeCoeur: [],
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

const ITEMS_PER_PAGE = 9;

const CATEGORIES = ['Tout', 'Trousses', 'Sacs', 'Housses', 'Accessoires'];
const CAT_KEY: Record<string, string> = {
  'Tout': 'products.cat_all',
  'Trousses': 'products.cat_pouches',
  'Sacs': 'products.cat_bags',
  'Housses': 'products.cat_sleeves',
  'Accessoires': 'products.cat_accessories',
};

function matchesCategory(realisation: Realisation, category: string): boolean {
  if (category === 'Tout') return true;
  // Si le champ Categorie est renseigné dans Strapi, on l'utilise directement
  if (realisation.categorie) {
    return realisation.categorie === category;
  }
  // Fallback : matching sur le texte (tant que Strapi n'est pas encore rempli)
  const text = `${realisation.title} ${realisation.description}`.toLowerCase();
  if (category === 'Sacs') return text.includes('tote') && !text.includes('porte-cl');
  if (category === 'Accessoires') {
    if (text.includes('porte-cl')) return true;
    return !text.includes('trousse') && !text.includes('tote') && !text.includes('housse');
  }
  return text.includes(category.toLowerCase().slice(0, -1));
}

export default function Realisations() {
  const { realisations, coupsDeCoeur, error } = useLoaderData<LoaderData>();
  const { t } = useTranslation();
  const lp = useLocalePath();
  const [showPopup, setShowPopup] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tout');

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
    navigate(lp('/#ou-nous-trouver'));
  };

  const filteredRealisations = realisations.filter((r) => matchesCategory(r, selectedCategory));

  const sortedRealisations = [...filteredRealisations].sort((a, b) => {
    const prixA = typeof a.prix === 'string' ? parseFloat(a.prix) : (a.prix ?? 0);
    const prixB = typeof b.prix === 'string' ? parseFloat(b.prix) : (b.prix ?? 0);
    return sortOrder === 'asc' ? prixA - prixB : prixB - prixA;
  });

  const totalPages = Math.ceil(sortedRealisations.length / ITEMS_PER_PAGE);
  const paginatedRealisations = sortedRealisations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSortChange = (value: 'asc' | 'desc') => {
    setSortOrder(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  return (
    <>
      {/* ── Bannière région (bottom) ── */}
      {showPopup && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-4 border-benin-jaune shadow-2xl p-4 sm:p-5">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
            <p className="font-basecoat font-bold text-gray-900 text-center sm:text-left text-sm sm:text-base whitespace-nowrap">
              {t('products.region_question')}
            </p>
            <div className="flex gap-3 flex-shrink-0">
              <button
                onClick={handleBelgiqueClick}
                className="font-basecoat border-2 border-benin-jaune text-gray-900 hover:bg-benin-jaune hover:text-black px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wide transition-all hover:scale-105"
              >
                {t('products.region_belgium')}
              </button>
              <button
                onClick={handleBeninClick}
                className="font-basecoat bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wide transition-all hover:scale-105 shadow"
              >
                {t('products.region_benin')}
              </button>
            </div>
            <button
              onClick={handleBelgiqueClick}
              className="text-gray-400 hover:text-gray-600 transition sm:ml-auto flex-shrink-0"
              aria-label={t('nav.aria_close')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Contenu principal ── */}
      <div
        ref={scrollRef}
        className="py-6 sm:py-8 md:py-[60px] px-4 sm:px-6 md:px-[60px] lg:px-[120px] mt-16 sm:mt-20 md:mt-24"
      >
        {/* Breadcrumb */}
        <nav className="anim-fade-up font-basecoat mb-6 sm:mb-8 text-xs sm:text-sm">
          <Link to={lp('/')} className="text-benin-jaune hover:text-benin-terre font-medium transition">
            {t('common.home')}
          </Link>
          <span className="mx-1.5 sm:mx-2 text-gray-400">/</span>
          <span className="text-gray-600">{t('products.breadcrumb_shop')}</span>
        </nav>

        {/* Titre + Tri */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12">
          <div>
            <h1
              className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-[44px] font-bold uppercase text-gray-900"
              data-delay="0.1"
            >
              {t('products.title')}
            </h1>
            <div
              className="anim-expand-line w-24 sm:w-28 h-[2px] bg-gradient-to-r from-benin-jaune via-benin-jaune/60 to-transparent mt-3 sm:mt-4"
              data-delay="0.15"
            ></div>
            <p className="anim-fade-up font-basecoat text-xs text-gray-400 mt-3" data-delay="0.2">
              <Link to={lp('/guide-des-tailles')} className="text-benin-jaune hover:text-benin-terre hover:underline transition font-semibold">
                {t('sizes.title')} →
              </Link>
            </p>
          </div>
          <div className="anim-fade-up flex items-center gap-2" data-delay="0.2">
            <label
              htmlFor="sort-price"
              className="font-basecoat text-sm text-gray-600 whitespace-nowrap"
            >
              {t('products.sort_by')}
            </label>
            <select
              id="sort-price"
              value={sortOrder}
              onChange={(e) => handleSortChange(e.target.value as 'asc' | 'desc')}
              className="font-basecoat text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-benin-jaune focus:border-benin-jaune"
            >
              <option value="asc">{t('products.sort_price_asc')}</option>
              <option value="desc">{t('products.sort_price_desc')}</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col">

        {/* ── Filtres catégories ── */}
        {!error && (
          <div className="order-2 sm:order-1 anim-fade-up flex gap-2 sm:gap-3 flex-wrap mb-8 sm:mb-10" data-delay="0.25">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`font-basecoat text-sm sm:text-base font-semibold px-4 sm:px-5 py-2 rounded-full border-2 transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-benin-jaune border-benin-jaune text-black shadow-md'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-benin-jaune hover:text-benin-jaune'
                }`}
              >
                {t(CAT_KEY[cat])}
                {cat !== 'Tout' && (
                  <span className="ml-1.5 text-xs opacity-60">
                    ({realisations.filter((r) => matchesCategory(r, cat)).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* ── Coups de cœur ── */}
        <div className="order-1 sm:order-2">
        {!error && coupsDeCoeur.length > 0 && (
          <div className="mb-12 sm:mb-14">
            <div className="mb-6 flex items-center gap-3">
              <span className="text-benin-jaune text-2xl">♥</span>
              <h2 className="font-basecoat text-xl sm:text-2xl font-bold uppercase text-gray-900">{t('products.favorites_title')}</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-benin-ocre scrollbar-track-gray-100">
              {coupsDeCoeur.map((item) => (
                <Link
                  key={`${item.productId}-${item.id}`}
                  to={lp(`/realisations/${item.productId}`)}
                  className="group flex-shrink-0 w-44 sm:w-52 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border border-gray-100"
                >
                  <div className="relative h-44 sm:h-52 overflow-hidden bg-amber-50">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.motif || item.productTitle}
                        loading="lazy"
                        width={300}
                        height={300}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-basecoat text-gray-400 text-xs">{t('home.no_image')}</span>
                      </div>
                    )}
                    <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full">
                      <span className="text-benin-jaune text-xl">♥</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-basecoat text-gray-900 text-sm font-bold uppercase leading-tight group-hover:text-benin-jaune transition-colors">
                      {item.productTitle}
                    </h3>
                    {item.motif && (
                      <p className="font-basecoat text-gray-500 text-xs mt-0.5">{item.motif}</p>
                    )}
                    <p className="font-basecoat text-benin-jaune font-bold text-base mt-1">
                      {item.prix ? `${item.prix} €` : t('products.on_request')}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        </div>{/* end order-1 sm:order-2 */}

        <div className="order-3">
        {/* Error state */}
        {error && (
          <div className="flex items-center justify-center py-20">
            <p className="font-basecoat text-benin-rouge text-center text-lg">{error}</p>
          </div>
        )}
        {/* ── Grille produits ── */}
        {!error && (
          <div
            className="anim-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
            data-stagger="0.1"
          >
            {paginatedRealisations.map((realisation) => (
              <Link
                key={realisation.id}
                to={lp(`/realisations/${realisation.id}`)}
                className="group flex flex-col rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5 bg-white border border-gray-100"
              >
                {/* Image */}
                <div className="relative h-60 sm:h-68 md:h-72 overflow-hidden bg-amber-50 flex-shrink-0">
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
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-basecoat text-gray-400 text-sm">{t('home.no_image')}</span>
                    </div>
                  )}

                  {/* Badge Nouveau */}
                  {realisation.isNew && (
                    <div className="absolute top-3 left-3 bg-benin-jaune text-black text-xs font-basecoat font-bold uppercase px-3 py-1 rounded-full shadow">
                      {t('products.new_badge')}
                    </div>
                  )}

                  {/* Badge stock faible / épuisé */}
                  {!realisation.isNew && realisation.totalStock !== null && realisation.totalStock !== undefined && (
                    realisation.totalStock === 0 ? (
                      <div className="absolute top-3 left-3 bg-benin-rouge/100 text-white text-xs font-basecoat font-bold uppercase px-3 py-1 rounded-full shadow">
                        {t('products.sold_out')}
                      </div>
                    ) : realisation.totalStock <= 5 ? (
                      <div className="absolute top-3 left-3 bg-benin-jaune/80 text-black text-xs font-basecoat font-bold uppercase px-3 py-1 rounded-full shadow">
                        {t('products.low_stock', { count: realisation.totalStock })}
                      </div>
                    ) : null
                  )}

                  {/* Badges Fait main / Made in Bénin */}
                  <div className="absolute bottom-2 right-2 flex flex-col items-end gap-1">
                    <span className="font-basecoat text-[10px] font-bold uppercase tracking-wide bg-benin-jaune text-black px-2 py-0.5 rounded-full shadow">{t('home.badge_handmade')}</span>
                    <span className="font-basecoat text-[10px] font-bold uppercase tracking-wide bg-gray-800 text-white px-2 py-0.5 rounded-full shadow">{t('home.badge_benin')}</span>
                  </div>

                </div>

                {/* Info section */}
                <div className="flex flex-col flex-1 p-5">
                  <h3 className="font-basecoat text-gray-900 text-lg sm:text-xl font-bold uppercase leading-tight mb-2 group-hover:text-benin-jaune transition-colors duration-300">
                    {realisation.title}
                  </h3>

                  {realisation.description && (
                    <p className="font-basecoat text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
                      {realisation.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <span className="font-basecoat text-2xl font-bold text-benin-jaune">
                      {realisation.prix ? `${realisation.prix} €` : t('products.on_request')}
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-basecoat text-sm font-bold uppercase tracking-wide text-black bg-beige group-hover:bg-benin-jaune px-4 py-2 rounded-xl transition-all duration-200 group-hover:shadow-md">
                      {t('products.view')}
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {!error && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10 sm:mt-14 flex-wrap">
            <button
              onClick={() => { setCurrentPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              disabled={currentPage === 1}
              className="font-basecoat flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:border-benin-jaune hover:text-benin-jaune transition disabled:opacity-30 disabled:cursor-not-allowed bg-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              {t('products.pagination_prev')}
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`w-10 h-10 rounded-xl font-basecoat text-sm font-bold transition ${
                    page === currentPage
                      ? 'bg-benin-jaune text-black shadow-md'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-benin-jaune hover:text-benin-jaune'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => { setCurrentPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              disabled={currentPage === totalPages}
              className="font-basecoat flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:border-benin-jaune hover:text-benin-jaune transition disabled:opacity-30 disabled:cursor-not-allowed bg-white"
            >
              {t('products.pagination_next')}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        )}

        {/* Empty state */}
        {!error && realisations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="font-basecoat text-gray-500 text-center text-lg">
              {t('products.coming_soon')}
            </p>
            <Link
              to={lp('/')}
              className="font-basecoat text-benin-jaune hover:text-benin-terre underline text-sm transition"
            >
              {t('common.home')}
            </Link>
          </div>
        )}
        {!error && realisations.length > 0 && filteredRealisations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="font-basecoat text-gray-500 text-center text-lg">
              {t('products.no_results_cat')}
            </p>
            <button
              onClick={() => handleCategoryChange('Tout')}
              className="font-basecoat text-benin-jaune hover:text-benin-terre underline text-sm transition"
            >
              {t('products.see_all_creations')}
            </button>
          </div>
        )}
        </div>{/* end order-3 */}

        </div>{/* end flex flex-col */}
      </div>
    </>
  );
}