import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Text, Edges } from '@react-three/drei';
import * as THREE from 'three';

const Chip = ({ position, label, color = "#202230" }: { position: [number, number, number], label: string, color?: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  return (
    <group position={position}>
      <mesh ref={meshRef} position={[0, 0.25, 0]}>
        <boxGeometry args={[1.5, 0.5, 1.5]} />
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.8} />
        <Edges scale={1} threshold={15} color="#00f0ff" />
      </mesh>
      <Text 
        position={[0, 0.51, 0]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        fontSize={0.2} 
        color="#00f0ff"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
export interface ComponentData {
  id: string;
  type: string;
  position: [number, number, number];
}

const Board = ({ isDeauthing, components }: { isDeauthing: boolean, components: ComponentData[] }) => {
  const boardRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (boardRef.current) {
      boardRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
      boardRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  return (
    <group ref={boardRef}>
      {/* Main PCB Board */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[8, 0.2, 6]} />
        <meshStandardMaterial color={isDeauthing ? "#2a0a0a" : "#0a0f1a"} roughness={0.5} metalness={0.5} />
        <Edges scale={1} threshold={15} color={isDeauthing ? "#ff0000" : "#7000ff"} />
      </mesh>

      {/* Components */}
      {components.map((comp) => (
        <Chip key={comp.id} position={comp.position} label={comp.type} color="#111827" />
      ))}

      {/* Traces */}
      <group position={[0, 0.01, 0]}>
        <mesh position={[-1, 0, -1]}>
          <boxGeometry args={[2, 0.02, 0.1]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>
        <mesh position={[1, 0, 0.25]}>
          <boxGeometry args={[0.1, 0.02, 2.5]} />
          <meshBasicMaterial color="#00f0ff" />
        </mesh>
      </group>
    </group>
  );
};

export default function SchematicViewer({ isDeauthing = false, components = [] }: { isDeauthing?: boolean, components?: ComponentData[] }) {
  return (
    <div className="canvas-container">
      <Canvas camera={{ position: [0, 5, 8], fov: 45 }}>
        <ambientLight intensity={isDeauthing ? 0.2 : 0.5} color={isDeauthing ? "#ff0000" : "#ffffff"} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={isDeauthing ? 5 : 2} color={isDeauthing ? "#ff0000" : "#00f0ff"} />
        <pointLight position={[-10, -10, -10]} intensity={isDeauthing ? 2 : 1} color={isDeauthing ? "#ff0000" : "#7000ff"} />
        
        <Board isDeauthing={isDeauthing} components={components} />
        
        <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={20} blur={2} far={4} />
        <OrbitControls 
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
          minDistance={5}
          maxDistance={15}
        />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
