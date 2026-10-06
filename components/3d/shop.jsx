// import { Canvas, useThree } from "@react-three/fiber";
// import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei";
// import { useRef, useEffect } from "react";
// import * as THREE from "three";

// function IceCreamShop() {
//   const { scene, animations } = useGLTF("./models/untitled.glb");
//   const { actions } = useAnimations(animations, scene);

//   scene.traverse((child) => {
//     if (child.isMesh) {
//       child.userData.selectable = true;
//     }
//   });

//   // Center the model
//   const box = new THREE.Box3().setFromObject(scene);
//   const center = box.getCenter(new THREE.Vector3());
//   scene.position.sub(center);

//   return <primitive object={scene} scale={0.58} />;
// }

// function RaycasterComponent({ onObjectClick }) {
//   const { camera, scene, gl } = useThree();
//   const raycaster = useRef(new THREE.Raycaster());
//   const mouse = useRef(new THREE.Vector2());

//   const handleClick = (event) => {
//     mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
//     mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

//     raycaster.current.setFromCamera(mouse.current, camera);
//     const intersects = raycaster.current.intersectObjects(scene.children, true);

//     if (intersects.length > 0) {
//       const clickedObject = intersects[0].object;
      
//       if (clickedObject.userData.selectable) {
//         console.log("Clicked on:", clickedObject.name || "Unnamed Object");
//         if (onObjectClick) onObjectClick(clickedObject);
//       }
//     }
//   };

//   useThree(({ gl }) => {
//     gl.domElement.addEventListener("click", handleClick);
//     return () => gl.domElement.removeEventListener("click", handleClick);
//   });

//   return null;
// }

// function CameraAnimation() {
//   const { camera } = useThree();
//   const startPosition = new THREE.Vector3(0, 5, 10);
//   const endPosition = new THREE.Vector3(0, 2, 5);
//   const duration = 2000; // 2 seconds

//   useEffect(() => {
//     camera.position.copy(startPosition);
//     const startTime = performance.now();

//     const animate = (time) => {
//       const elapsed = time - startTime;
//       const t = Math.min(elapsed / duration, 1);
//       camera.position.lerpVectors(startPosition, endPosition, t);
//       camera.lookAt(0, 2, 0);
//       if (t < 1) requestAnimationFrame(animate);
//     };

//     requestAnimationFrame(animate);
//   }, [camera]);

//   return null;
// }

// export default function ShopScene() {
//   const handleObjectClick = (object) => {
//     console.log(`Clicked on: ${object.name}`);

//     // Play animations based on the clicked object
//     switch (object.name) {
//       case "Door":
//         actions["OpenDoor"]?.reset().play().setLoop(THREE.LoopOnce);
//         break;
//       case "CashRegister":
//         actions["OpenRegister"]?.reset().play().setLoop(THREE.LoopOnce);
//         break;
//       default:
//         console.log(`No animation found for ${object.name}`);
//     }
//   };

//   return (
//     <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
//       <ambientLight intensity={0.5} />
//       <directionalLight position={[2, 5, 2]} />
//       <IceCreamShop />
//       <RaycasterComponent onObjectClick={handleObjectClick} />
//       <CameraAnimation />
//       <OrbitControls />
//     </Canvas>
//   );
// }