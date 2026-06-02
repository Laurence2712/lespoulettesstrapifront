import { useState, useEffect } from 'react';
import { Link } from '@remix-run/react';

const COOKIE_KEY = 'lespoulettes_cookies_accepted';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_KEY);
    if (!stored) {
      setVisible(true);
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
    <div
      role="region"
      aria-label="Consentement aux cookies"
      className={`w-full bg-gray-900/95 border-t border-gray-700 text-gray-400 text-xs font-basecoat transition-all duration-300 ${leaving ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-center sm:text-left leading-relaxed">
          Ce site utilise des cookies (Google Analytics, Stripe) pour améliorer votre expérience.{' '}
          <Link to="/fr/mentions-legales" className="underline hover:text-benin-jaune transition">
            En savoir plus
          </Link>
        </p>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => dismiss('refused')}
            className="px-3 py-1 rounded border border-gray-600 hover:border-gray-400 hover:text-white transition text-xs"
          >
            Refuser
          </button>
          <button
            onClick={() => dismiss('accepted')}
            className="px-3 py-1 rounded bg-benin-jaune text-black font-semibold hover:bg-benin-ocre transition text-xs"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
