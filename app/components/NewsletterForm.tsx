import { useFetcher } from '@remix-run/react';
import { useState } from 'react';

interface NewsletterFormProps {
  variant?: 'dark' | 'light';
}

export default function NewsletterForm({ variant = 'dark' }: NewsletterFormProps) {
  const fetcher = useFetcher<{ success?: boolean; error?: string }>();
  const [email, setEmail] = useState('');

  const isSubmitting = fetcher.state !== 'idle';
  const isSuccess = fetcher.data?.success;
  const isLight = variant === 'light';

  if (isSuccess) {
    return (
      <div className={`flex items-center gap-3 font-basecoat text-sm sm:text-base ${isLight ? 'text-green-700' : 'text-green-400'}`}>
        <span className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </span>
        <span>Merci ! Vous êtes inscrit·e à la newsletter.</span>
      </div>
    );
  }

  return (
    <fetcher.Form
      method="post"
      action="/newsletter-subscribe"
      className="flex flex-col sm:flex-row gap-3 w-full"
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Adresse email
      </label>
      <input
        id="newsletter-email"
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="votre@email.com"
        required
        className={`font-basecoat flex-1 rounded-xl px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-offset-1
          ${isLight
            ? 'border border-black/20 bg-white text-gray-900 placeholder-gray-400 focus:ring-black/30'
            : 'border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:ring-yellow-400 focus:border-yellow-400'
          }`}
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className={`font-basecoat font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] text-sm whitespace-nowrap disabled:opacity-60
          ${isLight
            ? 'bg-black hover:bg-gray-900 text-white'
            : 'bg-yellow-400 hover:bg-yellow-500 text-black'
          }`}
      >
        {isSubmitting ? 'Envoi...' : "S'inscrire"}
      </button>
      {fetcher.data?.error && (
        <p className={`text-xs mt-1 font-basecoat ${isLight ? 'text-red-700' : 'text-red-400'}`}>
          {fetcher.data.error}
        </p>
      )}
    </fetcher.Form>
  );
}
