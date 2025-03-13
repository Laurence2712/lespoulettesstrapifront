import { useEffect, useState } from 'react';
import { Link } from '@remix-run/react';

interface HomepageData {
  image_url?: string;
  description?: string;
}

export default function Index() {
  const [homepageData, setHomepageData] = useState<HomepageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHomepageData() {
      try {
        const response = await fetch('http://localhost:1337/api/homepages');  // Remplace par l'URL correcte de ton API
        const data = await response.json();
        
        if (data && data.data && data.data.length > 0) {
          const homepage = data.data[0]; // Prendre la première entrée
          
          // Récupérer la description en assemblant les morceaux de texte
          let descriptionText = '';
          homepage.description.forEach((block: any) => {
            block.children.forEach((child: any) => {
              descriptionText += child.text + ' ';
            });
          });

          setHomepageData({
            image_url: `http://localhost:1337${homepage.image_url}`, // Assure-toi que l'URL de l'image est correcte
            description: descriptionText.trim(),
          });
        } else {
          setError('Aucune donnée trouvée');
        }
      } catch (error: any) {
        setError('Erreur lors du chargement des données');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchHomepageData();
  }, []);

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      {/* Bannière principale */}
      <header className="banner relative bg-cover bg-center h-[80vh] flex items-center justify-center text-white p-8" style={{ backgroundImage: `url(${homepageData?.image_url})` }}>
        <div className="banner-content text-center z-10">
          <h1 className="text-5xl font-bold drop-shadow-lg">Bienvenue chez Les Poulettes</h1>
          <p className="text-xl mt-4 drop-shadow-lg">{homepageData?.description}</p>
          <Link to="/realisations" className="btn bg-yellow-400 text-black px-6 py-3 rounded mt-6 inline-block transform transition duration-500 hover:scale-105">Voir nos réalisations</Link>
        </div>
        {/* Overlay pour assombrir l'image */}
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
      </header>

      {/* À propos */}
      
      <section className="about py-16 bg-white">
        <h2 className="text-3xl text-center font-semibold text-black">Qui sommes-nous ?</h2>
        <p className="text-lg mt-4 text-center max-w-3xl mx-auto text-black">Les Poulettes, c’est une équipe passionnée qui fabrique des objets uniques : tote bags, décorations, housses d’ordinateur, bandeaux, sacs à main et bien plus encore.</p>
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

      {/* Produits */}
      <section className="products py-16 bg-white">
        <h2 className="text-3xl text-center font-semibold text-black">Nos Produits</h2>
        <div className="product-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          <div className="product-box text-center bg-gray-200 p-6 rounded-lg shadow-lg transition-transform duration-500 hover:scale-105">
            <img src="images/tote-bag.jpg" alt="Tote Bag" className="w-full h-48 object-cover rounded-md" />
            <h3 className="mt-4 text-xl font-semibold">Tote Bag</h3>
            <p>Pratique et stylé, idéal pour vos courses ou sorties quotidiennes.</p>
          </div>
          <div className="product-box text-center bg-gray-200 p-6 rounded-lg shadow-lg transition-transform duration-500 hover:scale-105">
            <img src="images/housse-ordinateur.jpg" alt="Housse d'ordinateur" className="w-full h-48 object-cover rounded-md" />
            <h3 className="mt-4 text-xl font-semibold">Housse d'Ordinateur</h3>
            <p>Protégez votre ordinateur avec nos housses uniques et élégantes.</p>
          </div>
          <div className="product-box text-center bg-gray-200 p-6 rounded-lg shadow-lg transition-transform duration-500 hover:scale-105">
            <img src="images/bandeau.jpg" alt="Bandeau" className="w-full h-48 object-cover rounded-md" />
            <h3 className="mt-4 text-xl font-semibold">Bandeau</h3>
            <p>Un accessoire mode et pratique pour toutes vos tenues.</p>
          </div>
        </div>
      </section>

      {/* Pied de page */}
      <footer className="footer bg-gray-800 text-white text-center py-4">
        <p>&copy; 2025 Les Poulettes - Tous droits réservés</p>
      </footer>
    </div>
  );
}
