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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl font-basecoat">Chargement...</p>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-500 text-xl font-basecoat">{error}</p>
    </div>
  );

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    arrows: false,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="overflow-x-hidden">
     
      {/* Header Banner - Responsive heights */}
      <header
        className="banner relative bg-cover bg-center h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[100vh] flex flex-col justify-end text-white p-4 sm:p-6 md:p-8"
        style={{ backgroundImage: `url(${homepageData?.image_url})` }}
      >
        <div className="banner-content text-center z-10 flex flex-col items-center justify-end pb-8 sm:pb-12 md:pb-16">
          <h1 className="font-basecoat text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold drop-shadow-lg uppercase px-4">
            Les trousses
          </h1>
          <div className="mt-4 sm:mt-6">
            <Link
              to="/realisations"
              className="font-basecoat btn bg-yellow-400 text-black px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-3.5 rounded text-sm sm:text-base md:text-lg transform transition duration-500 hover:scale-105 font-semibold inline-block"
            >
              Foncez !
            </Link>
          </div>
        </div>
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
      </header>

      {/* Description - Responsive padding & text */}
      <div className="mt-8 sm:mt-10 md:mt-12 text-center px-4 sm:px-6 md:px-8">
        <p className="font-basecoat text-base sm:text-lg md:text-xl lg:text-2xl max-w-[90%] sm:max-w-[750px] mx-auto leading-relaxed">
          {homepageData?.description}
        </p>
      </div>

      {/* Actualités - Responsive title */}
      <div className="relative z-10 mt-8 sm:mt-10 md:mt-12 text-center px-4">
        <h2 className="font-ogg font-light uppercase text-[28px] sm:text-[35px] md:text-[45px] lg:text-[60px] text-black leading-tight tracking-[3px] sm:tracking-[4px] md:tracking-[5px]">
          À ne pas manquer
        </h2>
      </div>

      {/* Actualités Section - Responsive layout */}
      <section className="actualites py-8 sm:py-12 md:py-16 bg-yellow-100 max-w-7xl mx-4 sm:mx-6 md:mx-8 lg:mx-auto px-4 sm:px-6 md:px-8 rounded-lg shadow-md mt-8 sm:mt-10 md:mt-12">
        {actualites.length > 0 ? (
          actualites.map((actu) => (
            <div key={actu.id} className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 mb-8 sm:mb-10 md:mb-12">
              <div className="w-full md:w-1/2 order-2 md:order-1">
                <h2 className="font-basecoat text-2xl sm:text-3xl md:text-4xl font-semibold text-black mb-3 sm:mb-4">
                  {actu.title}
                </h2>
                <p className="font-basecoat text-gray-800 text-base sm:text-lg md:text-xl whitespace-pre-line leading-relaxed">
                  {actu.content}
                </p>
                <Link to="/actualites">
                  <button
                    type="button"
                    className="font-basecoat uppercase py-2 px-4 sm:py-2.5 sm:px-5 mt-4 sm:mt-6 text-xs sm:text-sm font-medium text-indigo-600 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 transition"
                  >
                    Toutes les actualités
                  </button>
                </Link>
              </div>
              {actu.image_url && (
                <div className="w-full md:w-1/2 order-1 md:order-2">
                  <img
                    src={actu.image_url}
                    alt={actu.title}
                    className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover rounded-md shadow-md"
                  />
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 text-base sm:text-lg">Aucune actualité disponible.</p>
        )}
      </section>

      {/* Slider Réalisations - Responsive title & spacing */}
      <section className="products py-8 sm:py-12 md:py-16 bg-white max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <div className="relative z-10 mt-8 sm:mt-10 md:mt-12 text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="font-ogg font-light uppercase text-[28px] sm:text-[35px] md:text-[45px] lg:text-[60px] text-black leading-tight tracking-[3px] sm:tracking-[4px] md:tracking-[5px]">
            Vous laisserez-vous tenter ?
          </h2>
        </div>

        <Slider {...sliderSettings} className="mt-4 sm:mt-6 md:mt-8 relative z-0">
          {realisations.map((realisation) => (
            <div key={realisation.id} className="px-2 sm:px-3 md:px-4">
              <Link to={`/realisations/${realisation.id}`}>
                <div className="bg-gray-200 p-4 sm:p-5 md:p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition h-full">
                  {realisation.image_url ? (
                    <img
                      src={realisation.image_url}
                      alt={realisation.title}
                      className="w-full h-36 sm:h-44 md:h-52 lg:h-60 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-full h-36 sm:h-44 md:h-52 lg:h-60 bg-gray-300 flex items-center justify-center rounded-md">
                      <span className="text-gray-500 text-sm sm:text-base">Aucune image</span>
                    </div>
                  )}
                  <h3 className="font-basecoat mt-3 sm:mt-4 text-base sm:text-lg md:text-xl font-semibold line-clamp-2">
                    {realisation.title}
                  </h3>
                  <p className="font-basecoat mt-2 text-gray-700 text-xs sm:text-sm md:text-base line-clamp-2">
                    {realisation.description}
                  </p>
                  <p className="font-basecoat mt-2 text-gray-900 font-bold text-lg sm:text-xl md:text-2xl">
                    {realisation.prix} €
                  </p>
                  <button
                    type="button"
                    className="font-basecoat uppercase py-1.5 px-3 sm:py-2 sm:px-4 md:py-2.5 md:px-5 mt-3 sm:mt-4 text-xs sm:text-sm md:text-base font-medium text-indigo-600 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 transition"
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