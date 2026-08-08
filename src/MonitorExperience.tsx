import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, RoundedBox } from "@react-three/drei";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import * as THREE from "three";

type IntroState = "loading" | "ready" | "entering" | "entered";

const loaderWords = ["WORK", "WITH", "TNKAX"];

function BentBox({
  width,
  height,
  depth,
  curve,
  color,
  roughness,
  metalness = 0,
}: {
  width: number;
  height: number;
  depth: number;
  curve: number;
  color: string;
  roughness: number;
  metalness?: number;
}) {
  const geometry = useMemo(() => {
    const result = new THREE.BoxGeometry(width, height, depth, 64, 4, 4);
    const positions = result.attributes.position;
    for (let index = 0; index < positions.count; index += 1) {
      const x = positions.getX(index);
      const normalized = x / (width / 2);
      positions.setZ(index, positions.getZ(index) + curve * normalized ** 2);
    }
    positions.needsUpdate = true;
    result.computeVertexNormals();
    return result;
  }, [curve, depth, height, width]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
      />
    </mesh>
  );
}

function Keyboard() {
  const keys = Array.from({ length: 55 });
  return (
    <group position={[0, -2.93, 1.3]} rotation={[-0.08, 0, 0]}>
      <RoundedBox
        args={[4.75, 0.11, 1.17]}
        radius={0.07}
        smoothness={3}
        castShadow
      >
        <meshStandardMaterial
          color="#292929"
          roughness={0.5}
          metalness={0.42}
        />
      </RoundedBox>
      {keys.map((_, index) => {
        const row = Math.floor(index / 11);
        const column = index % 11;
        return (
          <RoundedBox
            key={index}
            args={[0.3, 0.055, 0.17]}
            radius={0.025}
            smoothness={2}
            position={[-1.76 + column * 0.35, 0.085, -0.39 + row * 0.2]}
            castShadow
          >
            <meshStandardMaterial
              color={index % 9 === 0 ? "#555" : "#171717"}
              roughness={0.7}
            />
          </RoundedBox>
        );
      })}
    </group>
  );
}

