import { Link } from '@remix-run/react';
import { useScrollAnimations } from '../hooks/useScrollAnimations';

export function meta() {
  return [
    { title: "Commandes personnalisées — Les Poulettes" },
    {
      name: "description",
      content:
        "Les Poulettes créent des accessoires wax sur mesure pour vos événements : mariage, baby shower, anniversaire, baptême, communion. Cadeaux personnalisés faits main au Bénin.",
    },
    { property: "og:title", content: "Commandes personnalisées — Les Poulettes" },
    {
      property: "og:description",
      content: "Accessoires wax sur mesure pour tous vos événements. Mariage, baby shower, anniversaire... Commandez des cadeaux uniques faits main au Bénin.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://lespoulettes.be/commandes-personnalisees" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Commandes personnalisées — Les Poulettes" },
  ];
}

const EVENTS = [
  { icon: '💍', label: 'Mariage', desc: 'Sachets dragées, cadeaux invités, trousses mariées & demoiselles d\'honneur' },
  { icon: '🍼', label: 'Baby shower', desc: 'Petits cadeaux wax pour accueillir le nouveau bébé avec style' },
  { icon: '✝️', label: 'Baptême & communion', desc: 'Souvenirs personnalisés pour vos cérémonies religieuses' },
  { icon: '🎂', label: 'Anniversaire', desc: 'Cadeaux invités coordonnés aux couleurs de votre fête' },
  { icon: '🎉', label: 'Naissance', desc: 'Trousses, pochettes et accessoires pour célébrer l\'arrivée d\'un enfant' },
  { icon: '🏢', label: 'Événement corporate', desc: 'Cadeaux d\'entreprise originaux et éco-responsables pour vos équipes' },
];

const STEPS = [
  {
    num: '01',
    title: 'Contactez-nous',
    desc: 'Décrivez votre projet par WhatsApp ou email : type d\'événement, nombre de pièces, couleurs souhaitées, date de besoin.',
    color: 'bg-wax-turquoise',
  },
  {
    num: '02',
    title: 'Devis personnalisé',
    desc: 'Nous vous répondons dans les 48h avec une proposition adaptée à votre budget et vos envies.',
    color: 'bg-wax-yellow',
  },
  {
    num: '03',
    title: 'Confection à la main',
    desc: 'Nos artisanes béninoises confectionnent vos pièces avec soin, en sélectionnant les meilleurs tissus wax.',
    color: 'bg-wax-orange',
  },
  {
    num: '04',
    title: 'Livraison ou retrait',
    desc: 'Livraison en Belgique/Europe ou retrait gratuit à Grimbergen, Watermael-Boisfort ou Cotonou.',
    color: 'bg-wax-green',
  },
];

export default function CommandesPersonnalisees() {
  const scrollRef = useScrollAnimations([]);

  return (
    <div ref={scrollRef} className="overflow-x-hidden">

      {/* ── Hero ── */}
      <header className="bg-beige pt-28 sm:pt-32 md:pt-40 pb-14 sm:pb-18 md:pb-24 px-4 sm:px-6 md:px-[60px] lg:px-[120px]">
        <nav className="anim-fade-up font-basecoat mb-8 text-xs sm:text-sm">
          <Link to="/" className="text-yellow-600 hover:text-yellow-700 font-medium transition">Accueil</Link>
          <span className="mx-1.5 text-gray-400">/</span>
          <span className="text-gray-600">Commandes personnalisées</span>
        </nav>
        <div className="max-w-3xl">
          <h1 className="anim-fade-up font-basecoat text-3xl sm:text-4xl md:text-[56px] font-bold uppercase text-gray-900 leading-tight">
            Commandes personnalisées
          </h1>
          <div className="anim-fade-up w-20 h-1.5 bg-wax-orange mt-4 mb-6" data-delay="0.1"></div>
          <p className="anim-fade-up font-basecoat text-lg sm:text-xl md:text-2xl text-gray-700 leading-relaxed" data-delay="0.2">
            Un événement à fêter ? Les Poulettes créent pour vous des pièces uniques, aux couleurs de votre occasion — faites main au Bénin, avec amour.
          </p>
        </div>
      </header>

      {/* ── Bande wax ── */}
      <div className="flex h-2 w-full" aria-hidden="true">
        <div className="flex-1 bg-wax-turquoise" />
        <div className="flex-1 bg-wax-yellow" />
        <div className="flex-1 bg-wax-orange" />
        <div className="flex-1 bg-wax-red" />
        <div className="flex-1 bg-wax-green" />
      </div>

      {/* ── Pour quels événements ? ── */}
      <section className="px-4 sm:px-6 md:px-[60px] lg:px-[120px] py-14 sm:py-18 md:py-24">
        <div className="text-center mb-12">
          <h2 className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-[40px] font-bold uppercase text-gray-900">
            Pour quels événements ?
          </h2>
          <div className="anim-fade-up w-16 h-1 bg-wax-turquoise mx-auto mt-4 mb-6" data-delay="0.1"></div>
          <p className="anim-fade-up font-basecoat text-gray-500 text-base sm:text-lg max-w-2xl mx-auto" data-delay="0.15">
            Des sachets de dragées aux cadeaux d'invités en passant par les trousses personnalisées — nous sommes là pour rendre votre fête inoubliable.
          </p>
        </div>
        <div className="anim-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" data-stagger="0.1">
          {EVENTS.map((event) => (
            <div key={event.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">{event.icon}</div>
              <h3 className="font-basecoat text-base font-bold uppercase text-gray-900 mb-2">{event.label}</h3>
              <p className="font-basecoat text-sm text-gray-600 leading-relaxed">{event.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Comment ça marche ── */}
      <section className="bg-gray-50 px-4 sm:px-6 md:px-[60px] lg:px-[120px] py-14 sm:py-18 md:py-24">
        <div className="text-center mb-12">
          <h2 className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-[40px] font-bold uppercase text-gray-900">
            Comment ça marche ?
          </h2>
          <div className="anim-fade-up w-16 h-1 bg-wax-orange mx-auto mt-4 mb-6" data-delay="0.1"></div>
          <p className="anim-fade-up font-basecoat text-gray-500 text-base sm:text-lg max-w-xl mx-auto" data-delay="0.15">
            Un processus simple, transparent et pensé pour vous faciliter la vie.
          </p>
        </div>
        <div className="anim-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" data-stagger="0.12">
          {STEPS.map((step) => (
            <div key={step.num} className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <div className={`${step.color} text-white font-basecoat font-black text-xl w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4`}>
                {step.num}
              </div>
              <h3 className="font-basecoat text-base font-bold uppercase text-gray-900 mb-3">{step.title}</h3>
              <p className="font-basecoat text-sm text-gray-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Ce qu'on peut créer ── */}
      <section className="px-4 sm:px-6 md:px-[60px] lg:px-[120px] py-14 sm:py-18 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="anim-fade-right" data-delay="0.1">
            <h2 className="font-basecoat text-2xl sm:text-3xl md:text-[40px] font-bold uppercase text-gray-900 mb-2">
              Ce que nous créons
            </h2>
            <div className="w-16 h-1 bg-wax-green mb-6"></div>
            <ul className="space-y-3 font-basecoat text-base sm:text-lg text-gray-700">
              {[
                'Sachets et pochettes pour dragées',
                'Trousses de toilette et trousses de maquillage',
                'Sacs et tote bags personnalisés',
                'Housses pour ordinateurs et tablettes',
                'Porte-clés et petits accessoires',
                'Emballages cadeaux en tissu wax',
                'Signets et carnets recouverts de wax',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-yellow-400 font-bold flex-shrink-0 mt-0.5">◆</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="font-basecoat text-sm text-gray-500 mt-5 italic">
              Et bien plus encore — si vous avez une idée, parlez-nous en !
            </p>
          </div>
          <div className="anim-fade-left" data-delay="0.2">
            <div className="bg-beige rounded-2xl p-8">
              <h3 className="font-basecoat text-lg font-bold uppercase text-gray-900 mb-4">Informations utiles</h3>
              <ul className="space-y-4 font-basecoat text-sm text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-wax-turquoise flex-shrink-0 mt-1.5"></span>
                  <span><strong>Délai :</strong> comptez 2 à 4 semaines selon la quantité. Commandez tôt pour éviter les délais de dernière minute.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-wax-orange flex-shrink-0 mt-1.5"></span>
                  <span><strong>Quantité minimum :</strong> pas de minimum imposé — nous traitons les petites comme les grandes commandes.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-wax-green flex-shrink-0 mt-1.5"></span>
                  <span><strong>Tissus :</strong> vous pouvez choisir parmi nos stocks disponibles ou suggérer une couleur/motif spécifique.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-wax-yellow flex-shrink-0 mt-1.5"></span>
                  <span><strong>Tarif :</strong> devis gratuit et sans engagement, adapté à votre budget.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Contact ── */}
      <section className="bg-gray-900 px-4 sm:px-6 md:px-[60px] lg:px-[120px] py-14 sm:py-18 md:py-24 text-center">
        <h2 className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-[40px] font-bold uppercase text-white mb-4">
          Parlons de votre projet !
        </h2>
        <div className="anim-fade-up w-16 h-1 bg-yellow-400 mx-auto mt-4 mb-8" data-delay="0.1"></div>
        <p className="anim-fade-up font-basecoat text-gray-400 text-base sm:text-lg mb-10 max-w-xl mx-auto" data-delay="0.15">
          Décrivez-nous votre événement, la quantité souhaitée et votre date de besoin. Nous vous répondons dans les 48h avec un devis personnalisé.
        </p>
        <div className="anim-fade-up flex flex-col sm:flex-row gap-4 justify-center" data-delay="0.2">
          <a
            href="https://wa.me/2290162007580"
            target="_blank"
            rel="noopener noreferrer"
            className="font-basecoat inline-flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white px-10 py-4 rounded-xl font-bold uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            WhatsApp
          </a>
          <Link
            to="/contact"
            className="font-basecoat border-2 border-gray-600 text-gray-300 hover:border-white hover:text-white px-10 py-4 rounded-xl font-bold uppercase tracking-wider transition-all duration-200 hover:scale-[1.02]"
          >
            Formulaire de contact
          </Link>
        </div>
      </section>

    </div>
  );
}
