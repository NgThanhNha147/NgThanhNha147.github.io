import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Html, RoundedBox } from "@react-three/drei";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import * as THREE from "three";

function ScreenPreview() {
  return (
    <div className="monitor-preview">
      <div className="monitor-preview-identity">
        <strong>WORK</strong>
        <strong>WITH</strong>
        <strong>TNKAX</strong>
        <small>
          FULL STACK DEVELOPER&nbsp;&nbsp; / &nbsp;&nbsp;SYSTEM READY
        </small>
      </div>
      <div className="monitor-preview-site">
        <div className="monitor-preview-nav">
          <b>TN.</b>
          <span>
            HOME&nbsp;&nbsp;&nbsp; ABOUT&nbsp;&nbsp;&nbsp;
            PROJECTS&nbsp;&nbsp;&nbsp; CONTACT
          </span>
        </div>
        <div className="monitor-preview-copy">
          <small>HEY, I'M THANH NHA.</small>
          <strong>I build full-stack web applications.</strong>
          <p>
            A Full-stack Developer based in Hanoi, building practical products
            from interface to database.
          </p>
          <div>
            <b>VIEW PROJECTS</b>
            <span>DOWNLOAD CV</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Keyboard() {
  const keys = Array.from({ length: 48 });
  return (
    <group position={[0, -2.92, 1.05]} rotation={[-0.12, 0, 0]}>
      <RoundedBox args={[4.5, 0.12, 1.15]} radius={0.08} smoothness={3}>
        <meshStandardMaterial
          color="#1b1b1b"
          roughness={0.55}
          metalness={0.35}
        />
      </RoundedBox>
      {keys.map((_, index) => (
        <mesh
          key={index}
          position={[
            -1.95 + (index % 12) * 0.355,
            0.09,
            -0.42 + Math.floor(index / 12) * 0.27,
          ]}
        >
          <boxGeometry args={[0.27, 0.055, 0.19]} />
          <meshStandardMaterial color="#303030" roughness={0.72} />
        </mesh>
      ))}
    </group>
  );
}

function Scene({ progress }: { progress: RefObject<number> }) {
  const setup = useRef<THREE.Group>(null);
  const props = useRef<THREE.Group>(null);
  const glare = useRef<THREE.Mesh>(null);
  const { camera, pointer, size } = useThree();
  const mobile = size.width < 700;

  useFrame(() => {
    const p = progress.current ?? 0;
    const eased = THREE.MathUtils.smootherstep(p, 0, 1);
    const parallax = (1 - eased) * (mobile ? 0 : 1);
    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      (1 - eased) * 0.7 + pointer.x * 0.22 * parallax,
      0.075,
    );
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      (1 - eased) * 0.35 + pointer.y * 0.13 * parallax,
      0.075,
    );
    camera.position.z = THREE.MathUtils.lerp(
      camera.position.z,
      mobile ? 18 - eased * 14.8 : 10.2 - eased * 7.25,
      0.075,
    );
    camera.lookAt(0, 0, 0);
    if (setup.current) {
      setup.current.rotation.y =
        THREE.MathUtils.lerp(0.1, 0, eased) + pointer.x * 0.025 * parallax;
      setup.current.rotation.x =
        THREE.MathUtils.lerp(-0.045, 0, eased) - pointer.y * 0.015 * parallax;
    }
    if (props.current) {
      props.current.position.y = -eased * 1.3;
      props.current.scale.setScalar(1 - eased * 0.3);
    }
    if (glare.current) glare.current.position.x = pointer.x * 1.8;
  });

  return (
    <>
      <color attach="background" args={["#f4f4f1"]} />
      <ambientLight intensity={1.8} />
      <directionalLight
        position={[4, 7, 7]}
        intensity={3.6}
        color="#ffffff"
        castShadow
      />
      <directionalLight position={[-5, 2, 3]} intensity={1.1} color="#dedede" />
      <group ref={setup} position={[0, 0.1, 0]}>
        <RoundedBox
          args={[7.35, 3.9, 0.22]}
          radius={0.19}
          smoothness={5}
          castShadow
        >
          <meshStandardMaterial
            color="#171717"
            roughness={0.38}
            metalness={0.7}
          />
        </RoundedBox>
        <mesh position={[0, 0, 0.125]}>
          <planeGeometry args={[7.03, 3.57]} />
          <meshStandardMaterial color="#fafafa" roughness={0.88} />
        </mesh>
        <Html
          transform
          position={[0, 0, 0.15]}
          distanceFactor={2.03}
          style={{ pointerEvents: "none" }}
        >
          <ScreenPreview />
        </Html>
        <mesh ref={glare} position={[0.8, 0.7, 0.17]} rotation={[0, 0, -0.2]}>
          <planeGeometry args={[2.8, 4.4]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.045}
            depthWrite={false}
          />
        </mesh>
        <RoundedBox
          args={[0.34, 1.65, 0.3]}
          radius={0.1}
          position={[0, -2.7, -0.08]}
          castShadow
        >
          <meshStandardMaterial
            color="#292929"
            roughness={0.35}
            metalness={0.82}
          />
        </RoundedBox>
        <RoundedBox
          args={[2.75, 0.16, 1.05]}
          radius={0.12}
          position={[0, -3.48, 0.1]}
          castShadow
        >
          <meshStandardMaterial
            color="#373737"
            roughness={0.3}
            metalness={0.85}
          />
        </RoundedBox>
      </group>
      <group ref={props}>
        <mesh position={[0, -3.72, 0]} receiveShadow>
          <boxGeometry args={[13, 0.28, 5.2]} />
          <meshStandardMaterial color="#e7e5e0" roughness={0.72} />
        </mesh>
        {!mobile && <Keyboard />}
        {!mobile && (
          <group position={[3.25, -3.18, 1.05]}>
            <RoundedBox args={[0.72, 0.25, 1.05]} radius={0.22} smoothness={4}>
              <meshStandardMaterial
                color="#3b3b3b"
                roughness={0.46}
                metalness={0.25}
              />
            </RoundedBox>
          </group>
        )}
        {!mobile && (
          <group position={[-4.15, -2.78, 0.25]}>
            <mesh>
              <cylinderGeometry args={[0.48, 0.42, 1.15, 32]} />
              <meshStandardMaterial color="#ecebe7" roughness={0.75} />
            </mesh>
            {[
              [-0.25, 0.95, 0],
              [0, 1.12, 0.05],
              [0.28, 0.9, -0.05],
            ].map((position, index) => (
              <mesh
                key={index}
                position={position as [number, number, number]}
                rotation={[0, 0, (index - 1) * 0.35]}
              >
                <capsuleGeometry args={[0.12, 0.8, 4, 10]} />
                <meshStandardMaterial color="#363b35" roughness={0.8} />
              </mesh>
            ))}
          </group>
        )}
      </group>
      <ContactShadows
        position={[0, -3.55, 0]}
        opacity={0.28}
        scale={13}
        blur={2.8}
        far={7}
      />
    </>
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
  const sceneActiveRef = useRef(true);
  const [sceneActive, setSceneActive] = useState(true);
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => onReady?.(), [onReady]);

  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.style.setProperty("--monitor-progress", "1");
      document.documentElement.style.setProperty("--monitor-dom-opacity", "1");
      document.documentElement.style.setProperty(
        "--monitor-scene-opacity",
        "0",
      );
      document.documentElement.style.setProperty("--monitor-nav-opacity", "1");
      document.documentElement.style.setProperty("--monitor-hint-opacity", "0");
      return;
    }
    const update = () => {
      if (!root.current) return;
      const rect = root.current.getBoundingClientRect();
      root.current.classList.toggle(
        "is-past",
        rect.bottom <= innerHeight * 0.5,
      );
      const distance = Math.max(1, root.current.offsetHeight - innerHeight);
      const next = THREE.MathUtils.clamp(-rect.top / distance, 0, 1);
      const shouldRenderScene = next < 0.995 && rect.bottom > 0;
      if (sceneActiveRef.current !== shouldRenderScene) {
        sceneActiveRef.current = shouldRenderScene;
        setSceneActive(shouldRenderScene);
      }
      progress.current = next;
      root.current.style.setProperty("--monitor-progress", String(next));
      document.documentElement.style.setProperty(
        "--monitor-progress",
        String(next),
      );
      const domOpacity = THREE.MathUtils.clamp((next - 0.94) / 0.05, 0, 1);
      document.documentElement.style.setProperty(
        "--monitor-dom-opacity",
        String(domOpacity),
      );
      document.documentElement.style.setProperty(
        "--monitor-scene-opacity",
        String(1 - domOpacity),
      );
      document.documentElement.style.setProperty(
        "--monitor-nav-opacity",
        String(THREE.MathUtils.clamp((next - 0.9) / 0.08, 0, 1)),
      );
      document.documentElement.style.setProperty(
        "--monitor-hint-opacity",
        String(1 - THREE.MathUtils.clamp(next / 0.2, 0, 1)),
      );
      document.documentElement.style.setProperty(
        "--monitor-title-opacity",
        String(1 - THREE.MathUtils.clamp((next - 0.04) / 0.1, 0, 1)),
      );
      document.documentElement.style.setProperty(
        "--monitor-preview-opacity",
        String(THREE.MathUtils.clamp((next - 0.16) / 0.14, 0, 1)),
      );
    };
    update();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    return () => {
      document.documentElement.style.removeProperty("--monitor-progress");
      document.documentElement.style.removeProperty("--monitor-dom-opacity");
      document.documentElement.style.removeProperty("--monitor-scene-opacity");
      document.documentElement.style.removeProperty("--monitor-nav-opacity");
      document.documentElement.style.removeProperty("--monitor-hint-opacity");
      document.documentElement.style.removeProperty("--monitor-title-opacity");
      document.documentElement.style.removeProperty(
        "--monitor-preview-opacity",
      );
      removeEventListener("scroll", update);
      removeEventListener("resize", update);
    };
  }, [reducedMotion]);

  return (
    <section id="home" className="monitor-experience" ref={root}>
      <div className="monitor-sticky">
        {!reducedMotion && sceneActive && (
          <div className="monitor-canvas" aria-hidden="true">
            <Canvas
              dpr={[1, 1.35]}
              shadows
              camera={{ position: [0.7, 0.35, 10.2], fov: 43 }}
              gl={{ antialias: true, powerPreference: "high-performance" }}
            >
              <Scene progress={progress} />
            </Canvas>
          </div>
        )}
        <div className="monitor-real-hero">{children}</div>
        <div className="monitor-instruction">
          <span>SCROLL TO ENTER</span>
          <i />
        </div>
      </div>
    </section>
  );
}
