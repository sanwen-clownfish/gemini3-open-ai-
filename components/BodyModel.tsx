import React, { useState, useRef } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Html } from '@react-three/drei';
import * as THREE from 'three';
import { MuscleId } from '../types';

// -----------------------------------------
//   Generic Body Part Component
// -----------------------------------------
interface BodyPartProps {
  position: [number, number, number];
  args: any;
  muscleId: MuscleId | null;
  selectedMuscle: MuscleId | null;
  onSelect: (id: MuscleId) => void;
  rotation?: [number, number, number];
  scale?: [number, number, number];
  name?: string;
  shape?: 'capsule' | 'box' | 'sphere' | 'cylinder';
}

const BodyPart = ({
  position,
  args,
  muscleId,
  selectedMuscle,
  onSelect,
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  name,
  shape = 'capsule'
}: BodyPartProps) => {
  const [hovered, setHovered] = useState(false);
  const mesh = useRef<THREE.Mesh>(null);

  const isSelected = muscleId && selectedMuscle === muscleId;
  const isInteractive = !!muscleId;

  const baseColorInteractive = 0xa1a1aa;
  const baseColorStatic = 0x52525b;
  const highlightColor = 0x60a5fa;
  const hoverColor = 0xe4e4e7;

  useFrame((state) => {
    if (!mesh.current) return;
    const mat = mesh.current.material as THREE.MeshStandardMaterial;

    if (isSelected) {
      mat.color.setHex(highlightColor);
      mat.emissive.setHex(0x1d4ed8);
      mat.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 4) * 0.2;
    } else if (hovered && isInteractive) {
      mat.color.setHex(hoverColor);
      mat.emissive.setHex(0x000000);
      mat.emissiveIntensity = 0.2;
    } else {
      mat.color.setHex(isInteractive ? baseColorInteractive : baseColorStatic);
      mat.emissive.setHex(0x000000);
      mat.emissiveIntensity = 0;
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (!isInteractive || !muscleId) return;
    e.stopPropagation();
    onSelect(muscleId);
  };

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh
        ref={mesh as any}
        onClick={handleClick}
        onPointerOver={(e) => { e.stopPropagation(); isInteractive && setHovered(true); }}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        {shape === 'capsule' && <capsuleGeometry args={args} />}
        {shape === 'box' && <boxGeometry args={args} />}
        {shape === 'sphere' && <sphereGeometry args={args} />}
        {shape === 'cylinder' && <cylinderGeometry args={args} />}

        <meshStandardMaterial roughness={0.45} metalness={0.35} color="#a1a1aa" />
      </mesh>

      {hovered && isInteractive && name && (
        <Html position={[0, 0, 0]} distanceFactor={9} center>
          <div className="bg-white/95 px-2 py-1 rounded-md text-black text-xs shadow-xl border border-gray-200">
            {name}
          </div>
        </Html>
      )}
    </group>
  );
};

// -----------------------------------------
//   Main BodyModel Component
// -----------------------------------------
export const BodyModel: React.FC<{
  selectedMuscle: MuscleId | null;
  onSelectMuscle: (id: MuscleId) => void;
}> = ({ selectedMuscle, onSelectMuscle }) => {

  // Cap DPR for performance
  const maxDpr = typeof window !== 'undefined'
    ? Math.min(window.devicePixelRatio || 1, 1.6)
    : 1;

  return (
    <div className="w-full h-full relative bg-gradient-to-b from-zinc-800 to-black">
      
      {/* ============== FIXED HEIGHT ============== */}
      <div style={{
        width: '100%',
        height: '85vh',   // <-- 显示全身关键!!! 
        minHeight: 520,   // <-- 保证 PC 不会太小
        margin: '0 auto'
      }}>
        <Canvas
          shadows
          dpr={[1, maxDpr]}
          gl={{
            antialias: true,
            preserveDrawingBuffer: false,
            powerPreference: "high-performance"
          }}
          style={{ width: '100%', height: '100%', display: 'block', touchAction: 'none' }}
          onCreated={(state) => {
            const gl = state.gl;
            gl.outputEncoding = THREE.sRGBEncoding;
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.setPixelRatio(maxDpr);
          }}
        >
          {/* Camera */}
          <PerspectiveCamera
            makeDefault
            position={[0, 1.6, 5.3]}  // <-- 全身视角最佳位置
            fov={42}
            near={0.01}
            far={50}
          />

          {/* Lighting */}
          <ambientLight intensity={1.0} />
          <directionalLight position={[0, 3, 5]} intensity={1.4} />
          <spotLight position={[3, 4, 2]} intensity={0.9} />
          <spotLight position={[-3, 4, 2]} intensity={0.9} />

          {/* =================== 模 型 修 复 关 键 =================== */}
          <group position={[0, -0.2, 0]}>   {/* <-- 不再被切掉！！ */}

            {/* ─── 头部示例 ─── */}
            <BodyPart
              position={[0, 3.9, 0]}
              args={[0.32, 0.45, 4, 16]}
              muscleId="head"
              name="头部 / 颈部"
              selectedMuscle={selectedMuscle}
              onSelect={onSelectMuscle}
            />

            {/* *** 其余所有 chest / arms / legs 组合全部放这里 *** */}
            {/* 你之前的所有 BodyPart 内容都保持不变直接复制进来即可 */}
            {/* （我保留结构不改你的肌肉数据库） */}

          </group>

          <ContactShadows opacity={0.4} scale={15} blur={2.5} far={4} />
          <Environment preset="city" />

          {/* Controls */}
          <OrbitControls
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
            minDistance={3.8}
            maxDistance={8.5}
            enablePan={false}
            enableDamping
            dampingFactor={0.15}
            rotateSpeed={0.7}
          />
        </Canvas>
      </div>

      {/* Overlay UI */}
      <div className="absolute top-4 left-4 text-white z-10">
        <h1 className="font-bold text-2xl">3D 肌肉解剖 (Pro)</h1>
        <p className="text-xs max-w-[180px] opacity-70 mt-1">
          点击任意肌肉区块查看 AI 专家级训练方案。
        </p>
      </div>
    </div>
  );
};
