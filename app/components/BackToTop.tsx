import { useState, useEffect } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [onDark, setOnDark] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
      const footer = document.querySelector("footer");
      if (footer) {
        const footerTop = footer.getBoundingClientRect().top;
        const buttonCenterY = window.innerHeight - 24 - 24;
        setOnDark(footerTop < buttonCenterY);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Retour en haut de la page"
      className={`group fixed bottom-6 right-6 z-50 w-12 h-12 rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:scale-105 ${
        onDark
          ? "bg-white text-black hover:bg-benin-jaune hover:shadow-[0_6px_24px_rgba(252,209,22,0.45)]"
          : "bg-benin-jaune text-black hover:bg-gray-900 hover:text-benin-jaune hover:shadow-[0_6px_24px_rgba(0,0,0,0.3)]"
      } ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div className="flex flex-col items-center justify-center h-full gap-1">
        <svg
          className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
        </svg>
        <div className="w-3.5 h-0.5 rounded-full bg-current opacity-50 transition-all duration-300 group-hover:w-5 group-hover:opacity-100" />
      </div>
    </button>
  );
}
