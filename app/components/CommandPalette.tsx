import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from '@remix-run/react';
import { useLocalePath } from '../hooks/useLocalePath';

interface SearchResult {
  id: string;
  title: string;
  prix?: string | number;
  image_url?: string;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const lp = useLocalePath();

  // Open/close with ⌘K / Ctrl+K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setQuery('');
      setResults([]);
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  // Search with debounce
  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); setLoading(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 320);
    return () => clearTimeout(timer);
  }, [query, search]);

  // Keyboard navigation in results
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected(s => Math.min(s + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected(s => Math.max(s - 1, 0));
    } else if (e.key === 'Enter' && results[selected]) {
      setOpen(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[12vh] px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-md animate-fade-in"
        onClick={() => setOpen(false)}
      />

      {/* Panel */}
      <div className="relative w-full max-w-xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden animate-scale-in border border-gray-100 dark:border-gray-700">

        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 dark:border-gray-700">
          <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setSelected(0); }}
            onKeyDown={onKeyDown}
            placeholder=""
            className="flex-1 bg-transparent font-basecoat text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-base outline-none"
            autoComplete="off"
          />
          {loading && (
            <div className="w-4 h-4 border-2 border-benin-jaune border-t-transparent rounded-full animate-spin flex-shrink-0" />
          )}
          <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs font-mono text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto">
          {query && !loading && results.length === 0 && (
            <div className="px-4 py-8 text-center font-basecoat text-gray-400 dark:text-gray-500 text-sm">
              Aucun résultat pour &ldquo;{query}&rdquo;
            </div>
          )}

          {!query && (
            <div className="px-4 py-6 text-center font-basecoat text-gray-400 dark:text-gray-500 text-sm">
              <span className="block mb-1 text-2xl">🔍</span>
              Tapez pour rechercher parmi nos créations
            </div>
          )}

          {results.length > 0 && (
            <ul>
              {results.map((r, i) => (
                <li key={r.id}>
                  <Link
                    to={lp(`/realisations/${r.id}`)}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-4 px-4 py-3 transition-colors
                      ${i === selected ? 'bg-benin-jaune/10 dark:bg-benin-jaune/5' : 'hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-800'}
                    `}
                    onMouseEnter={() => setSelected(i)}
                  >
                    {r.image_url ? (
                      <img
                        src={r.image_url}
                        alt={r.title}
                        className="w-12 h-12 rounded-xl object-cover flex-shrink-0 bg-beige dark:bg-gray-900"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">🎁</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-basecoat font-bold text-gray-900 dark:text-gray-100 text-sm truncate uppercase">
                        {r.title}
                      </p>
                      {r.prix && (
                        <p className="font-basecoat text-benin-jaune text-sm font-bold mt-0.5">
                          {r.prix} €
                        </p>
                      )}
                    </div>
                    <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-4 px-4 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <span className="font-basecoat text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs">↑↓</kbd>
            naviguer
          </span>
          <span className="font-basecoat text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs">↵</kbd>
            ouvrir
          </span>
        </div>
      </div>
    </div>
  );
}
