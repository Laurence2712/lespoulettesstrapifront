import { Link, useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import { apiEndpoints, getImageUrl } from '../config/api';
import { useScrollAnimations, useParallaxHero } from '../hooks/useScrollAnimations';

export function meta() {
  return [
    { title: "Les Poulettes — Accessoires wax fait main au Bénin" },
    {
      name: "description",
      content:
        "Les Poulettes, marque d'accessoires éco-responsables faits main au Bénin. Découvrez nos trousses, sacs et housses en tissu wax authentique.",
    },
    { property: "og:title", content: "Les Poulettes — Accessoires wax fait main au Bénin" },
    {
      property: "og:description",
      content: "Accessoires wax faits main au Bénin par Les Poulettes.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://lespoulettes.be" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Les Poulettes — Accessoires wax fait main au Bénin" },
    { name: "twitter:description", content: "Accessoires wax faits main au Bénin par Les Poulettes." },
  ];
}

interface HomepageData {
  image_url?: string;
  description?: string;
}

interface Realisation {
  id: number;
  title: string;
  image_url?: string;
  description?: string;
  prix?: string | number;
}

interface Actualite {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  date?: string;
}

interface LoaderData {
  homepageData: HomepageData | null;
  realisations: Realisation[];
  actualites: Actualite[];
  error: string | null;
}

function fetchWithTimeout(url: string, timeoutMs = 8000): Promise<Response | null> {
  return Promise.race([
    fetch(url).catch(() => null),
    new Promise<null>((resolve) => setTimeout(() => resolve(null), timeoutMs)),
  ]);
}

export function headers({ loaderHeaders }: { loaderHeaders: Headers }) {
  const link = loaderHeaders.get('Link');
  if (link) return { Link: link };
  return {};
}

export async function loader() {
  try {
    const [homepageRes, realisationsRes, actualitesRes] = await Promise.all([
      fetchWithTimeout(apiEndpoints.homepages, 8000),
      fetchWithTimeout(apiEndpoints.realisations, 8000),
      fetchWithTimeout(apiEndpoints.latestActualite, 8000),
    ]);

    let homepageData: HomepageData | null = null;
    let realisations: Realisation[] = [];
    let actualites: Actualite[] = [];

    if (homepageRes?.ok) {
      const data = await homepageRes.json();
      if (data?.data?.length) {
        const homepage = data.data[0];
        const bannerImageUrl = homepage.banner_image?.formats?.large?.url
          ? getImageUrl(homepage.banner_image.formats.large.url)
          : homepage.banner_image?.url
            ? getImageUrl(homepage.banner_image.url)
            : '';
        let descriptionText = '';
        if (Array.isArray(homepage.description)) {
          homepage.description.forEach((block: any) => {
            block.children?.forEach((child: any) => {
              descriptionText += child.text + ' ';
            });
          });
        }
        homepageData = { image_url: bannerImageUrl, description: descriptionText.trim() };
      }
    }

    const heroImageUrl = homepageData?.image_url;

    if (realisationsRes?.ok) {
      const data = await realisationsRes.json();
      if (data?.data) {
        realisations = data.data.map((realisation: any) => ({
          id: realisation.documentId,
          title: realisation.Titre || 'Titre indisponible',
          image_url: realisation.ImagePrincipale?.url
            ? getImageUrl(realisation.ImagePrincipale.url)
            : realisation.Images?.[0]?.url
              ? getImageUrl(realisation.Images[0].url)
              : undefined,
          description: realisation.Description || 'Description indisponible',
          prix: realisation.Prix,
        }));
      }
    }

    if (actualitesRes?.ok) {
      const data = await actualitesRes.json();
      if (data?.data) {
        actualites = data.data.map((item: any) => ({
          id: item.id,
          title: item.Title || 'Titre indisponible',
          content: item.content || '',
          date: item.date || '',
          image_url: item.image?.formats?.large?.url
            ? getImageUrl(item.image.formats.large.url)
            : item.image?.url
              ? getImageUrl(item.image.url)
              : '',
        }));
      }
    }

    const responseHeaders = new Headers();
    if (heroImageUrl) {
      responseHeaders.set('Link', `<${heroImageUrl}>; rel=preload; as=image`);
    }
    responseHeaders.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60');

    return json<LoaderData>({ homepageData, realisations, actualites, error: null }, { headers: responseHeaders });
  } catch (err: any) {
    return json<LoaderData>({
      homepageData: null,
      realisations: [],
      actualites: [],
      error: 'Erreur lors du chargement des données',
    });
  }
}

export default function Index() {
  const { homepageData, realisations, actualites } = useLoaderData<LoaderData>();

  const heroRef = useParallaxHero();
  const scrollRef = useScrollAnimations([]);

  const featured = realisations.slice(0, 4);

  return (
    <div className="overflow-x-hidden" ref={scrollRef}>

      {/* ── Hero Banner ── */}
      <header
        ref={heroRef}
        className="banner relative bg-cover bg-center h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[100vh] flex flex-col justify-center items-center text-white p-4 sm:p-6 md:p-8 pt-20 sm:pt-24"
        style={{ backgroundImage: `url(${homepageData?.image_url})` }}
      >
        <div className="banner-content text-center z-10 flex flex-col items-center justify-center pb-8 sm:pb-12 md:pb-16">
          <h1 className="anim-fade-up font-basecoat text-xl sm:text-2xl md:text-3xl lg:text-[44px] font-bold uppercase tracking-wide mb-8 px-6 sm:px-8 md:px-12 max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%] leading-tight lg:leading-snug">
            Une marque d'accessoires made in Bénin, éco-trendy/éco-friendly qui surfe sur la vague du wax !
          </h1>
          <div className="mt-4 sm:mt-6 anim-fade-up flex flex-col sm:flex-row gap-3 sm:gap-4" data-delay="0.3">
            <Link
              to="/realisations"
              className="font-basecoat border-2 border-yellow-400 text-gray-900 hover:bg-yellow-400 hover:text-black px-8 sm:px-10 md:px-12 py-3 sm:py-4 rounded-lg text-sm sm:text-base md:text-lg uppercase tracking-wider font-bold transform transition hover:scale-105 inline-block"
            >
              Je craque !
            </Link>
          </div>
        </div>
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

        {/* ── Ticker social proof (superposé sur le hero, fond transparent) ── */}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-white/10 backdrop-blur-sm py-3 overflow-hidden select-none">
          <div className="animate-ticker flex whitespace-nowrap w-max">
            {[0, 1].map((copy) => (
              <span key={copy} className="inline-flex items-center">
                {[
                  { icon: '', label: '100% fait main' },
                  { icon: '', label: 'Éco-responsable' },
                  { icon: '', label: 'Livraison Belgique/Europe & Bénin' },
                  { icon: '', label: 'Tissus wax authentiques' },
                  { icon: '', label: 'Artisanat solidaire' },
                  { icon: '', label: 'Fabriqué au Bénin' },
                ].map((item) => (
                  <span key={`${copy}-${item.label}`} className="inline-flex items-center gap-2 font-basecoat font-bold text-white text-xs sm:text-sm md:text-base px-6 sm:px-10">
                    <span className="text-base sm:text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                    <span className="ml-6 sm:ml-10 text-white/40 text-xs">◆</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* ── Nouveaux arrivages ── */}
      <section id="nouveaux-arrivages" className="px-4 sm:px-6 md:px-[60px] lg:px-[120px] py-10 sm:py-14 md:py-[70px] bg-gray-50">
        <div className="mb-8 sm:mb-10 md:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-3 sm:mb-4">
            <div>
              <h2 className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-[44px] font-bold uppercase text-gray-900">
                Nouvelles créations
              </h2>
              <div className="anim-fade-up w-16 sm:w-20 h-1 bg-yellow-400 mt-3 sm:mt-4" data-delay="0.1"></div>
            </div>
            <Link
              to="/realisations"
              className="anim-fade-up font-basecoat text-sm sm:text-base font-semibold text-yellow-600 hover:text-yellow-700 transition flex items-center gap-1.5 self-start sm:self-auto pb-1"
              data-delay="0.1"
            >
              Voir tout
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <p className="anim-fade-up font-basecoat text-gray-500 text-base sm:text-lg mt-4 mb-8 sm:mb-10" data-delay="0.15">
            Des pièces uniques, faites main au Bénin en tissu wax authentique.
          </p>
        </div>

        {featured.length > 0 ? (
          <>
            <div className="anim-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6" data-stagger="0.1">
              {featured.map((realisation) => (
                <Link key={realisation.id} to={`/realisations/${realisation.id}`} className="group">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    <div className="relative overflow-hidden aspect-square">
                      {realisation.image_url ? (
                        <img
                          src={realisation.image_url}
                          alt={realisation.title}
                          loading="lazy"
                          width={500}
                          height={500}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="font-basecoat text-gray-400 text-sm">Aucune image</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-1 justify-between">
                      <div>
                        <div className="flex items-baseline justify-between gap-2 mb-3">
                          <h3 className="font-basecoat font-semibold text-gray-900 text-base leading-snug">
                            {realisation.title}
                          </h3>
                          {realisation.prix && (
                            <p className="font-basecoat text-xl font-bold text-yellow-500 whitespace-nowrap flex-shrink-0">
                              {Number(realisation.prix).toFixed(2)} €
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="font-basecoat text-sm font-semibold text-yellow-600 group-hover:text-yellow-700 flex items-center gap-1 transition">
                        Voir le produit
                        <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="anim-fade-up text-center mt-10 sm:mt-12" data-delay="0.3">
              <Link
                to="/realisations"
                className="font-basecoat inline-block border-2 border-yellow-400 text-gray-900 hover:bg-yellow-400 hover:text-black px-10 sm:px-14 py-3 sm:py-4 rounded-xl text-sm sm:text-base uppercase tracking-wider font-bold transform transition hover:scale-105 hover:shadow-lg"
              >
                Voir toute la boutique
              </Link>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-400 font-basecoat">Aucun produit disponible pour l'instant.</p>
        )}
      </section>

      {/* ── Qui sommes-nous ── */}
      <section id="qui-sommes-nous" className="px-4 sm:px-6 md:px-[60px] lg:px-[120px] py-6 sm:py-8 md:py-[60px]">
        <div className="mb-8 sm:mb-10 md:mb-12">
          <h2 className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-[44px] font-bold uppercase text-gray-900">
            Qui sommes-nous
          </h2>
          <div className="anim-fade-up w-16 sm:w-20 h-1 bg-yellow-400 mt-3 sm:mt-4 mb-8 sm:mb-10 md:mb-12" data-delay="0.1"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 items-center">
            <div className="order-2 md:order-1 anim-fade-right" data-delay="0.2">
              <p className="font-basecoat text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
                Les Poulettes est une marque d'accessoires éco-responsables créée au Bénin.
                Nous confectionnons à la main des trousses, sacs et housses d'ordinateur en tissu wax authentique.
                Chaque pièce est unique et reflète l'artisanat béninois traditionnel tout en adoptant
                un style moderne et tendance.
              </p>
              <p className="font-basecoat text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed mt-4">
                Notre mission : promouvoir le savoir-faire local et offrir des accessoires durables,
                élégants et respectueux de l'environnement.
              </p>
            </div>
            <div className="order-1 md:order-2 flex justify-center items-center anim-scale" data-delay="0.3">
              <div className="relative w-full h-[300px] sm:h-[350px]">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="relative w-[160px] h-[160px] xl:h-[400px] xl:w-[400px] sm:w-[200px] sm:h-[200px] rounded-full overflow-hidden border-4 border-yellow-400 shadow-2xl transform hover:scale-110 transition duration-300">
                    <img src="/assets/equipe-1.jpg" alt="Fondatrice 1" loading="lazy" width={400} height={400} className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Actualités ── */}
      <section className="bg-gray-50">
        <div className="px-4 sm:px-6 md:px-[60px] lg:px-[120px] pt-6 sm:pt-8 md:pt-[60px] pb-8 sm:pb-10 md:pb-12">
          <h2 className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-[44px] font-bold uppercase text-gray-900">
            Actualités
          </h2>
          <div className="anim-fade-up w-16 sm:w-20 h-1 bg-yellow-400 mt-3 sm:mt-4" data-delay="0.1"></div>
        </div>

        {actualites.length > 0 ? (
          actualites.map((actu, idx) => (
            <div key={actu.id}>
              <div className="px-4 sm:px-6 md:px-[60px] lg:px-[120px] py-8 sm:py-10 md:py-14">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 items-center">
                  {actu.image_url && (
                    <div className="anim-fade-right rounded-2xl overflow-hidden shadow-xl" data-delay="0.2">
                      <img
                        src={actu.image_url}
                        alt={actu.title}
                        loading="lazy"
                        width={800}
                        height={400}
                        className="w-full h-64 sm:h-72 md:h-80 lg:h-[400px] object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                  )}
                  <div className={`anim-fade-left ${!actu.image_url ? 'lg:col-span-2' : ''}`} data-delay="0.3">
                    {actu.date && (
                      <p className="font-basecoat text-sm text-gray-500 uppercase mb-2">
                        {new Date(actu.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    )}
                    <h3 className="font-basecoat text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-5 leading-tight">
                      {actu.title}
                    </h3>
                    <p className="mb-6 sm:mb-8 font-basecoat text-gray-700 text-base sm:text-lg md:text-xl whitespace-pre-line leading-relaxed">
                      {actu.content}
                    </p>
                    <Link
                      to="/actualites"
                      className="font-basecoat uppercase border-2 border-yellow-400 text-gray-900 hover:bg-yellow-400 hover:text-black px-8 sm:px-10 py-3 sm:py-4 rounded-lg text-sm sm:text-base transform transition hover:scale-105 font-bold inline-block hover:shadow-lg"
                    >
                      Toutes les actualités
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="px-4 sm:px-6 md:px-[60px] lg:px-[120px] pb-10">
            <p className="text-center text-gray-500 text-base sm:text-lg font-basecoat">Aucune actualité disponible.</p>
          </div>
        )}
      </section>

      {/* ── Où nous trouver ── */}
      <section id="ou-nous-trouver" className="w-full">
        <div className="relative z-10 mt-8 sm:mt-10 md:mt-12 mb-8 sm:mb-10 md:mb-12 px-4 sm:px-6 md:px-[60px] lg:px-[120px]">
          <h2 className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-[44px] font-bold uppercase text-gray-900">
            Où nous trouver
          </h2>
          <div className="anim-fade-up w-16 sm:w-20 h-1 bg-yellow-400 mt-3 sm:mt-4" data-delay="0.1"></div>
          <p className="anim-fade-up mt-6 mb-6 font-basecoat text-gray-800 text-base sm:text-lg md:text-xl whitespace-pre-line leading-relaxed" data-delay="0.2">
            Un évènement à fêter ? Les Poulettes répondent à vos demandes spéciales : mariage, baby shower, naissance, baptême, communion, anniversaire, ...{'\n'}
            Des sachets de dragées aux cadeaux personnalisés pour vos invités, Les Poulettes sont prêtes à confectionner ce que vous souhaitez pour que la fête soit réussie !
          </p>
          <p className="anim-fade-up mb-6 font-basecoat text-gray-800 text-base sm:text-lg md:text-xl leading-relaxed" data-delay="0.3">
            <a
              href="https://wa.me/2290162007580"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              WhatsApp : +229 01 62 00 75 80
            </a>
          </p>
        </div>

        <div className="anim-fade-up w-full h-[400px] sm:h-[500px] md:h-[600px]" data-delay="0.3">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126169.02214257128!2d2.3522219!3d6.3702928!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1024a9a5c8d5f6c5%3A0x7a7a7a7a7a7a7a7a!2sCotonou%2C%20B%C3%A9nin!5e0!3m2!1sfr!2sbe!4v1234567890123!5m2!1sfr!2sbe"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localisation Les Poulettes - Cotonou, Bénin"
          ></iframe>
        </div>
      </section>

    </div>
  );
}
