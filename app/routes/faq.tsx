import { useState } from 'react';
import { Link } from '@remix-run/react';
import { useScrollAnimations } from '../hooks/useScrollAnimations';

export function meta() {
  return [
    { title: "FAQ — Questions fréquentes — Les Poulettes" },
    {
      name: "description",
      content:
        "Retrouvez les réponses à vos questions sur les commandes, la livraison, les paiements et les produits des Poulettes.",
    },
    { property: "og:title", content: "FAQ — Les Poulettes" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://lespoulettes.be/faq" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: "FAQ — Les Poulettes" },
  ];
}

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSection {
  title: string;
  emoji: string;
  items: FaqItem[];
}

const FAQ_SECTIONS: FaqSection[] = [
  {
    title: "Commandes & livraison",
    emoji: "📦",
    items: [
      {
        question: "Dans quels pays livrez-vous ?",
        answer:
          "Nous livrons en Belgique et dans toute l'Europe. Pour les clients au Bénin, nos produits sont disponibles directement à Cotonou. Contactez-nous via WhatsApp pour organiser une remise en main propre ou une livraison locale.",
      },
      {
        question: "Combien de temps prend la livraison ?",
        answer:
          "La livraison en Belgique prend généralement entre 3 et 7 jours ouvrables après expédition. Pour les autres pays européens, comptez 5 à 10 jours ouvrables. Vous recevrez un email de confirmation avec les informations de suivi dès que votre colis est expédié.",
      },
      {
        question: "Comment suivre ma commande ?",
        answer:
          "Une fois votre commande expédiée, vous recevrez un email avec un numéro de suivi. Vous pouvez également nous contacter directement via WhatsApp au +229 01 62 00 75 80 pour obtenir des informations sur l'avancement de votre commande.",
      },
      {
        question: "Puis-je commander en grande quantité pour un événement ?",
        answer:
          "Absolument ! Les Poulettes adorent les commandes de groupe pour mariages, baby showers, anniversaires, baptêmes, communions... Des sachets de dragées aux cadeaux personnalisés pour vos invités, nous réalisons tout. Contactez-nous pour un devis personnalisé.",
      },
    ],
  },
  {
    title: "Paiement & sécurité",
    emoji: "💳",
    items: [
      {
        question: "Quels moyens de paiement acceptez-vous ?",
        answer:
          "Nous acceptons les paiements par carte bancaire (Visa, Mastercard, American Express, Bancontact) via Stripe, une plateforme de paiement 100% sécurisée. Vos données bancaires ne sont jamais stockées sur nos serveurs.",
      },
      {
        question: "Le paiement en ligne est-il sécurisé ?",
        answer:
          "Oui, entièrement. Nous utilisons Stripe, l'un des leaders mondiaux du paiement en ligne, qui intègre le protocole de sécurité SSL (HTTPS) et la double authentification 3D Secure. Votre numéro de carte n'est jamais transmis à nos serveurs.",
      },
      {
        question: "Des frais supplémentaires s'appliquent-ils ?",
        answer:
          "Aucun frais caché. Le prix affiché sur chaque produit est le prix final. Des frais de livraison peuvent s'appliquer selon votre pays, et seront clairement indiqués avant la validation de votre commande.",
      },
    ],
  },
  {
    title: "Nos produits",
    emoji: "✂️",
    items: [
      {
        question: "Vos produits sont-ils vraiment faits main ?",
        answer:
          "Oui, à 100% ! Chaque pièce est entièrement réalisée à la main par nos artisanes à Cotonou, au Bénin. Aucune machine industrielle n'intervient dans notre processus de fabrication. C'est pourquoi chaque article est unique.",
      },
      {
        question: "D'où vient votre tissu wax ?",
        answer:
          "Nous utilisons du tissu wax authentique sourcé localement au Bénin et en Afrique de l'Ouest. Le wax est un tissu imprimé à la cire, emblématique de la culture africaine, reconnu pour ses motifs colorés et sa durabilité.",
      },
      {
        question: "Comment entretenir mes accessoires en wax ?",
        answer:
          "Pour préserver la beauté et les couleurs de votre tissu wax, lavez-le à la main ou en machine à 30°C maximum en programme délicat. Utilisez une lessive douce, évitez le sèche-linge et séchez à l'air libre à l'ombre. Repassez à température modérée avec un linge humide entre le fer et le tissu.",
      },
      {
        question: "Les produits sont-ils disponibles en différentes tailles ?",
        answer:
          "Nos produits sont disponibles en plusieurs coloris et motifs (appelés déclinaisons). Les tailles varient selon le type de produit (trousse, sac, housse d'ordinateur...). Les dimensions exactes sont indiquées sur chaque fiche produit.",
      },
    ],
  },
  {
    title: "Personnalisation",
    emoji: "🎨",
    items: [
      {
        question: "Puis-je personnaliser ma commande ?",
        answer:
          "Absolument ! Nous adorons les commandes personnalisées. Vous pouvez nous demander des couleurs spécifiques, des motifs particuliers, des initiales brodées, ou des dimensions sur mesure. Contactez-nous via WhatsApp ou par email pour discuter de votre projet.",
      },
      {
        question: "Combien coûte une commande personnalisée ?",
        answer:
          "Le prix d'une commande personnalisée dépend du type de personnalisation, des matériaux et de la complexité. Contactez-nous avec votre demande détaillée et nous vous ferons un devis gratuit dans les 48h.",
      },
      {
        question: "Quel est le délai pour une commande personnalisée ?",
        answer:
          "Les commandes personnalisées demandent généralement entre 1 et 3 semaines de fabrication, selon la complexité et notre charge de travail. Ce délai s'ajoute au délai de livraison habituel. Nous vous tiendrons informé à chaque étape.",
      },
    ],
  },
  {
    title: "Retours & remboursements",
    emoji: "🔄",
    items: [
      {
        question: "Puis-je retourner un article ?",
        answer:
          "Oui, nous acceptons les retours dans les 14 jours suivant la réception de votre commande, à condition que l'article soit non utilisé, dans son état d'origine et dans son emballage d'origine. Les articles personnalisés ne peuvent pas être retournés sauf en cas de défaut de fabrication.",
      },
      {
        question: "Comment procéder à un retour ?",
        answer:
          "Pour initier un retour, contactez-nous par email à lespoulettes.benin@gmail.com ou via WhatsApp en précisant votre numéro de commande et la raison du retour. Nous vous indiquerons la marche à suivre. Les frais de retour sont à votre charge sauf si l'article est défectueux.",
      },
      {
        question: "Quand serai-je remboursé·e ?",
        answer:
          "Une fois votre retour reçu et vérifié (sous 5 jours ouvrables), nous procédons au remboursement sur votre moyen de paiement original sous 5 à 10 jours ouvrables. Vous recevrez un email de confirmation.",
      },
    ],
  },
];

function FaqAccordion({ section }: { section: FaqSection }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mb-10 sm:mb-12">
      <h2 className="font-basecoat text-xl sm:text-2xl font-bold uppercase text-gray-900 mb-5 flex items-center gap-3">
        <span>{section.emoji}</span>
        <span>{section.title}</span>
      </h2>
      <div className="space-y-3">
        {section.items.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="border border-gray-200 rounded-2xl overflow-hidden bg-white"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 text-left font-basecoat font-semibold text-gray-900 text-sm sm:text-base hover:bg-gray-50 transition-colors"
              >
                <span className="flex-1">{item.question}</span>
                <span
                  className={`flex-shrink-0 w-6 h-6 rounded-full bg-yellow-100 flex items-center justify-center transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                >
                  <svg
                    className="w-3.5 h-3.5 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              {isOpen && (
                <div className="px-5 sm:px-6 pb-5">
                  <div className="border-t border-gray-100 pt-4">
                    <p className="font-basecoat text-gray-600 text-sm sm:text-base leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function FAQ() {
  const scrollRef = useScrollAnimations();

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
        <span className="text-gray-600">FAQ</span>
      </nav>

      {/* Titre */}
      <h1
        className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-[44px] font-bold uppercase text-gray-900"
        data-delay="0.1"
      >
        Questions fréquentes
      </h1>
      <div className="anim-fade-up w-16 sm:w-20 h-1 bg-yellow-400 mt-3 sm:mt-4" data-delay="0.15"></div>
      <p
        className="anim-fade-up font-basecoat text-gray-500 text-sm sm:text-base mt-3 mb-10 sm:mb-12 md:mb-16 max-w-xl"
        data-delay="0.2"
      >
        Vous avez une question ? Retrouvez ici les réponses aux questions les plus fréquentes.
        Si vous ne trouvez pas ce que vous cherchez, n'hésitez pas à nous contacter.
      </p>

      {/* Sections FAQ */}
      <div className="anim-fade-up max-w-3xl" data-delay="0.2">
        {FAQ_SECTIONS.map((section) => (
          <FaqAccordion key={section.title} section={section} />
        ))}
      </div>

      {/* CTA Contact */}
      <div className="anim-fade-up mt-10 sm:mt-12 p-6 sm:p-8 bg-yellow-50 border border-yellow-200 rounded-2xl max-w-xl" data-delay="0.3">
        <h2 className="font-basecoat font-bold text-gray-900 text-lg sm:text-xl uppercase mb-2">
          Vous n'avez pas trouvé votre réponse ?
        </h2>
        <p className="font-basecoat text-gray-600 text-sm sm:text-base mb-5">
          Notre équipe est disponible par WhatsApp et email pour répondre à toutes vos questions.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://wa.me/2290162007580"
            target="_blank"
            rel="noopener noreferrer"
            className="font-basecoat inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-5 py-2.5 rounded-xl transition hover:scale-105 text-sm"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            WhatsApp
          </a>
          <Link
            to="/contact"
            className="font-basecoat inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-5 py-2.5 rounded-xl transition hover:scale-105 text-sm"
          >
            Nous contacter
          </Link>
        </div>
      </div>
    </div>
  );
}
