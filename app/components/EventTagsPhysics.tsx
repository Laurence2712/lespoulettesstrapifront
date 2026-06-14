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

    const W = container.offsetWidth;
    const H = containerHeight;

    let cleanup: (() => void) | undefined;

    // Small delay so tags are rendered and measurable
    const timeout = setTimeout(() => {
      import('matter-js').then((Matter) => {
        const { Engine, Bodies, Body, Composite, Runner, Events } = Matter;

        const engine = Engine.create({ gravity: { y: 2 } });

        // Walls + floor
        const floor = Bodies.rectangle(W / 2, H + 25, W * 2, 50, { isStatic: true, label: 'floor' });
        const wallL = Bodies.rectangle(-25, H / 2, 50, H * 2, { isStatic: true });
        const wallR = Bodies.rectangle(W + 25, H / 2, 50, H * 2, { isStatic: true });
        Composite.add(engine.world, [floor, wallL, wallR]);

        // Create a body per tag, sized to match the HTML element
        const bodies = tags.map((_, i) => {
          const el = tagsRef.current[i];
          if (!el) return null;
          const w = el.offsetWidth + 4;
          const h = el.offsetHeight + 4;
          // Spread across width, start above container
          const x = (W / (tags.length + 1)) * (i + 1) + (Math.random() - 0.5) * 40;
          const y = -h - i * 55;
          const body = Bodies.rectangle(x, y, w, h, {
            restitution: 0.35,
            friction: 0.6,
            frictionAir: 0.015,
            label: String(i),
          });
          Body.setAngle(body, (Math.random() - 0.5) * 0.25);
          return body;
        });

        const validBodies = bodies.filter(Boolean) as Matter.Body[];
        Composite.add(engine.world, validBodies);

        const runner = Runner.create();
        Runner.run(runner, engine);

        let raf: number;
        const tick = () => {
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

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{ height: containerHeight }}
    >
      {tags.map((label, i) => (
        <span
          key={label}
          ref={(el) => { tagsRef.current[i] = el; }}
          className="absolute font-basecoat font-semibold text-sm px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl shadow-sm cursor-default select-none"
          style={{ opacity: 0 }}
        >
          {label}
        </span>
      ))}
    </div>
  );
}
