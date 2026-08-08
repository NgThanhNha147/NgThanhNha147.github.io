import { ArrowUpRight } from "lucide-react";

type Project = {
  name: string;
  role: string;
  description: string;
  stack: string[];
  repo: string;
};
export default function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (url: string) => void;
}) {
  const url = `https://github.com/NgThanhNha147/${project.repo}`;
  return (
    <article
      className="project-card glass cursor-view"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      <div className="project-visual">
        <span>0{index + 1}</span>
        <div className="project-window">
          <i />
          <i />
          <i />
          <strong>{project.name.split(" ")[0]}</strong>
        </div>
      </div>
      <div className="project-content">
        <small>{project.role}</small>
        <h3>{project.name}</h3>
        <p>{project.description}</p>
        <div className="tags">
          {project.stack.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
        <div className="project-actions">
          <button onClick={() => onOpen(url)}>
            View Project <ArrowUpRight />
          </button>
          <a href={url}>Source Code</a>
        </div>
      </div>
    </article>
  );
}
