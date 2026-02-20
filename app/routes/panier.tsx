import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from '@remix-run/react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useCartStore } from '../store/cartStore';
import { getApiUrl } from '../config/api';
import { useScrollAnimations } from '../hooks/useScrollAnimations';

export function meta() {
  return [
    { title: "Mon panier — Les Poulettes" },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

const API_URL = getApiUrl();

// Codes postaux belges → villes
const BELGIAN_CITIES: Record<string, string> = {
  '1000': 'Bruxelles', '1020': 'Laeken', '1030': 'Schaerbeek', '1040': 'Etterbeek',
  '1050': 'Ixelles', '1060': 'Saint-Gilles', '1070': 'Anderlecht', '1080': 'Molenbeek-Saint-Jean',
  '1082': 'Berchem-Sainte-Agathe', '1083': 'Ganshoren', '1090': 'Jette',
  '1140': 'Evere', '1150': 'Woluwe-Saint-Pierre', '1160': 'Auderghem',
  '1170': 'Watermael-Boitsfort', '1180': 'Uccle', '1190': 'Forest',
  '1200': 'Woluwe-Saint-Lambert', '1210': 'Saint-Josse-ten-Noode',
  '1300': 'Wavre', '1301': 'Bierges', '1310': 'La Hulpe', '1320': 'Beauvechain',
  '1325': 'Chaumont-Gistoux', '1330': 'Rixensart', '1340': 'Ottignies',
  '1348': 'Louvain-la-Neuve', '1350': 'Jodoigne', '1360': 'Perwez',
  '1370': 'Jodoigne', '1380': 'Lasne', '1390': 'Grez-Doiceau',
  '1400': 'Nivelles', '1410': 'Waterloo', '1420': 'Braine-l\'Alleud',
  '1428': 'Lillois-Witterzée', '1430': 'Rebecq', '1440': 'Braine-le-Château',
  '1450': 'Chastre', '1457': 'Walhain', '1460': 'Ittre', '1470': 'Genappe',
  '1480': 'Tubize', '1490': 'Court-Saint-Etienne', '1495': 'Mille',
  '1500': 'Hal', '1501': 'Buizingen', '1502': 'Lembeek',
  '2000': 'Anvers', '2018': 'Anvers', '2020': 'Anvers', '2050': 'Anvers',
  '2060': 'Anvers', '2100': 'Deurne', '2140': 'Borgerhout', '2150': 'Borsbeek',
  '2170': 'Merksem', '2180': 'Ekeren', '2200': 'Herentals', '2300': 'Turnhout',
  '2400': 'Mol', '2500': 'Lier', '2600': 'Berchem', '2640': 'Mortsel',
  '2660': 'Hoboken', '2800': 'Mechelen', '2900': 'Schoten',
  '3000': 'Louvain', '3001': 'Heverlee', '3010': 'Kessel-Lo', '3012': 'Wilsele',
  '3018': 'Wijgmaal', '3020': 'Herent', '3040': 'Ottenburg', '3050': 'Oud-Heverlee',
  '3054': 'Vaalbeek', '3060': 'Bertem', '3070': 'Kortenberg', '3078': 'Meerbeek',
  '3080': 'Tervuren', '3090': 'Overijse', '3110': 'Rotselaar', '3118': 'Werchter',
  '3200': 'Aarschot', '3300': 'Tirlemont', '3400': 'Landen', '3500': 'Hasselt',
  '3600': 'Genk', '3700': 'Tongres', '3800': 'Saint-Trond', '3900': 'Overpelt',
  '4000': 'Liège', '4020': 'Liège', '4030': 'Grivegnée', '4031': 'Angleur',
  '4032': 'Chênée', '4040': 'Herstal', '4041': 'Milmort', '4042': 'Liers',
  '4050': 'Chaudfontaine', '4051': 'Vaux-sous-Chèvremont', '4052': 'Beaufays',
  '4053': 'Embourg', '4100': 'Seraing', '4101': 'Jemeppe-sur-Meuse',
  '4102': 'Ougrée', '4120': 'Neupré', '4121': 'Neuville-en-Condroz',
  '4122': 'Plainevaux', '4130': 'Esneux', '4140': 'Sprimont', '4160': 'Anthisnes',
  '4170': 'Comblain-au-Pont', '4180': 'Hamoir', '4190': 'Ferrières',
  '4210': 'Burdinne', '4217': 'Héron', '4218': 'Couthuin', '4219': 'Wasseiges',
  '4220': 'Flémalle', '4300': 'Waremme', '4340': 'Awans', '4400': 'Flémalle',
  '4420': 'Saint-Nicolas', '4430': 'Ans', '4431': 'Loncin', '4432': 'Alleur',
  '4450': 'Juprelle', '4460': 'Grâce-Hollogne', '4470': 'Saint-Georges',
  '4480': 'Engis', '4490': 'Limont', '4500': 'Huy', '4520': 'Wanze',
  '4537': 'Verlaine', '4540': 'Amay', '4550': 'Nandrin', '4557': 'Tinlot',
  '4560': 'Clavier', '4570': 'Marchin', '4577': 'Modave', '4590': 'Ouffet',
  '4600': 'Visé', '4607': 'Berneau', '4608': 'Warsage', '4610': 'Beyne-Heusay',
  '4621': 'Retinne', '4630': 'Soumagne', '4632': 'Cérexhe-Heuseux',
  '4633': 'Melen', '4650': 'Herve', '4651': 'Battice', '4652': 'Xhendelesse',
  '4671': 'Blegny', '4680': 'Oupeye', '4681': 'Hermalle-sous-Argenteau',
  '4682': 'Heure-le-Romain', '4683': 'Vivegnis', '4684': 'Haccourt',
  '4690': 'Bassenge', '4700': 'Eupen', '4710': 'Lontzen', '4720': 'Kelmis',
  '4730': 'Hauset', '4731': 'Eynatten', '4750': 'Bullange', '4760': 'Büllingen',
  '4770': 'Amblève', '4780': 'Saint-Vith', '4782': 'Schönberg',
  '4783': 'Lommersweiler', '4784': 'Crombach', '4790': 'Burg-Reuland',
  '4800': 'Verviers', '4801': 'Stembert', '4802': 'Heusy', '4820': 'Dison',
  '4821': 'Andrimont', '4830': 'Limbourg', '4831': 'Bilstain', '4834': 'Goé',
  '4837': 'Membach', '4840': 'Welkenraedt', '4841': 'Henri-Chapelle',
  '4845': 'Jalhay', '4850': 'Plombières', '4851': 'Gemmenich', '4852': 'Moresnet',
  '4860': 'Pepinster', '4861': 'Soiron', '4870': 'Trooz', '4877': 'Olne',
  '4880': 'Aubel', '4890': 'Clermont', '4900': 'Spa', '4910': 'Theux',
  '4920': 'Aywaille', '4950': 'Waimes', '4960': 'Malmedy', '4970': 'Stavelot',
  '4980': 'Trois-Ponts', '4983': 'Basse-Bodeux', '4987': 'Stoumont',
  '4990': 'Lierneux',
  '5000': 'Namur', '5001': 'Belgrade', '5002': 'Saint-Servais', '5003': 'Saint-Marc',
  '5004': 'Bouge', '5020': 'Namur', '5100': 'Wépion', '5101': 'Erpent',
  '5300': 'Andenne', '5500': 'Dinant', '5600': 'Philippeville', '5700': 'Namur',
  '6000': 'Charleroi', '6001': 'Marcinelle', '6010': 'Couillet', '6020': 'Dampremy',
  '6030': 'Marchienne-au-Pont', '6040': 'Jumet', '6041': 'Gosselies',
  '6042': 'Lodelinsart', '6060': 'Gilly', '6061': 'Montignies-sur-Sambre',
  '6110': 'Montigny-le-Tilleul', '6200': 'Châtelet', '6220': 'Fleurus',
  '6440': 'Froidchapelle', '6500': 'Beaumont', '6600': 'Bastogne',
  '6700': 'Arlon', '6800': 'Libramont', '6900': 'Marche-en-Famenne',
  '7000': 'Mons', '7011': 'Ghlin', '7012': 'Jemappes', '7020': 'Nimy',
  '7021': 'Havré', '7022': 'Harmignies', '7024': 'Ciply', '7030': 'Saint-Symphorien',
  '7033': 'Cuesmes', '7034': 'Obourg', '7040': 'Quévy', '7050': 'Jurbise',
  '7060': 'Soignies', '7070': 'Le Roeulx', '7080': 'La Louvière',
  '7100': 'La Louvière', '7110': 'Houdeng-Goegnies', '7120': 'Estinnes',
  '7130': 'Binche', '7140': 'Morlanwelz', '7160': 'Chapelle-lez-Herlaimont',
  '7170': 'Manage', '7180': 'Seneffe', '7190': 'Écaussinnes',
  '7300': 'Boussu', '7301': 'Hornu', '7320': 'Bernissart', '7330': 'Saint-Ghislain',
  '7340': 'Colfontaine', '7350': 'Hensies', '7370': 'Dour', '7380': 'Quiévrain',
  '7387': 'Honnelles', '7390': 'Quaregnon', '7500': 'Tournai', '7520': 'Ramegnies-Chin',
  '7521': 'Chercq', '7522': 'Marquain', '7530': 'Gaurain-Ramecroix', '7531': 'Havinnes',
  '7532': 'Béclers', '7533': 'Thimougies', '7534': 'Barry', '7536': 'Vaulx',
  '7538': 'Vezon', '7540': 'Kain', '7542': 'Mont-Saint-Aubert', '7543': 'Melles',
  '7548': 'Warchin', '7600': 'Péruwelz', '7601': 'Roucourt', '7602': 'Bury',
  '7603': 'Bon-Secours', '7604': 'Braffe', '7608': 'Wiers',
  '7610': 'Rumes', '7618': 'Taintignies', '7620': 'Bléharies', '7621': 'Lesdain',
  '7622': 'Laplaigne', '7623': 'Rongy', '7624': 'Hollain', '7640': 'Antoing',
  '7641': 'Fontenoy', '7642': 'Calonne', '7643': 'Fontenoy', '7700': 'Mouscron',
  '7711': 'Dottignies', '7712': 'Herseaux', '7730': 'Estaimpuis',
  '7740': 'Pecq', '7742': 'Hérinnes-lez-Pecq', '7743': 'Esquelmes', '7744': 'Warcoing',
  '7745': 'Fontenoy', '7750': 'Amougies', '7780': 'Comines-Warneton',
  '7782': 'Ploegsteert', '7783': 'Bas-Warneton', '7784': 'Warneton',
  '8000': 'Bruges', '8200': 'Bruges', '8300': 'Knokke-Heist', '8400': 'Ostende',
  '8420': 'De Haan', '8430': 'Middelkerke', '8450': 'Bredene', '8460': 'Oudenburg',
  '8470': 'Gistel', '8480': 'Ichtegem', '8490': 'Jabbeke', '8500': 'Courtrai',
  '8510': 'Marke', '8520': 'Kuurne', '8530': 'Harelbeke', '8540': 'Deerlijk',
  '8550': 'Zwevegem', '8560': 'Wevelgem', '8570': 'Anzegem', '8580': 'Avelgem',
  '8587': 'Spiere-Helkijn', '8600': 'Dixmude', '8620': 'Nieuport', '8630': 'Veurne',
  '8640': 'Poperinge', '8647': 'Lo-Reninge', '8650': 'Middelkerke', '8660': 'De Panne',
  '8670': 'Koksijde', '8680': 'Koekelare', '8690': 'Alveringem',
  '8700': 'Tielt', '8710': 'Wielsbeke', '8720': 'Dentergem', '8730': 'Beernem',
  '8740': 'Pittem', '8750': 'Wingene', '8760': 'Meulebeke', '8770': 'Ingelmunster',
  '8780': 'Oostrozebeke', '8790': 'Waregem', '8800': 'Roulers', '8810': 'Lichtervelde',
  '8820': 'Torhout', '8830': 'Hooglede', '8840': 'Staden', '8850': 'Ardooie',
  '8851': 'Koolskamp', '8860': 'Lendelede', '8870': 'Izegem', '8880': 'Ledegem',
  '8890': 'Moorslede', '8900': 'Ypres', '8902': 'Zillebeke', '8904': 'Boezinge',
  '8906': 'Elverdinge', '8908': 'Vlamertinge', '8920': 'Langemark-Poelkapelle',
  '8930': 'Menen', '8940': 'Wervik', '8950': 'Heuvelland', '8951': 'Dranouter',
  '8952': 'Wulvergem', '8953': 'Wijtschate', '8954': 'Westouter', '8956': 'Kemmel',
  '8957': 'Mesen', '8958': 'Loker', '8970': 'Poperinge', '8972': 'Roesbrugge-Haringe',
  '8978': 'Watou', '8980': 'Zonnebeke',
  '9000': 'Gand', '9030': 'Mariakerke', '9031': 'Drongen', '9032': 'Wondelgem',
  '9040': 'Saint-Amandsberg', '9041': 'Oostakker', '9042': 'Desteldonk',
  '9050': 'Gand', '9051': 'Afsnee', '9052': 'Zwijnaarde', '9060': 'Zelzate',
  '9070': 'Destelbergen', '9080': 'Lochristi', '9090': 'Melle', '9100': 'Saint-Nicolas',
  '9111': 'Belsele', '9112': 'Sinaai', '9120': 'Beveren', '9140': 'Temse',
  '9150': 'Kruibeke', '9160': 'Lokeren', '9170': 'Sint-Gillis-Waas', '9180': 'Moerbeke',
  '9185': 'Wachtebeke', '9190': 'Stekene', '9200': 'Termonde', '9220': 'Hamme',
  '9240': 'Zele', '9250': 'Waasmunster', '9255': 'Buggenhout', '9260': 'Wetteren',
  '9270': 'Laarne', '9280': 'Lebbeke', '9290': 'Berlare', '9300': 'Alost',
  '9308': 'Hofstade', '9310': 'Moorsel', '9320': 'Nieuwerkerken', '9340': 'Lede',
  '9400': 'Ninove', '9402': 'Meerbeke', '9403': 'Neigem', '9404': 'Voorde',
  '9406': 'Outer', '9420': 'Erpe-Mere', '9450': 'Haaltert', '9451': 'Kerksken',
  '9470': 'Denderleeuw', '9473': 'Welle', '9500': 'Renaix', '9506': 'Schendelbeke',
  '9520': 'Sint-Lievens-Houtem', '9521': 'Letterhoutem', '9550': 'Herzele',
  '9551': 'Ressegem', '9552': 'Borsbeke', '9570': 'Lierde', '9571': 'Hemelveerdegem',
  '9572': 'Sint-Martens-Lierde', '9600': 'Renaix', '9620': 'Zottegem',
  '9630': 'Zwalm', '9636': 'Munkzwalm', '9660': 'Brakel', '9661': 'Elst',
  '9667': 'Horebeke', '9680': 'Maarkedal', '9681': 'Nukerke', '9688': 'Maarke-Kerkem',
  '9690': 'Kluisbergen', '9700': 'Audenarde', '9750': 'Zingem', '9770': 'Kruishoutem',
  '9790': 'Wortegem-Petegem', '9800': 'Deinze', '9810': 'Nazareth', '9820': 'Merelbeke',
  '9830': 'Sint-Martens-Latem', '9840': 'De Pinte', '9850': 'Nevele', '9860': 'Oosterzele',
  '9870': 'Zulte', '9880': 'Aalter', '9890': 'Gavere', '9900': 'Eeklo',
  '9910': 'Assenede', '9920': 'Lovendegem', '9921': 'Vinkt', '9930': 'Zomergem',
  '9940': 'Evergem', '9950': 'Waarschoot', '9960': 'Assenede', '9968': 'Bassevelde',
  '9970': 'Kaprijke', '9971': 'Lembeke', '9980': 'Sint-Laureins', '9988': 'Waterland-Oudeman',
  '9990': 'Maldegem',
};

// Frais de livraison
const SHIPPING_COSTS: Record<string, { label: string; cost: number }> = {
  belgique: { label: 'Belgique', cost: 4.95 },
  france: { label: 'France', cost: 6.95 },
  europe: { label: 'Autre pays Europe', cost: 9.95 },
  monde: { label: 'Reste du monde', cost: 14.95 },
};

export default function Panier() {
  const items = useCartStore((state) => state.items);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);

  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [showCheckout, setShowCheckout] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  const scrollRef = useScrollAnimations([mounted, items.length]);

  useEffect(() => {
    setMounted(true);
    fetch(`${API_URL}/api/commandes`, { method: 'HEAD', mode: 'no-cors' }).catch(() => {});
  }, []);

  // Stripe redirige vers /panier?session_id=xxx après paiement réussi
  useEffect(() => {
    if (sessionId) {
      clearCart();
      setOrderSuccess(true);
    }
  }, [sessionId, clearCart]);

  const total = mounted ? getTotalPrice() : 0;
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  if (orderSuccess) {
    const isPaid = Boolean(sessionId);
    return (
      <div className="py-6 sm:py-8 md:py-[60px] px-4 sm:px-6 md:px-[60px] lg:px-[120px] mt-16 sm:mt-20 md:mt-24 min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-lg">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isPaid ? 'bg-green-100' : 'bg-yellow-100'}`}>
            <svg className={`w-10 h-10 ${isPaid ? 'text-green-500' : 'text-yellow-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="font-basecoat text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 uppercase">
            {isPaid ? 'Paiement réussi !' : 'Commande envoyée !'}
          </h1>
          <p className="font-basecoat text-gray-600 mb-3 text-base sm:text-lg leading-relaxed">
            {isPaid
              ? 'Votre paiement a été effectué avec succès. Vous allez recevoir un email de confirmation.'
              : 'Nous avons bien reçu votre commande. Vous recevrez un email de confirmation.'}
          </p>
          {isPaid && (
            <p className="font-basecoat text-gray-600 mb-3 text-sm sm:text-base">
              Votre commande sera préparée et expédiée dans les plus brefs délais.
            </p>
          )}
          {!isPaid && (
            <p className="font-basecoat text-gray-500 mb-3 text-sm sm:text-base">
              Attention : La commande ne sera préparée et expédiée qu'à la réception du paiement.
            </p>
          )}
          {sessionId && (
            <p className="font-basecoat text-xs text-gray-400 mb-6 break-all px-2">
              Référence : {sessionId}
            </p>
          )}
          <Link
            to="/"
            className="font-basecoat inline-block bg-yellow-400 hover:bg-yellow-500 text-black px-8 sm:px-10 py-3 sm:py-4 rounded-xl font-bold uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] shadow-md hover:shadow-lg text-sm sm:text-base"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center mt-16">
        <p className="text-xl font-basecoat text-gray-400">Chargement...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-6 sm:py-8 md:py-[60px] px-4 sm:px-6 md:px-[60px] lg:px-[120px] mt-16 sm:mt-20 md:mt-24 min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <ShoppingCartIcon className="w-20 h-20 text-gray-200" strokeWidth={1} />
        <h1 className="font-basecoat text-2xl sm:text-3xl md:text-4xl font-bold uppercase text-gray-900">
          Votre panier est vide
        </h1>
        <p className="font-basecoat text-gray-500 text-base">
          Découvrez nos créations !
        </p>
        <Link
          to="/realisations"
          className="font-basecoat bg-yellow-400 hover:bg-yellow-500 text-black px-8 sm:px-10 py-3 sm:py-4 rounded-xl font-bold uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] shadow-md hover:shadow-lg text-sm sm:text-base mt-2"
        >
          Voir nos créations
        </Link>
      </div>
    );
  }

  if (showCheckout) {
    return <CheckoutForm cart={items} total={total} clearCart={clearCart} onBack={() => setShowCheckout(false)} onSuccess={() => setOrderSuccess(true)} />;
  }

  return (
    <div ref={scrollRef} className="py-6 sm:py-8 md:py-[60px] px-4 sm:px-6 md:px-[60px] lg:px-[120px] mt-16 sm:mt-20 md:mt-24">
      {/* Breadcrumb */}
      <nav className="anim-fade-up font-basecoat mb-6 sm:mb-8 text-xs sm:text-sm">
        <Link to="/" className="text-yellow-600 hover:text-yellow-700 font-medium transition">Accueil</Link>
        <span className="mx-1.5 sm:mx-2 text-gray-400">/</span>
        <span className="text-gray-600">Panier</span>
      </nav>

      <h1 className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-[44px] font-bold uppercase text-gray-900" data-delay="0.1">
        Votre panier
      </h1>
      <div className="anim-fade-up w-16 sm:w-20 h-1 bg-yellow-400 mt-3 sm:mt-4" data-delay="0.15"></div>
      <p className="anim-fade-up font-basecoat text-gray-500 text-sm sm:text-base mt-3 mb-8 sm:mb-10 md:mb-12" data-delay="0.2">
        {totalItems} article{totalItems > 1 ? 's' : ''}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
        {/* Liste des articles */}
        <div className="lg:col-span-2 order-2 lg:order-1 anim-stagger space-y-5" data-stagger="0.1">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 sm:gap-5 p-4 sm:p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.title}
                  width={160}
                  height={160}
                  className="w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 object-cover rounded-xl flex-shrink-0"
                />
              )}

              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <h3 className="font-basecoat text-base sm:text-lg font-bold text-gray-900 leading-tight">
                    {item.title}
                  </h3>
                  <p className="font-basecoat text-yellow-500 font-bold text-lg sm:text-xl mt-1">
                    {item.prix} €
                  </p>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 mt-3">
                  <div className="inline-flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      aria-label="Diminuer la quantité"
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span className="w-10 h-10 flex items-center justify-center font-basecoat font-bold text-gray-900 text-sm border-x border-gray-200">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.stock !== undefined && item.quantity >= item.stock}
                      aria-label="Augmenter la quantité"
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>

                  {item.stock !== undefined && item.quantity >= item.stock && (
                    <span className="font-basecoat text-orange-500 text-xs sm:text-sm font-semibold">
                      Stock max : {item.stock}
                    </span>
                  )}

                  <button
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Supprimer ${item.title} du panier`}
                    className="w-10 h-10 rounded-xl bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-400 hover:text-red-600 transition ml-auto"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="hidden sm:flex items-start pt-1">
                <p className="font-basecoat text-xl lg:text-2xl font-bold text-gray-900 whitespace-nowrap">
                  {(Number(item.prix) * item.quantity).toFixed(2)} €
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Résumé */}
        <div className="lg:col-span-1 order-1 lg:order-2 anim-fade-left" data-delay="0.3">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-7 shadow-sm lg:sticky lg:top-[100px]">
            <h2 className="font-basecoat text-xl sm:text-2xl font-bold uppercase text-gray-900 mb-5">
              Résumé
            </h2>

            <div className="space-y-3 mb-5">
              <div className="font-basecoat flex justify-between text-base text-gray-600">
                <span>Sous-total ({totalItems} article{totalItems > 1 ? 's' : ''})</span>
                <span className="font-semibold text-gray-900">{total.toFixed(2)} €</span>
              </div>
              <div className="font-basecoat flex justify-between text-sm text-gray-400">
                <span>Livraison</span>
                <span>À définir à l'étape suivante</span>
              </div>
              <div className="font-basecoat bg-green-50 border border-green-100 rounded-xl p-3 text-xs text-gray-500 space-y-1 leading-relaxed">
                <p>🚚 Belgique : 4,95 € · France : 6,95 €</p>
                <p>🌍 Autre Europe : 9,95 € · Monde : 14,95 €</p>
                <p className="text-green-700 font-semibold">✅ Retrait gratuit en Belgique ou au Bénin</p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-5 mb-6">
              <div className="font-basecoat flex justify-between items-center">
                <div>
                  <span className="font-bold text-gray-900 text-base">Total estimé</span>
                  <p className="text-xs text-gray-400 mt-0.5">Hors frais de livraison</p>
                </div>
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">{total.toFixed(2)} €</span>
              </div>
            </div>

            <button
              onClick={() => setShowCheckout(true)}
              className="font-basecoat w-full bg-yellow-400 hover:bg-yellow-500 text-black py-4 rounded-xl font-bold uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] shadow-md hover:shadow-lg mb-3 text-sm sm:text-base"
            >
              Passer commande
            </button>

            <Link
              to="/realisations"
              className="font-basecoat block w-full text-center py-3 rounded-xl font-semibold text-gray-500 hover:text-gray-900 border border-gray-200 hover:border-gray-300 transition text-sm sm:text-base"
            >
              Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ========== CHECKOUT FORM ==========
function CheckoutForm({ cart, total, clearCart, onBack, onSuccess }: {
  cart: any[],
  total: number,
  clearCart: () => void,
  onBack: () => void,
  onSuccess: () => void
}) {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    notes: ''
  });

  // Livraison
  const [deliveryMode, setDeliveryMode] = useState<'livraison' | 'retrait'>('livraison');
  const [country, setCountry] = useState('belgique');
  const [pickupLocation, setPickupLocation] = useState<'belgique' | 'benin'>('belgique');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');

  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState('');
  const isSubmittingRef = useRef(false);

  const scrollRef = useScrollAnimations([deliveryMode]);

  const shippingCost = deliveryMode === 'retrait' ? 0 : (SHIPPING_COSTS[country]?.cost ?? 14.95);
  const shippingLabel = deliveryMode === 'retrait' ? 'GRATUIT' : `${shippingCost.toFixed(2)} €`;
  const grandTotal = total + shippingCost;

  useEffect(() => {
    fetch(`${API_URL}/api/commandes`, { method: 'HEAD', mode: 'no-cors' }).catch(() => {});
  }, []);

  // Auto-remplissage ville pour codes postaux belges
  const handlePostalCodeChange = (val: string) => {
    setPostalCode(val);
    if (country === 'belgique' && val.length === 4) {
      const found = BELGIAN_CITIES[val];
      if (found) setCity(found);
    }
  };

  // Réinitialiser code postal / ville quand on change de pays
  const handleCountryChange = (val: string) => {
    setCountry(val);
    setPostalCode('');
    setCity('');
  };

  const buildAdresse = (): string => {
    if (deliveryMode === 'retrait') {
      if (pickupLocation === 'belgique') return 'RETRAIT GRATUIT — Belgique (adresse communiquée par email)';
      return 'RETRAIT GRATUIT — Bénin, Cotonou (adresse communiquée par email)';
    }
    const countryLabel = SHIPPING_COSTS[country]?.label ?? country;
    return [street, `${postalCode} ${city}`.trim(), countryLabel].filter(Boolean).join(', ');
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setLoading(true);
    setLoadingMessage('Redirection vers le paiement...');
    setError('');

    const slowTimer = setTimeout(() => {
      setLoadingMessage('Le serveur démarre, patientez quelques secondes...');
    }, 5000);

    const verySlowTimer = setTimeout(() => {
      setLoadingMessage('Le serveur est en cours de réveil, encore un instant...');
    }, 15000);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const adresse = buildAdresse();
    const notesCompose = [
      formData.notes,
      `Mode: ${deliveryMode === 'retrait' ? 'Retrait gratuit' : `Livraison — ${SHIPPING_COSTS[country]?.label ?? country}`}`,
      `Frais livraison: ${shippingLabel}`,
      `Total TTC: ${grandTotal.toFixed(2)} €`,
    ].filter(Boolean).join(' | ');

    try {
      const response = await fetch(`${API_URL}/api/commandes/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          email: formData.email,
          nom: formData.nom,
          telephone: formData.telephone,
          adresse,
          notes: notesCompose,
        }),
        signal: controller.signal,
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch {
        throw new Error(`Erreur serveur (${response.status}). Veuillez réessayer.`);
      }

      if (!response.ok) {
        throw new Error(
          responseData?.error?.message ||
          responseData?.message ||
          `Erreur ${response.status}. Veuillez réessayer.`
        );
      }

      const checkoutUrl = responseData.url;
      if (!checkoutUrl) throw new Error('URL de paiement manquante');
      window.location.href = checkoutUrl;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Le serveur met trop de temps à répondre. Veuillez réessayer.');
      } else if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
        setError('Impossible de contacter le serveur. Vérifiez votre connexion ou réessayez dans quelques secondes.');
      } else {
        setError(err.message || 'Erreur inconnue');
      }
    } finally {
      clearTimeout(timeoutId);
      clearTimeout(slowTimer);
      clearTimeout(verySlowTimer);
      setLoading(false);
      setLoadingMessage('');
      isSubmittingRef.current = false;
    }
  };

  return (
    <div ref={scrollRef} className="py-6 sm:py-8 md:py-[60px] px-4 sm:px-6 md:px-[60px] lg:px-[120px] mt-16 sm:mt-20 md:mt-24">
      <button
        onClick={onBack}
        className="anim-fade-up font-basecoat text-yellow-600 hover:text-yellow-700 mb-6 sm:mb-8 flex items-center gap-2 text-sm sm:text-base font-medium transition"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Retour au panier
      </button>

      <h1 className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-[44px] font-bold uppercase text-gray-900" data-delay="0.1">
        Finaliser la commande
      </h1>
      <div className="anim-fade-up w-16 sm:w-20 h-1 bg-yellow-400 mt-3 sm:mt-4 mb-8 sm:mb-10 md:mb-12" data-delay="0.15"></div>

      {/* Récapitulatif dynamique */}
      <div className="anim-fade-up bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 mb-8 sm:mb-10 shadow-sm" data-delay="0.15">
        <h2 className="font-basecoat font-bold text-gray-900 text-base sm:text-lg mb-4">Récapitulatif</h2>
        <div className="space-y-2">
          <div className="font-basecoat flex justify-between text-sm text-gray-600">
            <span>Sous-total ({cart.reduce((s, i) => s + i.quantity, 0)} article(s))</span>
            <span className="font-semibold text-gray-900">{total.toFixed(2)} €</span>
          </div>
          <div className="font-basecoat flex justify-between text-sm text-gray-600">
            <span>
              {deliveryMode === 'retrait'
                ? `Retrait gratuit — ${pickupLocation === 'belgique' ? 'Belgique' : 'Bénin'}`
                : `Livraison — ${SHIPPING_COSTS[country]?.label ?? country}`}
            </span>
            <span className={`font-semibold ${shippingCost === 0 ? 'text-green-600' : 'text-gray-900'}`}>
              {shippingLabel}
            </span>
          </div>
          <div className="border-t border-gray-100 pt-3 mt-3 font-basecoat flex justify-between items-center">
            <span className="font-bold text-gray-900 text-base">Total</span>
            <span className="font-bold text-2xl text-gray-900">{grandTotal.toFixed(2)} €</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleCheckout} className="space-y-5 sm:space-y-6 max-w-2xl">

        {/* Paiement sécurisé */}
        <div className="anim-fade-up bg-green-50 border border-green-100 rounded-2xl p-5 sm:p-6" data-delay="0.1">
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <span className="font-basecoat font-bold text-gray-900 text-sm sm:text-base">Paiement 100% sécurisé par Stripe</span>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <svg viewBox="0 0 48 30" className="h-8 rounded-md shadow-sm border border-gray-200 bg-white">
              <rect width="48" height="30" rx="3" fill="#1A1F71"/>
              <text x="24" y="20" textAnchor="middle" fill="white" fontSize="13" fontStyle="italic" fontFamily="Arial, sans-serif" fontWeight="bold">VISA</text>
            </svg>
            <svg viewBox="0 0 48 30" className="h-8 rounded-md shadow-sm border border-gray-200 bg-white">
              <rect width="48" height="30" rx="3" fill="#fff"/>
              <circle cx="19" cy="15" r="9" fill="#EB001B"/>
              <circle cx="29" cy="15" r="9" fill="#F79E1B"/>
              <path d="M24 7.7 a9 9 0 0 1 0 14.6 a9 9 0 0 1 0-14.6z" fill="#FF5F00"/>
            </svg>
            <svg viewBox="0 0 48 30" className="h-8 rounded-md shadow-sm border border-gray-200 bg-white">
              <rect width="48" height="30" rx="3" fill="#0052A5"/>
              <text x="24" y="20" textAnchor="middle" fill="white" fontSize="14" fontFamily="Arial, sans-serif" fontWeight="bold">CB</text>
            </svg>
            <svg viewBox="0 0 48 30" className="h-8 rounded-md shadow-sm border border-gray-200 bg-white">
              <rect width="48" height="30" rx="3" fill="#007BC1"/>
              <text x="24" y="14" textAnchor="middle" fill="white" fontSize="7.5" fontFamily="Arial, sans-serif" fontWeight="bold">AMERICAN</text>
              <text x="24" y="23" textAnchor="middle" fill="white" fontSize="7.5" fontFamily="Arial, sans-serif" fontWeight="bold">EXPRESS</text>
            </svg>
            <svg viewBox="0 0 48 30" className="h-8 rounded-md shadow-sm border border-gray-200 bg-white">
              <rect width="48" height="30" rx="3" fill="#fff"/>
              <rect width="24" height="30" rx="0" fill="#005498"/>
              <rect x="24" width="24" height="30" rx="0" fill="#F7A800"/>
              <text x="24" y="20" textAnchor="middle" fill="white" fontSize="7" fontFamily="Arial, sans-serif" fontWeight="bold">BCT</text>
            </svg>
          </div>
        </div>

        {/* Nom */}
        <div className="anim-fade-up" data-delay="0.15">
          <label htmlFor="checkout-nom" className="font-basecoat block text-sm font-semibold text-gray-700 mb-2">Nom complet *</label>
          <input
            id="checkout-nom"
            type="text"
            required
            value={formData.nom}
            onChange={(e) => setFormData({...formData, nom: e.target.value})}
            className="font-basecoat w-full rounded-xl border border-gray-200 px-4 py-3 text-sm sm:text-base focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition bg-white"
          />
        </div>

        {/* Email */}
        <div className="anim-fade-up" data-delay="0.2">
          <label htmlFor="checkout-email" className="font-basecoat block text-sm font-semibold text-gray-700 mb-2">Email *</label>
          <input
            id="checkout-email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="font-basecoat w-full rounded-xl border border-gray-200 px-4 py-3 text-sm sm:text-base focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition bg-white"
          />
        </div>

        {/* Téléphone */}
        <div className="anim-fade-up" data-delay="0.25">
          <label htmlFor="checkout-tel" className="font-basecoat block text-sm font-semibold text-gray-700 mb-2">Téléphone *</label>
          <input
            id="checkout-tel"
            type="tel"
            required
            value={formData.telephone}
            onChange={(e) => setFormData({...formData, telephone: e.target.value})}
            className="font-basecoat w-full rounded-xl border border-gray-200 px-4 py-3 text-sm sm:text-base focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition bg-white"
          />
        </div>

        {/* ===== MODE DE LIVRAISON ===== */}
        <div className="anim-fade-up" data-delay="0.3">
          <p className="font-basecoat block text-sm font-semibold text-gray-700 mb-3">Mode de livraison *</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            {/* Livraison à domicile */}
            <button
              type="button"
              onClick={() => setDeliveryMode('livraison')}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition text-left ${
                deliveryMode === 'livraison'
                  ? 'border-yellow-400 bg-yellow-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <span className="text-2xl">🚚</span>
              <div>
                <p className="font-basecoat font-bold text-gray-900 text-sm">Livraison à domicile</p>
                <p className="font-basecoat text-xs text-gray-500 mt-0.5">Belgique dès 4,95 €</p>
              </div>
            </button>

            {/* Retrait gratuit */}
            <button
              type="button"
              onClick={() => setDeliveryMode('retrait')}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition text-left ${
                deliveryMode === 'retrait'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <span className="text-2xl">🤝</span>
              <div>
                <p className="font-basecoat font-bold text-gray-900 text-sm">Retrait gratuit</p>
                <p className="font-basecoat text-xs text-green-600 font-semibold mt-0.5">0 € — Belgique ou Bénin</p>
              </div>
            </button>
          </div>
        </div>

        {/* ===== RETRAIT ===== */}
        {deliveryMode === 'retrait' && (
          <div className="anim-fade-up">
            <p className="font-basecoat block text-sm font-semibold text-gray-700 mb-3">Lieu de retrait *</p>
            <div className="space-y-3">

              <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${
                pickupLocation === 'belgique' ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'
              }`}>
                <input
                  type="radio"
                  name="pickup"
                  value="belgique"
                  checked={pickupLocation === 'belgique'}
                  onChange={() => setPickupLocation('belgique')}
                  className="accent-green-500 w-4 h-4"
                />
                <span className="text-xl">🇧🇪</span>
                <div>
                  <p className="font-basecoat font-bold text-gray-900 text-sm">Belgique</p>
                  <p className="font-basecoat text-xs text-gray-500 mt-0.5">L'adresse exacte vous sera communiquée par email</p>
                </div>
              </label>

              <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${
                pickupLocation === 'benin' ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'
              }`}>
                <input
                  type="radio"
                  name="pickup"
                  value="benin"
                  checked={pickupLocation === 'benin'}
                  onChange={() => setPickupLocation('benin')}
                  className="accent-green-500 w-4 h-4"
                />
                <span className="text-xl">🇧🇯</span>
                <div>
                  <p className="font-basecoat font-bold text-gray-900 text-sm">Bénin — Cotonou</p>
                  <p className="font-basecoat text-xs text-gray-500 mt-0.5">L'adresse exacte vous sera communiquée par email</p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* ===== LIVRAISON À DOMICILE ===== */}
        {deliveryMode === 'livraison' && (
          <div className="anim-fade-up space-y-4">

            {/* Pays */}
            <div>
              <label htmlFor="checkout-country" className="font-basecoat block text-sm font-semibold text-gray-700 mb-2">
                Pays de livraison *
              </label>
              <select
                id="checkout-country"
                value={country}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="font-basecoat w-full rounded-xl border border-gray-200 px-4 py-3 text-sm sm:text-base focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition bg-white"
              >
                <option value="belgique">🇧🇪 Belgique — 4,95 €</option>
                <option value="france">🇫🇷 France — 6,95 €</option>
                <option value="europe">🌍 Autre pays Europe — 9,95 €</option>
                <option value="monde">🌐 Reste du monde — 14,95 €</option>
              </select>
            </div>

            {/* Code postal + Ville (côte à côte) */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="checkout-postal" className="font-basecoat block text-sm font-semibold text-gray-700 mb-2">
                  Code postal *
                </label>
                <input
                  id="checkout-postal"
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => handlePostalCodeChange(e.target.value)}
                  placeholder={country === 'belgique' ? 'ex: 4000' : ''}
                  maxLength={10}
                  className="font-basecoat w-full rounded-xl border border-gray-200 px-4 py-3 text-sm sm:text-base focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition bg-white"
                />
              </div>
              <div>
                <label htmlFor="checkout-city" className="font-basecoat block text-sm font-semibold text-gray-700 mb-2">
                  Ville *
                  {country === 'belgique' && (
                    <span className="text-gray-400 font-normal ml-1">(auto)</span>
                  )}
                </label>
                <input
                  id="checkout-city"
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ville"
                  className="font-basecoat w-full rounded-xl border border-gray-200 px-4 py-3 text-sm sm:text-base focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition bg-white"
                />
              </div>
            </div>

            {/* Rue et numéro */}
            <div>
              <label htmlFor="checkout-street" className="font-basecoat block text-sm font-semibold text-gray-700 mb-2">
                Rue et numéro *
              </label>
              <input
                id="checkout-street"
                type="text"
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="ex: Rue de la Paix 12"
                className="font-basecoat w-full rounded-xl border border-gray-200 px-4 py-3 text-sm sm:text-base focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition bg-white"
              />
            </div>

          </div>
        )}

        {/* Notes */}
        <div className="anim-fade-up" data-delay="0.35">
          <label htmlFor="checkout-notes" className="font-basecoat block text-sm font-semibold text-gray-700 mb-2">Notes (optionnel)</label>
          <textarea
            id="checkout-notes"
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            className="font-basecoat w-full rounded-xl border border-gray-200 px-4 py-3 text-sm sm:text-base focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition resize-none bg-white"
            placeholder="Informations complémentaires, préférences de livraison..."
          />
        </div>

        {error && (
          <div className="font-basecoat bg-red-50 border-l-4 border-red-400 text-red-700 px-5 py-4 rounded-r-xl text-sm sm:text-base">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="anim-fade-up font-basecoat w-full bg-yellow-400 hover:bg-yellow-500 text-black py-4 rounded-xl font-bold uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base"
          data-delay="0.4"
        >
          {loading ? (
            <span className="inline-flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-black flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {loadingMessage}
            </span>
          ) : `Payer ${grandTotal.toFixed(2)} € en ligne`}
        </button>

        {loading && (
          <button
            type="button"
            onClick={() => {
              setLoading(false);
              setLoadingMessage('');
              isSubmittingRef.current = false;
              setError('Opération annulée. Vous pouvez réessayer.');
            }}
            className="font-basecoat w-full text-center py-3 text-gray-500 hover:text-gray-700 text-sm font-medium transition"
          >
            Annuler
          </button>
        )}
      </form>
    </div>
  );
}
