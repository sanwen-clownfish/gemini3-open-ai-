import React, { useState, useRef } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, Html } from '@react-three/drei';
import * as THREE from 'three';
import { MuscleId } from '../types';

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

  const baseColorInteractive = 0xa1a1aa; // Zinc 400 (Silver-ish)
  const baseColorStatic = 0x52525b; // Zinc 600 (Darker Grey)
  const highlightColor = 0x60a5fa; // Blue 400
  const hoverColor = 0xe4e4e7; // Zinc 200 (Almost white)

  useFrame((state) => {
    if (mesh.current) {
      const material = mesh.current.material as THREE.MeshStandardMaterial;

      if (isSelected) {
        material.emissiveIntensity = 0.6 + Math.sin(state.clock.elapsedTime * 4) * 0.2;
        material.color.setHex(highlightColor);
        material.emissive.setHex(0x1d4ed8); // Deep blue glow
      } else if (hovered && isInteractive) {
        material.emissiveIntensity = 0.3;
        material.color.setHex(hoverColor);
        material.emissive.setHex(0x000000);
      } else {
        material.emissiveIntensity = 0;
        material.emissive.setHex(0x000000);
        material.color.setHex(isInteractive ? baseColorInteractive : baseColorStatic);
      }
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (isInteractive && muscleId) {
      e.stopPropagation();
      onSelect(muscleId);
    }
  };
