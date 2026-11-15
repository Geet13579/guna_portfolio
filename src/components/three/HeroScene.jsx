import { useLayoutEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles, RoundedBox, Edges, Lightformer, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette, DepthOfField } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

const CYAN = '#00f0ff';
const PURPLE = '#a020ff';
const RED = '#ff2a55';

/* ---------- Procedural cinema camera ---------- */
function NeonRing({ position, radius = 0.58, tube = 0.012, color = CYAN, intensity = 3 }) {
  return (
    <mesh position={position}>
      <torusGeometry args={[radius, tube, 12, 64]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity} toneMapped={false} />
    </mesh>
  );
}

function CinemaCamera() {
  const metal = { color: '#0c0d12', metalness: 0.95, roughness: 0.32 };
  const ribs = useMemo(() => Array.from({ length: 18 }), []);
  return (
    <group>
      {/* body */}
      <RoundedBox args={[1.35, 1.1, 2.3]} radius={0.08} smoothness={4} position={[0, 0, -0.5]}>
        <meshStandardMaterial {...metal} />
        <Edges threshold={20} color={CYAN} />
      </RoundedBox>
      {/* top plate + handle */}
      <RoundedBox args={[0.9, 0.12, 1.6]} radius={0.04} position={[0, 0.62, -0.5]}>
        <meshStandardMaterial {...metal} />
      </RoundedBox>
      <mesh position={[0, 0.95, -0.5]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.9, 16]} />
        <meshStandardMaterial {...metal} roughness={0.5} />
      </mesh>
      {[-0.42, 0.42].map((x) => (
        <mesh key={x} position={[0, 0.78, -0.5 + x]}>
          <boxGeometry args={[0.1, 0.35, 0.1]} />
          <meshStandardMaterial {...metal} />
        </mesh>
      ))}
      {/* side grip / vents */}
      <RoundedBox args={[0.12, 0.8, 1.2]} radius={0.04} position={[0.72, -0.05, -0.2]}>
        <meshStandardMaterial {...metal} roughness={0.55} />
      </RoundedBox>
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[-0.69, 0.3 - i * 0.12, -0.9]}>
          <boxGeometry args={[0.02, 0.04, 0.9]} />
          <meshStandardMaterial color="#000" emissive={PURPLE} emissiveIntensity={1.6} toneMapped={false} />
        </mesh>
      ))}
      {/* rear battery plate */}
      <RoundedBox args={[1.0, 0.8, 0.35]} radius={0.05} position={[0, 0, -1.8]}>
        <meshStandardMaterial {...metal} roughness={0.45} />
      </RoundedBox>
      {/* tally light */}
      <mesh position={[0.5, 0.42, 0.66]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color={RED} emissive={RED} emissiveIntensity={4} toneMapped={false} />
      </mesh>
      {/* viewfinder */}
      <group position={[-0.95, 0.35, -0.9]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.16, 0.2, 0.55, 24]} />
          <meshStandardMaterial {...metal} />
        </mesh>
        <mesh position={[0, 0, 0.29]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.13, 24]} />
          <meshStandardMaterial color="#000" emissive={CYAN} emissiveIntensity={0.7} toneMapped={false} />
        </mesh>
        <mesh position={[0.35, -0.15, 0.1]}>
          <boxGeometry args={[0.7, 0.06, 0.06]} />
          <meshStandardMaterial {...metal} />
        </mesh>
      </group>

      {/* lens assembly (points +Z) */}
      <group position={[0, 0, 0.65]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.62, 0.62, 0.22, 48]} />
          <meshStandardMaterial {...metal} />
        </mesh>
        <mesh position={[0, 0.65, 0]}>
          <cylinderGeometry args={[0.52, 0.55, 1.1, 48]} />
          <meshStandardMaterial color="#090a0f" metalness={0.9} roughness={0.4} />
        </mesh>
        {/* grippy focus ring */}
        <mesh position={[0, 0.7, 0]}>
          <cylinderGeometry args={[0.575, 0.575, 0.5, 48]} />
          <meshStandardMaterial color="#14151c" metalness={0.8} roughness={0.7} />
        </mesh>
        {ribs.map((_, i) => {
          const a = (i / ribs.length) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 0.58, 0.7, Math.sin(a) * 0.58]} rotation={[0, -a, 0]}>
              <boxGeometry args={[0.03, 0.46, 0.05]} />
              <meshStandardMaterial color="#05050a" metalness={0.6} roughness={0.8} />
            </mesh>
          );
        })}
        {/* front barrel */}
        <mesh position={[0, 1.4, 0]}>
          <cylinderGeometry args={[0.7, 0.58, 0.45, 48]} />
          <meshStandardMaterial {...metal} />
        </mesh>
        {/* glass */}
        <mesh position={[0, 1.64, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 0.04, 48]} />
          <meshPhysicalMaterial color="#04101c" metalness={0.2} roughness={0.05} clearcoat={1} clearcoatRoughness={0.05} emissive="#1a0b3a" emissiveIntensity={0.6} />
        </mesh>
        {[0.42, 0.28, 0.14].map((r, i) => (
          <mesh key={r} position={[0, 1.67 + i * 0.002, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[r, 0.006, 8, 48]} />
            <meshStandardMaterial color={i % 2 ? CYAN : PURPLE} emissive={i % 2 ? CYAN : PURPLE} emissiveIntensity={2.5} toneMapped={false} />
          </mesh>
        ))}
        <mesh position={[0, 1.67, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.07, 24]} />
          <meshBasicMaterial color="#8a5cff" toneMapped={false} />
        </mesh>
        {/* neon rings */}
        <NeonRing position={[0, 1.15, 0]} radius={0.57} color={CYAN} />
        <NeonRing position={[0, 0.42, 0]} radius={0.55} color={PURPLE} />
        <NeonRing position={[0, 1.62, 0]} radius={0.71} tube={0.015} color={CYAN} intensity={4} />
      </group>

      {/* matte box */}
      <group position={[0, 0, 2.4]} scale={0.8}>
        {[
          [0, 0.95, 0, 1.9, 0.07, 0.9],
          [0, -0.95, 0, 1.9, 0.07, 0.9],
          [0.95, 0, 0, 0.07, 1.9, 0.9],
          [-0.95, 0, 0, 0.07, 1.9, 0.9],
        ].map(([x, y, z, w, h, d], i) => (
          <mesh key={i} position={[x, y, z]}>
            <boxGeometry args={[w, h, d]} />
            <meshStandardMaterial color="#07070b" metalness={0.8} roughness={0.5} />
          </mesh>
        ))}
        <mesh position={[0, 0, 0.46]}>
          <boxGeometry args={[2.0, 2.0, 0.02]} />
          <meshBasicMaterial visible={false} />
          <Edges color={PURPLE} />
        </mesh>
      </group>
    </group>
  );
}

