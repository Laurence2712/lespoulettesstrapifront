import { useState } from "react";
import { Link, Form, useActionData, useNavigation } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { useScrollAnimations } from "../hooks/useScrollAnimations";
import { getApiUrl } from "../config/api";

export function meta() {
  return [
    { title: "Nous contacter — Les Poulettes" },
    {
      name: "description",
      content:
        "Contactez Les Poulettes pour toute question, commande personnalisée ou partenariat. Retrouvez-nous sur WhatsApp, email, Facebook et Instagram.",
    },
    { property: "og:title", content: "Nous contacter — Les Poulettes" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://lespoulettes.be/contact" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: "Nous contacter — Les Poulettes" },
  ];
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return json({ success: false, error: "Tous les champs sont requis." });
  }

  const API_URL = getApiUrl();
  try {
    const res = await fetch(`${API_URL}/api/contact-messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { name, email, message } }),
    });
    if (!res.ok) throw new Error("API error");
    return json({ success: true, error: null });
  } catch {
    return json({
      success: false,
      error:
        "Le message n'a pas pu être envoyé automatiquement. Contactez-nous directement via WhatsApp ou à lespoulettes.benin@gmail.com",
    });
  }
}

export default function Contact() {
  const scrollRef = useScrollAnimations();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div
      ref={scrollRef}
      className="py-6 sm:py-8 md:py-[60px] px-4 sm:px-6 md:px-[60px] lg:px-[120px] mt-16 sm:mt-20 md:mt-24"
    >
      {/* Breadcrumb */}
      <nav className="anim-fade-up font-basecoat mb-6 sm:mb-8 text-xs sm:text-sm">
        <Link to="/" className="text-yellow-600 hover:text-yellow-700 font-medium transition">
          Accueil
        </Link>
        <span className="mx-1.5 sm:mx-2 text-gray-400">/</span>
        <span className="text-gray-600">Contact</span>
      </nav>

      {/* Titre */}
      <h1
        className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-[44px] font-bold uppercase text-gray-900"
        data-delay="0.1"
      >
        Contactez-nous
      </h1>
      <div className="anim-fade-up w-16 sm:w-20 h-1 bg-yellow-400 mt-3 sm:mt-4" data-delay="0.15"></div>
      <p className="anim-fade-up font-basecoat text-gray-500 text-sm sm:text-base mt-3 mb-8 sm:mb-10 md:mb-12" data-delay="0.2">
        Une question, un projet ou simplement envie de dire bonjour ?
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16">

        {/* ── Formulaire ── */}
        <div className="anim-fade-right" data-delay="0.2">
          <Form method="post" className="space-y-5">
            <div>
              <label htmlFor="name" className="font-basecoat block text-sm font-semibold text-gray-700 mb-2">
                Nom
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom"
                required
                className="font-basecoat w-full rounded-xl border border-gray-200 px-4 py-3 text-sm sm:text-base focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition bg-white"
              />
            </div>

            <div>
              <label htmlFor="email" className="font-basecoat block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className="font-basecoat w-full rounded-xl border border-gray-200 px-4 py-3 text-sm sm:text-base focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition bg-white"
              />
            </div>

            <div>
              <label htmlFor="message" className="font-basecoat block text-sm font-semibold text-gray-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Votre message..."
                rows={5}
                required
                className="font-basecoat w-full rounded-xl border border-gray-200 px-4 py-3 text-sm sm:text-base focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition resize-none bg-white"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="font-basecoat w-full border-2 border-yellow-400 text-gray-900 hover:bg-yellow-400 hover:text-black font-bold uppercase tracking-wider px-8 py-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-lg text-sm sm:text-base disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isSubmitting ? "Envoi en cours..." : "Envoyer"}
            </button>

            {actionData?.success && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <p className="font-basecoat text-green-700 font-semibold text-sm">
                    Message envoyé ! Nous vous répondrons dans les plus brefs délais.
                  </p>
                </div>
              </div>
            )}

            {actionData?.error && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="font-basecoat text-amber-800 text-sm leading-relaxed">{actionData.error}</p>
              </div>
            )}
          </Form>
        </div>

        {/* ── Reseaux & Coordonnees ── */}
        <div className="anim-fade-left flex flex-col gap-5" data-delay="0.3">
          {/* WhatsApp */}
          <a
            href="https://wa.me/2290162007580"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-5 p-5 sm:p-6 rounded-2xl border border-gray-200 hover:border-green-400 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-green-50 group-hover:bg-green-100 flex items-center justify-center transition-colors">
              <svg className="w-7 h-7 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </div>
            <div>
              <p className="font-basecoat font-bold text-gray-900 text-base sm:text-lg">WhatsApp</p>
              <p className="font-basecoat text-gray-500 text-sm sm:text-base">+229 01 62 00 75 80</p>
            </div>
            <svg className="w-5 h-5 text-gray-300 group-hover:text-green-400 ml-auto transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>

          {/* Email */}
          <a
            href="mailto:lespoulettes.benin@gmail.com"
            className="group flex items-center gap-5 p-5 sm:p-6 rounded-2xl border border-gray-200 hover:border-yellow-400 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-yellow-50 group-hover:bg-yellow-100 flex items-center justify-center transition-colors">
              <svg className="w-7 h-7 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <div>
              <p className="font-basecoat font-bold text-gray-900 text-base sm:text-lg">Email</p>
              <p className="font-basecoat text-gray-500 text-sm sm:text-base">lespoulettes.benin@gmail.com</p>
            </div>
            <svg className="w-5 h-5 text-gray-300 group-hover:text-yellow-400 ml-auto transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>

          {/* Facebook */}
          <a
            href="https://www.facebook.com/lespoulettescouture"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-5 p-5 sm:p-6 rounded-2xl border border-gray-200 hover:border-blue-400 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
              <svg className="w-7 h-7 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
            <div>
              <p className="font-basecoat font-bold text-gray-900 text-base sm:text-lg">Facebook</p>
              <p className="font-basecoat text-gray-500 text-sm sm:text-base">Les Poulettes Couture</p>
            </div>
            <svg className="w-5 h-5 text-gray-300 group-hover:text-blue-400 ml-auto transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/lespoulettes.benin/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-5 p-5 sm:p-6 rounded-2xl border border-gray-200 hover:border-pink-400 bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-pink-50 group-hover:bg-pink-100 flex items-center justify-center transition-colors">
              <svg className="w-7 h-7 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </div>
            <div>
              <p className="font-basecoat font-bold text-gray-900 text-base sm:text-lg">Instagram</p>
              <p className="font-basecoat text-gray-500 text-sm sm:text-base">@lespoulettes.benin</p>
            </div>
            <svg className="w-5 h-5 text-gray-300 group-hover:text-pink-400 ml-auto transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
