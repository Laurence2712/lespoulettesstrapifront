import { useState } from 'react';
import { Link } from '@remix-run/react';
import { useScrollAnimations } from '../hooks/useScrollAnimations';
import { useLocalePath } from '../hooks/useLocalePath';
import { useTranslation } from 'react-i18next';

export function meta() {
  return [
    { title: "Commandes personnalisées — Les Poulettes" },
    {
      name: "description",
      content:
        "Les Poulettes créent des accessoires wax sur mesure pour vos événements : mariage, baby shower, anniversaire, baptême, communion. Cadeaux personnalisés faits main au Bénin.",
    },
    { property: "og:title", content: "Commandes personnalisées — Les Poulettes" },
    {
      property: "og:description",
      content: "Accessoires wax sur mesure pour tous vos événements. Mariage, baby shower, anniversaire... Commandez des cadeaux uniques faits main au Bénin.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://lespoulettes.be/commandes-personnalisees" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Commandes personnalisées — Les Poulettes" },
  ];
}

export default function CommandesPersonnalisees() {
  const scrollRef = useScrollAnimations([]);
  const lp = useLocalePath();
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const STEPS = [
    { num: '01', title: t('custom.step1_title_short'), desc: t('custom.step1_desc_detail'), color: 'bg-wax-turquoise' },
    { num: '02', title: t('custom.step2_title_short'), desc: t('custom.step2_desc_detail'), color: 'bg-wax-yellow' },
    { num: '03', title: t('custom.step3_title_short'), desc: t('custom.step3_desc_detail'), color: 'bg-wax-orange' },
    { num: '04', title: t('custom.step4_title_short'), desc: t('custom.step4_desc_detail'), color: 'bg-wax-green' },
  ];

  const INFOS = [
    { title: t('custom.delay'), content: t('custom.delay_desc') },
    { title: t('custom.min_qty'), content: t('custom.min_qty_desc') },
    { title: t('custom.fabrics_title'), content: t('custom.fabrics_desc') },
    { title: t('custom.price_title'), content: t('custom.price_desc') },
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div ref={scrollRef} className="overflow-x-hidden">

      {/* ── Hero ── */}
      <header className="bg-beige pt-28 sm:pt-32 md:pt-40 pb-14 sm:pb-18 md:pb-24 px-4 sm:px-6 md:px-[60px] lg:px-[120px]">
        <nav className="anim-fade-up font-basecoat mb-8 text-xs sm:text-sm">
          <Link to={lp("/")} className="text-benin-jaune hover:text-benin-terre font-medium transition">{t('common.home')}</Link>
          <span className="mx-1.5 text-gray-400">/</span>
          <span className="text-gray-600">{t('custom.breadcrumb')}</span>
        </nav>
        <div className="max-w-3xl">
          <h1 className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-[40px] font-bold uppercase text-gray-900">
            {t('custom.title')}
          </h1>
          <div className="anim-expand-line w-24 sm:w-28 h-[2px] bg-gradient-to-r from-benin-jaune via-benin-jaune/60 to-transparent mt-4 mb-6" data-delay="0.1"></div>
          <p className="anim-fade-up font-basecoat text-lg sm:text-xl md:text-2xl text-gray-700 leading-relaxed" data-delay="0.2">
            {t('custom.hero_subtitle')}
          </p>
        </div>
      </header>

      {/* ── Comment ça marche ── */}
      <section className="bg-white px-4 sm:px-6 md:px-[60px] lg:px-[120px] py-14 sm:py-18 md:py-24">
        <div className="mb-12">
          <h2 className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-[40px] font-bold uppercase text-gray-900">
            {t('custom.how_title')}
          </h2>
          <div className="anim-expand-line w-24 sm:w-28 h-[2px] bg-gradient-to-r from-benin-jaune via-benin-jaune/60 to-transparent mt-4 mb-6" data-delay="0.1"></div>
          <p className="anim-fade-up font-basecoat text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed max-w-xl" data-delay="0.15">
            {t('custom.how_subtitle')}
          </p>
        </div>
        <div className="anim-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-stagger="0.12">
          {STEPS.map((step) => (
            <div key={step.num} className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#b22a44]/40 shadow-md hover:shadow-2xl hover:-translate-y-2 hover:-rotate-1 transition-all duration-300 ease-out cursor-default">
              <div className="flex items-center gap-3 mb-5">
                <span className="font-basecoat text-3xl font-bold text-[#b22a44]/50 leading-none transition-colors duration-300 group-hover:text-[#b22a44]">{step.num}</span>
                <div className="h-px flex-1 bg-gray-100 transition-colors duration-300 group-hover:bg-[#b22a44]/30"></div>
              </div>
              <h3 className="font-basecoat text-sm font-bold uppercase text-gray-900 mb-2 tracking-wide">{step.title}</h3>
              <p className="font-basecoat text-sm text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Ce qu'on peut créer ── */}
      <section className="px-4 sm:px-6 md:px-[60px] lg:px-[120px] py-14 sm:py-18 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
          <div className="anim-fade-right" data-delay="0.1">
            <h2 className="font-basecoat text-2xl sm:text-3xl md:text-[40px] font-bold uppercase text-gray-900">
              {t('custom.what_title')}
            </h2>
            <div className="anim-expand-line w-24 sm:w-28 h-[2px] bg-gradient-to-r from-benin-jaune via-benin-jaune/60 to-transparent mt-4 mb-6" data-delay="0.1"></div>
            <ul className="space-y-3 font-basecoat text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
              {[
                'Sachets et pochettes pour dragées',
                'Trousses de toilette et trousses de maquillage',
                'Sacs et tote bags personnalisés',
                'Housses pour ordinateurs et tablettes',
                'Porte-clés et petits accessoires',
                'Emballages cadeaux en tissu wax',
                'Signets et carnets recouverts de wax',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-benin-jaune/50 font-bold flex-shrink-0 mt-0.5">◆</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="font-basecoat text-sm text-gray-500 mt-5 italic">
              {t('custom.more_ideas')}
            </p>
          </div>
          <div className="anim-fade-left" data-delay="0.2">
            <div className="bg-beige rounded-2xl p-8">
              <h3 className="font-basecoat text-lg font-bold uppercase text-[#b22a44] mb-6">{t('custom.useful_info')}</h3>
              <div className="space-y-3">
                {INFOS.map((info, index) => (
                  <div
                    key={info.title}
                    className={`group bg-white rounded-xl overflow-hidden shadow-sm border transition-all duration-300 hover:shadow-lg ${
                      openIndex === index
                        ? 'border-[#b22a44]/40 shadow-md'
                        : 'border-gray-100 hover:border-[#b22a44]/25'
                    }`}
                  >
                    <button
                      onClick={() => toggleAccordion(index)}
                      className={`w-full flex items-center justify-between p-4 text-left font-basecoat transition-colors duration-200 ${
                        openIndex === index ? 'bg-[#b22a44]/5' : 'hover:bg-[#b22a44]/5'
                      }`}
                    >
                      <span
                        className="font-bold text-sm uppercase transition-colors duration-300"
                        style={{ color: openIndex === index ? '#b22a44' : '' }}
                      >{info.title}</span>
                      <svg
                        className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ${
                          openIndex === index ? 'rotate-180 text-[#b22a44]' : 'text-gray-300 group-hover:text-[#b22a44]'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        openIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="px-4 pb-4 pt-1 font-basecoat text-base text-black leading-relaxed border-t border-[#b22a44]/10">
                        {info.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Contact ── */}
      <section className="bg-black px-4 sm:px-6 md:px-[60px] lg:px-[120px] py-14 sm:py-18 md:py-24 text-center">
        <h2 className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-[40px] font-bold uppercase text-white mb-4">
          {t('custom.cta_title')}
        </h2>
        <div className="anim-expand-line w-24 sm:w-28 h-[2px] bg-gradient-to-r from-benin-jaune via-benin-jaune/60 to-transparent mx-auto mt-4 mb-8" data-delay="0.1"></div>
        <p className="anim-fade-up font-basecoat text-base sm:text-lg md:text-xl text-gray-400 leading-relaxed mb-10 max-w-xl mx-auto" data-delay="0.15">
          {t('custom.cta_desc')}
        </p>
        <div className="anim-fade-up flex flex-col sm:flex-row gap-4 justify-center" data-delay="0.2">
          <a
            href="https://wa.me/2290162007580"
            target="_blank"
            rel="noopener noreferrer"
            className="font-basecoat inline-flex items-center justify-center gap-3 bg-benin-vert/100 hover:bg-benin-vert/80 text-white px-10 py-4 rounded-xl font-bold uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            {t('custom.whatsapp_cta')}
          </a>
          <Link
            to={lp("/contact")}
            className="font-basecoat bg-benin-jaune text-black hover:bg-black hover:text-benin-jaune px-6 py-3 rounded-md text-sm sm:text-base font-semibold uppercase tracking-wide transition-all duration-300 inline-flex items-center gap-2"
          >
            {t('custom.contact_form_cta')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

    </div>
  );
}