/* ---------- Environment ---------- */
function City() {
  const towers = useRef();
  const strips = useRef();
  const data = useMemo(() => {
    const arr = [];
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 70; i++) {
      const a = (i / 70) * Math.PI * 1.2 + Math.PI * 0.9 - Math.PI * 0.1 + (rnd() - 0.5) * 0.1;
      const r = 22 + rnd() * 18;
      const h = 4 + rnd() * 22;
      const w = 1.2 + rnd() * 2.4;
      arr.push({ x: Math.cos(a) * r * 1.4, z: Math.sin(a) * r - 6, h, w, c: rnd() > 0.55 ? CYAN : rnd() > 0.5 ? PURPLE : RED });
    }
    return arr;
  }, []);

  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    const col = new THREE.Color();
    data.forEach((t, i) => {
      m.compose(new THREE.Vector3(t.x, -2.2 + t.h / 2, t.z), new THREE.Quaternion(), new THREE.Vector3(t.w, t.h, t.w));
      towers.current.setMatrixAt(i, m);
      m.compose(new THREE.Vector3(t.x, -2.2 + t.h * 0.82, t.z + t.w / 2 + 0.01), new THREE.Quaternion(), new THREE.Vector3(t.w * 0.8, 0.12, 0.02));
      strips.current.setMatrixAt(i, m);
      strips.current.setColorAt(i, col.set(t.c));
    });
    towers.current.instanceMatrix.needsUpdate = true;
    strips.current.instanceMatrix.needsUpdate = true;
    if (strips.current.instanceColor) strips.current.instanceColor.needsUpdate = true;
  }, [data]);

  return (
    <group>
      <instancedMesh ref={towers} args={[null, null, data.length]}>
        <boxGeometry />
        <meshStandardMaterial color="#07070d" metalness={0.8} roughness={0.5} />
      </instancedMesh>
      <instancedMesh ref={strips} args={[null, null, data.length]}>
        <boxGeometry />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

function LightStreaks({ reduced }) {
  const refs = useRef([]);
  const items = useMemo(
    () => [
      { y: 1.6, z: -9, c: CYAN, s: 0.35, l: 14 },
      { y: -0.4, z: -11, c: PURPLE, s: -0.28, l: 18 },
      { y: 3.0, z: -13, c: RED, s: 0.22, l: 10 },
      { y: -1.4, z: -8, c: CYAN, s: -0.4, l: 12 },
    ],
    []
  );
  useFrame(({ clock }) => {
    if (reduced) return;
    const t = clock.elapsedTime;
    refs.current.forEach((m, i) => {
      if (!m) return;
      const it = items[i];
      const span = 60;
      m.position.x = ((t * it.s * 14 + i * 17) % span) - span / 2;
    });
  });
  return items.map((it, i) => (
    <mesh key={i} ref={(el) => (refs.current[i] = el)} position={[0, it.y, it.z]}>
      <planeGeometry args={[it.l, 0.018]} />
      <meshBasicMaterial color={it.c} transparent opacity={0.9} blending={THREE.AdditiveBlending} toneMapped={false} depthWrite={false} />
    </mesh>
  ));
}

function Rig({ reduced, children }) {
  const group = useRef();
  const target = useRef({ x: 0, y: 0 });

  useFrame(({ pointer, camera, clock }, dt) => {
    const t = clock.elapsedTime;
    const scrollP = Math.min(1.5, window.scrollY / window.innerHeight);

    if (!reduced) {
      target.current.x = pointer.x;
      target.current.y = pointer.y;
    }
    const g = group.current;
    // slow auto-rotate + mouse reactivity
    const baseY = reduced ? -0.95 : -0.95 + Math.sin(t * 0.22) * 0.45;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, baseY + target.current.x * 0.5, 2.5, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.12 - target.current.y * 0.25, 2.5, dt);
    const isMobile = window.innerWidth < 768;
    // keep the camera clear of the headline: right side on desktop, upper area on mobile
    g.position.x = THREE.MathUtils.damp(g.position.x, isMobile ? 0 : window.innerWidth < 1100 ? 2.0 : 3.7, 3, dt);
    g.position.y = (isMobile ? 1.5 : 0.35) + (reduced ? 0 : Math.sin(t * 0.8) * 0.06);

    // scroll-driven camera dolly
    const baseZ = isMobile ? 14 : 10.5;
    camera.position.z = THREE.MathUtils.damp(camera.position.z, baseZ + scrollP * 4, 3, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 0.6 - scrollP * 1.2, 3, dt);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, reduced ? 0 : target.current.x * 0.5, 2, dt);
    camera.lookAt(0, 0.4, 0);
  });

  return <group ref={group}>{children}</group>;
}

