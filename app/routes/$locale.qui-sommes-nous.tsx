import { Link } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { useScrollAnimations } from '../hooks/useScrollAnimations';
import { useLocalePath } from '../hooks/useLocalePath';

export function meta() {
  return [
    { title: "Qui sommes-nous — Les Poulettes" },
    {
      name: "description",
      content:
        "Découvrez l'histoire des Poulettes : une marque d'accessoires en wax créée en 2017, confectionnée à la main avec passion et savoir-faire.",
    },
    { property: "og:title", content: "Qui sommes-nous — Les Poulettes" },
    {
      property: "og:description",
      content: "L'histoire, les valeurs et les artisanes derrière Les Poulettes, marque d'accessoires wax fait main au Bénin.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://lespoulettes.be/qui-sommes-nous" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Qui sommes-nous — Les Poulettes" },
    { name: "twitter:description", content: "L'histoire et les valeurs des Poulettes, accessoires wax fait main au Bénin." },
  ];
}

export default function QuiSommesNous() {
  const { t } = useTranslation();
  const scrollRef = useScrollAnimations([]);
  const lp = useLocalePath();

  return (
    <div ref={scrollRef} className="overflow-x-hidden">

      {/* ── Hero ── */}
      <header className="bg-beige dark:bg-gray-900 pt-28 sm:pt-32 md:pt-40 pb-14 sm:pb-18 md:pb-24 px-4 sm:px-6 md:px-[60px] lg:px-[120px]">
        <nav className="anim-fade-up font-basecoat mb-8 text-xs sm:text-sm">
          <Link to={lp("/")} className="text-benin-jaune hover:text-benin-terre font-medium transition">{t('common.home')}</Link>
          <span className="mx-1.5 text-gray-400 dark:text-gray-500">{t('common.breadcrumb_sep')}</span>
          <span className="text-gray-600 dark:text-gray-400 dark:text-gray-500">{t('about.breadcrumb')}</span>
        </nav>
        <div className="max-w-3xl">
          <h1 className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-[40px] font-bold uppercase text-gray-900 dark:text-gray-100 mb-2">
            {t('about.hero_title')}
          </h1>
          <div className="anim-expand-line w-24 sm:w-28 h-[2px] bg-gradient-to-r from-benin-jaune via-benin-jaune/60 to-transparent mt-4 mb-6" data-delay="0.1"></div>
          <p className="anim-fade-up font-basecoat text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed" data-delay="0.2">
            {t('about.hero_subtitle')}
          </p>
        </div>
      </header>


      {/* ── Notre histoire ── */}
      <section className="bg-white dark:bg-gray-950 px-4 sm:px-6 md:px-[60px] lg:px-[120px] py-14 sm:py-18 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="anim-fade-right order-2 md:order-1" data-delay="0.1">
            <h2 className="font-basecoat text-2xl sm:text-3xl md:text-[40px] font-bold uppercase text-gray-900 dark:text-gray-100 mb-2">
              {t('about.title')}
            </h2>
            <div className="anim-expand-line w-24 sm:w-28 h-[2px] bg-gradient-to-r from-benin-jaune via-benin-jaune/60 to-transparent mb-6"></div>
            <p className="font-basecoat text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {t('about.story_p1')}
            </p>
            <p className="font-basecoat text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {t('about.story_p2')}
            </p>
            <p className="font-basecoat text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {t('about.story_p3')}
            </p>
            <p className="font-basecoat text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {t('about.story_p4')}
            </p>
            <p className="font-basecoat text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('about.story_p5')}
            </p>
          </div>
          <div className="anim-scale order-1 md:order-2 flex justify-center" data-delay="0.2">
            <div className="relative w-full max-w-sm">
              <div className="shimmer-border-wrapper shadow-2xl">
                <div className="shimmer-inner aspect-square overflow-hidden">
                  <img
                    src="/assets/equipe-1.jpg"
                    alt={t('about.founder_alt')}
                    loading="lazy"
                    width={600}
                    height={600}
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                  />
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 z-10 bg-benin-jaune text-black dark:text-gray-100 font-basecoat text-xs font-bold uppercase px-4 py-2 rounded-xl shadow-lg">
                {t('about.since')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Nos valeurs ── */}
      <section className="bg-beige dark:bg-gray-900 px-4 sm:px-6 md:px-[60px] lg:px-[120px] py-14 sm:py-18 md:py-24">
        <div className="mb-12">
          <h2 className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-[40px] font-bold uppercase text-gray-900 dark:text-gray-100">
            {t('about.values_title')}
          </h2>
          <div className="anim-expand-line w-24 sm:w-28 h-[2px] bg-gradient-to-r from-benin-jaune via-benin-jaune/60 to-transparent mt-4" data-delay="0.1"></div>
        </div>
        <div className="anim-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-stagger="0.1">
          <div className="valeurs-card bg-white dark:bg-gray-900 rounded-2xl p-7 group">
            <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl inline-block transition-transform duration-300 group-hover:scale-110">✂️</span>
            </div>
            <h3 className="font-basecoat text-lg font-bold uppercase text-gray-900 dark:text-gray-100 mb-3">{t('about.val1_title')}</h3>
            <p className="font-basecoat text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 leading-relaxed">{t('about.val1_desc')}</p>
          </div>
          <div className="valeurs-card bg-white dark:bg-gray-900 rounded-2xl p-7 group">
            <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl inline-block transition-transform duration-300 group-hover:scale-110">🌿</span>
            </div>
            <h3 className="font-basecoat text-lg font-bold uppercase text-gray-900 dark:text-gray-100 mb-3">{t('about.val2_title')}</h3>
            <p className="font-basecoat text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 leading-relaxed">{t('about.val2_desc')}</p>
          </div>
          <div className="valeurs-card bg-white dark:bg-gray-900 rounded-2xl p-7 group">
            <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl inline-block transition-transform duration-300 group-hover:scale-110">🤝</span>
            </div>
            <h3 className="font-basecoat text-lg font-bold uppercase text-gray-900 dark:text-gray-100 mb-3">{t('about.val3_title')}</h3>
            <p className="font-basecoat text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 leading-relaxed">{t('about.val3_desc')}</p>
          </div>
          <div className="valeurs-card bg-white dark:bg-gray-900 rounded-2xl p-7 group">
            <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl inline-block transition-transform duration-300 group-hover:scale-110">🌍</span>
            </div>
            <h3 className="font-basecoat text-lg font-bold uppercase text-gray-900 dark:text-gray-100 mb-3">{t('about.val4_title')}</h3>
            <p className="font-basecoat text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 leading-relaxed">{t('about.val4_desc')}</p>
          </div>
          <div className="valeurs-card bg-white dark:bg-gray-900 rounded-2xl p-7 group">
            <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl inline-block transition-transform duration-300 group-hover:scale-110">🎨</span>
            </div>
            <h3 className="font-basecoat text-lg font-bold uppercase text-gray-900 dark:text-gray-100 mb-3">{t('about.val5_title')}</h3>
            <p className="font-basecoat text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 leading-relaxed">{t('about.val5_desc')}</p>
          </div>
          <div className="valeurs-card bg-white dark:bg-gray-900 rounded-2xl p-7 group">
            <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl inline-block transition-transform duration-300 group-hover:scale-110">💛</span>
            </div>
            <h3 className="font-basecoat text-lg font-bold uppercase text-gray-900 dark:text-gray-100 mb-3">{t('about.val6_title')}</h3>
            <p className="font-basecoat text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 leading-relaxed">{t('about.val6_desc')}</p>
          </div>
        </div>
      </section>

      {/* ── Dans notre atelier ── */}
      <section className="bg-white dark:bg-gray-950 px-4 sm:px-6 md:px-[60px] lg:px-[120px] py-14 sm:py-18 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="anim-fade-right" data-delay="0.1">
            <h2 className="font-basecoat text-2xl sm:text-3xl md:text-[40px] font-bold uppercase text-gray-900 dark:text-gray-100 mb-2">
              {t('home.atelier_title')}
            </h2>
            <div className="anim-expand-line w-24 sm:w-28 h-[2px] bg-gradient-to-r from-benin-jaune via-benin-jaune/60 to-transparent mb-6"></div>
            <p className="font-basecoat text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {t('about.atelier_p1')}
            </p>
            <p className="font-basecoat text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              {t('about.atelier_p2')}
            </p>
            <p className="font-basecoat text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
              {t('about.atelier_p3')}
            </p>
          </div>
          <div className="anim-fade-left grid grid-cols-2 gap-3" data-delay="0.2">

          </div>
        </div>
      </section>

      {/* ── Impact social ── */}
      <section className="bg-beige dark:bg-gray-900 px-4 sm:px-6 md:px-[60px] lg:px-[120px] py-14 sm:py-18 md:py-24">
        <div className="mb-12">
          <h2 className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-[40px] font-bold uppercase text-gray-900 dark:text-gray-100">
            {t('about.impact_title')}
          </h2>
          <div className="anim-expand-line w-24 sm:w-28 h-[2px] bg-gradient-to-r from-benin-jaune via-benin-jaune/60 to-transparent mt-4 mb-6" data-delay="0.1"></div>
          <p className="anim-fade-up font-basecoat text-gray-700 dark:text-gray-300 text-base sm:text-lg max-w-2xl md:text-xl leading-relaxed mb-4" data-delay="0.15">
            {t('about.impact_sub')}
          </p>
        </div>
        <div className="anim-stagger grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto" data-stagger="0.12">
          <div className="text-center bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 hover:rotate-1 transition-all duration-300 ease-out group cursor-default">
            <p className="font-basecoat text-4xl sm:text-5xl font-bold text-[#b22a44] mb-2 inline-block transition-transform duration-300 group-hover:scale-110">100%</p>
            <p className="font-basecoat text-sm font-semibold uppercase text-gray-700 dark:text-gray-300">{t('about.impact_stat1')}</p>
          </div>
          <div className="text-center bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 hover:-rotate-1 transition-all duration-300 ease-out group cursor-default">
            <p className="font-basecoat text-4xl sm:text-5xl font-bold text-[#b22a44] mb-2 inline-block transition-transform duration-300 group-hover:scale-110">0</p>
            <p className="font-basecoat text-sm font-semibold uppercase text-gray-700 dark:text-gray-300">{t('about.impact_stat2')}</p>
          </div>
          <div className="text-center bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 hover:rotate-2 transition-all duration-300 ease-out group cursor-default">
            <p className="font-basecoat text-4xl sm:text-5xl font-bold text-[#b22a44] mb-2 inline-block transition-transform duration-300 group-hover:scale-125">♥</p>
            <p className="font-basecoat text-sm font-semibold uppercase text-gray-700 dark:text-gray-300">{t('about.impact_stat3')}</p>
          </div>
        </div>
      </section>

      {/* ── CTAs ── */}
      <section className="bg-black px-4 sm:px-6 md:px-[60px] lg:px-[120px] py-14 sm:py-18 md:py-24 text-center">
        <h2 className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-[40px] font-bold uppercase text-white mb-4">
          {t('about.cta_title')}
        </h2>
        <div className="anim-expand-line w-24 sm:w-28 h-[2px] bg-gradient-to-r from-benin-jaune via-benin-jaune/60 to-transparent mx-auto mt-4 mb-8" data-delay="0.1"></div>
        <p className="anim-fade-up font-basecoat text-gray-400 dark:text-gray-500 text-base sm:text-lg mb-10 max-w-xl mx-auto" data-delay="0.15">
          {t('about.cta_sub')}
        </p>
        <div className="anim-fade-up flex flex-col sm:flex-row gap-4 justify-center" data-delay="0.2">
          <Link
            to={lp("/realisations")}
            className="font-basecoat bg-benin-jaune text-black dark:text-gray-100 hover:bg-black hover:text-benin-jaune px-6 py-3 rounded-md text-sm sm:text-base font-semibold uppercase tracking-wide transition-all duration-300 inline-flex items-center gap-2"
          >
            {t('about.cta_shop')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            to={lp("/commandes-personnalisees")}
            className="font-basecoat bg-benin-jaune text-black dark:text-gray-100 hover:bg-black hover:text-benin-jaune px-6 py-3 rounded-md text-sm sm:text-base font-semibold uppercase tracking-wide transition-all duration-300 inline-flex items-center gap-2"
          >
            {t('about.cta_custom')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

    </div>
  );
}
