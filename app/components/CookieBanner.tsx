import { useState, useEffect } from 'react';

const COOKIE_KEY = 'lespoulettes_cookies_accepted';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_KEY);
    if (!stored) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, 'accepted');
    setVisible(false);
  };

  const refuse = () => {
    localStorage.setItem(COOKIE_KEY, 'refused');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Consentement aux cookies"
      className="fixed bottom-0 left-0 right-0 z-[9999] bg-gray-900 text-white px-4 py-4 sm:px-6 sm:py-5 shadow-2xl"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="font-basecoat text-sm text-gray-300 flex-1 leading-relaxed">
          Ce site utilise des cookies tiers (Google Fonts, Google Maps, Stripe) pour améliorer votre expérience.{' '}
          <a href="/mentions-legales" className="underline text-yellow-400 hover:text-yellow-300 transition">
            En savoir plus
          </a>
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={refuse}
            className="font-basecoat text-sm px-4 py-2 rounded-lg border border-gray-600 hover:border-gray-400 text-gray-400 hover:text-white transition"
          >
            Refuser
          </button>
          <button
            onClick={accept}
            className="font-basecoat text-sm px-5 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black font-bold transition"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
