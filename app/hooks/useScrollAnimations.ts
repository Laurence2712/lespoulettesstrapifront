import { useEffect, useRef } from "react";

/**
 * Hook pour animer les elements au scroll
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

function showAllAnimated(container: HTMLElement) {
  const allAnimated = container.querySelectorAll(
    '.anim-fade-up, .anim-fade-down, .anim-fade-left, .anim-fade-right, .anim-fade, .anim-scale, .anim-expand-line'
  );
  allAnimated.forEach((el) => {
    const htmlEl = el as HTMLElement;
    htmlEl.style.opacity = '1';
    htmlEl.style.transform = 'none';
  });
}

export function useScrollAnimations(deps: any[] = []) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === "undefined") return;

    // Reduced motion : affichage immédiat, pas d'animation
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      showAllAnimated(container);
      return;
    }

    // Sur mobile : les animations GSAP sont désactivées, mais on anime quand
    // même les tirets (anim-expand-line) via IntersectionObserver
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      const nonExpand = container.querySelectorAll(
        '.anim-fade-up, .anim-fade-down, .anim-fade-left, .anim-fade-right, .anim-fade, .anim-scale'
      );
      nonExpand.forEach((el) => {
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.transform = 'none';
      });

      const expandLines = container.querySelectorAll('.anim-expand-line') as NodeListOf<HTMLElement>;
      expandLines.forEach((el) => {
        el.style.transformOrigin = 'left center';
        el.style.transform = 'scaleX(0)';
      });

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const el = entry.target as HTMLElement;
              const delay = parseFloat(el.dataset.delay || '0');
              setTimeout(() => {
                el.style.transition = 'transform 0.5s ease-out';
                el.style.transform = 'scaleX(1)';
              }, delay * 1000);
              observer.unobserve(el);
            }
          });
        },
        { threshold: 0, rootMargin: '0px 0px -10px 0px' }
      );
      expandLines.forEach((el) => observer.observe(el));

      return () => observer.disconnect();
    }

    let ctx: any;
    let timeout: ReturnType<typeof setTimeout>;

    Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
    ]).then(([gsapModule, scrollTriggerModule]) => {
      const gsap = gsapModule.gsap;
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      timeout = setTimeout(() => {
        ctx = gsap.context(() => {
          const animElements = container.querySelectorAll(
            ".anim-fade-up, .anim-fade-down, .anim-fade-left, .anim-fade-right, .anim-fade, .anim-scale, .anim-expand-line"
          );

          animElements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            const delay = parseFloat(htmlEl.dataset.delay || "0");
            const duration = parseFloat(htmlEl.dataset.duration || "0.6");

            if (el.classList.contains("anim-expand-line")) {
              gsap.fromTo(
                el,
                { scaleX: 0, transformOrigin: "left center" },
                {
                  scaleX: 1,
                  transformOrigin: "left center",
                  duration: 0.5,
                  delay,
                  ease: "power2.out",
                  scrollTrigger: {
                    trigger: el,
                    start: "top 95%",
                    toggleActions: "play none none none",
                  },
                }
              );
              return;
            }

            let fromVars: any = { opacity: 0 };

            if (el.classList.contains("anim-fade-up")) {
              fromVars = { opacity: 0, y: 25 };
            } else if (el.classList.contains("anim-fade-down")) {
              fromVars = { opacity: 0, y: -20 };
            } else if (el.classList.contains("anim-fade-left")) {
              fromVars = { opacity: 0, x: -30 };
            } else if (el.classList.contains("anim-fade-right")) {
              fromVars = { opacity: 0, x: 30 };
            } else if (el.classList.contains("anim-scale")) {
              fromVars = { opacity: 0, scale: 0.92 };
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
                ease: "power2.out",
                scrollTrigger: {
                  trigger: el,
                  start: "top 95%",
                  toggleActions: "play none none none",
                },
              }
            );
          });

          // Stagger containers
          const staggerContainers = container.querySelectorAll(".anim-stagger");
          staggerContainers.forEach((parent) => {
            const htmlParent = parent as HTMLElement;
            const children = parent.children;
            const staggerDelay = parseFloat(htmlParent.dataset.stagger || "0.1");

            gsap.fromTo(
              children,
              { opacity: 0, y: 20 },
              {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: staggerDelay,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: parent,
                  start: "top 95%",
                  toggleActions: "play none none none",
                },
              }
            );
          });
        }, container);
      }, 50);
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
 * Désactivé sur mobile pour éviter le jank de scroll
 */
export function useParallaxHero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || typeof window === "undefined") return;

    // Pas de parallax sur mobile — trop lourd pour le scroll
    if (window.innerWidth <= 768) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let ctx: any;

    Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
    ]).then(([gsapModule, scrollTriggerModule]) => {
      const gsap = gsapModule.gsap;
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
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

        const content = hero.querySelector(".banner-content");
        if (content) {
          gsap.to(content, {
            opacity: 0,
            y: -40,
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
