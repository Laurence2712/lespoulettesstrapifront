import { useEffect, useState } from "react";
import { Link } from "@remix-run/react";
import { gsap } from "gsap";
import { apiEndpoints, getImageUrl } from "../config/api";

interface Actualite {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  date?: string;
}

export default function ActualitesPage() {
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchActualites() {
      try {
        const response = await fetch(apiEndpoints.actualites);  // ✅ Utilise actualites, pas latestActualite
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (data?.data) {
          const actualitesData: Actualite[] = data.data.map((item: any) => ({
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
          setActualites(actualitesData);
        }
      } catch (err: any) {
        console.error(err);
        setError("Erreur lors du chargement des actualités");
      } finally {
        setLoading(false);
      }
    }

    fetchActualites();
  }, []);

  useEffect(() => {
    if (actualites.length > 0) {
      gsap.from(".actu-card", {
        opacity: 0,
        y: 50,
        stagger: { amount: 0.5 },
        duration: 0.8,
        ease: "power3.out",
      });
    }
  }, [actualites]);

  return (
    <div className="container mx-auto py-6 sm:py-8 md:py-12 lg:py-16 px-4 sm:px-6 md:px-8 max-w-7xl mt-[60px] sm:mt-[70px] md:mt-[80px]">
      {/* Breadcrumb - Responsive */}
      <nav className="font-basecoat mb-6 sm:mb-8 text-xs sm:text-sm">
        <Link to="/" className="text-yellow-600 hover:text-yellow-800 font-medium transition">
          Accueil
        </Link>
        <span className="mx-1.5 sm:mx-2 text-gray-400">/</span>
        <span className="text-gray-600">Actualités</span>
      </nav>

      {/* Titre - Responsive */}
      <h1 className="font-ogg text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center mb-8 sm:mb-10 md:mb-12 text-gray-900 tracking-wide font-light uppercase">
        Toutes les actualités
      </h1>

      {/* Loading & Error states */}
      {loading && (
        <div className="flex items-center justify-center py-12 sm:py-16 md:py-20">
          <p className="font-basecoat text-lg sm:text-xl md:text-2xl text-gray-600">Chargement...</p>
        </div>
      )}
      
      {error && (
        <div className="flex items-center justify-center py-12 sm:py-16 md:py-20">
          <p className="font-basecoat text-red-500 text-center text-base sm:text-lg md:text-xl">{error}</p>
        </div>
      )}

      {/* Liste actualités - Responsive spacing */}
      <div className="flex flex-col gap-8 sm:gap-10 md:gap-12 lg:gap-16">
        {actualites.map((actu, index) => (
          <div
            key={actu.id}
            className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 actu-card bg-white rounded-xl shadow-lg overflow-hidden p-4 sm:p-5 md:p-6 transform transition hover:scale-[1.01] md:hover:scale-[1.02]"
          >
            {/* Image à gauche (index pair) - Desktop only alternance */}
            {index % 2 === 0 && actu.image_url && (
              <div className="w-full md:w-1/2 order-1">
                <img
                  src={actu.image_url}
                  alt={actu.title}
                  className="w-full h-48 sm:h-56 md:h-64 lg:h-80 object-cover rounded-lg shadow-md"
                />
              </div>
            )}

            {/* Contenu - Responsive text sizes */}
            <div className={`w-full md:w-1/2 flex flex-col justify-center ${index % 2 === 0 ? 'order-2' : 'order-2 md:order-1'}`}>
              <p className="font-basecoat text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3 italic">
                {actu.date
                  ? new Date(actu.date).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : "Date inconnue"}
              </p>
              <h2 className="font-basecoat text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-3 sm:mb-4">
                {actu.title}
              </h2>
              <p className="font-basecoat text-gray-800 text-sm sm:text-base md:text-lg whitespace-pre-line leading-relaxed">
                {actu.content}
              </p>
            </div>

            {/* Image à droite (index impair) - Desktop only alternance */}
            {index % 2 !== 0 && actu.image_url && (
              <div className={`w-full md:w-1/2 ${index % 2 !== 0 ? 'order-1 md:order-2' : 'order-1'}`}>
                <img
                  src={actu.image_url}
                  alt={actu.title}
                  className="w-full h-48 sm:h-56 md:h-64 lg:h-80 object-cover rounded-lg shadow-md"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty state */}
      {!loading && !error && actualites.length === 0 && (
        <div className="flex items-center justify-center py-12 sm:py-16 md:py-20">
          <p className="font-basecoat text-gray-600 text-center text-base sm:text-lg md:text-xl">
            Aucune actualité disponible pour le moment.
          </p>
        </div>
      )}
    </div>
  );
}