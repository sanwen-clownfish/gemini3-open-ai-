import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

// Dummy data for muscle part names
const muscleParts = [
  { id: 'upper_chest', name: '上胸 (Upper Chest)', position: [0, 1.8, 0] },
  { id: 'middle_chest', name: '中胸 (Middle Chest)', position: [0.2, 1.6, 0] },
  { id: 'lower_chest', name: '下胸 (Lower Chest)', position: [0, 1.4, 0] },
  { id: 'biceps', name: '肱二头肌 (Biceps)', position: [0.6, 1.5, 0] },
  { id: 'triceps', name: '肱三头肌 (Triceps)', position: [-0.6, 1.5, 0] },
  { id: 'abs', name: '腹部 (Abs)', position: [0, 1.2, 0] },
  { id: 'quads', name: '股四头肌 (Quads)', position: [0.4, 0.2, 0] },
  { id: 'hamstrings', name: '腘绳肌 (Hamstrings)', position: [-0.4, 0.2, 0] },
];

const BodyPart = ({ part, onSelect }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <mesh
      position={part.position}
      onClick={() => onSelect(part.id)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshStandardMaterial
        color={hovered ? '#60a5fa' : '#a1a1aa'}
        emissive={hovered ? '#1d4ed8' : '#000000'}
        emissiveIntensity={0.3}
      />
      {hovered && (
        <Html position={part.position} distanceFactor={10} center>
          <div className="tooltip">{part.name}</div>
        </Html>
      )}
    </mesh>
  );
};

export const BodyModel = () => {
  const [selectedPart, setSelectedPart] = useState(null);

  const handleSelect = (id) => {
    setSelectedPart(id);
  };

  return (
    <div style={{ width: '100%', height: '100vh', background: '#1a1a1a' }}>
      <Canvas camera={{ position: [3, 3, 6], fov: 50 }}>
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" />

        {/* Body Part Meshes */}
        {muscleParts.map((part) => (
          <BodyPart key={part.id} part={part} onSelect={handleSelect} />
        ))}

        {/* Orbit controls */}
        <OrbitControls enableZoom={true} />
      </Canvas>

      {selectedPart && (
        <div style={{ position: 'absolute', top: 20, left: 20, color: 'white' }}>
          <h2>你选择的部位: {muscleParts.find(part => part.id === selectedPart).name}</h2>
          <p>开始专门的训练，增强 {muscleParts.find(part => part.id === selectedPart).name}</p>
        </div>
      )}
    </div>
  );
};
