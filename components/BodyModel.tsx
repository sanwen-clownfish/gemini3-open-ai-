import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

interface BodyModelProps {
  modelPath: string;           // GLB 文件路径
  selectedMuscle?: string | null;
  onSelect?: (muscleId: string) => void;
}

function AutoResize() {
  const { camera, gl, size } = useThree();

  useEffect(() => {
    // 修复比例拉伸 / 模型被裁切问题
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
    gl.setPixelRatio(window.devicePixelRatio);
    gl.setSize(size.width, size.height);
  }, [camera, gl, size]);

  return null;
}

function HumanModel({
  modelPath,
  onSelect,
}: {
  modelPath: string;
  onSelect?: (muscleId: string) => void;
}) {
  const group = useRef<any>();
  const { scene } = useGLTF(modelPath);

  // 允许模型持续旋转（可删）
  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.003;
    }
  });

  // 点击模型部位
  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    const name = e.object.name;
    if (onSelect) onSelect(name);
  };

  return (
    <group ref={group} onPointerDown={handlePointerDown} scale={1.7} position={[0, -1.2, 0]}>
      <primitive object={scene} />
    </group>
  );
}

export default function BodyModel({
  modelPath,
  selectedMuscle,
  onSelect,
}: BodyModelProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh", // ★ 解决模型只显示一部分 / 不显示
        background: "#000",
        overflow: "hidden",
      }}
    >
      <Canvas
        camera={{
          position: [0, 1.5, 6], // ★ 解决被裁切和视角过近
          fov: 40,
          near: 0.1,
          far: 100,
        }}
      >
        <AutoResize />

        {/* ★ 足够亮的灯光，否则会黑屏 */}
        <ambientLight intensity={2.2} />
        <directionalLight position={[5, 10, 5]} intensity={2.5} />
        <directionalLight position={[-5, 10, -5]} intensity={1.2} />

        <HumanModel modelPath={modelPath} onSelect={onSelect} />

        <OrbitControls
          enableZoom={true}
          minDistance={2}
          maxDistance={10}
          enablePan={false}
        />
      </Canvas>
    </div>
  );
}
