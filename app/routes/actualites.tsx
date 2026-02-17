import { useState } from "react";
import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { apiEndpoints, getImageUrl } from "../config/api";
import { useScrollAnimations } from "../hooks/useScrollAnimations";

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

export async function loader() {
  try {
    const response = await fetch(apiEndpoints.actualites);
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
        date: item.publishedAt || item.date || '',
      }));
      return json<LoaderData>({ actualites, error: null });
    }
    return json<LoaderData>({ actualites: [], error: null });
  } catch (err: any) {
    console.error('Loader error:', err);
    return json<LoaderData>({ actualites: [], error: "Erreur lors du chargement des actualités" });
  }
}

export default function ActualitesPage() {
  const { actualites, error } = useLoaderData<LoaderData>();
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const scrollRef = useScrollAnimations([sortOrder]);

  const sortedActualites = [...actualites].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  return (
    <div ref={scrollRef} className="py-6 sm:py-8 md:py-[60px] px-4 sm:px-6 md:px-[60px] lg:px-[120px] mt-[60px] sm:mt-[70px] md:mt-[80px]">
      {/* Breadcrumb */}
      <nav className="anim-fade-up font-basecoat mb-6 sm:mb-8 text-xs sm:text-sm">
        <Link to="/" className="text-yellow-600 hover:text-yellow-700 font-medium transition">
          Accueil
        </Link>
        <span className="mx-1.5 sm:mx-2 text-gray-400">/</span>
        <span className="text-gray-600">Actualités</span>
      </nav>

      {/* Titre + Tri */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12">
        <div>
          <h1
            className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-[44px] font-bold uppercase text-gray-900"
            data-delay="0.1"
          >
            Nos actualités
          </h1>
          <div
            className="anim-fade-up w-16 sm:w-20 h-1 bg-yellow-400 mt-3 sm:mt-4"
            data-delay="0.15"
          ></div>
          <p className="anim-fade-up font-basecoat text-gray-500 text-sm sm:text-base mt-3" data-delay="0.2">
            {actualites.length} actualité{actualites.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="anim-fade-up flex items-center gap-2" data-delay="0.2">
          <label
            htmlFor="sort-date"
            className="font-basecoat text-sm text-gray-600 whitespace-nowrap"
          >
            Trier par :
          </label>
          <select
            id="sort-date"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'desc' | 'asc')}
            className="font-basecoat text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
          >
            <option value="desc">Plus récent</option>
            <option value="asc">Plus ancien</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center justify-center py-20">
          <p className="font-basecoat text-red-500 text-center text-lg">{error}</p>
        </div>
      )}

      {/* Liste actualités */}
      {!error && (
        <div className="flex flex-col gap-12 sm:gap-16 md:gap-20">
          {sortedActualites.map((actu, index) => (
            <div
              key={actu.id}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 items-center"
            >
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
                    className="w-full h-64 sm:h-72 md:h-80 lg:h-[400px] object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              )}

              {/* Contenu texte */}
              <div
                className={`anim-fade-left ${!actu.image_url ? 'md:col-span-2' : ''} ${index % 2 !== 0 ? 'md:order-1' : ''}`}
                data-delay="0.3"
              >
                <p className="font-basecoat text-sm text-yellow-600 font-semibold mb-3 tracking-wider uppercase">
                  {actu.date
                    ? new Date(actu.date).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : "Date inconnue"}
                </p>
                <h2 className="font-basecoat text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-5 leading-tight">
                  {actu.title}
                </h2>
                <p className="font-basecoat text-gray-700 text-base sm:text-lg md:text-xl whitespace-pre-line leading-relaxed">
                  {actu.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!error && actualites.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <p className="font-basecoat text-gray-500 text-center text-lg">
            Aucune actualité disponible pour le moment.
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
  );
}
