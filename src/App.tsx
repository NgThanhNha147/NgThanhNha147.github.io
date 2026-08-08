import {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  ArrowUpRight,
  Download,
  Code2 as Github,
  Mail,
  MapPin,
  Terminal,
  GraduationCap,
} from "lucide-react";
import { ClickBurst, Cursor, Magnetic } from "./Interactive";
import { copy, projects, skillGroups, type Language } from "./content";
import Navigation from "./Navigation";
import ProjectCard from "./ProjectCard";
import IntroLoader from "./IntroLoader";
gsap.registerPlugin(ScrollTrigger);
const ids = [
  "home",
  "about",
  "goals",
  "projects",
  "skills",
  "education",
  "contact",
];
const ThreeHero = lazy(() => import("./ThreeHero"));

function GlassLink({
  href,
  children,
  primary = false,
}: {
  href: string;
  children: ReactNode;
  primary?: boolean;
}) {
  return (
    <Magnetic>
      <a className={`glass-button ${primary ? "primary" : ""}`} href={href}>
        {children}
      </a>
    </Magnetic>
  );
}
function Section({
  id,
  number,
  title,
  children,
  wide = false,
}: {
  id: string;
  number: string;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <section
      id={id}
      className={`section content-section ${wide ? "wide" : ""}`}
    >
      <span className="section-number">{number}</span>
      <span className="timeline-node" />
      <div className="section-inner">
        <header className="section-heading reveal">
          <small>{number} / 06</small>
          <h2>{title}</h2>
          <i />
        </header>
        <div className="reveal">{children}</div>
      </div>
    </section>
  );
}

