// components/LibrarySceneV2.js
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Text, Environment, Cone, Float } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing'; // For post-processing
import * as THREE from 'three';

// Optimized Book Instance - to render many books efficiently
function InstancedBooks({ count, color }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useMemo(() => {
    // Distribute books in a subtle cluster or on an invisible shelf
    for (let i = 0; i < count; i++) {
      dummy.position.set(
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.0,
        (Math.random() - 0.5) * 0.5
      );
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [count, dummy]);

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <boxGeometry args={[0.08, 0.2, 0.03]} /> {/* Smaller, more book-like */}
      <meshStandardMaterial color={color} metalness={0.1} roughness={0.8} />
    </instancedMesh>
  );
}

function LibrarySceneV2({ library, isHovered }) {
  const groupRef = useRef();
  const bookClusterRef = useRef();

  useFrame((state) => {
    // Subtle overall scene rotation
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
      // Slightly lift on hover
      groupRef.current.position.y = isHovered ? THREE.MathUtils.lerp(groupRef.current.position.y, 0.1, 0.1) : THREE.MathUtils.lerp(groupRef.current.position.y, 0, 0.1);
    }

    // Book cluster animation on hover
    if (bookClusterRef.current) {
      bookClusterRef.current.rotation.y += 0.005;
      if (isHovered) {
        bookClusterRef.current.position.z = THREE.MathUtils.lerp(bookClusterRef.current.position.z, 0.5, 0.1);
      } else {
        bookClusterRef.current.position.z = THREE.MathUtils.lerp(bookClusterRef.current.position.z, 0, 0.1);
      }
    }
  });

  // Calculate book display count based on a ratio, e.g., 1 book model for every 5000 books
  const numDisplayedBooks = Math.min(Math.floor(library.books_count / 5000), 50); // Limit to 50 for performance

  return (
    <group ref={groupRef}>
      <Environment preset="night" /> {/* A more dramatic environment */}

      {/* Ambient and directional lights */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />

      {/* Simple library building facade */}
      <Box args={[3.5, 2.5, 0.5]} position={[0, 0, -1]}>
        <meshStandardMaterial color={library.theme_color} opacity={0.2} transparent />
      </Box>
      <Box args={[0.2, 1.5, 0.1]} position={[-1.2, -0.25, -0.7]} rotation={[0, Math.PI / 4, 0]} >
        <meshStandardMaterial color={library.theme_color} /> {/* Pillars / decorative elements */}
      </Box>
      <Box args={[0.2, 1.5, 0.1]} position={[1.2, -0.25, -0.7]} rotation={[0, -Math.PI / 4, 0]} >
        <meshStandardMaterial color={library.theme_color} />
      </Box>

      {/* Dynamic Book Cluster */}
      <group ref={bookClusterRef} position={[0, 0, 0]}>
        <InstancedBooks count={numDisplayedBooks} color={library.theme_color} />
        {/* A large "book" floating near */}
        <Float floatIntensity={0.5} speed={1.5}>
          <Box args={[0.8, 1, 0.1]} position={[0, 1.5, 0.5]} rotation={[0, Math.PI / 8, 0]}>
            <meshStandardMaterial color={library.theme_color} emissive={library.theme_color} emissiveIntensity={0.2} />
          </Box>
        </Float>
      </group>

      {/* Library name in 3D, slightly elevated */}
      <Text
        position={[0, -1.3, 0.2]}
        fontSize={0.2}
        color="white" // Text color stands out better
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        outlineWidth={0.01} // Add outline for definition
        outlineColor={library.theme_color}
      >
        {library.name}
      </Text>

      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} height={300} intensity={0.8} />
      </EffectComposer>
    </group>
  );
}
export default LibrarySceneV2;