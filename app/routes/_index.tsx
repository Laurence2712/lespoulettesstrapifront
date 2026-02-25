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
      content: "Trousses, sacs et housses en tissu wax africain, confectionnés à la main au Bénin. Éco-responsables, uniques et solidaires.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://lespoulettes.be" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Les Poulettes — Accessoires wax fait main au Bénin" },
    { name: "twitter:description", content: "Trousses, sacs et housses en tissu wax africain, confectionnés à la main au Bénin. Éco-responsables, uniques et solidaires." },
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
          <h1 className="anim-fade-up font-basecoat text-xl sm:text-2xl md:text-3xl lg:text-[44px] font-bold uppercase tracking-wide mb-4 px-6 sm:px-8 md:px-12 max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%] leading-tight lg:leading-snug">
            Une marque d'accessoires made in Bénin, éco-trendy/éco-friendly qui surfe sur la vague du wax !
          </h1>
          <p className="anim-fade-up font-basecoat text-sm sm:text-base md:text-lg italic text-benin-ocre mb-8 px-4 max-w-[85%] sm:max-w-[70%] text-center" data-delay="0.2">
            Des accessoires faits main, pleins de peps et d'amour – made in Benin
          </p>
          <div className="mt-2 sm:mt-4 anim-fade-up flex flex-col items-center gap-2 sm:gap-3" data-delay="0.3">
            <Link
              to="/realisations"
              className="font-basecoat border-2 border-benin-jaune text-gray-900 hover:bg-benin-jaune hover:text-black px-8 sm:px-10 md:px-12 py-3 sm:py-4 rounded-lg text-sm sm:text-base md:text-lg uppercase tracking-wider font-bold transform transition hover:scale-105 inline-block"
            >
              Découvrir la collection
            </Link>
            <span className="font-basecoat text-xs text-white/60 tracking-widest uppercase">Handmade with love</span>
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
                  { icon: '', label: 'Handmade with love' },
                  { icon: '', label: 'Éco-responsable' },
                  { icon: '', label: 'Livraison Belgique/Europe & Bénin' },
                  { icon: '', label: 'Color up your day' },
                  { icon: '', label: 'Tissus wax authentiques' },
                  { icon: '', label: 'Artisanat solidaire' },
                  { icon: '', label: 'Made in Bénin with ♥' },
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

      {/* ── Bande wax ── */}
      <div className="flex h-2 w-full opacity-30" aria-hidden="true">
        <div className="flex-1 bg-wax-turquoise" />
        <div className="flex-1 bg-wax-yellow" />
        <div className="flex-1 bg-wax-orange" />
        <div className="flex-1 bg-wax-red" />
        <div className="flex-1 bg-wax-green" />
      </div>

      {/* ── Nouveaux arrivages ── */}
      <section
        id="nouveaux-arrivages"
        className="relative px-4 sm:px-6 md:px-[60px] lg:px-[120px] py-10 sm:py-14 md:py-[70px]"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600&q=80&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-white/85" />
        <div className="relative z-10">
        <div className="mb-8 sm:mb-10 md:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-3 sm:mb-4">
            <div>
              <h2 className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-[44px] font-bold uppercase text-gray-900">
                Nouvelles créations
              </h2>
              <div className="anim-fade-up w-16 sm:w-20 h-1 bg-wax-turquoise mt-3 sm:mt-4" data-delay="0.1"></div>
            </div>
            <Link
              to="/realisations"
              className="anim-fade-up font-basecoat text-sm sm:text-base font-semibold text-benin-jaune hover:text-benin-terre transition flex items-center gap-1.5 self-start sm:self-auto pb-1"
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
                      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                        <span className="font-basecoat text-[10px] font-bold uppercase tracking-wide bg-wax-orange text-white px-2 py-0.5 rounded-full">Fait main</span>
                        <span className="font-basecoat text-[10px] font-bold uppercase tracking-wide bg-wax-turquoise text-white px-2 py-0.5 rounded-full">Made in Bénin</span>
                      </div>
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
                            <p className="font-basecoat text-xl font-bold text-benin-jaune whitespace-nowrap flex-shrink-0">
                              {Number(realisation.prix).toFixed(2)} €
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="font-basecoat text-sm font-semibold text-benin-jaune group-hover:text-benin-terre flex items-center gap-1 transition">
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
                className="font-basecoat inline-block border-2 border-benin-jaune text-gray-900 hover:bg-benin-jaune hover:text-black px-10 sm:px-14 py-3 sm:py-4 rounded-xl text-sm sm:text-base uppercase tracking-wider font-bold transform transition hover:scale-105 hover:shadow-lg"
              >
                Voir toute la boutique
              </Link>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-400 font-basecoat">Aucun produit disponible pour l'instant.</p>
        )}
        </div>
      </section>

      {/* ── Qui sommes-nous ── */}
      <section
        id="qui-sommes-nous"
        className="relative px-4 sm:px-6 md:px-[60px] lg:px-[120px] py-6 sm:py-8 md:py-[60px]"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1605027990121-cbae9e0642df?w=1600&q=80&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-white/88" />
        <div className="relative z-10">
        <div className="mb-8 sm:mb-10 md:mb-12">
          <h2 className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-[44px] font-bold uppercase text-gray-900">
            Qui sommes-nous
          </h2>
          <div className="anim-fade-up w-16 sm:w-20 h-1 bg-wax-orange mt-3 sm:mt-4 mb-8 sm:mb-10 md:mb-12" data-delay="0.1"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 items-center">
            <div className="order-2 md:order-1 anim-fade-right" data-delay="0.2">
              <p className="font-basecoat text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
                Les Poulettes est une marque d'accessoires éco-responsables née entre la Belgique et le Bénin.
                Nous confectionnons à la main des trousses, sacs et housses d'ordinateur en tissu wax africain authentique.
                Chaque pièce est unique, réalisée par nos artisanes béninoises avec soin et passion.
              </p>
              <p className="font-basecoat text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed mt-4">
                Notre mission : valoriser le savoir-faire local, soutenir les artisanes et offrir des accessoires durables,
                élégants et respectueux de l'environnement.
              </p>
              <div className="mt-6">
                <Link
                  to="/qui-sommes-nous"
                  className="font-basecoat inline-flex items-center gap-2 text-benin-jaune hover:text-benin-terre font-bold text-sm sm:text-base transition group"
                >
                  Découvrir notre histoire
                  <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="order-1 md:order-2 flex justify-center items-center anim-scale" data-delay="0.3">
              <div className="relative w-full h-[300px] sm:h-[350px]">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="relative w-[160px] h-[160px] xl:h-[400px] xl:w-[400px] sm:w-[200px] sm:h-[200px] rounded-full overflow-hidden border-4 border-benin-jaune shadow-2xl transform hover:scale-110 transition duration-300">
                    <img src="/assets/equipe-1.jpg" alt="Fondatrice 1" loading="lazy" width={400} height={400} className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* ── Dans notre atelier ── */}
      <section
        className="relative px-4 sm:px-6 md:px-[60px] lg:px-[120px] py-10 sm:py-14 md:py-[70px]"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1600&q=80&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-white/80" />
        <div className="relative z-10">
        <h2 className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-[44px] font-bold uppercase text-gray-900">
          Dans notre atelier au Bénin
        </h2>
        <div className="anim-fade-up w-16 sm:w-20 h-1 bg-wax-yellow mt-3 sm:mt-4 mb-6 sm:mb-8" data-delay="0.1"></div>
        <p className="anim-fade-up font-basecoat text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed max-w-3xl mb-10 sm:mb-12" data-delay="0.15">
          Chaque création naît dans notre atelier de Cotonou, au rythme des mains habiles de nos artisanes. Des tissus wax soigneusement sélectionnés, une découpe précise, des finitions cousues avec amour — c'est ça, l'âme des Poulettes.
        </p>
        <div className="anim-stagger grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 max-w-2xl" data-stagger="0.1">
          <div className="bg-white rounded-2xl p-6 shadow-sm border-t-4 border-wax-turquoise">
            <p className="font-basecoat text-3xl mb-3">✂️</p>
            <h3 className="font-basecoat text-base font-bold uppercase text-gray-900 mb-2">Taillé à la main</h3>
            <p className="font-basecoat text-sm text-gray-600 leading-relaxed">Chaque pièce est découpée et assemblée manuellement par nos artisanes béninoises.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border-t-4 border-wax-orange">
            <p className="font-basecoat text-3xl mb-3">🌿</p>
            <h3 className="font-basecoat text-base font-bold uppercase text-gray-900 mb-2">Matières responsables</h3>
            <p className="font-basecoat text-sm text-gray-600 leading-relaxed">Wax africain 100% coton, sélectionné sur les marchés locaux de Cotonou. Emballages recyclables, zéro production industrielle.</p>
          </div>
        </div>
        </div>
      </section>

      {/* ── Actualités ── */}
      <section
        className="relative"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1509813005391-3d21e36ccb65?w=1600&q=80&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-white/88" />
        <div className="relative z-10">
        <div className="px-4 sm:px-6 md:px-[60px] lg:px-[120px] pt-6 sm:pt-8 md:pt-[60px] pb-8 sm:pb-10 md:pb-12">
          <h2 className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-[44px] font-bold uppercase text-gray-900">
            Actualités
          </h2>
          <div className="anim-fade-up w-16 sm:w-20 h-1 bg-wax-red mt-3 sm:mt-4" data-delay="0.1"></div>
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
                        className="w-full h-72 sm:h-80 md:h-96 lg:h-[480px] object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                  )}
                  <div className={`anim-fade-left ${!actu.image_url ? 'lg:col-span-2' : ''}`} data-delay="0.3">
                    {actu.date && (
                      <p className="font-basecoat text-sm text-benin-jaune font-semibold mb-3 tracking-wider uppercase">
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
                      className="font-basecoat uppercase border-2 border-benin-jaune text-gray-900 hover:bg-benin-jaune hover:text-black px-8 sm:px-10 py-3 sm:py-4 rounded-lg text-sm sm:text-base transform transition hover:scale-105 font-bold inline-block hover:shadow-lg"
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
        </div>
      </section>

      {/* ── Instagram ── */}
      <section
        className="relative px-4 sm:px-6 md:px-[60px] lg:px-[120px] py-10 sm:py-14 md:py-[70px]"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1600&q=80&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-white/88" />
        <div className="relative z-10">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-[44px] font-bold uppercase text-gray-900">
            Suivez-nous sur Instagram
          </h2>
          <div className="anim-fade-up w-16 sm:w-20 h-1 bg-wax-red mx-auto mt-3 sm:mt-4 mb-4" data-delay="0.1"></div>
          <p className="anim-fade-up font-basecoat text-gray-500 text-base sm:text-lg" data-delay="0.15">
            @lespoulettes.benin — coulisses, nouveautés & vie au Bénin
          </p>
        </div>

        {/* Grille photos Instagram */}
        <div className="anim-stagger grid grid-cols-3 gap-2 mb-8 sm:mb-10 rounded-2xl overflow-hidden" data-stagger="0.05">
          {[
            { url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=400&fit=crop&q=80', alt: 'Accessoires wax Les Poulettes' },
            { url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop&q=80', alt: 'Sacs et trousses wax colorés' },
            { url: 'https://images.unsplash.com/photo-1509813005391-3d21e36ccb65?w=400&h=400&fit=crop&q=80', alt: 'Tissu wax africain authentique' },
            { url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400&h=400&fit=crop&q=80', alt: 'Créations wax colorées' },
            { url: 'https://images.unsplash.com/photo-1605027990121-cbae9e0642df?w=400&h=400&fit=crop&q=80', alt: 'Atelier couture Cotonou' },
            { url: 'https://images.unsplash.com/photo-1524293581917-878a6d017c71?w=400&h=400&fit=crop&q=80', alt: 'Artisanes béninoises au travail' },
          ].map((post, i) => (
            <a
              key={i}
              href="https://www.instagram.com/lespoulettes.benin/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden"
            >
              <img
                src={post.url}
                alt={post.alt}
                loading="lazy"
                width={400}
                height={400}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-all duration-300 flex items-center justify-center">
                <svg className="w-9 h-9 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center anim-fade-up" data-delay="0.3">
          <a
            href="https://www.instagram.com/lespoulettes.benin/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-basecoat inline-flex items-center gap-3 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-10 sm:px-14 py-3 sm:py-4 rounded-xl text-sm sm:text-base uppercase tracking-wider font-bold transform transition hover:scale-105 hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            Voir notre Instagram
          </a>
        </div>
        </div>
      </section>

      {/* ── Commandes personnalisées ── */}
      <section
        className="relative px-4 sm:px-6 md:px-[60px] lg:px-[120px] py-10 sm:py-14 md:py-[70px]"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1600&q=80&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-white/88" />
        <div className="relative z-10">
        <div>
          <h2 className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-[40px] font-bold uppercase text-gray-900 leading-tight">
            Un événement à célébrer ?
          </h2>
          <div className="anim-fade-up w-16 sm:w-20 h-1 bg-benin-jaune mt-3 sm:mt-4 mb-6" data-delay="0.1"></div>
          <p className="anim-fade-up font-basecoat text-gray-700 text-base sm:text-lg leading-relaxed mb-8" data-delay="0.15">
            Mariage, baby shower, baptême, anniversaire... Les Poulettes créent des accessoires wax personnalisés pour que votre fête soit inoubliable.
          </p>
          <div className="anim-fade-up flex flex-wrap gap-3 mb-10" data-delay="0.2">
            {[
              { label: 'Mariage',      cls: 'animate-float',   borderColor: 'border-wax-turquoise' },
              { label: 'Baby shower',  cls: 'animate-float-2', borderColor: 'border-wax-yellow'    },
              { label: 'Anniversaire', cls: 'animate-float-3', borderColor: 'border-wax-orange'    },
              { label: 'Baptême',      cls: 'animate-float-4', borderColor: 'border-wax-red'       },
              { label: 'Naissance',    cls: 'animate-float-5', borderColor: 'border-wax-green'     },
            ].map(tag => (
              <span
                key={tag.label}
                className={`${tag.cls} font-basecoat text-sm font-semibold bg-white text-gray-800 border-2 ${tag.borderColor} px-6 py-3 rounded-full shadow-sm`}
              >
                {tag.label}
              </span>
            ))}
          </div>
          <div className="anim-fade-up flex flex-col sm:flex-row gap-4" data-delay="0.25">
            <Link
              to="/commandes-personnalisees"
              className="font-basecoat border-2 border-benin-jaune text-gray-900 hover:bg-benin-jaune hover:text-black px-8 py-3 rounded-xl font-bold uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] text-sm sm:text-base text-center"
            >
              Découvrir
            </Link>
            <a
              href="https://wa.me/2290162007580"
              target="_blank"
              rel="noopener noreferrer"
              className="font-basecoat border-2 border-benin-vert text-benin-vert hover:bg-benin-vert hover:text-white px-8 py-3 rounded-xl font-bold uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] text-sm sm:text-base text-center"
            >
              WhatsApp
            </a>
          </div>
        </div>
        </div>
      </section>

      {/* ── Où nous trouver ── */}
      <section id="ou-nous-trouver" className="w-full">
        <div className="relative z-10 mt-8 sm:mt-10 md:mt-12 mb-8 sm:mb-10 md:mb-12 px-4 sm:px-6 md:px-[60px] lg:px-[120px]">
          <h2 className="anim-fade-up font-basecoat text-2xl sm:text-3xl md:text-[44px] font-bold uppercase text-gray-900">
            Où nous trouver
          </h2>
          <div className="anim-fade-up w-16 sm:w-20 h-1 bg-wax-green mt-3 sm:mt-4" data-delay="0.1"></div>
          <p className="anim-fade-up mt-6 mb-6 font-basecoat text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed" data-delay="0.2">
            Retrait gratuit en Belgique (Grimbergen & Watermael-Boisfort) ou directement à Cotonou au Bénin. Livraison à domicile disponible en Belgique et dans toute l'Europe.
          </p>
          <p className="anim-fade-up mb-6 font-basecoat text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed" data-delay="0.3">
            <a
              href="https://wa.me/2290162007580"
              target="_blank"
              rel="noopener noreferrer"
              className="text-benin-jaune hover:text-benin-terre hover:underline font-semibold transition"
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
