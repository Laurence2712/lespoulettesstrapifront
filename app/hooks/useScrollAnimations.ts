import { useEffect, useRef } from "react";

/**
 * Hook pour animer les elements au scroll (style resyne.be)
 * Ajouter les classes CSS suivantes aux elements :
 *
 * - .anim-fade-up     : fade in + slide up
 * - .anim-fade-down   : fade in + slide down
 * - .anim-fade-left   : fade in + slide from left
 * - .anim-fade-right  : fade in + slide from right
 * - .anim-fade        : simple fade in
 * - .anim-scale       : scale from 0.8 to 1
 * - .anim-stagger     : parent container, children animate with stagger
 *
 * data-delay="0.2"    : delai avant animation (en secondes)
 * data-duration="0.8" : duree de l'animation
 */
export function useScrollAnimations(deps: any[] = []) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === "undefined") return;

    let ctx: any;
    let timeout: ReturnType<typeof setTimeout>;

    // Dynamic import to avoid SSR crash
    // Si l'utilisateur préfère moins de mouvement, on rend les éléments visibles sans animation
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const allAnimated = container.querySelectorAll(
        '.anim-fade-up, .anim-fade-down, .anim-fade-left, .anim-fade-right, .anim-fade, .anim-scale'
      );
      allAnimated.forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.opacity = '1';
        htmlEl.style.transform = 'none';
      });
      return;
    }

    Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
    ]).then(([gsapModule, scrollTriggerModule]) => {
      const gsap = gsapModule.gsap;
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      // Small delay to ensure DOM is fully rendered
      timeout = setTimeout(() => {
        ctx = gsap.context(() => {
          // Individual element animations
          const animElements = container.querySelectorAll(
            ".anim-fade-up, .anim-fade-down, .anim-fade-left, .anim-fade-right, .anim-fade, .anim-scale"
          );

          animElements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            const delay = parseFloat(htmlEl.dataset.delay || "0");
            const duration = parseFloat(htmlEl.dataset.duration || "0.8");

            let fromVars: any = { opacity: 0 };

            if (el.classList.contains("anim-fade-up")) {
              fromVars = { opacity: 0, y: 60 };
            } else if (el.classList.contains("anim-fade-down")) {
              fromVars = { opacity: 0, y: -40 };
            } else if (el.classList.contains("anim-fade-left")) {
              fromVars = { opacity: 0, x: -60 };
            } else if (el.classList.contains("anim-fade-right")) {
              fromVars = { opacity: 0, x: 60 };
            } else if (el.classList.contains("anim-scale")) {
              fromVars = { opacity: 0, scale: 0.85 };
            }

            gsap.fromTo(
              el,
              fromVars,
              {
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1,
                duration,
                delay,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: el,
                  start: "top 88%",
                  end: "bottom 20%",
                  toggleActions: "play none none none",
                },
              }
            );
          });

          // Stagger container: animate direct children
          const staggerContainers = container.querySelectorAll(".anim-stagger");
          staggerContainers.forEach((parent) => {
            const htmlParent = parent as HTMLElement;
            const children = parent.children;
            const staggerDelay = parseFloat(htmlParent.dataset.stagger || "0.15");

            gsap.fromTo(
              children,
              { opacity: 0, y: 50 },
              {
                opacity: 1,
                y: 0,
                duration: 0.7,
                stagger: staggerDelay,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: parent,
                  start: "top 85%",
                  toggleActions: "play none none none",
                },
              }
            );
          });
        }, container);
      }, 100);
    });

    return () => {
      if (timeout) clearTimeout(timeout);
      if (ctx) ctx.revert();
    };
  }, deps);

  return containerRef;
}

/**
 * Hook pour l'animation parallax du hero banner
 */
export function useParallaxHero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || typeof window === "undefined") return;

    let ctx: any;

    Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
    ]).then(([gsapModule, scrollTriggerModule]) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const gsap = gsapModule.gsap;
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // Parallax effect on background
        gsap.to(hero, {
          backgroundPositionY: "30%",
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

        // Fade out hero content on scroll
        const content = hero.querySelector(".banner-content");
        if (content) {
          gsap.to(content, {
            opacity: 0,
            y: -50,
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: "60% top",
              scrub: true,
            },
          });
        }
      }, hero);
    });

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  return heroRef;
}
