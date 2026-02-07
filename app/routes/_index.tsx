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
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Détection taille écran
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 767);
      setIsTablet(width > 767 && width <= 1024);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
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

  // Configuration slider dynamique
  const getSlidesToShow = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3;
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: getSlidesToShow(),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    swipeToSlide: true,
  };

  return (
    <div className="overflow-x-hidden">
     
      {/* Header Banner - Responsive heights */}
<header
  className="banner relative bg-cover bg-center h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[100vh] flex flex-col justify-end text-white p-4 sm:p-6 md:p-8 pt-20 sm:pt-24"
  style={{ backgroundImage: `url(${homepageData?.image_url})` }}
>
  <div className="banner-content text-center z-10 flex flex-col items-center justify-end pb-8 sm:pb-12 md:pb-16">
    {/* Logo Les Poulettes BLANC et GRAND */}
    <img
      src="/assets/logo_t_poulettes_white.png"
      alt="Les Poulettes"
      className="w-[300px] sm:w-[400px] md:w-[500px] lg:w-[600px] drop-shadow-2xl"
    />
    
    <h1 className="font-basecoat text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold drop-shadow-lg mb-6 px-4 max-w-[90%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[50%]">
      Une marque d'accessoires made in Bénin, éco-trendy/éco-friendly qui surfe sur la vague du wax !
    </h1>
    
    <div className="mt-4 sm:mt-6">
      <Link
        to="/realisations"
        className="font-basecoat btn bg-yellow-400 text-black px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-3.5 rounded text-sm sm:text-base md:text-lg transform transition duration-500 hover:scale-105 font-semibold inline-block"
      >
        Je craque !
      </Link>
    </div>
  </div>
  <div className="absolute inset-0 bg-black opacity-65 z-0"></div>
</header>
<section id="qui-sommes-nous">
  <div className="relative z-10 mt-8 sm:mt-10 md:mt-12 text-center mb-8 sm:mb-10 md:mb-12">
    <h2 className="font-basecoat text-3xl sm:text-4xl md:text-5xl lg:text-6xldrop-shadow-lg uppercase px-4">
      Qui sommes-nous?
    </h2>
  </div>

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16 md:mb-20">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
      
      {/* Texte */}
      <div className="order-2 md:order-1">
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

      {/* Photos circulaires - 2 personnes */}
      <div className="order-1 md:order-2 flex justify-center items-center">
        <div className="relative w-full h-[300px] sm:h-[350px]">
          {/* Photo 1 - Gauche */}
          <div className="absolute top-1/2 left-[20%] sm:left-[25%] -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="relative w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] rounded-full overflow-hidden border-4 border-yellow-400 shadow-2xl transform hover:scale-110 transition duration-300">
              <img src="/assets/equipe-1.jpg" alt="Fondatrice 1" className="w-full h-full object-cover" />
            </div>
          </div>
          
          {/* Photo 2 - Droite */}
          <div className="absolute top-1/2 right-[20%] sm:right-[25%] translate-x-1/2 -translate-y-1/2 z-20">
            <div className="relative w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] rounded-full overflow-hidden border-4 border-yellow-400 shadow-2xl transform hover:scale-110 transition duration-300">
              <img src="/assets/equipe-2.jpg" alt="Fondatrice 2" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>
      {/* Actualités - Responsive title */}
      <div className="relative z-10 mt-8 sm:mt-10 md:mt-12 text-center px-4">
        <h2 className="font-basecoat text-3xl sm:text-4xl md:text-5xl lg:text-6xldrop-shadow-lg uppercase px-4">
         Actualités
        </h2>
      </div>

      {/* Actualités Section - Responsive layout */}
      <section className="actualites py-6 sm:py-8 md:py-10 bg-yellow-100 max-w-7xl mx-4 sm:mx-6 md:mx-8 lg:mx-auto px-4 sm:px-6 md:px-8 rounded-lg shadow-md mt-8 sm:mt-10 md:mt-12">
        {actualites.length > 0 ? (
          actualites.map((actu) => (
            <div key={actu.id} className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
              <div className="w-full md:w-1/2 order-2 md:order-1">
                <h2 className="font-basecoat text-2xl sm:text-3xl md:text-4xl font-semibold text-black mb-3 sm:mb-4">
                  {actu.title}
                </h2>
                <p className="mb-6 font-basecoat text-gray-800 text-base sm:text-lg md:text-xl whitespace-pre-line leading-relaxed">
                  {actu.content}
                </p>
                <Link to="/actualites">
                  <button
                    type="button"
                    className="font-basecoat btn bg-yellow-400 text-black px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-3.5 rounded text-sm sm:text-base md:text-lg transform transition duration-500 hover:scale-105 font-semibold inline-block"
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
          <h2 className="font-basecoat text-3xl sm:text-4xl md:text-5xl lg:text-6xldrop-shadow-lg uppercase px-4">
 Nos créations          </h2>
        </div>

        <Slider {...sliderSettings} className="mt-4 sm:mt-6 md:mt-8 relative z-0" key={`${isMobile}-${isTablet}`}>
          {realisations.map((realisation) => (
            <div key={realisation.id} className="px-3 sm:px-4 md:px-6">
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
   <section id="ou-nous-trouver" className="w-full">
  <div className="relative z-10 mt-8 sm:mt-10 md:mt-12 text-center mb-8 sm:mb-10 md:mb-12">
    <h2 className="font-basecoat text-3xl sm:text-4xl md:text-5xl lg:text-6xldrop-shadow-lg uppercase px-4">
      Où nous trouver
    </h2>
    
    {/* Texte descriptif */}
    <p className="font-basecoat text-base sm:text-lg md:text-xl text-gray-700 mt-4 sm:mt-6 px-4">
      Vous pouvez nous trouver à Cotonou<br></br>
      Whatsapp : +229 xx xx xx xx
    </p>
  </div>

  {/* Google Map - Pleine largeur */}
  <div className="w-full h-[400px] sm:h-[500px] md:h-[600px]">
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