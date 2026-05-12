import { useState } from "react";
import { Link, Form, useActionData, useNavigation } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { useScrollAnimations } from "../hooks/useScrollAnimations";
import { getApiUrl } from "../config/api";
import { useTranslation } from "react-i18next";
import { useLocalePath } from "../hooks/useLocalePath";

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
  const { t } = useTranslation();
  const lp = useLocalePath();
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
        <Link to={lp('/')} className="text-benin-jaune hover:text-benin-jaune/70 font-medium transition">
          {t('common.home')}
        </Link>
        <span className="mx-1.5 sm:mx-2 text-gray-400 dark:text-gray-500">/</span>
        <span className="text-gray-600 dark:text-gray-400 dark:text-gray-500">{t('contact.breadcrumb')}</span>
      </nav>

      {/* Titre */}
      <h1
        className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-[44px] font-bold uppercase text-gray-900 dark:text-gray-100"
        data-delay="0.1"
      >
        {t('contact.title')}
      </h1>
      <div className="anim-expand-line w-24 sm:w-28 h-[2px] bg-gradient-to-r from-benin-jaune via-benin-jaune/60 to-transparent mt-3 sm:mt-4" data-delay="0.15"></div>
      <p className="anim-fade-up font-basecoat sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 mt-3 mb-8 sm:mb-10 md:mb-12" data-delay="0.2">
        
      </p>

      <div className="w-full lg:w-3/4">

        {/* ── Formulaire ── */}
        <div className="anim-fade-right" data-delay="0.2">
          <Form method="post" className="space-y-5">
            <div>
              <label htmlFor="name" className="font-basecoat block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('contact.name_placeholder')}
                required
                className="form-field font-basecoat w-full rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm sm:text-base bg-white dark:bg-gray-900"
              />
            </div>

            <div>
              <label htmlFor="email" className="font-basecoat block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('contact.email_placeholder')}
                required
                className="form-field font-basecoat w-full rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm sm:text-base bg-white dark:bg-gray-900"
              />
            </div>

            <div>
              <label htmlFor="message" className="font-basecoat block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('contact.message_placeholder')}
                rows={5}
                required
                className="form-field font-basecoat w-full rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3 text-sm sm:text-base resize-none bg-white dark:bg-gray-900"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="font-basecoat bg-benin-jaune text-black dark:text-gray-100 hover:bg-black hover:text-benin-jaune px-6 py-3 rounded-md text-sm sm:text-base font-semibold uppercase tracking-wide transition-all duration-300 inline-flex items-center gap-2"
            >
              {isSubmitting ? t('contact.sending') : t('contact.send')}
            </button>

            {actionData?.success && (
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-benin-jaune flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <p className="font-basecoat text-benin-jaune font-semibold text-sm">
                    {t('contact.success')}
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

      </div>
    </div>
  );
}
