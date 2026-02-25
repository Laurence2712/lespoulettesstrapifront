import { Link } from '@remix-run/react';
import { useScrollAnimations } from '../hooks/useScrollAnimations';

export function meta() {
  return [
    { title: "Guide des tailles & Entretien — Les Poulettes" },
    {
      name: "description",
      content:
        "Trouvez les dimensions de nos trousses, sacs et housses, et découvrez comment entretenir vos accessoires en tissu wax Les Poulettes pour qu'ils durent longtemps.",
    },
    { property: "og:title", content: "Guide des tailles & Entretien — Les Poulettes" },
    {
      property: "og:description",
      content: "Dimensions, contenance et conseils d'entretien pour vos accessoires wax faits main au Bénin.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://lespoulettes.be/guide-des-tailles" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: "Guide des tailles & Entretien — Les Poulettes" },
  ];
}

const SIZES = [
  {
    category: 'Trousses',
    icon: '👜',
    color: 'border-wax-turquoise',
    accent: 'bg-wax-turquoise',
    description: 'Idéales pour les essentiels du quotidien — clés, cosmétiques, câbles, monnaie.',
    items: [
      { name: 'Trousse S', dims: '~18 × 10 cm', ideal: 'Maquillage léger, câbles USB, petite monnaie' },
      { name: 'Trousse M', dims: '~24 × 14 cm', ideal: 'Trousse de toilette voyage, cosmétiques, crayons' },
      { name: 'Trousse L', dims: '~30 × 18 cm', ideal: 'Trousse de toilette complète, accessoires bébé' },
    ],
  },
  {
    category: 'Sacs & Tote bags',
    icon: '🛍️',
    color: 'border-wax-orange',
    accent: 'bg-wax-orange',
    description: 'Pour le quotidien, les courses, le bureau ou les sorties — pratiques et colorés.',
    items: [
      { name: 'Tote bag S', dims: '~30 × 35 cm', ideal: 'Courses légères, livre, petites affaires' },
      { name: 'Tote bag M', dims: '~38 × 42 cm', ideal: 'Courses, plage, bureau, sport' },
      { name: 'Tote bag L', dims: '~45 × 50 cm', ideal: 'Grande capacité, courses hebdomadaires, voyage' },
    ],
  },
  {
    category: 'Housses',
    icon: '💻',
    color: 'border-wax-green',
    accent: 'bg-wax-green',
    description: 'Protégez votre ordinateur ou tablette avec style — doublure en coton doux.',
    items: [
      { name: 'Housse 11-12"', dims: '~30 × 22 cm', ideal: 'MacBook Air 11-12", iPad Pro, tablettes' },
      { name: 'Housse 13-14"', dims: '~35 × 26 cm', ideal: 'MacBook Pro 13-14", laptops 13"' },
      { name: 'Housse 15-16"', dims: '~40 × 30 cm', ideal: 'MacBook Pro 16", laptops 15"' },
    ],
  },
];

const CARE = [
  {
    icon: '🧺',
    title: 'Lavage',
    text: 'Lavage à la main ou en machine à 30°C, en programme délicat. Évitez les cycles chauds qui peuvent altérer les couleurs du wax.',
  },
  {
    icon: '🔆',
    title: 'Séchage',
    text: 'Séchage à l\'air libre, à plat ou suspendu. Évitez le sèche-linge et l\'exposition prolongée au soleil direct.',
  },
  {
    icon: '🧴',
    title: 'Détachage',
    text: 'En cas de tache, tamponnez délicatement avec un peu de savon de Marseille et de l\'eau froide. Ne pas frotter.',
  },
  {
    icon: '👕',
    title: 'Repassage',
    text: 'Repassez à l\'envers, à température moyenne (coton), sans vapeur. Cela ravive les couleurs et maintient la tenue du tissu.',
  },
  {
    icon: '📦',
    title: 'Rangement',
    text: 'Rangez à l\'abri de la lumière et de l\'humidité. Évitez de plier sur les mêmes plis trop longtemps pour préserver la forme.',
  },
  {
    icon: '⏳',
    title: 'Durabilité',
    text: 'Le tissu wax est conçu pour durer. Avec un entretien adapté, votre accessoire Les Poulettes vous accompagne des années.',
  },
];

