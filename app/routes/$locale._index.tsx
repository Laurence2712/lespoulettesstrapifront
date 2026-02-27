import { Link, useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { apiEndpoints, getImageUrl } from '../config/api';
import { useScrollAnimations, useParallaxHero } from '../hooks/useScrollAnimations';
import { useTranslation } from 'react-i18next';
import { useLocalePath } from '../hooks/useLocalePath';

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
    const [homepageRes, realisationsRes, actualitesRes] = await Promise.all([
      fetchWithTimeout(endpoints.homepages, 8000),
      fetchWithTimeout(endpoints.realisations, 8000),
      fetchWithTimeout(endpoints.latestActualite, 8000),
    ]);

    let homepageData: HomepageData | null = null;
    let realisations: Realisation[] = [];
    let actualites: Actualite[] = [];

    if (homepageRes?.ok) {
      const data = await homepageRes.json();
      if (data?.data?.length) {
        const homepage = data.data[0];
        const bannerImageUrl = homepage.banner_image?.formats?.large?.url
          ? getImageUrl(homepage.banner_image.formats.large.url)
          : homepage.banner_image?.url
            ? getImageUrl(homepage.banner_image.url)
            : '';
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
          image_url: realisation.ImagePrincipale?.url
            ? getImageUrl(realisation.ImagePrincipale.url)
            : realisation.Images?.[0]?.url
              ? getImageUrl(realisation.Images[0].url)
              : undefined,
          description: realisation.Description || 'Description indisponible',
          prix: realisation.Prix,
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
          image_url: item.image?.formats?.large?.url
            ? getImageUrl(item.image.formats.large.url)
            : item.image?.url
              ? getImageUrl(item.image.url)
              : '',
        }));
      }
    }

    const responseHeaders = new Headers();
    if (heroImageUrl) {
      responseHeaders.set('Link', `<${heroImageUrl}>; rel=preload; as=image`);
    }
    responseHeaders.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60');

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

