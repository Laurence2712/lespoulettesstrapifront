import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { apiEndpoints, getImageUrl } from "../config/api";
import { useScrollAnimations } from "../hooks/useScrollAnimations";
import { useTranslation } from "react-i18next";
import { useLocalePath } from "../hooks/useLocalePath";

export async function loader({ params }: LoaderFunctionArgs) {
  const locale = params.locale ?? 'fr';
  const id = params.id;
  if (!id) throw new Response("Not Found", { status: 404 });

  try {
    const res = await fetch(apiEndpoints(locale).actualiteById(Number(id)));
    if (!res.ok) throw new Response("Not Found", { status: 404 });
    const data = await res.json();
    if (!data?.data) throw new Response("Not Found", { status: 404 });

    const item = data.data;
    const actu = {
      id: item.id,
      title: item.Title || '',
      content: item.content || '',
      date: item.date || '',
      image_url: item.image?.formats?.large?.url
        ? getImageUrl(item.image.formats.large.url)
        : item.image?.url
        ? getImageUrl(item.image.url)
        : '',
    };
    return json({ actu });
  } catch (e: any) {
    if (e instanceof Response) throw e;
    throw new Response("Not Found", { status: 404 });
  }
}

export function meta({ data }: any) {
  const title = data?.actu?.title || 'Actualité';
  return [
    { title: `${title} — Les Poulettes` },
    { property: "og:title", content: title },
  ];
}

export default function ActualiteDetail() {
  const { actu } = useLoaderData<typeof loader>();
  const { t } = useTranslation();
  const lp = useLocalePath();
  const scrollRef = useScrollAnimations([]);

  return (
    <div ref={scrollRef} className="mt-16 sm:mt-20 md:mt-24">
      <div className="py-6 sm:py-8 md:py-[60px] px-6 sm:px-10 md:px-16 lg:px-24">
        {/* Breadcrumb */}
        <nav className="anim-fade-up font-basecoat mb-8 text-xs">
          <Link to={lp('/')} className="text-benin-jaune hover:text-benin-terre font-medium transition">
            {t('common.home')}
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link to={lp('/actualites')} className="text-benin-jaune hover:text-benin-terre font-medium transition">
            {t('news.breadcrumb')}
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600 dark:text-gray-400">{actu.title}</span>
        </nav>

        <div className="max-w-3xl">
          {actu.date && (
            <p className="anim-fade-up font-basecoat text-[1rem] text-benin-jaune font-semibold mb-3 tracking-widest uppercase" data-delay="0.05">
              {new Date(actu.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          )}
          <h1 className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-4xl font-bold uppercase text-gray-900 dark:text-gray-100 leading-tight mb-4" data-delay="0.1">
            {actu.title}
          </h1>
          <div className="anim-expand-line w-24 sm:w-28 h-[2px] bg-gradient-to-r from-benin-jaune via-benin-jaune/60 to-transparent mb-8" data-delay="0.15" />

          {actu.image_url && (
            <div className="anim-fade-up mb-8 rounded-2xl overflow-hidden shadow-sm" data-delay="0.2">
              <img
                src={actu.image_url}
                alt={actu.title}
                className="w-full max-h-[500px] object-cover"
              />
            </div>
          )}

          <p className="anim-fade-up font-basecoat text-gray-700 dark:text-gray-300 text-base sm:text-lg leading-relaxed whitespace-pre-line" data-delay="0.25">
            {actu.content}
          </p>

          <div className="mt-12">
            <Link
              to={lp('/actualites')}
              className="font-basecoat font-bold text-xs uppercase tracking-widest px-6 py-3 border-2 border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100 rounded-md hover:bg-gray-900 hover:text-white transition-all duration-200 inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {t('news.breadcrumb')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
