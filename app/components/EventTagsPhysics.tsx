import { useEffect, useRef } from 'react';

interface Props {
  tags: string[];
  containerHeight?: number;
}

export default function EventTagsPhysics({ tags, containerHeight = 220 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === 'undefined') return;

    // Disable on mobile and reduced motion
    if (window.innerWidth <= 768) {
      // Show tags statically on mobile
      tagsRef.current.forEach((el) => {
        if (el) el.style.opacity = '1';
      });
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      tagsRef.current.forEach((el) => {
        if (el) el.style.opacity = '1';
      });
      return;
    }

    const W = container.offsetWidth;
    const H = containerHeight;

    let cleanup: (() => void) | undefined;

    const timeout = setTimeout(() => {
      import('matter-js').then((Matter) => {
        const { Engine, Bodies, Body, Composite, Runner, Mouse, MouseConstraint } = Matter;

        const engine = Engine.create({ gravity: { y: 2 } });

        // Walls + floor
        const floor = Bodies.rectangle(W / 2, H + 25, W * 2, 50, { isStatic: true });
        const wallL = Bodies.rectangle(-25, H / 2, 50, H * 2, { isStatic: true });
        const wallR = Bodies.rectangle(W + 25, H / 2, 50, H * 2, { isStatic: true });
        Composite.add(engine.world, [floor, wallL, wallR]);

        // Tag bodies
        const bodies = tags.map((_, i) => {
          const el = tagsRef.current[i];
          if (!el) return null;
          const w = el.offsetWidth + 4;
          const h = el.offsetHeight + 4;
          const x = (W / (tags.length + 1)) * (i + 1) + (Math.random() - 0.5) * 40;
          const y = -h - i * 55;
          const body = Bodies.rectangle(x, y, w, h, {
            restitution: 0.4,
            friction: 0.5,
            frictionAir: 0.015,
            label: String(i),
          });
          Body.setAngle(body, (Math.random() - 0.5) * 0.25);
          return body;
        });

        const validBodies = bodies.filter(Boolean) as Matter.Body[];
        Composite.add(engine.world, validBodies);

        // Mouse drag constraint
        const mouse = Mouse.create(container);
        const mouseConstraint = MouseConstraint.create(engine, {
          mouse,
          constraint: {
            stiffness: 0.2,
            render: { visible: false },
          } as any,
        });
        Composite.add(engine.world, mouseConstraint);

        // Mouse repulsion on hover (without drag)
        let mouseX = -9999;
        let mouseY = -9999;
        const onMouseMove = (e: MouseEvent) => {
          const rect = container.getBoundingClientRect();
          mouseX = e.clientX - rect.left;
          mouseY = e.clientY - rect.top;
        };
        const onMouseLeave = () => { mouseX = -9999; mouseY = -9999; };
        container.addEventListener('mousemove', onMouseMove);
        container.addEventListener('mouseleave', onMouseLeave);

        // Scroll shake
        let lastScrollY = window.scrollY;
        const onScroll = () => {
          const delta = window.scrollY - lastScrollY;
          lastScrollY = window.scrollY;
          const rect = container.getBoundingClientRect();
          if (rect.top > window.innerHeight || rect.bottom < 0) return;
          // Scrolling down → tags float up, scrolling up → tags fall back
          validBodies.forEach((body) => {
            Body.applyForce(body, body.position, {
              x: (Math.random() - 0.5) * 0.008,
              y: delta * -0.003,
            });
          });
        };
        window.addEventListener('scroll', onScroll, { passive: true });

        const runner = Runner.create();
        Runner.run(runner, engine);

        const REPULSION_RADIUS = 120;
        const REPULSION_STRENGTH = 0.025;

        let raf: number;
        const tick = () => {
          // Apply repulsion from mouse
          if (mouseX > 0) {
            validBodies.forEach((body) => {
              const dx = body.position.x - mouseX;
              const dy = body.position.y - mouseY;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < REPULSION_RADIUS && dist > 1) {
                const force = (REPULSION_RADIUS - dist) / REPULSION_RADIUS * REPULSION_STRENGTH;
                Body.applyForce(body, body.position, {
                  x: (dx / dist) * force,
                  y: (dy / dist) * force,
                });
              }
            });
          }

          // Sync HTML positions
          validBodies.forEach((body, i) => {
            const el = tagsRef.current[i];
            if (!el) return;
            el.style.left = `${body.position.x - el.offsetWidth / 2}px`;
            el.style.top = `${body.position.y - el.offsetHeight / 2}px`;
            el.style.transform = `rotate(${body.angle}rad)`;
            el.style.opacity = '1';
          });
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);

        cleanup = () => {
          cancelAnimationFrame(raf);
          Runner.stop(runner);
          container.removeEventListener('mousemove', onMouseMove);
          container.removeEventListener('mouseleave', onMouseLeave);
          window.removeEventListener('scroll', onScroll);
          Composite.clear(engine.world, false);
          Engine.clear(engine);
        };
      });
    }, 100);

    return () => {
      clearTimeout(timeout);
      cleanup?.();
    };
  }, [tags, containerHeight]);

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  if (isMobile) {
    return (
      <div className="flex flex-wrap gap-3 mb-2">
        {tags.map((label) => (
          <span
            key={label}
            className="font-basecoat font-semibold text-sm px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl shadow-sm select-none"
          >
            {label}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden cursor-grab active:cursor-grabbing"
      style={{ height: containerHeight }}
    >
      {tags.map((label, i) => (
        <span
          key={label}
          ref={(el) => { tagsRef.current[i] = el; }}
          className="absolute font-basecoat font-semibold text-sm px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl shadow-sm select-none pointer-events-none"
          style={{ opacity: 0 }}
        >
          {label}
        </span>
      ))}
    </div>
  );
}
