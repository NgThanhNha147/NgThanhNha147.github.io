import { useEffect, useRef } from "react";
import gsap from "gsap";

const letters = ["T", "H", "A", "N", "H", "N", "H", "Ã"];
const chaos = [
  { x: -420, y: -210, z: -180, r: -18, s: 1.45 },
  { x: 390, y: -110, z: 120, r: 14, s: 0.72 },
  { x: -250, y: 230, z: -320, r: 11, s: 0.5 },
  { x: 95, y: -330, z: 240, r: -12, s: 1.8 },
  { x: 430, y: 190, z: -120, r: 18, s: 0.82 },
  { x: -390, y: 95, z: 170, r: -15, s: 1.25 },
  { x: 250, y: 290, z: -260, r: 10, s: 0.62 },
  { x: 460, y: -250, z: 210, r: -20, s: 1.5 },
];

export default function IntroLoader({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const complete = useRef(onComplete);
  complete.current = onComplete;

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = matchMedia("(max-width: 700px)").matches;
    const returning = sessionStorage.getItem("thanh-nha-intro-seen") === "1";
    document.body.style.overflow = "hidden";

    const context = gsap.context(() => {
      const chars = gsap.utils.toArray<HTMLElement>(".intro-letter");
      const timeline = gsap.timeline({
        defaults: { ease: "power4.out" },
        onComplete: () => {
          sessionStorage.setItem("thanh-nha-intro-seen", "1");
          document.body.style.overflow = "";
          complete.current();
        },
      });

      if (reduced || returning) {
        gsap.set(chars, {
          opacity: 1,
          x: 0,
          y: 0,
          z: 0,
          rotate: 0,
          scale: 1,
          filter: "blur(0px)",
        });
        gsap.set(".intro-name", { letterSpacing: "0.08em" });
        timeline
          .to(".intro-sweep", {
            xPercent: 220,
            duration: reduced ? 0.18 : 0.26,
            ease: "power2.inOut",
          })
          .to(
            ".intro-status",
            { opacity: 1, y: 0, duration: reduced ? 0.12 : 0.14 },
            "-=0.1",
          )
          .to(
            element,
            {
              clipPath: "circle(0% at 50% 50%)",
              duration: reduced ? 0.24 : 0.4,
              ease: "power3.inOut",
            },
            "+=0.04",
          );
        return;
      }

      chars.forEach((char, index) => {
        const state = chaos[index];
        gsap.set(char, {
          x: state.x * (mobile ? 0.42 : 1),
          y: state.y * (mobile ? 0.55 : 1),
          z: state.z * (mobile ? 0.18 : 1),
          rotate: state.r * (mobile ? 0.45 : 1),
          scale: mobile ? 1 + (state.s - 1) * 0.35 : state.s,
          opacity: index % 3 === 0 ? 0.12 : 0,
          filter: `blur(${index % 2 ? 10 : 5}px)`,
        });
      });

      timeline
        .to(".intro-ambient", { opacity: 1, scale: 1, duration: 0.55 }, 0)
        .to(
          chars,
          {
            x: 0,
            y: 0,
            z: 0,
            rotate: 0,
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.05,
            stagger: 0.075,
            ease: "expo.out",
          },
          0.25,
        )
        .to(
          ".intro-name",
          { letterSpacing: "0.08em", duration: 0.65, ease: "power3.inOut" },
          0.92,
        )
        .to(
          chars,
          {
            scale: 1.075,
            duration: 0.12,
            stagger: 0.075,
            yoyo: true,
            repeat: 1,
            ease: "power2.out",
          },
          0.86,
        )
        .to(
          ".intro-pulse",
          { scale: 1.7, opacity: 0, duration: 0.65, stagger: 0.075 },
          0.92,
        )
        .to(
          ".intro-sweep",
          { xPercent: 220, duration: 0.52, ease: "power2.inOut" },
          1.82,
        )
        .to(
          ".intro-name",
          {
            color: "#f4ffff",
            textShadow: "0 0 34px rgba(67,241,221,.28)",
            duration: 0.24,
          },
          2.03,
        )
        .to(".intro-role", { opacity: 1, y: 0, duration: 0.28 }, 2.08)
        .to(".intro-ready", { opacity: 1, y: 0, duration: 0.24 }, 2.2)
        .to(
          chars,
          {
            x: (index) =>
              index < 4 ? -90 - index * 22 : 90 + (index - 4) * 22,
            y: (index) => (index % 2 ? 28 : -24),
            rotate: (index) => (index % 2 ? 5 : -5),
            opacity: 0,
            scale: 1.14,
            filter: "blur(4px)",
            duration: 0.58,
            stagger: 0.025,
            ease: "power3.in",
          },
          2.55,
        )
        .to(
          element,
          {
            clipPath: "circle(0% at 50% 50%)",
            duration: 0.72,
            ease: "power4.inOut",
          },
          2.62,
        );
    }, element);

    return () => {
      context.revert();
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      ref={root}
      className="intro-loader"
      aria-label="Loading Thanh Nha portfolio"
    >
      <div className="intro-grid" aria-hidden="true" />
      <div className="intro-code" aria-hidden="true">
        <span>const identity = "THANH NHA";</span>
        <span>system.compose(profile);</span>
      </div>
      <div className="intro-ambient" aria-hidden="true" />
      <div className="intro-stage">
        <div className="intro-name" aria-label="THANH NHÃ">
          {letters.map((letter, index) => (
            <span
              aria-hidden="true"
              data-letter={letter}
              className={`intro-letter ${index === 5 ? "word-gap" : ""}`}
              key={`${letter}-${index}`}
            >
              {letter}
              <i className="intro-pulse" aria-hidden="true" />
            </span>
          ))}
          <i className="intro-sweep" aria-hidden="true" />
        </div>
        <div className="intro-status">
          <p className="intro-role">FULL STACK DEVELOPER</p>
          <p className="intro-ready">SYSTEM READY</p>
        </div>
      </div>
    </div>
  );
}
