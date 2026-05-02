import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Text, Edges } from '@react-three/drei';
import * as THREE from 'three';

const Chip = ({ position, label, color = "#202230", status }: { position: [number, number, number], label: string, color?: string, status?: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const isActive = status === 'active' || status === 'secure' || status === 'transmitting';
  const statusColor = status === 'secure' ? '#7000ff' : status === 'transmitting' ? '#ff3333' : '#00f0ff';
  
  return (
    <group position={position}>
      <mesh ref={meshRef} position={[0, 0.25, 0]}>
        <boxGeometry args={[1.2, 0.4, 1.2]} />
        <meshStandardMaterial color={color} roughness={0.1} metalness={0.9} />
        <Edges scale={1} threshold={15} color={isActive ? statusColor : "#444"} />
      </mesh>
      {/* Pins */}
      {[...Array(8)].map((_, i) => (
        <mesh key={i} position={[i < 4 ? -0.7 : 0.7, 0.1, (i % 4) * 0.3 - 0.45]}>
           <boxGeometry args={[0.2, 0.05, 0.1]} />
           <meshStandardMaterial color="#888" metalness={1} />
        </mesh>
      ))}
      <Text 
        position={[0, 0.51, 0]} 
        rotation={[-Math.PI / 2, 0, 0]} 
        fontSize={0.15} 
        font="/fonts/Outfit-Bold.ttf"
        color={isActive ? statusColor : "#888"}
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
      {isActive && (
        <mesh position={[0, 0.2, 0]}>
           <boxGeometry args={[1.3, 0.1, 1.3]} />
           <meshBasicMaterial color={statusColor} transparent opacity={0.1} />
        </mesh>
      )}
    </group>
  );
};

export interface ComponentData {
  id: string;
  type: string;
  position: [number, number, number];
  status?: string;
  part_number?: string;
}

const Board = ({ isDeauthing, components }: { isDeauthing: boolean, components: ComponentData[] }) => {
  const boardRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (boardRef.current) {
      boardRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
      boardRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.1) * 0.02;
    }
  });

  return (
    <group ref={boardRef}>
      {/* Main PCB Board */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[10, 0.2, 8]} />
        <meshStandardMaterial color={isDeauthing ? "#1a0505" : "#050810"} roughness={0.3} metalness={0.7} />
        <Edges scale={1} threshold={15} color={isDeauthing ? "#ff0000" : "#222"} />
      </mesh>

      {/* Grid pattern on board */}
      <gridHelper args={[10, 20, "#111", "#111"]} position={[0, 0.01, 0]} rotation={[0, 0, 0]} />

      {/* Components */}
      {components.map((comp) => (
        <Chip key={comp.id} position={comp.position} label={comp.type} color="#111827" status={comp.status} />
      ))}

      {/* Complex Traces */}
      <group position={[0, 0.02, 0]}>
        {/* Core to NPU */}
        <mesh position={[-1, 0, 0.25]}>
          <boxGeometry args={[2, 0.01, 0.05]} />
          <meshBasicMaterial color={isDeauthing ? "#440000" : "#00f0ff"} transparent opacity={0.6} />
        </mesh>
        {/* NPU to Preciseliens */}
        <mesh position={[1, 0, 0.25]}>
          <boxGeometry args={[0.05, 0.01, 2.5]} />
          <meshBasicMaterial color={isDeauthing ? "#440000" : "#7000ff"} transparent opacity={0.6} />
        </mesh>
        {/* Decorative Vias */}
        {[...Array(20)].map((_, i) => (
          <mesh key={i} position={[Math.sin(i) * 4, 0, Math.cos(i) * 3]}>
             <cylinderGeometry args={[0.05, 0.05, 0.05, 8]} />
             <meshStandardMaterial color="#885500" metalness={1} />
          </mesh>
        ))}
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
