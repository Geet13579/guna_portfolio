import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Edges, OrbitControls, RoundedBox, Sparkles } from '@react-three/drei';

const metal = { color: '#0d0e14', metalness: 0.9, roughness: 0.38 };

function Glow({ color, intensity = 2.5, ...props }) {
  return <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity} toneMapped={false} {...props} />;
}

function Lens({ position = [0, 0, 0], r = 0.5, len = 0.9, color }) {
  return (
    <group position={position} rotation={[Math.PI / 2, 0, 0]}>
      <mesh position={[0, len / 2, 0]}>
        <cylinderGeometry args={[r, r * 1.08, len, 40]} />
        <meshStandardMaterial {...metal} />
      </mesh>
      <mesh position={[0, len * 0.55, 0]}>
        <cylinderGeometry args={[r * 1.07, r * 1.07, len * 0.32, 40]} />
        <meshStandardMaterial color="#16171f" metalness={0.7} roughness={0.75} />
      </mesh>
      <mesh position={[0, len + 0.005, 0]}>
        <cylinderGeometry args={[r * 0.82, r * 0.82, 0.03, 40]} />
        <meshPhysicalMaterial color="#05101c" roughness={0.05} clearcoat={1} emissive="#1a0b3a" emissiveIntensity={0.7} />
      </mesh>
      <mesh position={[0, len + 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[r * 0.95, 0.012, 8, 48]} />
        <Glow color={color} />
      </mesh>
      <mesh position={[0, len * 0.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[r * 1.08, 0.01, 8, 48]} />
        <Glow color={color} intensity={1.6} />
      </mesh>
    </group>
  );
}

function CinemaCam({ color }) {
  return (
    <group>
      <RoundedBox args={[1.3, 1.0, 1.9]} radius={0.07} position={[0, 0, -0.3]}>
        <meshStandardMaterial {...metal} />
        <Edges threshold={20} color={color} />
      </RoundedBox>
      <mesh position={[0, 0.78, -0.3]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.8, 16]} />
        <meshStandardMaterial {...metal} roughness={0.5} />
      </mesh>
      {[-0.35, 0.35].map((z) => (
        <mesh key={z} position={[0, 0.65, -0.3 + z]}>
          <boxGeometry args={[0.1, 0.3, 0.1]} />
          <meshStandardMaterial {...metal} />
        </mesh>
      ))}
      <RoundedBox args={[0.1, 0.7, 0.9]} radius={0.03} position={[0.68, -0.05, -0.1]}>
        <meshStandardMaterial {...metal} roughness={0.6} />
      </RoundedBox>
      <group position={[-0.85, 0.3, -0.6]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.14, 0.18, 0.5, 20]} />
          <meshStandardMaterial {...metal} />
        </mesh>
      </group>
      <Lens position={[0, 0, 0.65]} r={0.48} len={1.1} color={color} />
      <mesh position={[0.45, 0.38, 0.66]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <Glow color="#ff2a55" intensity={4} />
      </mesh>
    </group>
  );
}

function CompactCam({ color }) {
  return (
    <group>
      <RoundedBox args={[1.2, 0.85, 0.95]} radius={0.08} position={[0, 0, -0.1]}>
        <meshStandardMaterial {...metal} />
        <Edges threshold={20} color={color} />
      </RoundedBox>
      <RoundedBox args={[0.35, 0.9, 0.7]} radius={0.06} position={[0.7, -0.05, -0.1]}>
        <meshStandardMaterial {...metal} roughness={0.6} />
      </RoundedBox>
      <mesh position={[-0.3, 0.52, -0.15]}>
        <boxGeometry args={[0.25, 0.14, 0.3]} />
        <meshStandardMaterial {...metal} />
      </mesh>
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[-0.61, 0.2 - i * 0.1, -0.2]}>
          <boxGeometry args={[0.02, 0.035, 0.5]} />
          <Glow color={color} intensity={1.4} />
        </mesh>
      ))}
      <Lens position={[0, 0, 0.38]} r={0.38} len={0.8} color={color} />
      <mesh position={[0.42, 0.3, 0.38]}>
        <sphereGeometry args={[0.03, 12, 12]} />
        <Glow color="#ff2a55" intensity={4} />
      </mesh>
    </group>
  );
}

function Rotor({ position, speed = 1, color }) {
  const ref = useRef();
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 40 * speed;
  });
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.07, 0.07, 0.12, 12]} />
        <meshStandardMaterial {...metal} />
      </mesh>
      <group ref={ref} position={[0, 0.09, 0]}>
        <mesh>
          <boxGeometry args={[0.95, 0.012, 0.06]} />
          <meshStandardMaterial color="#1b1c26" metalness={0.5} roughness={0.5} />
        </mesh>
      </group>
      <mesh position={[0, 0.095, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, 0.006, 6, 40]} />
        <Glow color={color} intensity={1.2} transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

