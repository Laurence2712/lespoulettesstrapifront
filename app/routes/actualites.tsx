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

  // === Fetch Actualités ===
  useEffect(() => {
    async function fetchActualites() {
      try {
        const response = await fetch(apiEndpoints.actualites);
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

  // Animation GSAP
  useEffect(() => {
    if (actualites.length > 0) {
      gsap.from(".actu-card", {
        opacity: 1,
        y: 50,
        stagger: { amount: 0.5 },
        duration: 0.8,
        ease: "power3.out",
      });
    }
  }, [actualites]);

  return (
    <div className="container mx-auto py-16 px-4 max-w-7xl mt-[70px]">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm">
        <Link to="/" className="text-yellow-600 hover:text-yellow-800 font-medium">
          Accueil
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-600">Actualités</span>
      </nav>

      <h1 className="text-4xl md:text-5xl text-center mb-12 text-gray-900 tracking-wide">
        Toutes les actualités
      </h1>

      {loading && <p className="text-center text-xl">Chargement...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="flex flex-col gap-16">
        {actualites.map((actu, index) => (
          <div
            key={actu.id}
            className={`flex flex-col md:flex-row items-center gap-8 actu-card bg-white rounded-xl shadow-lg overflow-hidden p-6 transform transition hover:scale-[1.02]`}
          >
            {/* Alternance image / texte */}
            {index % 2 === 0 && actu.image_url && (
              <div className="md:w-1/2">
                <img
                  src={actu.image_url}
                  alt={actu.title}
                  className="w-full h-80 object-cover rounded-lg shadow-md"
                />
              </div>
            )}

            <div className="md:w-1/2 flex flex-col justify-center">
              <p className="font-ogg text-gray-500 mb-2 italic">
                {actu.date
                  ? new Date(actu.date).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : "Date inconnue"}
              </p>
              <h2 className="font-basecoat text-2xl md:text-3xl font-bold text-black mb-4">
                {actu.title}
              </h2>
              <p className="font-basecoat text-gray-800 text-lg whitespace-pre-line leading-relaxed">
                {actu.content}
              </p>
            </div>

            {index % 2 !== 0 && actu.image_url && (
              <div className="md:w-1/2">
                <img
                  src={actu.image_url}
                  alt={actu.title}
                  className="w-full h-80 object-cover rounded-lg shadow-md"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
