import { useState } from "react";
import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { apiEndpoints, getImageUrl } from "../config/api";
import { useScrollAnimations } from "../hooks/useScrollAnimations";
import { useTranslation } from "react-i18next";
import { useLocalePath } from "../hooks/useLocalePath";

export function meta() {
  return [
    { title: "Actualités — Les Poulettes" },
    {
      name: "description",
      content:
        "Nouvelles collections, coulisses de l'atelier, événements et inspirations wax — suivez toute l'actualité des Poulettes.",
    },
    { property: "og:title", content: "Actualités — Les Poulettes" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://lespoulettes.be/actualites" },
    { tagName: "link", rel: "canonical", href: "https://lespoulettes.be/fr/actualites" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Actualités — Les Poulettes" },
  ];
}

interface Actualite {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  date?: string;
}

interface LoaderData {
  actualites: Actualite[];
  error: string | null;
}

export async function loader({ params }: LoaderFunctionArgs) {
  const locale = params.locale ?? 'fr';
  try {
    const response = await fetch(apiEndpoints(locale).actualites);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    if (data?.data) {
      const actualites: Actualite[] = data.data.map((item: any) => ({
        id: item.id,
        title: item.Title || 'Titre indisponible',
        content: item.content || '',
        image_url: item.image?.formats?.large?.url
          ? getImageUrl(item.image.formats.large.url)
          : item.image?.url
          ? getImageUrl(item.image.url)
          : '',
        date: item.date || '',
      }));
      return json<LoaderData>({ actualites, error: null });
    }
    return json<LoaderData>({ actualites: [], error: null });
  } catch (err: any) {
    return json<LoaderData>({ actualites: [], error: "Erreur lors du chargement des actualités" });
  }
}

export default function ActualitesPage() {
  const { actualites, error } = useLoaderData<LoaderData>();
  const { t } = useTranslation();
  const lp = useLocalePath();
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const scrollRef = useScrollAnimations([sortOrder]);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  // Upcoming: future dates only (agenda)
  const upcomingEvents = [...actualites]
    .filter((a) => a.date && new Date(a.date) > todayEnd)
    .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime());

  // Published: date has arrived or no date
  const visibleActualites = actualites.filter(
    (a) => !a.date || new Date(a.date) <= todayEnd
  );

  const sortedActualites = [...visibleActualites].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: "https://lespoulettes.be" },
      { "@type": "ListItem", position: 2, name: "Actualités", item: "https://lespoulettes.be/fr/actualites" },
    ],
  };

  return (
    <div ref={scrollRef} className="mt-16 sm:mt-20 md:mt-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Header */}
      <div className="pt-5 pb-4 sm:pt-8 sm:pb-6 md:py-[60px] px-4 sm:px-10 md:px-16 lg:px-24">
        {/* Breadcrumb */}
        <nav className="anim-fade-up font-basecoat mb-4 sm:mb-6 text-xs">
          <Link to={lp('/')} className="text-benin-jaune hover:text-benin-terre font-medium transition">
            {t('common.home')}
          </Link>
          <span className="mx-1.5 text-gray-400 dark:text-gray-500">/</span>
          <span className="text-gray-600 dark:text-gray-400">{t('news.breadcrumb')}</span>
        </nav>

        {/* Titre + Tri pills */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1
              className="anim-fade-up font-basecoat text-lg sm:text-xl md:text-2xl font-bold uppercase text-gray-900 dark:text-gray-100"
              data-delay="0.1"
            >
              {t('news.title')}
            </h1>
            <div
              className="anim-expand-line w-20 sm:w-28 h-[2px] bg-gradient-to-r from-benin-jaune via-benin-jaune/60 to-transparent mt-3"
              data-delay="0.15"
            />
          </div>
          <div className="anim-fade-up flex items-center gap-2 flex-shrink-0" data-delay="0.2">
            <button
              onClick={() => setSortOrder('desc')}
              className={`font-basecoat text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 ${
                sortOrder === 'desc'
                  ? 'bg-benin-jaune text-black shadow-md'
                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 shadow-sm hover:shadow-md'
              }`}
            >
              {t('news.sort_recent_short')}
            </button>
            <button
              onClick={() => setSortOrder('asc')}
              className={`font-basecoat text-xs font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 ${
                sortOrder === 'asc'
                  ? 'bg-benin-jaune text-black shadow-md'
                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 shadow-sm hover:shadow-md'
              }`}
            >
              {t('news.sort_oldest_short')}
            </button>
          </div>
        </div>
      </div>

      {/* Agenda — événements à venir */}
      {upcomingEvents.length > 0 && (
        <div className="px-4 sm:px-10 md:px-16 lg:px-24 pb-6">
          <div className="anim-fade-up bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden w-full" data-delay="0.25">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <svg className="w-4 h-4 text-benin-jaune flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-basecoat font-bold text-xs uppercase tracking-widest text-gray-900 dark:text-gray-100">
                {t('news.upcoming_events')}
              </span>
            </div>
            <ul>
              {upcomingEvents.map((ev, i) => {
                const d = new Date(ev.date!);
                const day = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long' });
                return (
                  <li key={ev.id} className={`flex items-center gap-4 px-6 py-4 ${i < upcomingEvents.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''}`}>
                    <span className="font-basecoat text-sm font-semibold text-benin-jaune w-28 flex-shrink-0 capitalize">{day}</span>
                    <span className="w-px h-4 bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
                    <span className="font-basecoat text-sm text-gray-800 dark:text-gray-200 font-medium">{ev.title}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center justify-center py-20">
          <p className="font-basecoat text-benin-rouge text-center text-lg">{error}</p>
        </div>
      )}

      {/* Liste actualités */}
      {!error && (
        <div>
          {sortedActualites.map((actu, index) => (
            <section
              key={actu.id}
              className={index % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-beige dark:bg-gray-900'}
            >
              <div className="px-4 sm:px-10 md:px-16 lg:px-24 py-8 sm:py-14 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                  {/* Image */}
                  {actu.image_url && (
                    <div
                      className={`anim-fade-right ${index % 2 !== 0 ? 'md:order-2' : ''}`}
                      data-delay="0.2"
                    >
                      <img
                        src={actu.image_url}
                        alt={actu.title}
                        loading="lazy"
                        width={800}
                        height={500}
                        className="w-full max-w-sm md:max-w-md h-auto object-contain rounded-xl shadow-sm"
                      />
                    </div>
                  )}

                  {/* Contenu texte */}
                  <div
                    className={`anim-fade-left ${index % 2 !== 0 ? 'md:order-1' : ''}`}
                    data-delay="0.3"
                  >
                    <p className="font-basecoat text-[1rem] text-benin-jaune font-semibold mb-2 tracking-widest uppercase">
                      {actu.date
                        ? new Date(actu.date).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })
                        : t('news.date_unknown')}
                    </p>
                    <h2 className="font-basecoat text-[1.2rem] sm:text-[1.5rem] font-bold uppercase text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 leading-tight break-words">
                      {actu.title}
                    </h2>
                    <p className="font-basecoat text-gray-700 dark:text-gray-300 text-sm sm:text-base whitespace-pre-line leading-relaxed">
                      {actu.content}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!error && visibleActualites.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="font-basecoat text-gray-500 dark:text-gray-400 dark:text-gray-500 text-center text-lg">
            {t('news.no_articles')}
          </p>
          <Link
            to={lp('/')}
            className="font-basecoat text-benin-jaune hover:text-benin-terre underline text-sm transition"
          >
            {t('common.home')}
          </Link>
        </div>
      )}

    </div>
  );
}