function Mouse() {
  return (
    <group position={[3.35, -3.11, 1.18]} rotation={[0, -0.14, 0]}>
      <mesh scale={[0.52, 0.22, 0.78]} castShadow>
        <sphereGeometry args={[0.62, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#303030"
          roughness={0.36}
          metalness={0.32}
        />
      </mesh>
      <mesh position={[0, 0.145, -0.1]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 0.18, 18]} />
        <meshStandardMaterial color="#777" roughness={0.42} metalness={0.7} />
      </mesh>
    </group>
  );
}

function BooksAndPens() {
  return (
    <group position={[-4.45, -3.08, 0.68]}>
      <RoundedBox args={[1.85, 0.15, 1.04]} radius={0.035} castShadow>
        <meshStandardMaterial color="#3b3b3b" roughness={0.75} />
      </RoundedBox>
      <RoundedBox
        args={[1.58, 0.16, 0.94]}
        radius={0.035}
        position={[0.08, 0.17, 0]}
        castShadow
      >
        <meshStandardMaterial color="#d3d2cd" roughness={0.84} />
      </RoundedBox>
      <group position={[-0.48, 0.79, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.37, 0.34, 0.94, 32]} />
          <meshStandardMaterial color="#f4f3ef" roughness={0.66} />
        </mesh>
        <group position={[0, 0.02, 0.355]}>
          <mesh position={[-0.09, 0.03, 0]} rotation={[0, 0, -0.72]}>
            <boxGeometry args={[0.035, 0.2, 0.018]} />
            <meshBasicMaterial color="#222" />
          </mesh>
          <mesh position={[-0.09, -0.09, 0]} rotation={[0, 0, 0.72]}>
            <boxGeometry args={[0.035, 0.2, 0.018]} />
            <meshBasicMaterial color="#222" />
          </mesh>
          <mesh rotation={[0, 0, -0.35]}>
            <boxGeometry args={[0.03, 0.3, 0.018]} />
            <meshBasicMaterial color="#222" />
          </mesh>
          <mesh position={[0.09, 0.03, 0]} rotation={[0, 0, 0.72]}>
            <boxGeometry args={[0.035, 0.2, 0.018]} />
            <meshBasicMaterial color="#222" />
          </mesh>
          <mesh position={[0.09, -0.09, 0]} rotation={[0, 0, -0.72]}>
            <boxGeometry args={[0.035, 0.2, 0.018]} />
            <meshBasicMaterial color="#222" />
          </mesh>
        </group>
      </group>
      <group position={[0.54, 0.84, 0]}>
        {[-0.17, 0, 0.17].map((x, index) => (
          <mesh
            key={x}
            position={[x, 0, 0]}
            rotation={[0, 0, (index - 1) * 0.09]}
            castShadow
          >
            <cylinderGeometry args={[0.025, 0.025, 1.18, 10]} />
            <meshStandardMaterial
              color={index === 1 ? "#777" : "#202020"}
              roughness={0.58}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Plant() {
  const leaves = [
    [-0.48, 0.16, -0.58],
    [-0.3, 0.3, -0.3],
    [-0.12, 0.1, -0.08],
    [0.12, -0.08, 0.08],
    [0.3, -0.3, 0.3],
    [0.48, -0.16, 0.58],
  ] as const;
  return (
    <group position={[4.35, -2.84, 0.36]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.52, 0.42, 1.38, 36]} />
        <meshStandardMaterial color="#f2f1ed" roughness={0.7} />
      </mesh>
      {leaves.map(([x, ry, rz], index) => (
        <mesh
          key={index}
          position={[
            x * 0.45,
            1.12 + (index % 3) * 0.12,
            (index % 2 ? -1 : 1) * 0.08,
          ]}
          rotation={[rz, ry, -x]}
          scale={[0.16, 0.95 + (index % 2) * 0.16, 0.08]}
          castShadow
        >
          <sphereGeometry args={[0.58, 20, 16]} />
          <meshStandardMaterial
            color={index % 2 ? "#394039" : "#4d554b"}
            roughness={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

function StudioBackdrop() {
  return (
    <group>
      <mesh position={[0, 0.2, -3.45]} receiveShadow>
        <planeGeometry args={[25, 14]} />
        <meshStandardMaterial color="#f1f1ed" roughness={0.98} />
      </mesh>
      <mesh position={[-6.2, 0.1, -3.39]}>
        <planeGeometry args={[7, 12]} />
        <meshBasicMaterial color="#fafaf7" transparent opacity={0.5} />
      </mesh>
      <mesh position={[6.5, 0.1, -3.38]}>
        <planeGeometry args={[7.5, 12]} />
        <meshBasicMaterial color="#deded9" transparent opacity={0.17} />
      </mesh>
      <mesh
        position={[0, -3.91, -0.3]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[25, 13]} />
        <meshStandardMaterial color="#e7e6e1" roughness={0.94} />
      </mesh>
      <mesh position={[0, -1.94, -3.32]}>
        <planeGeometry args={[20, 0.028]} />
        <meshBasicMaterial color="#fff" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

function Monitor() {
  return (
    <group position={[0, 0.9, 0]}>
      <BentBox
        width={7.75}
        height={3.5}
        depth={0.24}
        curve={0.28}
        color="#151515"
        roughness={0.3}
        metalness={0.74}
      />
      <mesh position={[0, 0, 0.19]}>
        <planeGeometry args={[7.46, 3.25, 64, 1]} />
        <meshStandardMaterial color="#f9f9f7" roughness={0.82} />
      </mesh>
      <mesh position={[0, 0, 0.205]} rotation={[0, 0, -0.015]}>
        <planeGeometry args={[2.2, 3.2]} />
        <meshBasicMaterial
          color="#fff"
          transparent
          opacity={0.045}
          depthWrite={false}
        />
      </mesh>
      <group position={[0, -3.1, -0.08]}>
        <RoundedBox
          args={[0.44, 2.72, 0.36]}
          radius={0.12}
          smoothness={5}
          castShadow
        >
          <meshStandardMaterial
            color="#292929"
            roughness={0.28}
            metalness={0.86}
          />
        </RoundedBox>
        <RoundedBox
          args={[2.72, 0.17, 0.92]}
          radius={0.13}
          smoothness={5}
          position={[0, -0.78, 0.2]}
          castShadow
        >
          <meshStandardMaterial
            color="#414141"
            roughness={0.25}
            metalness={0.88}
          />
        </RoundedBox>
        <RoundedBox
          args={[2.08, 0.03, 0.64]}
          radius={0.07}
          smoothness={4}
          position={[0, -0.68, 0.65]}
        >
          <meshStandardMaterial
            color="#bababa"
            roughness={0.23}
            metalness={0.9}
          />
        </RoundedBox>
      </group>
    </group>
  );
}

function Scene({ progress }: { progress: RefObject<number> }) {
  const monitor = useRef<THREE.Group>(null);
  const foreground = useRef<THREE.Group>(null);
  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);
  const mouse = useRef<THREE.Group>(null);
  const { camera, pointer, size } = useThree();
  const mobile = size.width < 700;

  useFrame(() => {
    const p = progress.current ?? 0;
    const eased = THREE.MathUtils.smootherstep(p, 0, 1);
    const pointerStrength = mobile ? 0 : 1 - eased;
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      (1 - eased) * 0.42 + pointer.x * 0.16 * pointerStrength,
      0.075,
    );
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      (1 - eased) * 0.28 + pointer.y * 0.1 * pointerStrength,
      0.075,
    );
    camera.position.z = THREE.MathUtils.lerp(
      camera.position.z,
      mobile ? 27.5 - eased * 24.7 : 10.5 - eased * 7.75,
      0.075,
    );
    camera.lookAt(0, 0, 0);
    if (monitor.current) {
      monitor.current.rotation.y =
        THREE.MathUtils.lerp(0.055, 0, eased) +
        pointer.x * 0.018 * pointerStrength;
      monitor.current.rotation.x =
        THREE.MathUtils.lerp(-0.025, 0, eased) -
        pointer.y * 0.012 * pointerStrength;
    }
    if (foreground.current) {
      foreground.current.position.y = eased * -3.2;
      foreground.current.position.z = eased * 1.2;
      foreground.current.scale.setScalar(1 + eased * 0.12);
    }
    if (left.current) left.current.position.x = -eased * 4.2;
    if (right.current) right.current.position.x = eased * 4.2;
    if (mouse.current) {
      mouse.current.position.x = eased * 2.7;
      mouse.current.position.y = eased * -1.5;
    }
  });

  return (
    <>
      <color attach="background" args={["#f5f5f2"]} />
      <fog attach="fog" args={["#f3f3ef", 13, 60]} />
      <StudioBackdrop />
      <ambientLight intensity={1.25} />
      <directionalLight
        position={[4.8, 7.5, 7]}
        intensity={2.7}
        color="#fff"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight
        position={[-5, 2, 4]}
        intensity={0.85}
        color="#e7e7e2"
      />
      <pointLight
        position={[0, -0.6, 3]}
        intensity={5.5}
        distance={9}
        color="#fff"
      />
      <group ref={monitor}>
        <Monitor />
      </group>
      <group ref={foreground}>
        <mesh position={[0, -3.72, 0]} receiveShadow>
          <boxGeometry args={[13.5, 0.3, 5.4]} />
          <meshStandardMaterial color="#e9e8e3" roughness={0.72} />
        </mesh>
        {!mobile && (
          <RoundedBox
            args={[7.6, 0.055, 2.45]}
            radius={0.14}
            smoothness={3}
            position={[0.35, -3.49, 0.8]}
            receiveShadow
          >
            <meshStandardMaterial color="#d5d4cf" roughness={0.9} />
          </RoundedBox>
        )}
        {!mobile && <Keyboard />}
        {!mobile && (
          <group ref={mouse}>
            <Mouse />
          </group>
        )}
        {!mobile && (
          <group ref={left}>
            <BooksAndPens />
          </group>
        )}
        {!mobile && (
          <group ref={right}>
            <Plant />
          </group>
        )}
      </group>
      <ContactShadows
        position={[0, -3.55, 0]}
        opacity={0.22}
        scale={14}
        blur={3.5}
        far={7}
      />
    </>
  );
}

function LoaderIdentity({ state }: { state: IntroState }) {
  let index = 0;
  return (
    <div
      className={`screen-loader is-${state}`}
      aria-label="WORK WITH TNKAX loading sequence"
    >
      <div className="screen-loader-name">
        {loaderWords.map((word) => (
          <div key={word}>
            {word.split("").map((letter) => {
              const letterIndex = index++;
              return (
                <span
                  key={`${letter}-${letterIndex}`}
                  style={{ "--letter": letterIndex } as CSSProperties}
                >
                  {letter}
                </span>
              );
            })}
          </div>
        ))}
      </div>
      <p>FULL STACK DEVELOPER&nbsp;&nbsp; / &nbsp;&nbsp;SYSTEM READY</p>
    </div>
  );
}

export default function MonitorExperience({
  children,
  onReady,
}: {
  children: ReactNode;
  onReady?: () => void;
}) {
  const root = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const stateRef = useRef<IntroState>("loading");
  const [introState, setIntroState] = useState<IntroState>("loading");
  const [sceneActive, setSceneActive] = useState(true);
  const sceneActiveRef = useRef(true);
  const readyCallback = useRef(onReady);
  readyCallback.current = onReady;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const changeState = (next: IntroState) => {
    if (stateRef.current === next) return;
    stateRef.current = next;
    setIntroState(next);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    const duration = reducedMotion ? 250 : 2800;
    const timer = window.setTimeout(() => {
      changeState("ready");
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      readyCallback.current?.();
      requestAnimationFrame(() => dispatchEvent(new Event("resize")));
    }, duration);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [reducedMotion]);

  useEffect(() => {
    const update = () => {
      const element = root.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const distance = Math.max(1, element.offsetHeight - innerHeight);
      const scrollProgress = reducedMotion
        ? 1
        : THREE.MathUtils.clamp(-rect.top / distance, 0, 1);
      const next = stateRef.current === "loading" ? 0 : scrollProgress;
      progress.current = next;

      if (stateRef.current !== "loading") {
        if (next <= 0.002) changeState("ready");
        else if (next < 0.965) changeState("entering");
        else changeState("entered");
      }

      const eased = THREE.MathUtils.smootherstep(next, 0, 1);
      const mobile = innerWidth < 700;
      const initialWidth = Math.min(
        innerWidth * (mobile ? 0.78 : 0.61),
        mobile ? 620 : 1120,
      );
      const initialHeight = initialWidth / (mobile ? 2.14 : 2.295);
      const initialTop = mobile ? innerHeight * 0.34 : innerHeight * 0.17;
      const width = THREE.MathUtils.lerp(
        initialWidth,
        innerWidth * 1.04,
        eased,
      );
      const height = THREE.MathUtils.lerp(
        initialHeight,
        innerHeight * 1.04,
        eased,
      );
      const top = THREE.MathUtils.lerp(initialTop, -innerHeight * 0.02, eased);
      const left = (innerWidth - width) / 2;

      element.style.setProperty("--monitor-progress", String(next));
      element.style.setProperty("--screen-left", `${left}px`);
      element.style.setProperty("--screen-top", `${top}px`);
      element.style.setProperty("--screen-width", `${width}px`);
      element.style.setProperty("--screen-height", `${height}px`);
      element.style.setProperty(
        "--screen-radius",
        `${THREE.MathUtils.lerp(6, 0, eased)}px`,
      );
      element.style.setProperty(
        "--loader-opacity",
        String(1 - THREE.MathUtils.clamp((next - 0.2) / 0.2, 0, 1)),
      );
      element.style.setProperty(
        "--hero-eyebrow",
        String(THREE.MathUtils.clamp((next - 0.34) / 0.1, 0, 1)),
      );
      element.style.setProperty(
        "--hero-title",
        String(THREE.MathUtils.clamp((next - 0.4) / 0.12, 0, 1)),
      );
      element.style.setProperty(
        "--hero-copy",
        String(THREE.MathUtils.clamp((next - 0.54) / 0.13, 0, 1)),
      );
      element.style.setProperty(
        "--hero-actions",
        String(THREE.MathUtils.clamp((next - 0.64) / 0.13, 0, 1)),
      );
      element.style.setProperty(
        "--monitor-hint-opacity",
        String(1 - THREE.MathUtils.clamp(next / 0.08, 0, 1)),
      );
      element.style.setProperty(
        "--monitor-nav-opacity",
        String(THREE.MathUtils.clamp((next - 0.86) / 0.1, 0, 1)),
      );
      document.documentElement.style.setProperty(
        "--monitor-nav-opacity",
        String(THREE.MathUtils.clamp((next - 0.86) / 0.1, 0, 1)),
      );
      document.documentElement.style.setProperty(
        "--monitor-dom-opacity",
        String(THREE.MathUtils.clamp((next - 0.82) / 0.12, 0, 1)),
      );

      const exitOpacity = THREE.MathUtils.clamp(
        (rect.bottom / innerHeight - 0.7) / 0.3,
        0,
        1,
      );
      element.style.setProperty("--portal-exit-opacity", String(exitOpacity));
      element.classList.toggle("is-past", rect.bottom <= 0);

      const shouldRender = next < 0.985 && rect.bottom > 0;
      if (sceneActiveRef.current !== shouldRender) {
        sceneActiveRef.current = shouldRender;
        setSceneActive(shouldRender);
      }
    };

    update();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    return () => {
      document.documentElement.style.removeProperty("--monitor-nav-opacity");
      document.documentElement.style.removeProperty("--monitor-dom-opacity");
      removeEventListener("scroll", update);
      removeEventListener("resize", update);
    };
  }, [reducedMotion]);

  return (
    <section
      id="home"
      className={`monitor-experience state-${introState}`}
      ref={root}
    >
      <div className="monitor-sticky">
        {sceneActive && !reducedMotion && (
          <div className="monitor-canvas" aria-hidden="true">
            <Canvas
              dpr={[1, 1.4]}
              shadows
              camera={{ position: [0.42, 0.28, 10.5], fov: 43 }}
              gl={{ antialias: true, powerPreference: "high-performance" }}
            >
              <Scene progress={progress} />
            </Canvas>
          </div>
        )}
        <div className="studio-code" aria-hidden="true">
          <code>const craft = detail + restraint;</code>
          <code>app.MapControllers();</code>
          <code>SELECT quality FROM projects;</code>
        </div>
        <div className="screen-portal">
          <LoaderIdentity state={introState} />
          <div className="screen-hero">{children}</div>
        </div>
        <div className="monitor-instruction">
          <span>SCROLL TO ENTER</span>
          <i />
        </div>
      </div>
    </section>
  );
}
