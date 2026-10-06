import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Card, CardContent } from '../card/card';
import { Button } from '../button/button';

export default function DashboardHero() {
  const [selectedCategory, setSelectedCategory] = useState('Most Selling');
  const mountRef = useRef(null);

  // Setup Three.js scene
  useEffect(() => {
    const currentMount = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    currentMount.appendChild(renderer.domElement);

    // Basic geometry (replace with your model)
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({ color: 0x0077ff });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    camera.position.z = 3;

    const animate = function () {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      currentMount.removeChild(renderer.domElement);
    };
  }, [selectedCategory]); // You can update the scene based on category

  return (
    <Card className="p-6 shadow-lg rounded-lg border border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
      <CardContent className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
        {/* Three.js Canvas Section */}
        <div ref={mountRef} className="w-full md:w-1/2 h-64 md:h-96 rounded-lg shadow-lg" />
        
        {/* Data & Controls Section */}
        <div className="w-full md:w-1/2 p-4 flex flex-col space-y-4">
          <h2 className="text-3xl font-bold text-blue-700">{selectedCategory}</h2>
          <p className="text-gray-700">
            Highlighting the most selling variant or category. Use the toggles below to explore different segments.
          </p>
          <div className="flex gap-4">
            
            <Button onClick={() => setSelectedCategory('Most Selling')}>Most Selling</Button>
            <Button onClick={() => setSelectedCategory('Categories')}>Categories</Button>
            <Button onClick={() => setSelectedCategory('Variants')}>Variants</Button>
          </div>
          {/* Additional Data Visuals can be integrated here */}
        </div>
      </CardContent>
    </Card>
  );
}
