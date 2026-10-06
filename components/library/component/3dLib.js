import { Box, Environment, Sphere } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

// Reading Table Component
function ReadingTable({ position }) {
 return (
   <group position={position}>
     {/* Table top */}
     <Box args={[0.8, 0.05, 0.5]} position={[0, 0, 0]}>
       <meshStandardMaterial color="#8B4513" />
     </Box>
     {/* Table legs */}
     <Cylinder args={[0.02, 0.02, 0.3]} position={[-0.3, -0.15, -0.2]}>
       <meshStandardMaterial color="#654321" />
     </Cylinder>
     <Cylinder args={[0.02, 0.02, 0.3]} position={[0.3, -0.15, -0.2]}>
       <meshStandardMaterial color="#654321" />
     </Cylinder>
     <Cylinder args={[0.02, 0.02, 0.3]} position={[-0.3, -0.15, 0.2]}>
       <meshStandardMaterial color="#654321" />
     </Cylinder>
     <Cylinder args={[0.02, 0.02, 0.3]} position={[0.3, -0.15, 0.2]}>
       <meshStandardMaterial color="#654321" />
     </Cylinder>
     {/* Open book on table */}
     <Box args={[0.25, 0.01, 0.18]} position={[0, 0.03, 0]} rotation={[0, Math.PI / 6, 0]}>
       <meshStandardMaterial color="#F5F5DC" />
     </Box>
     <Box args={[0.25, 0.01, 0.18]} position={[0, 0.04, 0]} rotation={[0, -Math.PI / 6, 0]}>
       <meshStandardMaterial color="#F5F5DC" />
     </Box>
   </group>
 );
}

// Library Chair Component
function LibraryChair({ position, rotation = [0, 0, 0] }) {
 return (
   <group position={position} rotation={rotation}>
     {/* Seat */}
     <Box args={[0.3, 0.05, 0.3]} position={[0, 0, 0]}>
       <meshStandardMaterial color="#8B4513" />
     </Box>
     {/* Backrest */}
     <Box args={[0.3, 0.4, 0.05]} position={[0, 0.2, -0.125]}>
       <meshStandardMaterial color="#8B4513" />
     </Box>
     {/* Chair legs */}
     <Cylinder args={[0.015, 0.015, 0.25]} position={[-0.12, -0.125, -0.12]}>
       <meshStandardMaterial color="#654321" />
     </Cylinder>
     <Cylinder args={[0.015, 0.015, 0.25]} position={[0.12, -0.125, -0.12]}>
       <meshStandardMaterial color="#654321" />
     </Cylinder>
     <Cylinder args={[0.015, 0.015, 0.25]} position={[-0.12, -0.125, 0.12]}>
       <meshStandardMaterial color="#654321" />
     </Cylinder>
     <Cylinder args={[0.015, 0.015, 0.25]} position={[0.12, -0.125, 0.12]}>
       <meshStandardMaterial color="#654321" />
     </Cylinder>
   </group>
 );
}

// Library Pillar Component
function LibraryPillar({ position, height = 2 }) {
 return (
   <group position={position}>
     <Cylinder args={[0.08, 0.08, height]}>
       <meshStandardMaterial color="#D3D3D3" />
     </Cylinder>
     {/* Pillar capital */}
     <Cylinder args={[0.12, 0.08, 0.1]} position={[0, height/2 + 0.05, 0]}>
       <meshStandardMaterial color="#E5E5E5" />
     </Cylinder>
     {/* Pillar base */}
     <Cylinder args={[0.12, 0.08, 0.1]} position={[0, -height/2 - 0.05, 0]}>
       <meshStandardMaterial color="#E5E5E5" />
     </Cylinder>
   </group>
 );
}

// Information Desk Component
function InformationDesk({ position }) {
 return (
   <group position={position}>
     {/* Desk counter */}
     <Box args={[1.2, 0.08, 0.6]} position={[0, 0, 0]}>
       <meshStandardMaterial color="#8B4513" />
     </Box>
     {/* Desk front panel */}
     <Box args={[1.2, 0.5, 0.05]} position={[0, -0.25, 0.275]}>
       <meshStandardMaterial color="#654321" />
     </Box>
     {/* Computer monitor */}
     <Box args={[0.25, 0.15, 0.05]} position={[0, 0.15, -0.1]}>
       <meshStandardMaterial color="#2C2C2C" />
     </Box>
     {/* Monitor stand */}
     <Cylinder args={[0.03, 0.03, 0.1]} position={[0, 0.05, -0.1]}>
       <meshStandardMaterial color="#2C2C2C" />
     </Cylinder>
   </group>
 );
}

