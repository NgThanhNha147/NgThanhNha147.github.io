import { useEffect, useRef } from "react";
import gsap from "gsap";

const words = ["WORK", "WITH", "TNKAX"];
const glyphs = [
  ["{", 7, 16],
  ["01", 18, 8],
  ["</>", 31, 19],
  ["+", 44, 9],
  ["N", 58, 17],
  ["[]", 72, 8],
  ["Ã", 88, 20],
  ["/", 95, 42],
  ["T", 4, 49],
  ["::", 15, 63],
  ["*", 27, 46],
  ["H", 38, 70],
  ["=>", 51, 56],
  ["A", 64, 69],
  ["{}", 77, 48],
  ["0", 91, 64],
  [";", 8, 84],
  ["N", 22, 91],
  ["~", 35, 80],
  ["1", 49, 90],
  ["H", 61, 82],
  ["//", 74, 91],
  ["<>", 86, 79],
  ["}", 96, 88],
] as const;
const chaosFor = (index: number) => ({
  x: ((index * 197 + 83) % 920) - 460,
  y: ((index * 149 + 47) % 640) - 320,
  z: ((index * 173 + 29) % 560) - 280,
  r: ((index * 17 + 9) % 44) - 22,
  s: 0.62 + ((index * 23 + 11) % 100) / 82,
});

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
    const returning =
      sessionStorage.getItem("work-with-tnkax-intro-seen") === "1";
    document.body.style.overflow = "hidden";

    const context = gsap.context(() => {
      const chars = gsap.utils.toArray<HTMLElement>(".intro-letter");
      const floatingGlyphs = gsap.utils.toArray<HTMLElement>(".intro-glyph");
      const timeline = gsap.timeline({
        defaults: { ease: "power4.out" },
        onComplete: () => {
          sessionStorage.setItem("work-with-tnkax-intro-seen", "1");
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
          .to(".intro-role, .intro-ready", {
            opacity: 1,
            y: 0,
            duration: reduced ? 0.12 : 0.14,
          })
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
        const state = chaosFor(index);
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

      gsap.set(floatingGlyphs, { opacity: 0, scale: 0.65 });

      timeline
        .to(".intro-ambient", { opacity: 1, scale: 1, duration: 0.55 }, 0)
        .to(
          floatingGlyphs,
          {
            opacity: (index) => 0.28 + (index % 4) * 0.08,
            scale: 1,
            duration: 0.7,
            stagger: 0.025,
          },
          0.08,
        )
        .to(
          floatingGlyphs,
          {
            x: (index) => (index % 2 ? 34 : -28),
            y: (index) => -45 - (index % 5) * 15,
            rotate: (index) => (index % 2 ? 12 : -10),
            duration: 3.1,
            stagger: 0.018,
            ease: "sine.inOut",
          },
          0.22,
        )
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
            duration: 1.55,
            stagger: 0.11,
            ease: "power3.out",
          },
          0.62,
        )
        .to(
          ".intro-name",
          { letterSpacing: "0.13em", duration: 0.82, ease: "power3.inOut" },
          1.55,
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
          1.55,
        )
        .to(
          ".intro-pulse",
          { scale: 1.7, opacity: 0, duration: 0.65, stagger: 0.075 },
          1.65,
        )
        .to(
          ".intro-name",
          {
            color: "#ffffff",
            textShadow: "0 0 30px rgba(255,255,255,.2)",
            duration: 0.24,
          },
          3.08,
        )
        .to(floatingGlyphs, { opacity: 0, duration: 0.8 }, 2.98)
        .to(".intro-role", { opacity: 1, y: 0, duration: 0.4 }, 3.25)
        .to(".intro-ready", { opacity: 1, y: 0, duration: 0.32 }, 3.42)
        .to(
          chars,
          {
            x: (index) =>
              index < chars.length / 2
                ? -90 - index * 18
                : 90 + (index - chars.length / 2) * 18,
            y: (index) => (index % 2 ? 28 : -24),
            rotate: (index) => (index % 2 ? 5 : -5),
            opacity: 0,
            scale: 1.14,
            filter: "blur(4px)",
            duration: 0.58,
            stagger: 0.025,
            ease: "power3.in",
          },
          3.88,
        )
        .to(
          element,
          {
            clipPath: "circle(0% at 50% 50%)",
            duration: 0.86,
            ease: "power4.inOut",
          },
          3.94,
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
      aria-label="Loading Work With Tnkax portfolio"
    >
      <div className="intro-grid" aria-hidden="true" />
      <div className="intro-code" aria-hidden="true">
        <span>const identity = "WORK WITH TNKAX";</span>
        <span>system.compose(profile);</span>
      </div>
      <div className="intro-ambient" aria-hidden="true" />
      <div className="intro-glyph-field" aria-hidden="true">
        {glyphs.map(([glyph, left, top], index) => (
          <span
            className="intro-glyph"
            key={`${glyph}-${index}`}
            style={{ left: `${left}%`, top: `${top}%` }}
          >
            {glyph}
          </span>
        ))}
      </div>
      <div className="intro-stage">
        <div className="intro-name" aria-label="WORK WITH TNKAX">
          {words.map((word, wordIndex) => {
            const offset = words
              .slice(0, wordIndex)
              .reduce((total, item) => total + item.length, 0);
            return (
              <div className="intro-word" key={word} aria-hidden="true">
                {word.split("").map((letter, letterIndex) => {
                  const index = offset + letterIndex;
                  return (
                    <span
                      data-letter={letter}
                      className="intro-letter"
                      key={`${letter}-${index}`}
                    >
                      {letter}
                      <i className="intro-pulse" aria-hidden="true" />
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div className="intro-status">
          <p className="intro-role">FULL STACK DEVELOPER</p>
          <p className="intro-ready">SYSTEM READY</p>
        </div>
      </div>
    </div>
  );
}