export default function GuideTailles() {
  const scrollRef = useScrollAnimations([]);

  return (
    <div ref={scrollRef} className="overflow-x-hidden">

      {/* ── Header ── */}
      <header className="bg-beige pt-28 sm:pt-32 md:pt-40 pb-14 sm:pb-18 md:pb-24 px-4 sm:px-6 md:px-[60px] lg:px-[120px]">
        <nav className="anim-fade-up font-basecoat mb-8 text-xs sm:text-sm">
          <Link to="/" className="text-benin-jaune hover:text-benin-terre font-medium transition">Accueil</Link>
          <span className="mx-1.5 text-gray-400">/</span>
          <span className="text-gray-600">Guide des tailles & Entretien</span>
        </nav>
        <div className="max-w-3xl">
          <h1 className="anim-fade-up font-basecoat text-3xl sm:text-4xl md:text-[56px] font-bold uppercase text-gray-900 leading-tight">
            Guide des tailles & Entretien
          </h1>
          <div className="anim-expand-line w-24 h-px bg-benin-jaune mt-4 mb-6" data-delay="0.1"></div>
          <p className="anim-fade-up font-basecoat text-lg sm:text-xl text-gray-700 leading-relaxed" data-delay="0.2">
            Toutes les informations dont vous avez besoin pour choisir la bonne taille et entretenir vos accessoires Les Poulettes.
          </p>
        </div>
      </header>


      {/* ── Note dimensions ── */}
      <div className="px-4 sm:px-6 md:px-[60px] lg:px-[120px] py-6 sm:py-8">
        <div className="bg-benin-jaune/10 border-l-4 border-benin-jaune rounded-r-xl p-5 font-basecoat text-sm text-gray-700 max-w-3xl">
          <strong>Important :</strong> Les dimensions indiquées sont approximatives. Chaque pièce étant faite main, de légères variations de quelques centimètres sont normales — c'est la signature de l'artisanat !
        </div>
      </div>

      {/* ── Tableaux par catégorie ── */}
      {SIZES.map((cat) => (
        <section key={cat.category} className="px-4 sm:px-6 md:px-[60px] lg:px-[120px] py-10 sm:py-12">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{cat.icon}</span>
            <h2 className="font-basecoat text-2xl sm:text-3xl font-bold uppercase text-gray-900">{cat.category}</h2>
          </div>
          <div className="anim-expand-line w-20 h-px bg-benin-jaune mb-4"></div>
          <p className="font-basecoat text-gray-600 text-sm sm:text-base mb-6 max-w-xl">{cat.description}</p>

          <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
            <table className="w-full font-basecoat text-sm sm:text-base">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className={`text-left py-4 px-5 font-bold uppercase text-gray-900 text-xs sm:text-sm tracking-wider border-l-4 ${cat.color}`}>Modèle</th>
                  <th className="text-left py-4 px-5 font-bold uppercase text-gray-900 text-xs sm:text-sm tracking-wider">Dimensions (L × H)</th>
                  <th className="text-left py-4 px-5 font-bold uppercase text-gray-900 text-xs sm:text-sm tracking-wider hidden sm:table-cell">Idéal pour</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {cat.items.map((item, i) => (
                  <tr key={i} className="bg-white hover:bg-gray-50 transition-colors">
                    <td className={`py-4 px-5 font-semibold text-gray-900 border-l-4 ${cat.color}`}>{item.name}</td>
                    <td className="py-4 px-5 text-gray-600">{item.dims}</td>
                    <td className="py-4 px-5 text-gray-500 hidden sm:table-cell">{item.ideal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Version mobile "idéal pour" */}
          <div className="sm:hidden mt-3 space-y-2">
            {cat.items.map((item, i) => (
              <p key={i} className="font-basecoat text-xs text-gray-500">
                <span className="font-semibold text-gray-700">{item.name} :</span> {item.ideal}
              </p>
            ))}
          </div>
        </section>
      ))}

      {/* ── Matières ── */}
      <section className="bg-beige px-4 sm:px-6 md:px-[60px] lg:px-[120px] py-14 sm:py-18">
        <h2 className="anim-fade-up font-basecoat text-2xl sm:text-3xl font-bold uppercase text-gray-900 mb-2">
          Nos matières
        </h2>
        <div className="anim-expand-line w-20 h-px bg-benin-jaune mb-6" data-delay="0.1"></div>
        <div className="anim-stagger grid grid-cols-1 sm:grid-cols-3 gap-5" data-stagger="0.1">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-basecoat font-bold uppercase text-gray-900 mb-3 text-base">Tissu extérieur</h3>
            <p className="font-basecoat text-sm text-gray-600 leading-relaxed">Wax africain 100% coton de haute qualité, tissé et imprimé à la main. Résistant, lavable, aux motifs uniques.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-basecoat font-bold uppercase text-gray-900 mb-3 text-base">Doublure intérieure</h3>
            <p className="font-basecoat text-sm text-gray-600 leading-relaxed">Coton doux coordonné ou contrasté — protège vos affaires et facilite la recherche à l'intérieur.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-basecoat font-bold uppercase text-gray-900 mb-3 text-base">Fermetures</h3>
            <p className="font-basecoat text-sm text-gray-600 leading-relaxed">Fermetures à glissière ou liens en tissu, selon le modèle. Solides et pratiques au quotidien.</p>
          </div>
        </div>
      </section>

      {/* ── Entretien ── */}
      <section className="px-4 sm:px-6 md:px-[60px] lg:px-[120px] py-14 sm:py-18">
        <div className="mb-12">
          <h2 className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-[40px] font-bold uppercase text-gray-900">
            Conseils d'entretien
          </h2>
          <div className="anim-expand-line w-20 h-px bg-benin-jaune mt-4 mb-6" data-delay="0.1"></div>
          <p className="anim-fade-up font-basecoat text-gray-500 text-base sm:text-lg max-w-xl" data-delay="0.15">
            Bien entretenu, votre accessoire Les Poulettes vous accompagnera des années.
          </p>
        </div>
        <div className="anim-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" data-stagger="0.1">
          {CARE.map((tip) => (
            <div key={tip.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="text-3xl mb-3">{tip.icon}</div>
              <h3 className="font-basecoat font-bold uppercase text-gray-900 mb-2 text-base">{tip.title}</h3>
              <p className="font-basecoat text-sm text-gray-600 leading-relaxed">{tip.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-gray-50 px-4 sm:px-6 md:px-[60px] lg:px-[120px] py-12 sm:py-14 text-center">
        <p className="font-basecoat text-gray-600 text-base sm:text-lg mb-6">
          Une question sur la taille ou le modèle qui vous convient ?
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/realisations"
            className="font-basecoat border-2 border-benin-jaune text-gray-900 hover:bg-benin-jaune hover:text-black px-10 py-4 rounded-xl font-bold uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
          >
            Voir la boutique
          </Link>
          <a
            href="https://wa.me/2290162007580"
            target="_blank"
            rel="noopener noreferrer"
            className="font-basecoat border-2 border-gray-300 text-gray-700 hover:border-benin-vert hover:text-benin-vert px-10 py-4 rounded-xl font-bold uppercase tracking-wider transition-all duration-200 hover:scale-[1.02]"
          >
            Demander conseil sur WhatsApp
          </a>
        </div>
      </section>

    </div>
  );
}
