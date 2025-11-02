import { useEffect, useState } from "react";
import { Link } from "@remix-run/react";
import { gsap } from "gsap";

interface Actualite {
  id: number;
  title: string;
  content: string;
  image_url?: string | null;
  date?: string | null;
}

export default function Actualites() {
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchActualites() {
      try {
        const response = await fetch(
          "http://localhost:1337/api/actualites?populate=*&sort=publishedAt:desc&pagination[pageSize]=100"
        );
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
        const data = await response.json();

        if (data?.data) {
          const actualitesData: Actualite[] = data.data.map((actu: any) => {
            const attrs = actu.attributes || {};
            let image_url: string | null = null;

            if (attrs.Image?.data?.attributes?.url) {
              image_url = attrs.Image.data.attributes.url.startsWith("http")
                ? attrs.Image.data.attributes.url
                : `http://localhost:1337${attrs.Image.data.attributes.url}`;
            }

            return {
              id: actu.id,
              title: attrs.title || attrs.Titre || "Titre indisponible",
              content: attrs.content || attrs.Contenu || "Contenu indisponible",
              image_url,
              date: attrs.publishedAt || null,
            };
          });

          // Tri sécurisé par date décroissante
          const sorted = actualitesData.sort((a, b) => {
            const ta = a.date ? new Date(a.date).getTime() : 0;
            const tb = b.date ? new Date(b.date).getTime() : 0;
            return tb - ta;
          });

          setActualites(sorted);
        } else {
          setError("Aucune actualité trouvée.");
        }
      } catch (err: any) {
        console.error("Erreur lors du chargement des actualités :", err);
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
        y: 40,
        stagger: { amount: 0.5, from: "start" },
        duration: 0.7,
        ease: "power3.out",
      });
    }
  }, [actualites]);

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <nav className="mb-8 text-sm">
        <Link to="/" className="text-yellow-600 hover:text-yellow-800 font-medium">
          Accueil
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-600">Actualités</span>
      </nav>

      <Link
        to="/"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Retour à l'accueil
      </Link>

      <h1 className="text-4xl font-bold text-center mb-12 text-gray-900 tracking-widest">
        Nos Actualités
      </h1>

      {loading && <p className="text-center text-xl">Chargement...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {actualites.map((actu) => (
          <article
            key={actu.id}
            className="bg-white rounded-lg shadow-md overflow-hidden actu-card hover:shadow-xl transition-all duration-300"
          >
            {actu.image_url ? (
              <img
                src={actu.image_url}
                alt={actu.title}
                className="w-full h-52 object-cover"
              />
            ) : (
              <div className="w-full h-52 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Aucune image</span>
              </div>
            )}
            <div className="p-6">
              {actu.date && (
                <p className="text-gray-500 text-sm mb-2 font-basecoat">
                  {new Date(actu.date).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}
              <h2 className="font-basecoat text-xl font-semibold text-gray-900 mb-2">
                {actu.title}
              </h2>
              <p className="text-gray-700 mb-4 line-clamp-3">{actu.content}</p>
              <Link
                to={`/actualites/${actu.id}`}
                className="text-yellow-600 font-semibold hover:underline"
              >
                Lire plus →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
