import { useEffect, useState } from 'react';
import { Link } from '@remix-run/react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { apiEndpoints, getImageUrl } from '../config/api';

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
}

export default function Index() {
  const [homepageData, setHomepageData] = useState<HomepageData | null>(null);
  const [realisations, setRealisations] = useState<Realisation[]>([]);
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Scroll pour nav
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch homepage
  useEffect(() => {
    async function fetchHomepageData() {
      try {
        const response = await fetch(apiEndpoints.homepages);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
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
          setHomepageData({ image_url: bannerImageUrl, description: descriptionText.trim() });
        } else {
          setError('Aucune donnée trouvée');
        }
      } catch (err: any) {
        console.error(err);
        setError('Erreur lors du chargement des données');
      }
    }
    fetchHomepageData();
  }, []);

  // Fetch réalisations
  useEffect(() => {
    async function fetchRealisations() {
      try {
        const response = await fetch(apiEndpoints.realisations);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (data?.data) {
          const realisationsData: Realisation[] = data.data.map((item: any) => ({
            id: item.id,
            title: item.Titre || 'Titre indisponible',
            image_url: item.Images?.[0]?.url ? getImageUrl(item.Images[0].url) : undefined,
            description: item.Description || 'Description indisponible',
            prix: item.Prix || 'Prix indisponible',
          }));
          setRealisations(realisationsData);
        }
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchRealisations();
  }, []);

  // Fetch actualités
  useEffect(() => {
    async function fetchActualites() {
      try {
        const response = await fetch(apiEndpoints.latestActualite);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (data?.data) {
          const actualitesData: Actualite[] = data.data.map((item: any) => ({
            id: item.id,
            title: item.Title || 'Titre indisponible',
            content: item.content || '',
            image_url: item.image?.formats?.large?.url
              ? getImageUrl(item.image.formats.large.url)
              : item.image?.url
              ? getImageUrl(item.image.url)
              : '',
          }));
          setActualites(actualitesData);
        }
      } catch (err: any) {
        console.error(err);
      }
    }
    fetchActualites();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div>
     
      {/* Header Banner */}
      <header
        className="banner relative bg-cover bg-center h-[100vh] flex flex-col justify-end text-white p-8"
        style={{ backgroundImage: `url(${homepageData?.image_url})` }}
      >
        <div className="banner-content text-center z-10 flex flex-col items-center justify-end pb-16">
          <h1 className="font-basecoat text-5xl font-bold drop-shadow-lg uppercase">Les trousses</h1>
          <div className="mt-6">
            <Link
              to="/realisations"
              className="font-basecoat btn bg-yellow-400 text-black px-6 py-3 rounded transform transition duration-500 hover:scale-105 font-semibold"
            >
              Foncez !
            </Link>
          </div>
        </div>
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
      </header>

      {/* Description */}
      <div className="banner-content mt-12 text-center z-10 flex flex-col items-center justify-end">
        <p className="font-basecoat text-xl drop-shadow-lg max-w-[750px]">{homepageData?.description}</p>
      </div>

      {/* Actualités */}
      <div className="relative z-10 mt-12 text-center -mb-[var(--margin-mobile)] lg:-mb-[var(--margin-desktop)]"
        style={{ "--margin-desktop": "75px", "--margin-mobile": "20px" } as any}
      >
        <h2 className="font-ogg font-light uppercase text-[35px] md:text-[40px] lg:text-[60px] text-black leading-tight tracking-[5px]">
          À ne pas manquer
        </h2>
      </div>

      <section className="actualites py-16 bg-yellow-100 max-w-7xl mx-auto px-4 rounded-lg shadow-md mt-12">
        {actualites.length > 0 ? (
          actualites.map((actu) => (
            <div key={actu.id} className="flex flex-col md:flex-row items-center gap-8 mb-12">
              <div className="md:w-1/2">
                <h2 className="font-basecoat text-3xl font-semibold text-black mb-4">{actu.title}</h2>
                <p className="font-basecoat text-gray-800 text-lg whitespace-pre-line">{actu.content}</p>
                <Link to={`/actualites/`}>
                  <button
                    type="button"
                    className="font-basecoat uppercase py-2.5 px-5 me-2 mb-2 text-sm font-medium text-indigo-600 mt-2 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
                  >
                    Toutes les actualités
                  </button>
                </Link>
              </div>
              {actu.image_url && (
                <div className="md:w-1/2">
                  <img
                    src={actu.image_url}
                    alt={actu.title}
                    className="w-full h-64 object-cover rounded-md shadow-md"
                  />
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">Aucune actualité disponible.</p>
        )}
      </section>

      {/* Slider Réalisations */}
      <section className="products py-16 bg-white max-w-7xl mx-auto px-4 relative z-10">
        <div
          className="relative z-10 mt-12 text-center -mb-[var(--margin-mobile)] lg:-mb-[var(--margin-desktop)]"
          style={{ "--margin-desktop": "75px", "--margin-mobile": "20px" } as any}
        >
          <h2 className="font-ogg font-light uppercase text-[28px] sm:text-[35px] md:text-[40px] lg:text-[60px] text-black leading-tight tracking-[3px] sm:tracking-[4px] md:tracking-[5px]">
            Laisserez-vous tenter ?
          </h2>
        </div>

        <Slider {...sliderSettings} className="mt-8 relative z-0">
          {realisations.map((realisation) => (
            <div key={realisation.id} className="p-2 sm:p-4">
              <Link to={`/realisations/${realisation.id}`}>
                <div className="bg-gray-200 p-4 sm:p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition">
                  {realisation.image_url ? (
                    <img
                      src={realisation.image_url}
                      alt={realisation.title}
                      className="w-full h-40 sm:h-48 md:h-52 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-full h-40 sm:h-48 md:h-52 bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-500">Aucune image</span>
                    </div>
                  )}
                  <h3 className="font-basecoat mt-3 sm:mt-4 text-lg sm:text-xl font-semibold">{realisation.title}</h3>
                  <p className="font-basecoat mt-1 sm:mt-2 text-gray-700 text-sm sm:text-base">{realisation.description}</p>
                  <p className="font-basecoat mt-1 sm:mt-2 text-gray-700 font-medium">{realisation.prix} €</p>
                  <button
                    type="button"
                    className="font-basecoat uppercase py-2 px-4 sm:py-2.5 sm:px-5 mt-2 text-sm sm:text-base font-medium text-indigo-600 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 transition"
                  >
                    Voir plus
                  </button>
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      </section>
    </div>
  );
}