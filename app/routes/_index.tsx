import { useEffect, useState } from 'react';
import { Link } from '@remix-run/react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ShoppingCartIcon } from "@heroicons/react/24/outline"; // 👈 ajoute cet import en haut avec les autres


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


  const [scrolled, setScrolled] = useState(false);

useEffect(() => {
  const handleScroll = () => setScrolled(window.scrollY > 50);
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
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
    autoplaySpeed: 2000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div>
      {/* Bannière */}
     <header
  className="banner relative bg-contain md:bg-cover bg-center h-[100vh] flex flex-col justify-between text-white p-8"
  style={{ backgroundImage: `url(${homepageData?.image_url})` }}
>
  {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-colors duration-500 ${
          scrolled ? "bg-black bg-opacity-70 text-white" : "bg-transparent text-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
         {/* Logo */}
<Link to="/" className="flex items-center">
  <img
    src="/assets/logo_t_poulettes.png" 
    alt="Les Poulettes"
    className="h-[100px] w-auto" 
  />
</Link>


          {/* Menu */}
          <ul className="hidden md:flex space-x-8 uppercase font-semibold text-lg">
            <li>
              <Link to="apropos" className="font-basecoat hover:text-yellow-400 transition">
                A propos
              </Link>
            </li>
            <li>
              <Link to="realisations" className="font-basecoat hover:text-yellow-400 transition">
                Réalisations
              </Link>
            </li>
            <li>
              <Link to="news" className="font-basecoat hover:text-yellow-400 transition">
                News
              </Link>
            </li>
          </ul>

          {/* Panier */}
          <Link
            to="/panier"
            className="relative p-2 hover:text-yellow-400 transition"
          >
            <ShoppingCartIcon className="w-6 h-6" />
            {/* Badge optionnel : */}
            {/* <span className="absolute -top-1 -right-1 bg-red-500 rounded-full text-xs w-4 h-4 flex items-center justify-center">3</span> */}
          </Link>
        </div>
      </nav>

  <div className="banner-content text-center z-10 flex-1 flex flex-col items-center justify-end">
    <h1 className="font-basecoat text-5xl font-bold drop-shadow-lg uppercase">Les trousses</h1>
  </div>

  <div className="z-10 flex justify-center mt-8">
    <Link
      to="/realisations"
      className="font-basecoat btn bg-yellow-400 text-black px-6 py-3 rounded transform transition duration-500 hover:scale-105 font-semibold"
    >
      Foncez !
    </Link>
  </div>
  
  <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
</header>

  <div className="banner-content mt-12  text-center z-10 flex-1 flex flex-col items-center justify-end">
    <p className="font-basecoat text-xl drop-shadow-lg max-w-[750px]">{homepageData?.description}</p>
  </div>

      {/* Actualités */}
 <div
  className="relative z-10 mt-12 text-center -mb-[var(--margin-mobile)] lg:-mb-[var(--margin-desktop)]"
  style={{ "--margin-desktop": "75px", "--margin-mobile": "20px" }}
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
    style={{ "--margin-desktop": "75px", "--margin-mobile": "20px" }}
  >
   <h2 className="font-ogg font-light uppercase text-[35px] md:text-[40px] lg:text-[60px] text-black leading-tight tracking-[5px]">
  Laisserez-vous tenter ?
</h2>

  </div>

  <Slider {...sliderSettings} className="mt-8 relative z-0">
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
            <h3 className="font-basecoat mt-4 text-xl font-semibold">{realisation.title}</h3>
            <p className="font-basecoat mt-2 text-gray-700">{realisation.description}</p>
            <p className="font-basecoat mt-2 text-gray-700">{realisation.prix} €</p>
            <span className="font-basecoat text-indigo-600 hover:text-indigo-800 font-medium mt-2 block">
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
