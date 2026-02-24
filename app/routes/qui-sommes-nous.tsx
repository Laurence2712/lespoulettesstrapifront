import { Link } from '@remix-run/react';
import { useScrollAnimations } from '../hooks/useScrollAnimations';

export function meta() {
  return [
    { title: "Qui sommes-nous — Les Poulettes" },
    {
      name: "description",
      content:
        "Découvrez l'histoire des Poulettes : une marque d'accessoires éco-responsables créée au Bénin, confectionnée à la main par des artisanes béninoises passionnées.",
    },
    { property: "og:title", content: "Qui sommes-nous — Les Poulettes" },
    {
      property: "og:description",
      content: "L'histoire, les valeurs et les artisanes derrière Les Poulettes, marque d'accessoires wax fait main au Bénin.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://lespoulettes.be/qui-sommes-nous" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Qui sommes-nous — Les Poulettes" },
    { name: "twitter:description", content: "L'histoire et les valeurs des Poulettes, accessoires wax fait main au Bénin." },
  ];
}

export default function QuiSommesNous() {
  const scrollRef = useScrollAnimations([]);

  return (
    <div ref={scrollRef} className="overflow-x-hidden">

      {/* ── Hero ── */}
      <header className="bg-beige pt-28 sm:pt-32 md:pt-40 pb-14 sm:pb-18 md:pb-24 px-4 sm:px-6 md:px-[60px] lg:px-[120px]">
        <nav className="anim-fade-up font-basecoat mb-8 text-xs sm:text-sm">
          <Link to="/" className="text-benin-jaune hover:text-benin-terre font-medium transition">Accueil</Link>
          <span className="mx-1.5 text-gray-400">/</span>
          <span className="text-gray-600">Qui sommes-nous</span>
        </nav>
        <div className="max-w-3xl">
          <h1 className="anim-fade-up font-basecoat text-3xl sm:text-4xl md:text-[56px] font-bold uppercase text-gray-900 leading-tight">
            L'âme des Poulettes
          </h1>
          <div className="anim-fade-up w-20 h-1.5 bg-wax-orange mt-4 mb-6" data-delay="0.1"></div>
          <p className="anim-fade-up font-basecoat text-lg sm:text-xl md:text-2xl text-gray-700 leading-relaxed" data-delay="0.2">
            Une marque née de la passion du tissu wax, de l'artisanat solidaire et d'une envie profonde de mettre en lumière le savoir-faire béninois.
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

      {/* ── Notre histoire ── */}
      <section className="px-4 sm:px-6 md:px-[60px] lg:px-[120px] py-14 sm:py-18 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="anim-fade-right order-2 md:order-1" data-delay="0.1">
            <h2 className="font-basecoat text-2xl sm:text-3xl md:text-[40px] font-bold uppercase text-gray-900 mb-2">
              Notre histoire
            </h2>
            <div className="w-16 h-1 bg-wax-turquoise mb-6"></div>
            <p className="font-basecoat text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
              Les Poulettes sont nées d'une histoire d'amour entre la Belgique et le Bénin. Fondée par Laurence, la marque a vu le jour avec une conviction simple : les tissus wax africains méritent d'être portés au quotidien, avec style et conscience.
            </p>
            <p className="font-basecoat text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
              Ce qui a commencé comme une création artisanale dans un atelier de Cotonou est devenu une marque à part entière — reconnue pour ses pièces uniques, ses coloris vibrants et son engagement social.
            </p>
            <p className="font-basecoat text-base sm:text-lg text-gray-700 leading-relaxed">
              Chaque collection est une invitation à voyager, à célébrer la créativité béninoise et à choisir une mode qui a du sens.
            </p>
          </div>
          <div className="anim-scale order-1 md:order-2 flex justify-center" data-delay="0.2">
            <div className="relative w-full max-w-sm">
              <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-2xl border-4 border-benin-jaune">
                <img
                  src="/assets/equipe-1.jpg"
                  alt="Fondatrice Les Poulettes"
                  loading="lazy"
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-wax-orange text-white font-basecoat text-xs font-bold uppercase px-4 py-2 rounded-xl shadow-lg">
                Depuis 2019
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Nos valeurs ── */}
      <section className="bg-gray-50 px-4 sm:px-6 md:px-[60px] lg:px-[120px] py-14 sm:py-18 md:py-24">
        <div className="text-center mb-12">
          <h2 className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-[40px] font-bold uppercase text-gray-900">
            Nos valeurs
          </h2>
          <div className="anim-fade-up w-16 h-1 bg-wax-yellow mx-auto mt-4" data-delay="0.1"></div>
        </div>
        <div className="anim-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-stagger="0.1">
          <div className="bg-white rounded-2xl p-7 shadow-sm border-t-4 border-wax-turquoise">
            <div className="w-12 h-12 bg-wax-turquoise/10 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">✂️</span>
            </div>
            <h3 className="font-basecoat text-lg font-bold uppercase text-gray-900 mb-3">100% fait main</h3>
            <p className="font-basecoat text-sm text-gray-600 leading-relaxed">
              Chaque trousse, chaque sac, chaque housse est découpé et cousu à la main dans notre atelier de Cotonou. Pas de production industrielle — uniquement le travail patient et précis de nos artisanes.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-7 shadow-sm border-t-4 border-wax-green">
            <div className="w-12 h-12 bg-wax-green/10 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🌿</span>
            </div>
            <h3 className="font-basecoat text-lg font-bold uppercase text-gray-900 mb-3">Éco-responsable</h3>
            <p className="font-basecoat text-sm text-gray-600 leading-relaxed">
              Nous travaillons avec des tissus wax de qualité issus de circuits courts locaux. Nos emballages sont minimalistes et recyclables. Chaque choix de production est pensé pour minimiser notre impact environnemental.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-7 shadow-sm border-t-4 border-wax-orange">
            <div className="w-12 h-12 bg-wax-orange/10 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🤝</span>
            </div>
            <h3 className="font-basecoat text-lg font-bold uppercase text-gray-900 mb-3">Artisanat solidaire</h3>
            <p className="font-basecoat text-sm text-gray-600 leading-relaxed">
              Chaque achat soutient directement nos artisanes et leurs familles au Bénin. Nous croyons en une mode qui crée de la valeur là où elle est fabriquée — pas seulement là où elle est vendue.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-7 shadow-sm border-t-4 border-wax-red">
            <div className="w-12 h-12 bg-wax-red/10 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🌍</span>
            </div>
            <h3 className="font-basecoat text-lg font-bold uppercase text-gray-900 mb-3">Wax authentique</h3>
            <p className="font-basecoat text-sm text-gray-600 leading-relaxed">
              Nous sélectionnons nos tissus wax avec soin — pour leurs motifs, leur tenue et leur authenticité. Le wax africain est bien plus qu'un tissu : c'est un langage, une tradition, une identité.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-7 shadow-sm border-t-4 border-wax-yellow">
            <div className="w-12 h-12 bg-wax-yellow/10 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🎨</span>
            </div>
            <h3 className="font-basecoat text-lg font-bold uppercase text-gray-900 mb-3">Pièces uniques</h3>
            <p className="font-basecoat text-sm text-gray-600 leading-relaxed">
              Chaque création est unique. Les tissus varient d'une collection à l'autre, les motifs évoluent avec les saisons. Votre accessoire Les Poulettes ne ressemble à aucun autre — et c'est tout son charme.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-7 shadow-sm border-t-4 border-gray-800">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">💛</span>
            </div>
            <h3 className="font-basecoat text-lg font-bold uppercase text-gray-900 mb-3">Sur mesure & sur demande</h3>
            <p className="font-basecoat text-sm text-gray-600 leading-relaxed">
              Mariage, baby shower, anniversaire, événement d'entreprise... Nous confectionnons des créations personnalisées pour que votre occasion soit inoubliable. Contactez-nous pour un devis.
            </p>
          </div>
        </div>
      </section>

      {/* ── Dans notre atelier ── */}
      <section className="px-4 sm:px-6 md:px-[60px] lg:px-[120px] py-14 sm:py-18 md:py-24 bg-beige">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="anim-fade-right" data-delay="0.1">
            <h2 className="font-basecoat text-2xl sm:text-3xl md:text-[40px] font-bold uppercase text-gray-900 mb-2">
              Dans notre atelier
            </h2>
            <div className="w-16 h-1 bg-wax-orange mb-6"></div>
            <p className="font-basecoat text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
              Notre atelier se trouve à Cotonou, au cœur du Bénin. C'est là que tout commence : la sélection des tissus sur les marchés locaux, le tracé des patrons, la découpe minutieuse, l'assemblage couture après couture.
            </p>
            <p className="font-basecoat text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
              Nos artisanes travaillent à leur rythme, avec leur savoir-faire transmis de génération en génération. Aucune machine industrielle — seulement des mains habiles, une machine à coudre et beaucoup d'amour du travail bien fait.
            </p>
            <p className="font-basecoat text-base sm:text-lg text-gray-700 leading-relaxed">
              Le résultat ? Des pièces solides, durables, avec un soin du détail qui se voit et se sent dès la première utilisation.
            </p>
          </div>
          <div className="anim-fade-left grid grid-cols-2 gap-3" data-delay="0.2">
            {['bg-wax-turquoise', 'bg-wax-yellow', 'bg-wax-orange', 'bg-wax-green'].map((color, i) => (
              <div key={i} className={`${color} aspect-square rounded-2xl opacity-80`} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Impact social ── */}
      <section className="px-4 sm:px-6 md:px-[60px] lg:px-[120px] py-14 sm:py-18 md:py-24">
        <div className="text-center mb-12">
          <h2 className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-[40px] font-bold uppercase text-gray-900">
            Notre impact
          </h2>
          <div className="anim-fade-up w-16 h-1 bg-wax-green mx-auto mt-4 mb-6" data-delay="0.1"></div>
          <p className="anim-fade-up font-basecoat text-gray-600 text-base sm:text-lg max-w-2xl mx-auto" data-delay="0.15">
            Derrière chaque accessoire, il y a une artisane, une famille, une communauté. Acheter Les Poulettes, c'est choisir une mode qui a un vrai impact humain.
          </p>
        </div>
        <div className="anim-stagger grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto" data-stagger="0.12">
          <div className="text-center bg-gray-50 rounded-2xl p-8">
            <p className="font-basecoat text-4xl sm:text-5xl font-bold text-benin-jaune mb-2">100%</p>
            <p className="font-basecoat text-sm font-semibold uppercase text-gray-700">Fait main au Bénin</p>
          </div>
          <div className="text-center bg-gray-50 rounded-2xl p-8">
            <p className="font-basecoat text-4xl sm:text-5xl font-bold text-benin-jaune mb-2">0</p>
            <p className="font-basecoat text-sm font-semibold uppercase text-gray-700">Production industrielle</p>
          </div>
          <div className="text-center bg-gray-50 rounded-2xl p-8">
            <p className="font-basecoat text-4xl sm:text-5xl font-bold text-benin-jaune mb-2">♥</p>
            <p className="font-basecoat text-sm font-semibold uppercase text-gray-700">Artisanes soutenues directement</p>
          </div>
        </div>
      </section>

      {/* ── CTAs ── */}
      <section className="bg-gray-900 px-4 sm:px-6 md:px-[60px] lg:px-[120px] py-14 sm:py-18 md:py-24 text-center">
        <h2 className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-[40px] font-bold uppercase text-white mb-4">
          Prête à craquer pour une pièce unique ?
        </h2>
        <div className="anim-fade-up w-16 h-1 bg-benin-jaune mx-auto mt-4 mb-8" data-delay="0.1"></div>
        <p className="anim-fade-up font-basecoat text-gray-400 text-base sm:text-lg mb-10 max-w-xl mx-auto" data-delay="0.15">
          Explorez notre boutique ou contactez-nous pour une commande sur mesure.
        </p>
        <div className="anim-fade-up flex flex-col sm:flex-row gap-4 justify-center" data-delay="0.2">
          <Link
            to="/realisations"
            className="font-basecoat border-2 border-benin-jaune text-white hover:bg-benin-jaune hover:text-black px-10 py-4 rounded-xl font-bold uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
          >
            Voir la boutique
          </Link>
          <Link
            to="/commandes-personnalisees"
            className="font-basecoat border-2 border-gray-600 text-gray-300 hover:border-white hover:text-white px-10 py-4 rounded-xl font-bold uppercase tracking-wider transition-all duration-200 hover:scale-[1.02]"
          >
            Commande personnalisée
          </Link>
        </div>
      </section>

    </div>
  );
}