export default function Index() {
  const { homepageData, realisations, actualites, locale } = useLoaderData<LoaderData>();
  const { t } = useTranslation();
  const lp = useLocalePath();

  const heroRef = useParallaxHero();
  const scrollRef = useScrollAnimations([]);

  const featured = realisations.slice(0, 4);

  return (
    <div className="overflow-x-hidden" ref={scrollRef}>

      {/* ── Hero Banner ── */}
      <header
        ref={heroRef}
        className="banner relative bg-cover bg-center h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[100vh] flex flex-col justify-center items-center text-white p-4 sm:p-6 md:p-8 pt-20 sm:pt-24"
        style={{ backgroundImage: `url(${homepageData?.image_url || '/images/banner-default.jpg'})` }}
      >
        <div className="banner-content text-center z-10 flex flex-col items-center justify-center pb-8 sm:pb-12 md:pb-16">
          <h1 className="anim-fade-up font-basecoat text-xl sm:text-2xl md:text-3xl lg:text-[44px] font-bold uppercase tracking-wide mb-4 px-6 sm:px-8 md:px-12 max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%] leading-tight lg:leading-snug">
            {t('home.hero_title')}
          </h1>
          <p className="anim-fade-up font-basecoat text-base sm:text-lg md:text-xl italic text-benin-ocre mb-8 px-4 max-w-[85%] sm:max-w-[70%] text-center leading-relaxed" data-delay="0.2">
            {t('home.hero_subtitle')}
          </p>
          <div className="mt-2 sm:mt-4 anim-fade-up flex flex-col items-center gap-2 sm:gap-3" data-delay="0.3">
            <Link
              to={lp('/realisations')}
              className="font-basecoat bg-benin-jaune text-black hover:bg-black hover:text-benin-jaune px-6 py-3 rounded-md text-sm sm:text-base font-semibold uppercase tracking-wide transition-all duration-300 inline-flex items-center gap-2"
            >
              {t('home.hero_cta')}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <span className="font-basecoat text-xs text-white/60 tracking-widest uppercase">{t('home.ticker_handmade')}</span>
          </div>
        </div>
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

        {/* ── Ticker social proof (superposé sur le hero, fond transparent) ── */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-white/10 backdrop-blur-sm py-3 overflow-hidden select-none">
          <div className="animate-ticker flex whitespace-nowrap w-max">
            {[0, 1].map((copy) => (
              <span key={copy} className="inline-flex items-center">
                {[
                  { icon: '', label: t('home.ticker_handmade') },
                  { icon: '', label: 'Handmade with love' },
                  { icon: '', label: t('home.ticker_eco') },
                  { icon: '', label: t('home.ticker_shipping') },
                  { icon: '', label: 'Color up your day' },
                  { icon: '', label: t('home.ticker_wax') },
                  { icon: '', label: t('home.ticker_artisan') },
                  { icon: '', label: 'Made in Bénin with love' },
                ].map((item) => (
                  <span key={`${copy}-${item.label}`} className="inline-flex items-center gap-2 font-basecoat font-bold text-white text-xs sm:text-sm md:text-base px-6 sm:px-10">
                    <span className="text-base sm:text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                    <span className="ml-6 sm:ml-10 text-white/40 text-xs">◆</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </header>


      {/* ── Nouveaux arrivages ── */}
      <section id="nouveaux-arrivages" className="px-4 sm:px-6 md:px-[60px] lg:px-[120px] py-10 sm:py-14 md:py-[70px] bg-white">
        <div className="mb-8 sm:mb-10 md:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-3 sm:mb-4">
            <div>
              <h2 className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-[44px] font-bold uppercase text-gray-900">
                {t('home.new_creations')}
              </h2>
              <div className="anim-expand-line w-24 sm:w-28 h-[2px] bg-gradient-to-r from-benin-jaune via-benin-jaune/60 to-transparent mt-3 sm:mt-4" data-delay="0.1"></div>
            </div>
            <Link
              to={lp('/realisations')}
              className="anim-fade-up font-basecoat bg-benin-jaune text-black hover:bg-black hover:text-benin-jaune px-6 py-3 rounded-md text-sm sm:text-base font-semibold uppercase tracking-wide transition-all duration-300 inline-flex items-center gap-2"
              data-delay="0.1"
            >
              {t('home.see_all_shop')}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <p className="anim-fade-up font-basecoat text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed mt-4 mb-8 sm:mb-10" data-delay="0.15">
            {t('home.new_creations_sub')}
          </p>
        </div>

        {featured.length > 0 ? (
          <>
            <div className="anim-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6" data-stagger="0.1">
              {featured.map((realisation) => (
                <Link key={realisation.id} to={lp(`/realisations/${realisation.id}`)} className="group">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 h-full flex flex-col">
                    <div className="relative overflow-hidden aspect-square">
                      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                        <span className="font-basecoat text-[10px] font-bold uppercase tracking-wide bg-benin-jaune text-black px-2 py-0.5 rounded-full">{t('home.badge_handmade')}</span>
                        <span className="font-basecoat text-[10px] font-bold uppercase tracking-wide bg-gray-800 text-white px-2 py-0.5 rounded-full">{t('home.badge_benin')}</span>
                      </div>
                      {realisation.image_url ? (
                        <img
                          src={realisation.image_url}
                          alt={realisation.title}
                          loading="lazy"
                          width={500}
                          height={500}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="font-basecoat text-gray-400 text-sm">{t('home.no_image')}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-1 justify-between">
                      <div>
                        <div className="flex items-baseline justify-between gap-2 mb-3">
                          <h3 className="font-basecoat font-semibold text-gray-900 text-base leading-snug">
                            {realisation.title}
                          </h3>
                          {realisation.prix && (
                            <p className="font-basecoat text-xl font-bold text-benin-jaune whitespace-nowrap flex-shrink-0">
                              {Number(realisation.prix).toFixed(2)} €
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="font-basecoat text-sm font-semibold text-benin-jaune group-hover:text-benin-terre flex items-center gap-1 transition">
                        {t('home.view_product')}
                        <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="anim-fade-up text-center mt-10 sm:mt-12" data-delay="0.3">
              <Link
                to={lp('/realisations')}
                className="font-basecoat bg-benin-jaune text-black hover:bg-black hover:text-benin-jaune px-6 py-3 rounded-md text-sm sm:text-base font-semibold uppercase tracking-wide transition-all duration-300 inline-flex items-center gap-2"
              >
                {t('home.see_all_shop_full')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-400 font-basecoat">{t('home.no_products')}</p>
        )}
      </section>

      {/* ── Qui sommes-nous ── */}
      <section id="qui-sommes-nous" className="px-4 sm:px-6 md:px-[60px] lg:px-[120px] py-6 sm:py-8 md:py-[60px] bg-beige">
        <div className="mb-8 sm:mb-10 md:mb-12">
          <h2 className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-[44px] font-bold uppercase text-gray-900">
            {t('about.title')}
          </h2>
          <div className="anim-expand-line w-24 sm:w-28 h-[2px] bg-gradient-to-r from-benin-jaune via-benin-jaune/60 to-transparent mt-3 sm:mt-4 mb-8 sm:mb-10 md:mb-12" data-delay="0.1"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 items-center">
            <div className="order-2 md:order-1 anim-fade-right" data-delay="0.2">
              <p className="font-basecoat text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
                {t('home.about_p1')}
              </p>
              <p className="font-basecoat text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed mt-4">
                {t('home.about_p2')}
              </p>
              <div className="mt-6">
                <Link
                  to={lp('/qui-sommes-nous')}
                  className="font-basecoat bg-benin-jaune text-black hover:bg-black hover:text-benin-jaune px-6 py-3 rounded-md text-sm sm:text-base font-semibold uppercase tracking-wide transition-all duration-300 inline-flex items-center gap-2"
                >
                  {t('home.atelier_cta')}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="order-1 md:order-2 flex justify-center items-center anim-scale" data-delay="0.3">
              <div className="relative w-full max-w-sm mx-auto">
                <div className="shimmer-border-wrapper shadow-2xl">
                  <div className="shimmer-inner aspect-square overflow-hidden">
                    <img src="/assets/equipe-1.jpg" alt="Fondatrice 1" loading="lazy" width={400} height={400} className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Dans notre atelier ── */}
      <section id="notre-atelier" className="bg-white px-4 sm:px-6 md:px-[60px] lg:px-[120px] py-10 sm:py-14 md:py-[70px]">
        <div className="max-w-5xl mx-auto bg-beige rounded-3xl shadow-lg p-8 sm:p-10 md:p-14">
          <h2 className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-[44px] font-bold uppercase text-gray-900">
            {t('home.atelier_title')}
          </h2>
          <div className="anim-expand-line w-24 sm:w-28 h-[2px] bg-gradient-to-r from-benin-jaune via-benin-jaune/60 to-transparent mt-3 sm:mt-4 mb-6 sm:mb-8" data-delay="0.1"></div>
          <p className="anim-fade-up font-basecoat text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed mb-10 sm:mb-12" data-delay="0.15">
            {t('home.atelier_sub')}
          </p>
          <div className="anim-stagger grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6" data-stagger="0.1">
            <div className="bg-white rounded-2xl shadow-sm border-t-4 border-benin-jaune min-h-[180px] p-6">
              <p className="font-basecoat text-3xl mb-3">✂️</p>
              <h3 className="font-basecoat text-base font-bold uppercase text-gray-900 mb-2">{t('home.atelier_item1_title')}</h3>
              <p className="font-basecoat text-sm text-gray-700 leading-relaxed">{t('home.atelier_item1_desc')}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border-t-4 border-benin-jaune min-h-[180px] p-6">
              <p className="font-basecoat text-3xl mb-3">🌿</p>
              <h3 className="font-basecoat text-base font-bold uppercase text-gray-900 mb-2">{t('home.atelier_item2_title')}</h3>
              <p className="font-basecoat text-sm text-gray-700 leading-relaxed">{t('home.atelier_item2_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Actualités ── */}
      <section className="bg-beige">
        <div className="px-4 sm:px-6 md:px-[60px] lg:px-[120px] pt-6 sm:pt-8 md:pt-[60px] pb-8 sm:pb-10 md:pb-12">
          <h2 className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-[44px] font-bold uppercase text-gray-900">
            {t('news.title')}
          </h2>
          <div className="anim-expand-line w-24 sm:w-28 h-[2px] bg-gradient-to-r from-benin-jaune via-benin-jaune/60 to-transparent mt-3 sm:mt-4" data-delay="0.1"></div>
        </div>

        {actualites.length > 0 ? (
          actualites.map((actu, idx) => (
            <div key={actu.id}>
              <div className="px-4 sm:px-6 md:px-[60px] lg:px-[120px] py-8 sm:py-10 md:py-14">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 items-center">
                  {actu.image_url && (
                    <div className="anim-fade-right rounded-2xl overflow-hidden shadow-xl" data-delay="0.2">
                      <img
                        src={actu.image_url}
                        alt={actu.title}
                        loading="lazy"
                        width={800}
                        height={400}
                        className="w-full h-72 sm:h-80 md:h-96 lg:h-[480px] object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                  )}
                  <div className={`anim-fade-left ${!actu.image_url ? 'lg:col-span-2' : ''}`} data-delay="0.3">
                    {actu.date && (
                      <p className="font-basecoat text-sm text-benin-jaune font-semibold mb-3 tracking-wider uppercase">
                        {new Date(actu.date).toLocaleDateString(locale === 'en' ? 'en-GB' : 'fr-FR', { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    )}
                    <h3 className="font-basecoat text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-5 leading-tight">
                      {actu.title}
                    </h3>
                    <p className="mb-6 sm:mb-8 font-basecoat text-gray-700 text-base sm:text-lg md:text-xl whitespace-pre-line leading-relaxed">
                      {actu.content}
                    </p>
                    <Link
                      to={lp('/actualites')}
                      className="font-basecoat bg-benin-jaune text-black hover:bg-black hover:text-benin-jaune px-6 py-3 rounded-md text-sm sm:text-base font-semibold uppercase tracking-wide transition-all duration-300 inline-flex items-center gap-2"
                    >
                      {t('home.see_all_news')}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-4 sm:px-6 md:px-[60px] lg:px-[120px] pb-10">
            <p className="text-center text-gray-500 text-base sm:text-lg font-basecoat">{t('home.no_news')}</p>
          </div>
        )}
      </section>

      {/* ── Commandes personnalisées ── */}
      <section className="px-4 sm:px-6 md:px-[60px] lg:px-[120px] py-10 sm:py-14 md:py-[70px] bg-white">
        <div className="mb-8 sm:mb-10 md:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-3 sm:mb-4">
            <div>
              <h2 className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-[40px] font-bold uppercase text-gray-900 leading-tight">
                {t('home.event_title')}
              </h2>
              <div className="anim-expand-line w-24 sm:w-28 h-[2px] bg-gradient-to-r from-benin-jaune via-benin-jaune/60 to-transparent mt-3 sm:mt-4" data-delay="0.1"></div>
            </div>
            <Link
              to={lp('/commandes-personnalisees')}
              className="anim-fade-up font-basecoat bg-benin-jaune text-black hover:bg-black hover:text-benin-jaune px-6 py-3 rounded-md text-sm sm:text-base font-semibold uppercase tracking-wide transition-all duration-300 inline-flex items-center gap-2"
              data-delay="0.1"
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
    <div className="flex flex-wrap justify-center items-start gap-4 max-w-md mx-auto">

      {[
        { label: t('home.event_tag_mariage'), size: 'large' as const, rotate: '-rotate-2' },
        { label: t('home.event_tag_baby_shower'), size: 'medium' as const, rotate: 'rotate-2' },
        { label: t('home.event_tag_anniv'), size: 'large' as const, rotate: 'rotate-1' },
        { label: t('home.event_tag_bapt'), size: 'small' as const, rotate: '-rotate-3' },
        { label: t('home.event_tag_birth'), size: 'medium' as const, rotate: 'rotate-3' },
        { label: t('home.event_tag_corporate'), size: 'small' as const, rotate: '-rotate-1' },
      ].map((event) => {
        const sizeClasses = {
          small: 'px-4 py-2 text-xs',
          medium: 'px-5 py-2.5 text-sm',
          large: 'px-6 py-3 text-base'
        };

        return (
          <div
            key={event.label}
            className={`
              ${sizeClasses[event.size]}
              ${event.rotate}
              font-basecoat font-semibold
              bg-white
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
        );
      })}

    </div>
  </div>

  {/* Colonne droite : Texte */}
  <div className="anim-fade-left order-1 md:order-2 text-center md:text-left" data-delay="0.3">
    <p className="font-basecoat text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed max-w-xl mx-auto md:mx-0">
      {t('home.event_sub')}
    </p>
  </div>

</div>

<p className="mt-16 sm:mt-10 md:mt-12 font-basecoat max-w-[90%] sm:max-w-[80%] md:max-w-[70%] font-bold lg:max-w-[50%] mx-auto text-center text-base sm:text-lg text-benin-jaune uppercase leading-relaxed">
  {t('home.event_quote')}
</p>
      </section>

      {/* ── Où nous trouver ── */}
      <section id="ou-nous-trouver" className="relative w-full h-[440px] sm:h-[500px] md:h-[540px] overflow-hidden">

        {/* Map — fond plein écran */}
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10000!2d2.3100!3d6.3650!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sfr!2sbe!4v1706000000000!5m2!1sfr!2sbe"
          className="absolute inset-0 w-full h-full"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={t('home.map_title')}
        ></iframe>

        {/* Mobile : dégradé beige haut → transparent bas */}
        <div
          className="md:hidden absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, #F5F1E8 42%, rgba(245,241,232,0.88) 62%, transparent 100%)' }}
        />

        {/*
          Desktop : forme organique africaine
          Bords ondulés inspirés des contours de calebasse et tissus wax.
          Dégradé beige solide à gauche → transparent à droite, épousant la forme.
          viewBox 0 0 100 100 = % directs de la section (preserveAspectRatio="none")
        */}
        <svg
          className="hidden md:block absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="beige-africa" x1="0" y1="0" x2="70" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="#F5F1E8" stopOpacity="1"/>
              <stop offset="58%"  stopColor="#F5F1E8" stopOpacity="1"/>
              <stop offset="100%" stopColor="#F5F1E8" stopOpacity="0"/>
            </linearGradient>
          </defs>
          {/* Contour organique : gonfle et se creuse comme une calebasse */}
          <path
            d="M 0,0
               L 50,0
               C 56,0 62,8 60,15
               C 58,22 50,25 52,33
               C 54,40 63,45 60,52
               C 57,58 48,62 50,70
               C 52,77 62,82 58,90
               C 55,96 60,100 54,100
               L 0,100 Z"
            fill="url(#beige-africa)"
          />
        </svg>

        {/* Contenu texte */}
        <div className="relative z-10 h-full flex flex-col justify-start md:justify-center pt-8 sm:pt-10 md:pt-0 px-4 sm:px-6 md:px-[60px] lg:px-[120px]">
          <div className="max-w-xl mx-auto md:mx-0">
            <h2 className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-[44px] font-bold uppercase text-gray-900 leading-snug md:leading-tight">
              {t('home.location_title')}
            </h2>
            <div className="anim-expand-line w-24 sm:w-28 h-[2px] bg-gradient-to-r from-benin-jaune via-benin-jaune/60 to-transparent mt-3 sm:mt-4" data-delay="0.1"></div>
            <p className="anim-fade-up mt-5 mb-5 font-basecoat text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed whitespace-pre-line" data-delay="0.2">
              {t('home.location_desc')}
            </p>
            <p className="anim-fade-up" data-delay="0.3">
              <a
                href="https://wa.me/2290162007580"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 font-basecoat font-semibold text-sm sm:text-base text-benin-jaune hover:text-benin-terre transition-colors duration-200"
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
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
