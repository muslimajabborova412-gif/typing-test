import { useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { locations, type WorldLocation } from '../data/locations';

function Building({ location, selected, onSelect }: { location: WorldLocation; selected: boolean; onSelect: (id: string) => void }) {
  const [width, height, depth] = location.size;
  const [x, , z] = location.position;
  return (
    <group position={[x, 0, z]} onClick={(event) => { event.stopPropagation(); onSelect(location.id); }} onPointerOver={() => { document.body.style.cursor = 'pointer'; }} onPointerOut={() => { document.body.style.cursor = 'auto'; }}>
      {location.kind === 'park' ? (
        <>
          <mesh position={[0, 0.08, 0]} receiveShadow><boxGeometry args={[width, 0.16, depth]} /><meshStandardMaterial color={selected ? '#70c99a' : '#397953'} /></mesh>
          {[-2.2, 0, 2.2].map((offset) => <Tree key={offset} position={[offset, 0.1, offset % 2 ? 0.8 : -0.8]} />)}
          <mesh position={[0, 0.18, 0]}><boxGeometry args={[0.22, 0.08, depth - 0.5]} /><meshStandardMaterial color="#d8c7a6" /></mesh>
        </>
      ) : (
        <>
          <mesh position={[0, height / 2 + 0.1, 0]} castShadow receiveShadow>
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial color={selected ? '#d9cbff' : location.color} roughness={0.78} />
          </mesh>
          <mesh position={[0, height + 0.2, 0]} castShadow>
            <coneGeometry args={[Math.max(width, depth) * 0.78, 1.25, 4]} />
            <meshStandardMaterial color={location.kind === 'market' ? '#80594b' : '#625a73'} roughness={0.85} />
          </mesh>
          {[-1, 1].map((side) => <mesh key={side} position={[side * width * 0.24, height * 0.58, depth / 2 + 0.015]}><boxGeometry args={[0.68, 0.72, 0.07]} /><meshStandardMaterial color="#536b79" emissive="#273f51" emissiveIntensity={0.25} /></mesh>)}
          <mesh position={[0, 0.75, depth / 2 + 0.045]}><boxGeometry args={[0.78, 1.5, 0.12]} /><meshStandardMaterial color="#634b48" /></mesh>
          <mesh position={[0, height + 0.06, 0]}><boxGeometry args={[width + 0.6, 0.16, depth + 0.6]} /><meshStandardMaterial color="#ead9c5" /></mesh>
        </>
      )}
      {selected && <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[Math.max(width, depth) * 0.58, Math.max(width, depth) * 0.68, 48]} /><meshBasicMaterial color="#c3a6ff" transparent opacity={0.9} /></mesh>}
    </group>
  );
}

function Tree({ position }: { position: [number, number, number] }) {
  return <group position={position}>
    <mesh position={[0, 0.8, 0]} castShadow><cylinderGeometry args={[0.12, 0.18, 1.6, 7]} /><meshStandardMaterial color="#76533b" /></mesh>
    <mesh position={[0, 1.9, 0]} castShadow><icosahedronGeometry args={[0.9, 1]} /><meshStandardMaterial color="#39765b" roughness={0.9} /></mesh>
  </group>;
}

function Lamp({ position }: { position: [number, number, number] }) {
  return <group position={position}>
    <mesh position={[0, 1.1, 0]}><cylinderGeometry args={[0.045, 0.07, 2.2, 8]} /><meshStandardMaterial color="#344054" metalness={0.55} /></mesh>
    <mesh position={[0, 2.25, 0]}><sphereGeometry args={[0.17, 12, 10]} /><meshStandardMaterial color="#ffe7b0" emissive="#ffcf80" emissiveIntensity={1.4} /></mesh>
  </group>;
}

function SceneContents({ selected, onSelect, focusId }: { selected: string; onSelect: (id: string) => void; focusId: string | null }) {
  const { camera } = useThree();
  const controls = useRef<any>(null);

  useEffect(() => {
    if (!focusId) return;
    const target = locations.find((item) => item.id === focusId);
    if (!target) return;
    const [x, , z] = target.position;
    controls.current?.target.set(x, 0, z);
    camera.position.set(x + 18, 19, z + 22);
    controls.current?.update();
  }, [focusId, camera]);

  return <>
    <color attach="background" args={['#101a23']} />
    <fog attach="fog" args={['#101a23', 38, 78]} />
    <ambientLight intensity={1.15} />
    <hemisphereLight args={['#c6d9ff', '#26352d', 1.1]} />
    <directionalLight position={[-12, 22, 14]} intensity={2.2} castShadow shadow-mapSize={[1024, 1024]} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.14, 0]} receiveShadow>
      <planeGeometry args={[200, 200]} /><meshStandardMaterial color="#344b43" roughness={1} />
    </mesh>
    <mesh position={[0, -0.03, -0.3]} receiveShadow><boxGeometry args={[42, 0.16, 5.2]} /><meshStandardMaterial color="#303841" roughness={0.92} /></mesh>
    <mesh position={[0, 0.06, -0.3]}><boxGeometry args={[42, 0.025, 0.12]} /><meshStandardMaterial color="#d7caa8" /></mesh>
    {[-1, 1].map((side) => <mesh key={side} position={[0, 0.015, -0.3 + side * 3.3]} receiveShadow><boxGeometry args={[42, 0.12, 1.25]} /><meshStandardMaterial color="#b9b29f" roughness={0.95} /></mesh>)}
    <mesh position={[0, 0.04, 5.7]} receiveShadow><boxGeometry args={[38, 0.12, 1.5]} /><meshStandardMaterial color="#cabd9c" /></mesh>
    {locations.map((location) => <Building key={location.id} location={location} selected={selected === location.id} onSelect={onSelect} />)}
    {[-16, -8, 0, 8, 16].flatMap((x) => [-3.6, 3.6].map((z) => <Tree key={`${x}-${z}`} position={[x, 0, z]} />))}
    {[-13, -5, 5, 13].flatMap((x) => [-2.7, 2.6].map((z) => <Lamp key={`${x}-${z}`} position={[x, 0, z]} />))}
    <gridHelper args={[50, 50, '#60756b', '#60756b']} position={[0, -0.12, 0]} material-opacity={0.12} material-transparent />
    <OrbitControls ref={controls} makeDefault minDistance={12} maxDistance={58} maxPolarAngle={Math.PI / 2.06} target={[0, 0, 0]} enableDamping dampingFactor={0.08} />
  </>;
}

export default function WorldScene({ selected, onSelect, focusId }: { selected: string; onSelect: (id: string) => void; focusId: string | null }) {
  return <Canvas shadows camera={{ position: [24, 23, 28], fov: 42 }} dpr={[1, 1.7]} gl={{ antialias: true }}>
    <SceneContents selected={selected} onSelect={onSelect} focusId={focusId} />
  </Canvas>;
}
