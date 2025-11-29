import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

/**
 * A simple placeholder 3D human-like model (a few basic primitives)
 * This ensures the project builds successfully even without external GLTF files.
 */
function HumanPlaceholder() {
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 1, 0]}>
        <capsuleGeometry args={[0.4, 1.6, 8, 16]} />
        <meshStandardMaterial color="#cfcfcf" />
      </mesh>

      {/* Head */}
      <mesh position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="#e0e0e0" />
      </mesh>

      {/* Left Arm */}
      <mesh position={[-0.7, 1.4, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.12, 0.12, 1, 12]} />
        <meshStandardMaterial color="#cfcfcf" />
      </mesh>

      {/* Right Arm */}
      <mesh position={[0.7, 1.4, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.12, 0.12, 1, 12]} />
        <meshStandardMaterial color="#cfcfcf" />
      </mesh>

      {/* Left Leg */}
      <mesh position={[-0.3, 0.1, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 1.2, 12]} />
        <meshStandardMaterial color="#bfbfbf" />
      </mesh>

      {/* Right Leg */}
      <mesh position={[0.3, 0.1, 0]}>
        <cylinderGeometry args={[0.14, 0.14, 1.2, 12]} />
        <meshStandardMaterial color="#bfbfbf" />
      </mesh>
    </group>
  );
}

/** -------------------------------------------
 *  Exported Component
 * ------------------------------------------- */
export const BodyModel = () => {
  return (
    <div style={{ width: "100%", height: "100%", background: "#000" }}>
      <Canvas camera={{ position: [3, 2, 4], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />

        <Suspense fallback={null}>
          <HumanPlaceholder />
        </Suspense>

        <OrbitControls enableZoom={true} />
      </Canvas>
    </div>
  );
};
