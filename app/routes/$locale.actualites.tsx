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

  const sortedActualites = [...actualites].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  return (
    <div ref={scrollRef} className="mt-16 sm:mt-20 md:mt-24">
      {/* Header */}
      <div className="py-6 sm:py-8 md:py-[60px] px-4 sm:px-6 md:px-[60px] lg:px-[120px]">
        {/* Breadcrumb */}
        <nav className="anim-fade-up font-basecoat mb-6 sm:mb-8 text-xs sm:text-sm">
          <Link to={lp('/')} className="text-benin-jaune hover:text-benin-terre font-medium transition">
            {t('common.home')}
          </Link>
          <span className="mx-1.5 sm:mx-2 text-gray-400 dark:text-gray-500">/</span>
          <span className="text-gray-600 dark:text-gray-400 dark:text-gray-500">{t('news.breadcrumb')}</span>
        </nav>

        {/* Titre + Tri */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6">
          <div>
            <h1
              className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-[44px] font-bold uppercase text-gray-900 dark:text-gray-100"
              data-delay="0.1"
            >
              {t('news.title')}
            </h1>
            <div
              className="anim-expand-line w-24 sm:w-28 h-[2px] bg-gradient-to-r from-benin-jaune via-benin-jaune/60 to-transparent mt-3 sm:mt-4"
              data-delay="0.15"
            ></div>
            <p className="anim-fade-up font-basecoat text-gray-500 dark:text-gray-400 dark:text-gray-500 text-sm sm:text-base mt-3" data-delay="0.2">
              {t('news.subtitle_base')} — {actualites.length} publication{actualites.length > 1 ? 's' : ''}
            </p>
          </div>
          <div className="anim-fade-up flex items-center gap-2" data-delay="0.2">
            <label
              htmlFor="sort-date"
              className="font-basecoat text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500 whitespace-nowrap"
            >
              {t('news.sort_by')}
            </label>
            <select
              id="sort-date"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'desc' | 'asc')}
              className="font-basecoat text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-benin-jaune focus:border-benin-jaune"
            >
              <option value="desc">{t('news.sort_recent_short')}</option>
              <option value="asc">{t('news.sort_oldest_short')}</option>
            </select>
          </div>
        </div>
      </div>

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
              <div className="px-4 sm:px-6 md:px-[60px] lg:px-[120px] py-16 sm:py-20 md:py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                  {/* Image */}
                  {actu.image_url && (
                    <div
                      className={`anim-fade-right rounded-2xl overflow-hidden shadow-xl ${index % 2 !== 0 ? 'md:order-2' : ''}`}
                      data-delay="0.2"
                    >
                      <img
                        src={actu.image_url}
                        alt={actu.title}
                        loading="lazy"
                        width={800}
                        height={500}
                        className="w-full h-72 sm:h-80 md:h-96 lg:h-[480px] object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                  )}

                  {/* Contenu texte */}
                  <div
                    className={`anim-fade-left ${index % 2 !== 0 ? 'md:order-1' : ''}`}
                    data-delay="0.3"
                  >
                    <p className="font-basecoat text-sm text-benin-jaune font-semibold mb-3 tracking-wider uppercase">
                      {actu.date
                        ? new Date(actu.date).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })
                        : t('news.date_unknown')}
                    </p>
                    <h2 className="font-basecoat text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 leading-tight">
                      {actu.title}
                    </h2>
                    <p className="font-basecoat text-gray-700 dark:text-gray-300 text-base sm:text-lg whitespace-pre-line leading-relaxed">
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
      {!error && actualites.length === 0 && (
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

      {/* ── Newsletter CTA ── */}
      {!error && (
        <div className="bg-gray-900 px-4 sm:px-6 md:px-[60px] lg:px-[120px] py-14 sm:py-16 text-center">
          <h2 className="font-basecoat text-xl sm:text-2xl font-bold uppercase text-white mb-2">
            {t('news.newsletter_cta_title')}
          </h2>
          <p className="font-basecoat text-gray-400 dark:text-gray-500 text-sm sm:text-base mb-6 max-w-md mx-auto">
            {t('news.newsletter_cta_desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto mb-6">
            <a
              href="https://www.instagram.com/lespoulettes.benin/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-basecoat inline-flex items-center justify-center gap-2 border-2 border-gray-600 text-gray-300 hover:border-white hover:text-white px-8 py-3 rounded-xl font-bold uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              {t('news.follow_instagram')}
            </a>
          </div>
          <Link
            to={lp('/realisations')}
            className="font-basecoat inline-block border-2 border-benin-jaune text-white hover:bg-benin-jaune hover:text-black dark:text-gray-100 px-10 py-3 rounded-xl font-bold uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] text-sm"
          >
            {t('products.see_all')}
          </Link>
        </div>
      )}
    </div>
  );
}
