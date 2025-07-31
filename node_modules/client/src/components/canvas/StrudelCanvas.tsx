import React, { useRef, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { useDrop } from 'react-dnd';
import { useWorkspaceStore } from '@stores/workspaceStore';
import type { Block } from '@types';

// Block visual component
const BlockMesh: React.FC<{ block: Block }> = ({ block }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { selectedBlocks } = useWorkspaceStore();
  const isSelected = selectedBlocks.includes(block.id);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.x = block.position.x;
      meshRef.current.position.z = block.position.y; // Map 2D y to 3D z
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 0.5, 1]} />
      <meshStandardMaterial 
        color={isSelected ? '#3b82f6' : '#6b7280'} 
        transparent
        opacity={0.8}
      />
      {/* Block label */}
      <mesh position={[0, 0.3, 0]}>
        <planeGeometry args={[1.5, 0.3]} />
        <meshBasicMaterial color="white" transparent opacity={0.9} />
      </mesh>
    </mesh>
  );
};

// Connection visual component
const ConnectionLine: React.FC<{ from: THREE.Vector3; to: THREE.Vector3 }> = ({ from, to }) => {
  const points = [from, to];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <line>
      <bufferGeometry attach="geometry" {...geometry} />
      <lineBasicMaterial attach="material" color="#3b82f6" linewidth={2} />
    </line>
  );
};

// Main scene component
const Scene: React.FC = () => {
  const { camera } = useThree();
  const { currentProject, canvas } = useWorkspaceStore();

  useEffect(() => {
    if (camera) {
      camera.position.set(canvas.pan.x, 10, canvas.pan.y);
      camera.zoom = canvas.zoom;
      camera.updateProjectionMatrix();
    }
  }, [camera, canvas]);

  if (!currentProject) {
    return (
      <mesh>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial color="#1e293b" opacity={0.5} transparent />
      </mesh>
    );
  }

  return (
    <>
      {/* Grid */}
      <Grid 
        args={[50, 50]} 
        cellSize={1} 
        cellThickness={0.5} 
        cellColor="#334155" 
        sectionSize={5} 
        sectionThickness={1} 
        sectionColor="#475569" 
        fadeDistance={25} 
        fadeStrength={1} 
      />
      
      {/* Ambient lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />

      {/* Render blocks */}
      {currentProject.blocks.map((block) => (
        <BlockMesh key={block.id} block={block} />
      ))}

      {/* Render connections */}
      {currentProject.connections.map((connection) => {
        const sourceBlock = currentProject.blocks.find(b => b.id === connection.source.blockId);
        const targetBlock = currentProject.blocks.find(b => b.id === connection.target.blockId);
        
        if (sourceBlock && targetBlock) {
          const from = new THREE.Vector3(sourceBlock.position.x, 0.5, sourceBlock.position.y);
          const to = new THREE.Vector3(targetBlock.position.x, 0.5, targetBlock.position.y);
          
          return <ConnectionLine key={connection.id} from={from} to={to} />;
        }
        return null;
      })}
    </>
  );
};

// Main canvas component
export const StrudelCanvas: React.FC = () => {
  const { createBlock } = useWorkspaceStore();

  const [, drop] = useDrop({
    accept: 'block-type',
    drop: (item: { type: string }, monitor) => {
      const offset = monitor.getClientOffset();
      if (offset) {
        // Convert screen coordinates to canvas coordinates
        // This is a simplified conversion - would need proper screen-to-world transformation
        const x = (offset.x - window.innerWidth / 2) / 50;
        const y = (offset.y - window.innerHeight / 2) / 50;
        createBlock(item.type, { x, y });
      }
    },
  });

  const handleCanvasClick = useCallback((event: THREE.Event) => {
    // Handle canvas clicks for block selection
    console.log('Canvas clicked:', event);
  }, []);

  return (
    <div ref={drop} className="w-full h-full bg-canvas-bg">
      <Canvas
        camera={{ 
          position: [0, 10, 0], 
          fov: 60, 
          near: 0.1, 
          far: 1000 
        }}
        onClick={handleCanvasClick}
      >
        <Scene />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={0}
        />
      </Canvas>
    </div>
  );
};