function Scene({ reduced, mobile }) {
  const caOffset = useMemo(() => new THREE.Vector2(0.0009, 0.0007), []);
  return (
    <>
      <color attach="background" args={['#030306']} />
      <fog attach="fog" args={['#07040f', 30, 130]} />

      {/* lighting: cyan + purple rim, red accent */}
      <ambientLight intensity={0.35} />
      <pointLight position={[-5, 2, 3]} intensity={160} color={CYAN} distance={26} />
      <pointLight position={[5, 1, -2]} intensity={180} color={PURPLE} distance={26} />
      <pointLight position={[0, 3, 6]} intensity={60} color="#ffffff" distance={20} />
      <pointLight position={[0, -1.5, -4]} intensity={35} color={RED} distance={14} />
      <spotLight position={[0, 9, 2]} angle={0.4} penumbra={1} intensity={90} color="#8a5cff" />

      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={5} color={CYAN} position={[-5, 1, 2]} scale={[3, 8, 1]} />
        <Lightformer form="rect" intensity={5} color={PURPLE} position={[5, 1, 1]} scale={[3, 8, 1]} />
        <Lightformer form="ring" intensity={2} color="#ffffff" position={[0, 5, -3]} scale={4} />
      </Environment>

      <Rig reduced={reduced}>
        <CinemaCamera />
      </Rig>

      {/* neon grid floor */}
      <gridHelper args={[160, 80, PURPLE, '#1b0b33']} position={[0, -2.2, -20]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.21, -20]}>
        <planeGeometry args={[160, 160]} />
        <meshBasicMaterial color="#04030a" />
      </mesh>

      <City />
      <LightStreaks reduced={reduced} />

      <Sparkles count={mobile ? 50 : 140} scale={[26, 12, 22]} size={mobile ? 2.2 : 2.8} speed={reduced ? 0 : 0.35} color={CYAN} opacity={0.75} position={[0, 1, -4]} />
      <Sparkles count={mobile ? 30 : 80} scale={[22, 10, 18]} size={3.2} speed={reduced ? 0 : 0.25} color={PURPLE} opacity={0.8} position={[0, 1, -3]} />

      <EffectComposer multisampling={0} disableNormalPass>
        <Bloom intensity={mobile ? 0.8 : 1.15} luminanceThreshold={0.35} luminanceSmoothing={0.25} mipmapBlur />
        {!mobile && <DepthOfField worldFocusDistance={10.5} worldFocusRange={16} bokehScale={2.2} height={420} />}
        <ChromaticAberration offset={caOffset} blendFunction={BlendFunction.NORMAL} radialModulation={false} modulationOffset={0} />
        <Noise opacity={0.045} />
        <Vignette eskil={false} offset={0.2} darkness={0.85} />
      </EffectComposer>
    </>
  );
}

export default function HeroScene({ reduced, mobile, active }) {
  return (
    <Canvas
      dpr={mobile ? [1, 1.25] : [1, 1.6]}
      camera={{ position: [0, 0.6, 10.5], fov: 38, near: 0.1, far: 120 }}
      gl={{ antialias: false, powerPreference: 'high-performance', alpha: false }}
      frameloop={active ? 'always' : 'never'}
    >
      <Scene reduced={reduced} mobile={mobile} />
    </Canvas>
  );
}
