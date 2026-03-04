import { useState, useEffect } from 'react';

const COOKIE_KEY = 'lespoulettes_cookies_accepted';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_KEY);
    if (!stored) {
      // Slight delay so it doesn't flash on page load
      setTimeout(() => setVisible(true), 1200);
    }
  }, []);

  const dismiss = (value: 'accepted' | 'refused') => {
    setLeaving(true);
    setTimeout(() => {
      localStorage.setItem(COOKIE_KEY, value);
      setVisible(false);
      setLeaving(false);
    }, 280);
  };

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[9990] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${leaving ? 'opacity-0' : 'opacity-100 animate-fade-in'}`}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Consentement aux cookies"
        className={`fixed z-[9991] left-1/2 bottom-6 sm:bottom-auto sm:top-1/2 -translate-x-1/2 sm:-translate-y-1/2 w-[calc(100%-2rem)] max-w-md transition-all duration-300
          ${leaving ? 'opacity-0 scale-95' : 'opacity-100 scale-100 animate-scale-in'}
        `}
      >
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
          {/* Header strip */}
          <div className="h-1 w-full bg-gradient-to-r from-benin-jaune via-wax-orange to-benin-terre" />

          <div className="p-6">
            {/* Icon + title */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-benin-jaune/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-lg">🍪</span>
              </div>
              <div>
                <h2 className="font-basecoat font-bold text-gray-900 dark:text-gray-100 text-base uppercase tracking-wide">
                  Cookies & confidentialité
                </h2>
                <p className="font-basecoat text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  Ce site utilise des cookies tiers (Google Analytics, Stripe) pour améliorer votre expérience et analyser le trafic.
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-wrap gap-2 mb-5">
              {['Analytics', 'Paiement sécurisé', 'Performance'].map(tag => (
                <span
                  key={tag}
                  className="font-basecoat text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
                >
                  {tag}
                </span>
              ))}
              <a
                href="/mentions-legales"
                className="font-basecoat text-xs px-2.5 py-1 rounded-full text-benin-jaune border border-benin-jaune/30 hover:bg-benin-jaune/10 transition"
              >
                En savoir plus →
              </a>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => dismiss('refused')}
                className="flex-1 font-basecoat text-sm px-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-gray-200 transition font-semibold"
              >
                Refuser
              </button>
              <button
                onClick={() => dismiss('accepted')}
                className="flex-1 font-basecoat text-sm px-4 py-2.5 rounded-xl bg-benin-jaune hover:bg-benin-ocre text-black font-bold transition hover:scale-[1.02] shadow-sm"
              >
                Accepter
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
