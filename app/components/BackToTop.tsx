import { useState, useEffect } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Retour en haut de la page"
      className={`fixed bottom-8 right-8 z-50 group flex flex-col items-center gap-2 transition-opacity duration-300 ${
        visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <span className="font-basecoat text-xs tracking-widest text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase">
        Haut
      </span>
      <span className="w-[2px] h-8 bg-benin-jaune group-hover:h-12 transition-all duration-300"></span>
    </button>
  );
}
