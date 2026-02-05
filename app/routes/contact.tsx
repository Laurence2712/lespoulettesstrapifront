import { motion } from "framer-motion";

export default function Contact() {
  return (
    <section className="min-h-screen bg-gray-50 pt-[80px] sm:pt-[100px] md:pt-[120px] pb-12 sm:pb-16 md:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-start md:items-center">
        
        {/* Bloc gauche : infos et formulaire */}
        <div className="order-1">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-ogg text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-3 sm:mb-4 text-gray-900 uppercase"
          >
            Contactez-nous
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-basecoat text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed"
          >
            Vous avez une question, un projet ou simplement envie de dire bonjour ? 
            Nous sommes à Cotonou, Bénin — et toujours ravis d'échanger !
          </motion.p>

          {/* Carte Google Map - Responsive height */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl sm:rounded-2xl overflow-hidden shadow-lg mb-6 sm:mb-8 border border-gray-200"
          >
            <iframe
              title="Carte Cotonou"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.8946343210434!2d2.420964075838061!3d6.370292993617867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x102356b1b7fca2f7%3A0x7d1ab145c3e53238!2sCotonou%2C%20B%C3%A9nin!5e0!3m2!1sfr!2sbe!4v1700000000000"
              width="100%"
              height="200"
              className="sm:h-[250px] md:h-[280px]"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </motion.div>

          {/* Formulaire - Responsive spacing */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3 sm:space-y-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <div>
              <label className="font-basecoat block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
                Nom
              </label>
              <input
                type="text"
                placeholder="Votre nom"
                className="font-basecoat w-full rounded-lg sm:rounded-xl border border-gray-300 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base focus:ring-2 focus:ring-yellow-400 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="font-basecoat block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
                Email
              </label>
              <input
                type="email"
                placeholder="votre@email.com"
                className="font-basecoat w-full rounded-lg sm:rounded-xl border border-gray-300 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base focus:ring-2 focus:ring-yellow-400 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="font-basecoat block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
                Message
              </label>
              <textarea
                placeholder="Écrivez votre message..."
                rows={4}
                className="font-basecoat w-full rounded-lg sm:rounded-xl border border-gray-300 px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base focus:ring-2 focus:ring-yellow-400 outline-none transition resize-none sm:rows-5"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="font-basecoat w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition transform hover:scale-105 active:scale-95 text-sm sm:text-base"
            >
              Envoyer le message
            </button>
          </motion.form>
        </div>

        {/* Bloc droit : Image visuelle - Responsive order & height */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="relative order-2 mt-8 md:mt-0"
        >
        
          <div className="absolute inset-0 bg-yellow-400 opacity-20 rounded-xl sm:rounded-2xl pointer-events-none"></div>
        </motion.div>
      </div>
    </section>
  );
}