function Drone({ color, dome360 = false }) {
  const arms = [
    [0.85, 0, 0.85],
    [-0.85, 0, 0.85],
    [0.85, 0, -0.85],
    [-0.85, 0, -0.85],
  ];
  return (
    <group rotation={[0.18, 0, 0]}>
      <RoundedBox args={[0.8, 0.28, 1.1]} radius={0.09} smoothness={4}>
        <meshStandardMaterial {...metal} />
        <Edges threshold={20} color={color} />
      </RoundedBox>
      {arms.map((p, i) => (
        <group key={i}>
          <mesh position={[p[0] / 2, 0, p[2] / 2]} rotation={[0, Math.atan2(p[0], p[2]), 0]}>
            <boxGeometry args={[0.1, 0.07, 1.2]} />
            <meshStandardMaterial {...metal} />
          </mesh>
          <Rotor position={p} color={color} speed={i % 2 ? 1 : -1} />
        </group>
      ))}
      {dome360 ? (
        <>
          {[0.32, -0.32].map((y) => (
            <mesh key={y} position={[0, y, 0]}>
              <sphereGeometry args={[0.2, 24, 24]} />
              <meshPhysicalMaterial color="#05101c" roughness={0.05} clearcoat={1} emissive={color} emissiveIntensity={0.35} />
            </mesh>
          ))}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.62, 0.012, 8, 60]} />
            <Glow color={color} />
          </mesh>
        </>
      ) : (
        <group position={[0, -0.27, 0.45]}>
          <mesh>
            <sphereGeometry args={[0.17, 20, 20]} />
            <meshStandardMaterial {...metal} />
          </mesh>
          <mesh position={[0, 0, 0.14]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.1, 20]} />
            <Glow color={color} intensity={1.2} />
          </mesh>
        </group>
      )}
      <mesh position={[0, 0.01, 0.56]}>
        <sphereGeometry args={[0.03, 10, 10]} />
        <Glow color="#ff2a55" intensity={4} />
      </mesh>
    </group>
  );
}

function Cam360({ color }) {
  return (
    <group rotation={[0, 0, 0.12]}>
      <mesh>
        <capsuleGeometry args={[0.42, 1.05, 12, 28]} />
        <meshStandardMaterial {...metal} />
      </mesh>
      {[0.46, -0.46].map((z) => (
        <group key={z} position={[0, 0.55, z * 0.0]}>
          <mesh position={[0, 0, z]}>
            <sphereGeometry args={[0.3, 28, 28]} />
            <meshPhysicalMaterial color="#04101c" roughness={0.04} clearcoat={1} emissive="#1a0b3a" emissiveIntensity={0.7} />
          </mesh>
          <mesh position={[0, 0, z]} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.32, 0.012, 8, 48]} />
            <Glow color={color} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, -0.05, 0.3]}>
        <boxGeometry args={[0.02, 0.5, 0.01]} />
        <Glow color={color} intensity={1.4} />
      </mesh>
      <mesh position={[0, -1.25, 0]}>
        <cylinderGeometry args={[0.1, 0.14, 0.5, 20]} />
        <meshStandardMaterial {...metal} roughness={0.55} />
      </mesh>
    </group>
  );
}

function Model({ kind, color }) {
  if (kind === 'camera') return <CinemaCam color={color} />;
  if (kind === 'camera-small') return <CompactCam color={color} />;
  if (kind === 'drone') return <Drone color={color} />;
  if (kind === 'drone360') return <Drone color={color} dome360 />;
  return <Cam360 color={color} />;
}

function Spin({ children, reduced }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current || reduced) return;
    ref.current.position.y = Math.sin(clock.elapsedTime * 1.1) * 0.06;
  });
  return <group ref={ref}>{children}</group>;
}

export default function EquipmentScene({ kind, hue, active, reduced }) {
  const color = `hsl(${hue}, 100%, 60%)`;
  const scale = kind === 'camera' ? 1 : kind === 'sphere' ? 0.95 : 1.05;
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [3.2, 1.6, 4.2], fov: 34 }}
      frameloop={active ? 'always' : 'demand'}
      gl={{ antialias: true, alpha: true, powerPreference: 'default' }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[-4, 2, 3]} intensity={55} color="#00f0ff" distance={18} />
      <pointLight position={[4, 1, -3]} intensity={60} color="#a020ff" distance={18} />
      <pointLight position={[0, 4, 2]} intensity={25} color="#ffffff" distance={14} />
      <Spin reduced={reduced}>
        <group scale={scale}>
          <Model kind={kind} color={color} />
        </group>
      </Spin>
      {/* floor ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.35, 0]}>
        <ringGeometry args={[1.5, 1.52, 64]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.35, 0]}>
        <ringGeometry args={[1.9, 1.91, 64]} />
        <meshBasicMaterial color="#a020ff" toneMapped={false} transparent opacity={0.6} />
      </mesh>
      {!reduced && <Sparkles count={30} scale={[5, 3, 5]} size={2.2} speed={0.3} color={color} />}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={!reduced}
        autoRotateSpeed={1.6}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.9}
        makeDefault
      />
    </Canvas>
  );
}
