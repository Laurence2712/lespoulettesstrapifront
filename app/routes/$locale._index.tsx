import { Link, useLoaderData, useNavigate } from '@remix-run/react';
import { useState, useEffect } from 'react';
import { json } from '@remix-run/node';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { apiEndpoints, getImageUrl, getStrapiImageUrl } from '../config/api';
import { useScrollAnimations, useParallaxHero } from '../hooks/useScrollAnimations';
import { useTranslation } from 'react-i18next';
import { useLocalePath } from '../hooks/useLocalePath';
import ProductCard from '../components/ProductCard';

export function meta() {
  return [
    { title: "Les Poulettes — Accessoires wax fait main au Bénin" },
    {
      name: "description",
      content:
        "Les Poulettes, marque d'accessoires éco-responsables faits main au Bénin. Découvrez nos trousses, sacs et housses en tissu wax authentique.",
    },
    { property: "og:title", content: "Les Poulettes — Accessoires wax fait main au Bénin" },
    {
      property: "og:description",
      content: "Trousses, sacs et housses en tissu wax africain, confectionnés à la main au Bénin. Éco-responsables, uniques et solidaires.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://lespoulettes.be" },
    { tagName: "link", rel: "canonical", href: "https://lespoulettes.be" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Les Poulettes — Accessoires wax fait main au Bénin" },
    { name: "twitter:description", content: "Trousses, sacs et housses en tissu wax africain, confectionnés à la main au Bénin. Éco-responsables, uniques et solidaires." },
  ];
}

interface HomepageData {
  image_url?: string;
  description?: string;
}

interface Realisation {
  id: number;
  title: string;
  image_url?: string;
  description?: string;
  prix?: string | number;
  categorie?: string;
}

interface Actualite {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  date?: string;
}

interface LoaderData {
  homepageData: HomepageData | null;
  realisations: Realisation[];
  actualites: Actualite[];
  locale: string;
  error: string | null;
}

function fetchWithTimeout(url: string, timeoutMs = 8000): Promise<Response | null> {
  return Promise.race([
    fetch(url).catch(() => null),
    new Promise<null>((resolve) => setTimeout(() => resolve(null), timeoutMs)),
  ]);
}

export function headers({ loaderHeaders }: { loaderHeaders: Headers }) {
  const link = loaderHeaders.get('Link');
  if (link) return { Link: link };
  return {};
}

export async function loader({ params }: LoaderFunctionArgs) {
  const locale = params.locale ?? 'fr';
  const endpoints = apiEndpoints(locale);

  try {
    // Reduce timeout to 5s — faster failure & faster TTFB on slow Strapi cold starts
    const [homepageRes, realisationsRes, actualitesRes] = await Promise.all([
      fetchWithTimeout(endpoints.homepages, 5000),
      fetchWithTimeout(endpoints.realisations, 5000),
      fetchWithTimeout(endpoints.latestActualite, 5000),
    ]);

    let homepageData: HomepageData | null = null;
    let realisations: Realisation[] = [];
    let actualites: Actualite[] = [];

    if (homepageRes?.ok) {
      const data = await homepageRes.json();
      if (data?.data?.length) {
        const homepage = data.data[0];
        const bannerImageUrl = getStrapiImageUrl(homepage.banner_image, 'large');
        let descriptionText = '';
        if (Array.isArray(homepage.description)) {
          homepage.description.forEach((block: any) => {
            block.children?.forEach((child: any) => {
              descriptionText += child.text + ' ';
            });
          });
        }
        homepageData = { image_url: bannerImageUrl, description: descriptionText.trim() };
      }
    }

    const heroImageUrl = homepageData?.image_url;

    if (realisationsRes?.ok) {
      const data = await realisationsRes.json();
      if (data?.data) {
        realisations = data.data.map((realisation: any) => ({
          id: realisation.documentId,
          title: realisation.Titre || 'Titre indisponible',
          image_url: getStrapiImageUrl(realisation.ImagePrincipale ?? realisation.Images?.[0], 'medium') || undefined,
          description: realisation.Description || 'Description indisponible',
          prix: realisation.Prix,
          categorie: realisation.Categorie || undefined,
        }));
      }
    }

    if (actualitesRes?.ok) {
      const data = await actualitesRes.json();
      if (data?.data) {
        actualites = data.data.map((item: any) => ({
          id: item.id,
          title: item.Title || 'Titre indisponible',
          content: item.content || '',
          date: item.date || '',
          image_url: getStrapiImageUrl(item.image, 'medium'),
        }));
      }
    }

    const responseHeaders = new Headers();
    if (heroImageUrl) {
      responseHeaders.set('Link', `<${heroImageUrl}>; rel=preload; as=image`);
    }
    // Cache 10min on Vercel Edge, serve stale up to 1h while revalidating in background
    responseHeaders.set('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=3600');

    return json<LoaderData>({ homepageData, realisations, actualites, locale, error: null }, { headers: responseHeaders });
  } catch (err: any) {
    return json<LoaderData>({
      homepageData: null,
      realisations: [],
      actualites: [],
      locale,
      error: 'Erreur lors du chargement des données',
    });
  }
}

function matchesCategory(r: Realisation, category: string): boolean {
  if (category === 'Tout') return true;
  if (r.categorie) return r.categorie === category;
  const text = `${r.title} ${r.description}`.toLowerCase();
  if (category === 'Sacs') return text.includes('tote') && !text.includes('porte-cl');
  if (category === 'Accessoires') {
    if (text.includes('porte-cl')) return true;
    return !text.includes('trousse') && !text.includes('tote') && !text.includes('housse');
  }
  return text.includes(category.toLowerCase().slice(0, -1));
}

export default function Index() {
  const { homepageData, realisations, actualites, locale } = useLoaderData<LoaderData>();
  const { t } = useTranslation();
  const lp = useLocalePath();

  const heroRef = useParallaxHero();
  const scrollRef = useScrollAnimations([]);
  const navigate = useNavigate();

  const CATEGORIES = [
    { label: t('products.cat_all'),        value: 'Tout' },
    { label: t('products.cat_pouches'),    value: 'Trousses' },
    { label: t('products.cat_bags'),       value: 'Sacs' },
    { label: t('products.cat_sleeves'),    value: 'Housses' },
    { label: t('products.cat_accessories'),value: 'Accessoires' },
  ].filter((cat) => cat.value === 'Tout' || realisations.some((r) => matchesCategory(r, cat.value)));

  const [activeCategory, setActiveCategory] = useState('Tout');
  const [preloaderVisible, setPreloaderVisible] = useState(true);

  useEffect(() => {
    const hide = () => setTimeout(() => setPreloaderVisible(false), 300);
    if (document.readyState === 'complete') {
      hide();
    } else {
      window.addEventListener('load', hide, { once: true });
      return () => window.removeEventListener('load', hide);
    }
  }, []);

  const filtered = realisations.filter((r) => matchesCategory(r, activeCategory));

  const featured = filtered.slice(0, 8);

  return (
    <div className="overflow-x-hidden" ref={scrollRef}>

      {/* ── Preloader ── */}
      {preloaderVisible && (
        <div
          style={{
            position: 'fixed', inset: 0, background: '#ffffff',
            zIndex: 99999, display: 'flex', justifyContent: 'center', alignItems: 'center',
            transition: 'opacity 0.5s ease, visibility 0.5s ease',
          }}
        >
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <img
              src="/assets/logo_t_poulettes.png"
              alt="Les Poulettes"
              style={{ maxWidth: 280, height: 'auto', animation: 'breatheLogo 2s ease-in-out infinite' }}
            />
            <div style={{ width: 150, height: 3, background: '#f0f0f0', borderRadius: 10, overflow: 'hidden', position: 'relative' }}>
              <div style={{ width: '100%', height: '100%', background: '#111111', position: 'absolute', animation: 'linkThread 1.6s infinite cubic-bezier(0.4,0,0.2,1)' }} />
            </div>
          </div>
          <style>{`
            @keyframes breatheLogo { 0%,100%{transform:scale(1);opacity:.95} 50%{transform:scale(1.04);opacity:1} }
            @keyframes linkThread { 0%{left:-100%} 50%{left:0} 100%{left:100%} }
          `}</style>
        </div>
      )}

      {/* ── Hero Banner ── */}
      <header ref={heroRef} className="banner relative text-white overflow-hidden h-screen min-h-[500px]">
        {homepageData?.image_url && (
          <img
            src={homepageData.image_url}
            alt="Les Poulettes"
            className="absolute inset-0 w-full h-full object-cover object-center z-0"
          />
        )}
        {/* Dégradé léger uniquement en bas pour lisibilité du texte */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
        {/* Texte en bas à gauche — style Martine */}
        <div className="absolute bottom-10 sm:bottom-14 left-6 sm:left-10 md:left-16 lg:left-24 z-20 max-w-lg">
          <h1 className="anim-fade-up font-basecoat text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-wide mb-4 sm:mb-6 leading-tight">
            {t('home.hero_title')}
          </h1>
          <div className="anim-fade-up" data-delay="0.2">
            <Link
              to={lp('/realisations')}
              className="font-basecoat bg-benin-jaune text-black hover:bg-white hover:text-black px-4 py-4 rounded-md text-xs font-bold uppercase tracking-widest transition-all duration-300 inline-flex items-center gap-2"
            >
              {t('home.hero_cta')}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </header>


      {/* ── Nouveaux arrivages ── */}
      <section id="nouveaux-arrivages" className="py-10 sm:py-14 md:py-[70px] bg-beige dark:bg-gray-900">
        <div className="px-6 sm:px-10 md:px-16 lg:px-24">
        <div className="mb-8 sm:mb-10 md:mb-12">
          {/* Titre + bouton boutique alignés */}
          <div className="flex items-center justify-between gap-4 flex-wrap mb-3 sm:mb-4">
            <div>
              <h2 className="anim-fade-up font-basecoat text-lg sm:text-xl md:text-2xl font-bold uppercase text-gray-900 dark:text-gray-100">
                {t('home.new_creations')}
              </h2>
              <div className="anim-expand-line w-24 sm:w-28 h-[2px] bg-gradient-to-r from-benin-jaune via-benin-jaune/60 to-transparent mt-3 sm:mt-4" data-delay="0.1"></div>
            </div>
            <Link
              to={lp('/realisations')}
              className="font-basecoat bg-benin-jaune text-black hover:bg-white hover:text-black px-4 py-4 rounded-md text-xs font-bold uppercase tracking-widest transition-all duration-300 inline-flex items-center gap-2"
            >
              {t('home.see_all_shop_full')}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          {/* Filtres en dessous du titre */}
          <div className="flex gap-2 flex-wrap mt-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`font-basecoat text-sm font-semibold px-4 py-1.5 rounded-lg border-2 transition-all duration-200 ${
                  activeCategory === cat.value
                    ? 'bg-benin-jaune border-benin-jaune text-black shadow-md'
                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-benin-jaune hover:text-benin-jaune'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {featured.length > 0 ? (
          <>
            <div className="anim-stagger grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5" data-stagger="0.08">
              {featured.map((realisation) => (
                <ProductCard
                  key={realisation.id}
                  id={realisation.id}
                  title={realisation.title}
                  image_url={realisation.image_url}
                  prix={realisation.prix}
                  categorie={realisation.categorie}
                />
              ))}
            </div>

          </>
        ) : (
          <p className="text-center text-gray-400 dark:text-gray-500 font-basecoat">{t('home.no_products')}</p>
        )}
        </div>
      </section>

      {/* ── Actualités ── */}
      <section className="bg-beige dark:bg-gray-900">
        <div className="px-6 sm:px-10 md:px-16 lg:px-24 pt-6 sm:pt-8 md:pt-[60px] pb-8 sm:pb-10 md:pb-12">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-3 sm:mb-4">
            <div>
              <h2 className="anim-fade-up font-basecoat text-lg sm:text-xl md:text-2xl font-bold uppercase text-gray-900 dark:text-gray-100">
                {t('news.title')}
              </h2>
              <div className="anim-expand-line w-24 sm:w-28 h-[2px] bg-gradient-to-r from-benin-jaune via-benin-jaune/60 to-transparent mt-3 sm:mt-4" data-delay="0.1"></div>
            </div>
            <Link
              to={lp('/actualites')}
              className="font-basecoat bg-benin-jaune text-black hover:bg-white hover:text-black px-4 py-4 rounded-md text-xs font-bold uppercase tracking-widest transition-all duration-300 inline-flex items-center gap-2"
            >
              {t('home.see_all_news')}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {actualites.length > 0 ? (
          actualites.map((actu, idx) => (
            <div key={actu.id}>
              <div className="px-6 sm:px-10 md:px-16 lg:px-24 py-8 sm:py-10 md:py-14">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 items-center">
                  {actu.image_url && (
                    <div className="anim-fade-right" data-delay="0.2">
                      <img
                        src={actu.image_url}
                        alt={actu.title}
                        loading="lazy"
                        width={800}
                        height={400}
                        className="w-full max-w-sm md:max-w-md h-auto object-contain rounded-xl shadow-sm"
                      />
                    </div>
                  )}
                  <div className={`anim-fade-left ${!actu.image_url ? 'lg:col-span-2' : ''}`} data-delay="0.3">
                    {actu.date && (
                      <p className="font-basecoat text-xs text-benin-jaune font-semibold mb-2 tracking-widest uppercase">
                        {new Date(actu.date).toLocaleDateString(locale === 'en' ? 'en-GB' : 'fr-FR', { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    )}
                    <h3 className="font-basecoat text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-5 leading-tight">
                      {actu.title}
                    </h3>
                    <p className="font-basecoat text-gray-700 dark:text-gray-300 text-sm sm:text-base whitespace-pre-line leading-relaxed">
                      {actu.content}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 sm:px-10 md:px-16 lg:px-24 pb-10">
            <p className="text-center text-gray-500 dark:text-gray-400 dark:text-gray-500 text-sm sm:text-base font-basecoat">{t('home.no_news')}</p>
          </div>
        )}
      </section>

      {/* ── Commandes personnalisées ── */}
      <section className="py-10 sm:py-14 md:py-[70px] bg-white dark:bg-gray-900">
        <div className="px-6 sm:px-10 md:px-16 lg:px-24">
        <div className="mb-8 sm:mb-10 md:mb-12">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-3 sm:mb-4">
            <div>
              <h2 className="anim-fade-up font-basecoat text-lg sm:text-xl md:text-2xl font-bold uppercase text-gray-900 dark:text-gray-100 leading-tight">
                {t('home.event_title')}
              </h2>
              <div className="anim-expand-line w-24 sm:w-28 h-[2px] bg-gradient-to-r from-benin-jaune via-benin-jaune/60 to-transparent mt-3 sm:mt-4" data-delay="0.1"></div>
            </div>
            <Link
              to={lp('/commandes-personnalisees')}
              className="font-basecoat bg-benin-jaune text-black hover:bg-white hover:text-black px-4 py-4 rounded-md text-xs font-bold uppercase tracking-widest transition-all duration-300 inline-flex items-center gap-2"
            >
              {t('common.learn_more')}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">

  {/* Colonne gauche : Tags premium */}
  <div className="anim-fade-right order-2 md:order-1" data-delay="0.2">
    <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-sm mx-auto">
      {[
        { label: t('home.event_tag_mariage'), rotate: '-rotate-1' },
        { label: t('home.event_tag_baby_shower'), rotate: 'rotate-1' },
        { label: t('home.event_tag_anniv'), rotate: 'rotate-1' },
        { label: t('home.event_tag_bapt'), rotate: '-rotate-1' },
        { label: t('home.event_tag_birth'), rotate: 'rotate-1' },
        { label: t('home.event_tag_corporate'), rotate: '-rotate-1' },
      ].map((event) => (
        <div
          key={event.label}
          className={`
            ${event.rotate}
            px-4 py-3 text-sm
            text-center
            font-basecoat font-semibold
            bg-white dark:bg-gray-900
            border border-red-900/20
            text-red-900
            rounded-2xl
            shadow-sm
            hover:shadow-xl
            hover:-translate-y-1
            hover:rotate-0
            hover:scale-105
            transition-all duration-300 ease-out
            cursor-default
          `}
        >
          {event.label}
        </div>
      ))}
    </div>
  </div>

  {/* Colonne droite : Texte */}
  <div className="anim-fade-left order-1 md:order-2 text-center md:text-left" data-delay="0.3">
    <p className="font-basecoat text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 uppercase leading-relaxed max-w-xl mx-auto md:mx-0">
      {t('home.event_quote')}
    </p>
  </div>

</div>
        </div>
      </section>

    {/* ── Où nous trouver ── */}
<section
  id="ou-nous-trouver"
  className="relative w-full h-[440px] sm:h-[500px] md:h-[580px] overflow-hidden"
>
  {/* Map full background */}
  <iframe
    src="https://maps.google.com/maps?q=6.3554,2.3793&z=14&output=embed"
    className="absolute inset-0 w-full h-full"
    style={{ border: 0 }}
    allowFullScreen={true}
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    title={t('home.map_title')}
  ></iframe>

  {/* Blur sur les bords, centre net autour de Cotonou */}
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)',
      maskImage: 'radial-gradient(ellipse 45% 55% at 68% 50%, transparent 30%, black 75%)',
      WebkitMaskImage: 'radial-gradient(ellipse 45% 55% at 68% 50%, transparent 30%, black 75%)',
    }}
  />
  {/* Dégradé beige sur la gauche pour le texte */}
  <div className="absolute inset-0 bg-gradient-to-r from-[#F5F1E8] via-[#F5F1E8]/95 to-transparent pointer-events-none" />

  {/* Contenu texte */}
  <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-10 md:px-16 lg:px-24">
    <div className="max-w-xl">
      <h2 className="anim-fade-up font-basecoat text-lg sm:text-xl md:text-2xl font-bold uppercase text-gray-900 dark:text-gray-100 leading-snug md:leading-tight">
        {t('home.location_title')}
      </h2>

      <div
        className="anim-expand-line w-24 sm:w-28 h-[2px] bg-gradient-to-r from-benin-jaune via-benin-jaune/60 to-transparent mt-3 sm:mt-4"
        data-delay="0.1"
      ></div>

      <p
        className="anim-fade-up mt-4 mb-8 sm:mb-10 font-basecoat text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line"
        data-delay="0.2"
      >
        {t('home.location_desc')}
      </p>

      <p className="anim-fade-up" data-delay="0.3">
        <a
          href="https://wa.me/2290162007580"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 font-basecoat font-semibold text-sm sm:text-base text-benin-jaune hover:text-benin-terre transition-colors duration-200"
        >
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
          </svg>
          +229 01 62 00 75 80
        </a>
      </p>
    </div>
  </div>
</section>

    </div>
  );
}
