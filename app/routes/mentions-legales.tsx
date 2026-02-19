import { Link } from "@remix-run/react";
import { useScrollAnimations } from "../hooks/useScrollAnimations";

export function meta() {
  return [
    { title: "Mentions légales & CGV — Les Poulettes" },
    {
      name: "description",
      content:
        "Mentions légales, conditions générales de vente et politique de retour de Les Poulettes.",
    },
    { property: "og:title", content: "Mentions légales & CGV — Les Poulettes" },
    { property: "og:url", content: "https://lespoulettes.be/mentions-legales" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: "Mentions légales & CGV — Les Poulettes" },
  ];
}

export default function MentionsLegales() {
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
        <span className="text-gray-600">Mentions légales & CGV</span>
      </nav>

      <h1
        className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-[44px] font-bold uppercase text-gray-900"
        data-delay="0.1"
      >
        Mentions légales & CGV
      </h1>
      <div className="anim-fade-up w-16 sm:w-20 h-1 bg-yellow-400 mt-3 sm:mt-4 mb-10 sm:mb-12" data-delay="0.15"></div>

      <div className="max-w-3xl space-y-10 font-basecoat text-gray-700 text-sm sm:text-base leading-relaxed">

        {/* 1. Éditeur */}
        <section className="anim-fade-up" data-delay="0.2">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 uppercase mb-4">1. Éditeur du site</h2>
          <p>
            <strong>Les Poulettes</strong><br />
            Entreprise individuelle enregistrée au Bénin<br />
            Siège social : Cotonou, Bénin<br />
            Email : <a href="mailto:lespoulettes.benin@gmail.com" className="text-yellow-600 hover:underline">lespoulettes.benin@gmail.com</a><br />
            WhatsApp : <a href="https://wa.me/2290162007580" className="text-yellow-600 hover:underline">+229 01 62 00 75 80</a>
          </p>
        </section>

        {/* 2. Hébergement */}
        <section className="anim-fade-up" data-delay="0.25">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 uppercase mb-4">2. Hébergement</h2>
          <p>
            Ce site est hébergé par <strong>Vercel Inc.</strong>, 340 Pine Street, Suite 900, San Francisco, CA 94104, USA.
          </p>
        </section>

        {/* 3. Conditions générales de vente */}
        <section className="anim-fade-up" data-delay="0.3">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 uppercase mb-4">3. Conditions générales de vente</h2>

          <h3 className="font-bold text-gray-900 mb-2">3.1 Produits</h3>
          <p className="mb-4">
            Les produits proposés sur ce site sont des accessoires artisanaux faits main au Bénin (trousses, sacs, housses en tissu wax). Chaque article est unique ; de légères variations de couleur ou de motif sont inhérentes au caractère artisanal des produits.
          </p>

          <h3 className="font-bold text-gray-900 mb-2">3.2 Prix</h3>
          <p className="mb-4">
            Les prix sont indiqués en euros (€), toutes taxes comprises pour les commandes à destination de la Belgique et de l'Union européenne. Les frais de livraison sont calculés séparément et communiqués par email après validation de la commande.
          </p>

          <h3 className="font-bold text-gray-900 mb-2">3.3 Commande</h3>
          <p className="mb-4">
            Toute commande passée sur ce site implique l'acceptation des présentes conditions. La commande est confirmée par email dès réception du paiement. Les Poulettes se réservent le droit d'annuler une commande en cas de rupture de stock ou de force majeure, avec remboursement intégral.
          </p>

          <h3 className="font-bold text-gray-900 mb-2">3.4 Paiement</h3>
          <p className="mb-4">
            Le paiement en ligne est sécurisé par <strong>Stripe</strong> (carte bancaire, Bancontact). Des frais de traitement de 2,9 % + 0,25 € s'appliquent au paiement en ligne. La commande n'est préparée qu'à la réception du paiement complet.
          </p>

          <h3 className="font-bold text-gray-900 mb-2">3.5 Livraison</h3>
          <p className="mb-4">
            Les commandes sont expédiées depuis Cotonou (Bénin) vers la Belgique et l'Europe. Les délais de livraison sont estimatifs (généralement 7 à 21 jours ouvrables). Les frais de livraison sont communiqués par email avant expédition et peuvent varier selon le poids et la destination.
          </p>

          <h3 className="font-bold text-gray-900 mb-2">3.6 Rétractation et retours</h3>
          <p className="mb-4">
            Conformément à la directive européenne 2011/83/UE, le client dispose d'un délai de <strong>14 jours</strong> à compter de la réception du colis pour exercer son droit de rétractation, sans justification. Les articles doivent être retournés dans leur état d'origine, non utilisés et non lavés. Les frais de retour sont à la charge du client. Le remboursement interviendra dans les 14 jours suivant la réception du retour.
          </p>
          <p className="mb-4">
            <strong>Exception :</strong> le droit de rétractation ne s'applique pas aux articles personnalisés (motifs ou dimensions sur commande).
          </p>
        </section>

        {/* 4. Données personnelles */}
        <section className="anim-fade-up" data-delay="0.35">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 uppercase mb-4">4. Données personnelles (RGPD)</h2>
          <p className="mb-4">
            Les données collectées lors de la commande (nom, email, adresse, téléphone) sont utilisées uniquement pour le traitement de la commande et la communication associée. Elles ne sont jamais vendues ni transmises à des tiers, à l'exception des prestataires indispensables au traitement (Stripe pour le paiement, SendGrid pour les emails).
          </p>
          <p className="mb-4">
            Conformément au Règlement général sur la protection des données (RGPD – Règlement UE 2016/679), vous disposez d'un droit d'accès, de rectification, d'effacement et de portabilité de vos données. Pour exercer ces droits, contactez-nous à : <a href="mailto:lespoulettes.benin@gmail.com" className="text-yellow-600 hover:underline">lespoulettes.benin@gmail.com</a>.
          </p>
          <p>
            Ce site utilise des services tiers susceptibles de déposer des cookies (Google Fonts, Google Maps, Stripe). Vous pouvez gérer vos préférences via le bandeau de consentement affiché lors de votre première visite.
          </p>
        </section>

        {/* 5. Propriété intellectuelle */}
        <section className="anim-fade-up" data-delay="0.4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 uppercase mb-4">5. Propriété intellectuelle</h2>
          <p>
            L'ensemble du contenu de ce site (textes, images, logos) est la propriété exclusive de Les Poulettes et est protégé par le droit d'auteur. Toute reproduction ou utilisation sans autorisation préalable est interdite.
          </p>
        </section>

        {/* 6. Litiges */}
        <section className="anim-fade-up" data-delay="0.45">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 uppercase mb-4">6. Litiges</h2>
          <p className="mb-4">
            En cas de litige, nous vous invitons à nous contacter en priorité à l'adresse <a href="mailto:lespoulettes.benin@gmail.com" className="text-yellow-600 hover:underline">lespoulettes.benin@gmail.com</a> pour trouver une solution amiable.
          </p>
          <p>
            Pour les consommateurs européens, la Commission européenne met à disposition une plateforme de règlement en ligne des litiges accessible à l'adresse : <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-yellow-600 hover:underline">https://ec.europa.eu/consumers/odr</a>.
          </p>
        </section>

        <p className="anim-fade-up text-xs text-gray-400" data-delay="0.5">
          Dernière mise à jour : février 2026
        </p>
      </div>
    </div>
  );
}
