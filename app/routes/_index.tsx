import { useEffect, useState } from 'react';
import { Link } from '@remix-run/react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

  // === Fetch Homepage ===
  useEffect(() => {
    async function fetchHomepageData() {
      try {
        const response = await fetch('http://localhost:1337/api/homepages?populate=*');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (data?.data?.length) {
          const homepage = data.data[0];
          const bannerImageUrl = homepage.banner_image?.formats?.large?.url
            ? `http://localhost:1337${homepage.banner_image.formats.large.url}`
            : homepage.banner_image?.url
            ? `http://localhost:1337${homepage.banner_image.url}`
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

  // === Fetch Réalisations ===
  useEffect(() => {
    async function fetchRealisations() {
      try {
        const response = await fetch('http://localhost:1337/api/realisations?populate=*');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (data?.data) {
          const realisationsData: Realisation[] = data.data.map((item: any) => ({
            id: item.id,
            title: item.Titre || 'Titre indisponible',
            image_url: item.Images?.[0]?.url ? `http://localhost:1337${item.Images[0].url}` : undefined,
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

  // === Fetch Actualités ===
  useEffect(() => {
    async function fetchActualites() {
      try {
        const response = await fetch('http://localhost:1337/api/actualites?populate=*');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (data?.data) {
          const actualitesData: Actualite[] = data.data.map((item: any) => ({
            id: item.id,
            title: item.Title || 'Titre indisponible',
            content: item.content || '',
            image_url: item.image?.formats?.large?.url
              ? `http://localhost:1337${item.image.formats.large.url}`
              : item.image?.url
              ? `http://localhost:1337${item.image.url}`
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
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div>
      {/* Bannière */}
      <header
        className="banner relative bg-cover bg-center h-[80vh] flex items-center justify-center text-white p-8"
        style={{ backgroundImage: `url(${homepageData?.image_url})` }}
      >
        <div className="banner-content text-center z-10">
          <h1 className="text-5xl font-bold drop-shadow-lg">Les Poulettes</h1>
          <p className="text-xl mt-4 drop-shadow-lg">{homepageData?.description}</p>
          <Link
            to="/realisations"
            className="btn bg-yellow-400 text-black px-6 py-3 rounded mt-6 inline-block transform transition duration-500 hover:scale-105"
          >
            Voir nos réalisations
          </Link>
        </div>
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
      </header>

      {/* Actualités */}
      <section className="actualites py-16 bg-yellow-100 max-w-7xl mx-auto px-4 rounded-lg shadow-md mt-12">
        {actualites.length > 0 ? (
          actualites.map((actu) => (
            <div key={actu.id} className="flex flex-col md:flex-row items-center gap-8 mb-12">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-semibold text-black mb-4">{actu.title}</h2>
                <p className="text-gray-800 text-lg whitespace-pre-line">{actu.content}</p>
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
      <section className="products py-16 bg-white max-w-7xl mx-auto px-4">
        <h2 className="text-3xl text-center font-semibold text-black">Nos Réalisations</h2>
        <Slider {...sliderSettings} className="mt-8">
          {realisations.map((realisation) => (
            <div key={realisation.id} className="p-4">
              <Link to={`/realisations/${realisation.id}`}>
                <div className="bg-gray-200 p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition">
                  {realisation.image_url ? (
                    <img
                      src={realisation.image_url}
                      alt={realisation.title}
                      className="w-full h-48 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-500">Aucune image</span>
                    </div>
                  )}
                  <h3 className="mt-4 text-xl font-semibold">{realisation.title}</h3>
                  <p className="mt-2 text-gray-700">{realisation.description}</p>
                  <p className="mt-2 text-gray-700">{realisation.prix} €</p>
                  <span className="text-indigo-600 hover:text-indigo-800 font-medium mt-2 block">
                    Voir plus
                  </span>
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      </section>
    </div>
  );
}