export default function App() {
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [lang, setLang] = useState<Language>(
      () => (localStorage.getItem("portfolio-language") as Language) || "en",
    ),
    [active, setActive] = useState(0),
    [loaded, setLoaded] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [languageChanging, setLanguageChanging] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);
  const heroRef = useRef<HTMLElement>(null);
  const timeline = useRef<HTMLElement>(null),
    t = copy[lang];
  const code = useMemo(
    () => [
      "public async Task<IActionResult> BuildAsync()",
      'const developer = { frontend: "React" }',
      "def build_application(): return create_app()",
      "SELECT craft FROM projects WHERE quality = true",
      "app.MapControllers();",
      'git commit -m "build something useful"',
    ],
    [],
  );
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { rootMargin: "180px" },
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => localStorage.setItem("portfolio-language", lang), [lang]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = new Lenis({
      duration: reduced ? 0 : 1.05,
      smoothWheel: !reduced,
    });
    let raf = 0;
    const frame = (n: number) => {
      lenis.raf(n);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    const ctx = gsap.context(() => {
      document.querySelectorAll(".reveal").forEach((el) =>
        gsap.fromTo(
          el,
          {
            y: 50,
            opacity: 0,
            filter: "blur(0px)",
            clipPath: "inset(0 0 35% 0)",
          },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0)",
            clipPath: "inset(0 0 0% 0)",
            duration: reduced ? 0.01 : 0.82,
            ease: "power4.out",
            scrollTrigger: { trigger: el, start: "top 82%", once: true },
          },
        ),
      );
      gsap.to(".timeline-fill", {
        height: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: timeline.current,
          start: "top center",
          end: "bottom center",
          scrub: reduced ? false : 0.45,
        },
      });
      ids.forEach((id, i) =>
        ScrollTrigger.create({
          trigger: `#${id}`,
          start: "top center",
          end: "bottom center",
          onToggle: (s) => {
            if (s.isActive) setActive(i);
            document
              .querySelector(`#${id} .timeline-node`)
              ?.classList.toggle("active", s.isActive);
          },
        }),
      );
    });
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      ctx.revert();
    };
  }, []);
  return (
    <div
      className={`${loaded ? "app loaded" : "app loading"} ${leaving ? "leaving" : ""} ${languageChanging ? "language-changing" : ""}`}
    >
      {!loaded && <IntroLoader onComplete={() => setLoaded(true)} />}
      <Cursor />
      <ClickBurst />
      <div className="ambient" />
      <div className="noise" />
      <div className="floating-code" aria-hidden="true">
        {code.map((line, i) => (
          <code key={line} style={{ "--i": i } as CSSProperties}>
            {line}
          </code>
        ))}
      </div>
      <Navigation
        ids={ids}
        labels={t.nav}
        active={active}
        lang={lang}
        theme={theme}
        onTheme={() =>
          setTheme((value) => (value === "light" ? "dark" : "light"))
        }
        onLanguage={() => {
          setLanguageChanging(true);
          setTimeout(() => setLang((v) => (v === "en" ? "vi" : "en")), 130);
          setTimeout(() => setLanguageChanging(false), 420);
        }}
      />
      <div className="page-transition" aria-hidden="true" />
      <aside className="scroll-progress">
        <span>{String(active + 1).padStart(2, "0")} / 07</span>
        <div>
          <i style={{ height: `${(active / 6) * 100}%` }} />
        </div>
      </aside>
      <main ref={timeline}>
        <div className="timeline-rail">
          <div className="timeline-fill" />
        </div>
        <section id="home" className="hero section" ref={heroRef}>
          {heroVisible && !reducedMotion && (
            <Suspense fallback={<div className="three-fallback" />}>
              <ThreeHero />
            </Suspense>
          )}
          <div className="hero-copy">
            <p className="eyebrow">{t.eyebrow}</p>
            <h1>{t.title}</h1>
            <p className="hero-subtitle">{t.subtitle}</p>
            <div className="role-cycle">
              <span>I BUILD</span>
              <div>
                <b>WEB APPLICATIONS</b>
                <b>APIs</b>
                <b>BACKEND SYSTEMS</b>
                <b>INTERACTIVE PRODUCTS</b>
              </div>
            </div>
            <div className="hero-actions">
              <GlassLink href="#projects" primary>
                View Projects <ArrowUpRight size={17} />
              </GlassLink>
              <GlassLink href="/cv/Thanh-Nha-CV.pdf">
                Download CV <Download size={16} />
              </GlassLink>
              <GlassLink href="https://github.com/NgThanhNha147">
                <Github size={17} /> GitHub
              </GlassLink>
            </div>
            <div className="terminal glass">
              <Terminal size={16} />
              <pre>
                <b>&gt; whoami</b>
                {"\n"}Thanh Nha{"\n"}
                <b>&gt; stack</b>
                {"\n"}.NET / Python / React
              </pre>
            </div>
          </div>
          <a href="#about" className="scroll-cue">
            SCROLL <i />
          </a>
        </section>
        <Section id="about" number="01" title={t.nav[1]}>
          <div className="about-grid">
            <div className="portrait glass">
              <div className="avatar">
                <img
                  src="/images/avatar-placeholder.svg"
                  alt="Portrait placeholder for Thanh Nha"
                />
              </div>
              <span className="orbit one">.NET</span>
              <span className="orbit two">PYTHON</span>
              <span className="orbit three">REACT</span>
            </div>
            <div className="about-copy">
              <p>{t.about}</p>
              <div className="facts">
                <span>
                  <MapPin />
                  Hanoi, Vietnam
                </span>
                <span>
                  <Terminal />
                  Full-stack Developer
                </span>
              </div>
            </div>
          </div>
        </Section>
        <Section id="goals" number="02" title={t.nav[2]}>
          <div className="goal-path">
            <article className="goal-card glass">
              <b>01</b>
              <small>NOW · SHORT-TERM</small>
              <h3>Build the foundation</h3>
              <p>{t.short}</p>
            </article>
            <div className="goal-connector">
              <i />
            </div>
            <article className="goal-card glass">
              <b>02</b>
              <small>NEXT · LONG-TERM</small>
              <h3>Design complete systems</h3>
              <p>{t.long}</p>
            </article>
          </div>
        </Section>
        <Section id="projects" number="03" title={t.nav[3]} wide>
          <div className="projects">
            {projects.map((p, i) => (
              <ProjectCard
                key={p.name}
                project={p}
                index={i}
                onOpen={(url) => {
                  setLeaving(true);
                  setTimeout(() => {
                    window.location.href = url;
                  }, 420);
                }}
              />
            ))}
          </div>
        </Section>
        <Section id="skills" number="04" title={t.nav[4]}>
          <div className="skills-orbit">
            <div className="skill-core">
              <span>MY</span>
              <strong>STACK</strong>
            </div>
            {Object.entries(skillGroups).map(([group, skills], gi) => (
              <div className={`skill-group group-${gi}`} key={group}>
                <h3>{group}</h3>
                {skills.map((s, i) => (
                  <button
                    title={`${s} · ${group}`}
                    style={{ "--skill-i": i } as CSSProperties}
                    key={s}
                  >
                    {s}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </Section>
        <Section id="education" number="05" title={t.nav[5]}>
          <article className="education glass">
            <div className="year">
              2021 <i /> 2027
            </div>
            <GraduationCap />
            <div>
              <small>BACHELOR'S JOURNEY</small>
              <h3>{t.education}</h3>
              <p>{t.location}</p>
            </div>
          </article>
        </Section>
        <Section id="contact" number="06" title={t.nav[6]} wide>
          <div className="contact-final">
            <div className="contact-particles" aria-hidden="true">
              {Array.from({ length: 14 }, (_, i) => (
                <i key={i} style={{ "--particle": i } as CSSProperties} />
              ))}
            </div>
            <div className="contact-orb" />
            <p>OPEN TO FULL-STACK OPPORTUNITIES</p>
            <h2>{t.contact}</h2>
            <a className="email" href="mailto:Workwithtnkax@gmail.com">
              Workwithtnkax@gmail.com <ArrowUpRight />
            </a>
            <div className="contact-links">
              <GlassLink href="mailto:Workwithtnkax@gmail.com">
                <Mail /> Email me
              </GlassLink>
              <GlassLink href="https://github.com/NgThanhNha147">
                <Github /> GitHub
              </GlassLink>
            </div>
          </div>
        </Section>
      </main>
      <footer>
        <div>FULL-STACK DEVELOPER — .NET — PYTHON — REACT —</div>
        <p>© 2026 Nguyen Thi Thanh Nha</p>
      </footer>
    </div>
  );
}
