import {
  useEffect,
  useRef,
  type PropsWithChildren,
  type MouseEvent,
} from "react";
export function Magnetic({ children }: PropsWithChildren) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: MouseEvent) => {
    const el = ref.current;
    if (!el || matchMedia("(pointer: coarse)").matches) return;
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.13}px,${(e.clientY - r.top - r.height / 2) * 0.13}px)`;
  };
  return (
    <div
      ref={ref}
      className="magnetic"
      onMouseMove={move}
      onMouseLeave={() => {
        if (ref.current) ref.current.style.transform = "";
      }}
    >
      {children}
    </div>
  );
}
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null),
    ring = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let x = -100,
      y = -100,
      rx = -100,
      ry = -100,
      raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const interactive = (e.target as HTMLElement).closest(
        "a,button,.cursor-view,.screen-portal",
      );
      ring.current?.classList.toggle("interactive", Boolean(interactive));
      ring.current?.classList.toggle(
        "view",
        Boolean((e.target as HTMLElement).closest(".cursor-view")),
      );
      document.documentElement.style.setProperty("--cursor-x", `${x}px`);
      document.documentElement.style.setProperty("--cursor-y", `${y}px`);
      document.documentElement.style.setProperty(
        "--parallax-x",
        `${(x / innerWidth - 0.5) * 18}px`,
      );
      document.documentElement.style.setProperty(
        "--parallax-y",
        `${(y / innerHeight - 0.5) * 12}px`,
      );
    };
    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      if (dot.current)
        dot.current.style.transform = `translate3d(${x}px,${y}px,0)`;
      if (ring.current)
        ring.current.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      raf = requestAnimationFrame(loop);
    };
    addEventListener("pointermove", move);
    loop();
    return () => {
      removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <>
      <div ref={dot} className="cursor-dot" />
      <div ref={ring} className="cursor-ring">
        <span>VIEW</span>
      </div>
    </>
  );
}
export function ClickBurst() {
  useEffect(() => {
    const click = (e: PointerEvent) => {
      const b = document.createElement("i");
      b.className = "click-burst";
      b.style.left = `${e.clientX}px`;
      b.style.top = `${e.clientY}px`;
      document.body.append(b);
      setTimeout(() => b.remove(), 700);
    };
    addEventListener("pointerdown", click);
    return () => removeEventListener("pointerdown", click);
  }, []);
  return null;
}
