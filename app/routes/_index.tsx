import { useEffect, useState } from 'react';
import { Link } from '@remix-run/react';

interface HomepageData {
  image_url?: string;
  description?: string;
}

interface Realisation {
  id: number;
  title: string;
  image_url?: string;
  description?: string;
  prix?: string;
}

export default function Index() {
  const [homepageData, setHomepageData] = useState<HomepageData | null>(null);
  const [realisations, setRealisations] = useState<Realisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch homepage data
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

          setHomepageData({
            image_url: bannerImageUrl,
            description: descriptionText.trim(),
          });
        } else {
          setError('Aucune donnée trouvée');
        }
      } catch (err: any) {
        console.error('Erreur lors du chargement de la homepage :', err);
        setError('Erreur lors du chargement des données');
      }
    }

    fetchHomepageData();
  }, []);

  // Fetch last 3 realizations
  useEffect(() => {
    async function fetchRealisations() {
      try {
        const response = await fetch('http://localhost:1337/api/realisations?populate=*&sort=createdAt:desc&pagination[pageSize]=3');
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
        const data = await response.json();

        if (data?.data) {
          const realisationsData: Realisation[] = data.data.map((item: any) => ({
            id: item.id,
            title: item.Titre || 'Titre indisponible',
            image_url: item.Images?.[0]?.url,
            description: item.Description || 'Description indisponible',
            prix: item.Prix || 'Prix indisponible',
          }));
          setRealisations(realisationsData);
        }
      } catch (err: any) {
        console.error('Erreur lors du chargement des réalisations', err);
      } finally {
        setLoading(false);
      }
    }

    fetchRealisations();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      {/* Bannière principale */}
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

      {/* Container pour toutes les sections */}
      <div className="max-w-7xl mx-auto px-4">

        {/* À propos */}
        <section className="about py-16 bg-white">
          <h2 className="text-3xl text-center font-semibold text-black">Qui sommes-nous ?</h2>
          <p className="text-lg mt-4 text-center max-w-3xl mx-auto text-black">
            Les Poulettes, c’est une équipe passionnée qui fabrique des objets uniques : tote bags, décorations, housses d’ordinateur, bandeaux, sacs à main et bien plus encore.
          </p>
        </section>

        {/* Nos valeurs */}
        <section className="values py-16 bg-gray-100">
          <h2 className="text-3xl text-center font-semibold text-black">Nos Valeurs</h2>
          <div className="values-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            <div className="value-box text-center bg-white p-6 rounded-lg shadow-lg transition-transform duration-500 hover:scale-105">
              <img src="images/artisanat.jpg" alt="Artisanat" className="w-full h-48 object-cover rounded-md" />
              <h3 className="mt-4 text-xl font-semibold">Artisanat</h3>
              <p>Chaque création est faite à la main avec soin et originalité.</p>
            </div>
            <div className="value-box text-center bg-white p-6 rounded-lg shadow-lg transition-transform duration-500 hover:scale-105">
              <img src="images/ecologie.jpg" alt="Écologie" className="w-full h-48 object-cover rounded-md" />
              <h3 className="mt-4 text-xl font-semibold">Écologie</h3>
              <p>Nous utilisons des matériaux respectueux de l’environnement.</p>
            </div>
            <div className="value-box text-center bg-white p-6 rounded-lg shadow-lg transition-transform duration-500 hover:scale-105">
              <img src="images/qualite.jpg" alt="Qualité" className="w-full h-48 object-cover rounded-md" />
              <h3 className="mt-4 text-xl font-semibold">Qualité</h3>
              <p>Des produits conçus pour durer et embellir votre quotidien.</p>
            </div>
          </div>
        </section>

        {/* Produits / Dernières réalisations */}
        <section className="products py-16 bg-white">
          <h2 className="text-3xl text-center font-semibold text-black">Nos Réalisations</h2>
          <div className="product-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {realisations.map((realisation) => (
              <div
                key={realisation.id}
                className="product-box text-center bg-gray-200 p-6 rounded-lg shadow-lg transition-transform duration-500 hover:scale-105"
              >
                {realisation.image_url ? (
                  <img
                    src={`http://localhost:1337${realisation.image_url}`}
                    alt={realisation.title}
                    className="w-full h-48 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-500">Aucune image</span>
                  </div>
                )}
                <h3 className="mt-4 text-xl font-semibold">{realisation.title}</h3>
                <p className="text-gray-700 mt-2">{realisation.description}</p>
                <p className="text-gray-700 mt-2">{realisation.prix} €</p>
                <Link
                  to={`/realisations/${realisation.id}`}
                  className="text-indigo-600 hover:text-indigo-800 font-medium mt-2 block"
                >
                  Voir plus
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Pied de page */}
        <footer className="footer bg-gray-800 text-white text-center py-4">
          <p>&copy; 2025 Les Poulettes - Tous droits réservés</p>
        </footer>
      </div>
    </div>
  );
}
