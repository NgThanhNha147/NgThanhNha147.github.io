import { useState } from "react";
import { Code2, Menu, Moon, Sun, X } from "lucide-react";
import type { Language } from "./content";

export default function Navigation({
  ids,
  labels,
  active,
  lang,
  onLanguage,
  theme,
  onTheme,
}: {
  ids: string[];
  labels: string[];
  active: number;
  lang: Language;
  onLanguage: () => void;
  theme: "light" | "dark";
  onTheme: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <header
      className={`nav glass ${open ? "menu-open" : ""} ${active > 0 ? "scrolled" : ""}`}
    >
      <a className="brand" href="#home">
        TN<span>.</span>
      </a>
      <nav>
        <span
          className="nav-indicator"
          style={{
            transform: `translateX(${active * 100}%)`,
            width: `${100 / ids.length}%`,
          }}
        />
        {ids.map((id, i) => (
          <a
            key={id}
            className={active === i ? "active" : ""}
            href={`#${id}`}
            onClick={() => setOpen(false)}
          >
            {labels[i]}
          </a>
        ))}
      </nav>
      <button
        className="language"
        onClick={onLanguage}
        aria-label="Switch language"
      >
        {lang.toUpperCase()} / {lang === "en" ? "VI" : "EN"}
      </button>
      <button
        className="theme-toggle"
        onClick={onTheme}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
      >
        {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
      </button>
      <a
        className="nav-github"
        href="https://github.com/NgThanhNha147"
        aria-label="Open GitHub profile"
      >
        <Code2 size={18} />
      </a>
      <button
        className="menu-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle navigation"
        aria-expanded={open}
      >
        {open ? <X /> : <Menu />}
      </button>
    </header>
  );
}
