import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section className="min-h-screen bg-gray-50 pt-[120px] pb-20">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
        {/* Bloc gauche : infos et formulaire */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 font-basecoat"
          >
            Contactez-nous
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 mb-6"
          >
            Vous avez une question, un projet ou simplement envie de dire bonjour ? 
            Nous sommes à Cotonou, Bénin — et toujours ravis d’échanger !
          </motion.p>

          {/* Carte Google Map */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl overflow-hidden shadow-lg mb-8 border border-gray-200"
          >
            <iframe
              title="Carte Cotonou"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.8946343210434!2d2.420964075838061!3d6.370292993617867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x102356b1b7fca2f7%3A0x7d1ab145c3e53238!2sCotonou%2C%20B%C3%A9nin!5e0!3m2!1sfr!2sbe!4v1700000000000"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </motion.div>

          {/* Formulaire */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                placeholder="Votre nom"
                className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-yellow-400 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="votre@email.com"
                className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-yellow-400 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                placeholder="Écrivez votre message..."
                rows="5"
                className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-yellow-400 outline-none transition"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-3 rounded-xl transition transform hover:-translate-y-1"
            >
              Envoyer le message
            </button>
          </motion.form>
        </div>

        {/* Bloc droit : Image visuelle */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="relative"
        >
          <img
            src="/assets/contact_visual.jpg"
            alt="Illustration contact"
            className="rounded-2xl shadow-2xl w-full object-cover h-[500px]"
          />
          <div className="absolute inset-0 bg-yellow-400 opacity-20 rounded-2xl"></div>
        </motion.div>
      </div>
    </section>
  );
}