// 3D Library Scene Component
export function LibraryScene({ library, isHovered }) {
 const groupRef = useRef();
 
 useFrame((state) => {
   if (groupRef.current) {
     groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
     if (isHovered) {
       groupRef.current.scale.setScalar(1.05);
     } else {
       groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
     }
   }
 });

 return (
   <group ref={groupRef}>
     <Environment preset="apartment" />
     
     {/* Library floor */}
     <Box args={[4, 0.05, 3]} position={[0, -1, 0]}>
       <meshStandardMaterial color="#F5F5DC" />
     </Box>
     
     {/* Library walls */}
     <Box args={[4, 2.5, 0.1]} position={[0, 0.25, -1.5]}>
       <meshStandardMaterial color="#E6E6FA" opacity={0.8} transparent />
     </Box>
     <Box args={[0.1, 2.5, 3]} position={[-2, 0.25, 0]}>
       <meshStandardMaterial color="#E6E6FA" opacity={0.6} transparent />
     </Box>
     <Box args={[0.1, 2.5, 3]} position={[2, 0.25, 0]}>
       <meshStandardMaterial color="#E6E6FA" opacity={0.6} transparent />
     </Box>
     
     {/* Classical library pillars */}
     <LibraryPillar position={[-1.5, 0.25, -1]} height={2} />
     <LibraryPillar position={[1.5, 0.25, -1]} height={2} />
     
     {/* Main bookshelf wall */}
     {/* <Bookshelf position={[0, -0.3, -1.2]} booksCount={library.books_count} />
     
     <group rotation={[0, Math.PI/2, 0]}>
       <Bookshelf position={[-1.7, -0.3, 0]} booksCount={library.books_count / 3} />
       <Bookshelf position={[1.7, -0.3, 0]} booksCount={library.books_count / 3} />
     </group> */}
     
     {/* Information desk */}
     <InformationDesk position={[0, -0.65, 0.8]} />
     
     {/* Reading area with tables and chairs */}
     <ReadingTable position={[-0.7, -0.65, 0.2]} />
     <LibraryChair position={[-0.7, -0.65, 0.6]} rotation={[0, Math.PI, 0]} />
     <LibraryChair position={[-0.7, -0.65, -0.2]} />
     
     <ReadingTable position={[0.7, -0.65, 0.2]} />
     <LibraryChair position={[0.7, -0.65, 0.6]} rotation={[0, Math.PI, 0]} />
     <LibraryChair position={[0.7, -0.65, -0.2]} />
     
     {/* Ceiling lights */}
     <Sphere args={[0.08]} position={[-0.7, 1, 0.2]}>
       <meshStandardMaterial color="#FFF" emissive="#FFFACD" emissiveIntensity={0.5} />
     </Sphere>
     <Sphere args={[0.08]} position={[0.7, 1, 0.2]}>
       <meshStandardMaterial color="#FFF" emissive="#FFFACD" emissiveIntensity={0.5} />
     </Sphere>
     <Sphere args={[0.08]} position={[0, 1, 0.8]}>
       <meshStandardMaterial color="#FFF" emissive="#FFFACD" emissiveIntensity={0.5} />
     </Sphere>
     
     {/* Floating magical books (library atmosphere) */}
     <FloatingBook position={[-1.2, 0.5, 0.5]} color={library.theme_color} scale={0.4} />
     <FloatingBook position={[1.2, 0.3, 0.3]} color="#FFD700" scale={0.5} />
     <FloatingBook position={[0, 0.8, 0.2]} color="#FF6B6B" scale={0.3} />
     
     {/* Library entrance archway */}
     <Box args={[1, 0.15, 0.1]} position={[0, 0.8, 1.45]}>
       <meshStandardMaterial color="#D3D3D3" />
     </Box>
     <Box args={[0.1, 1, 0.1]} position={[-0.5, 0.25, 1.45]}>
       <meshStandardMaterial color="#D3D3D3" />
     </Box>
     <Box args={[0.1, 1, 0.1]} position={[0.5, 0.25, 1.45]}>
       <meshStandardMaterial color="#D3D3D3" />
     </Box>
     
     {/* Library name plaque */}
     <Text
       position={[0, -1.4, 0]}
       fontSize={0.15}
       color={library.theme_color}
       anchorX="center"
       anchorY="middle"
       font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
     >
       {library.name}
     </Text>
   </group>
 );
}