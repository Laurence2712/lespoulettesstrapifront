import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { useLocalePath } from "../hooks/useLocalePath";
import ProductCard from "../components/ProductCard";

interface SearchResult {
  id: string;
  title: string;
  prix?: string | number;
  image_url?: string | null;
}

export function meta() {
  return [{ title: "Rechercher — Les Poulettes" }, { name: "robots", content: "noindex" }];
}

export default function RecherchePage() {
  const { t } = useTranslation();
  const lp = useLocalePath();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        setResults(data.results ?? []);
        setSearched(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-20 md:pt-24 pb-20">
      {/* Titre + input centré */}
      <div className="text-center px-6 sm:px-10 md:px-16 lg:px-24 pt-10 pb-8">
        <h1 className="font-basecoat text-xl sm:text-2xl font-bold uppercase text-gray-900 dark:text-gray-100 mb-8">
          Rechercher
        </h1>
        <div className="relative max-w-xl mx-auto">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
            fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Saisir un mot pour rechercher"
            className="w-full border border-gray-300 dark:border-gray-700 rounded-none bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-basecoat text-base pl-12 pr-24 py-3 focus:outline-none focus:border-gray-900 dark:focus:border-gray-100 transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 font-basecoat text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors underline"
            >
              Supprimer
            </button>
          )}
        </div>
      </div>

      {/* Résultats */}
      <div className="px-6 sm:px-10 md:px-16 lg:px-24">
        {loading && (
          <p className="text-center font-basecoat text-gray-400 py-10">Recherche en cours…</p>
        )}

        {!loading && searched && results.length === 0 && (
          <p className="text-center font-basecoat text-gray-500 py-10">Aucun résultat pour « {query} »</p>
        )}

        {!loading && results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 mt-4">
            {results.map((item) => (
              <ProductCard
                key={item.id}
                id={item.id}
                title={item.title}
                image_url={item.image_url}
                prix={item.prix}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
