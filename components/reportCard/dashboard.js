import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Box, Sphere, Cylinder, OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Sample library data
const sampleLibraries = [
  {
    id: 'lib-1',
    name: 'Central City Library',
    location: 'Downtown District',
    books_count: 45000,
    established_date: '1985',
    description: 'The largest public library serving the metropolitan area with extensive digital collections.',
    max_return_period: '21 days',
    fine_per_day: '$0.50',
    books_allowed: 5,
    standards: ['ALA Certified', 'Digital Access'],
    created_by: 'City Council',
    theme_color: '#4F46E5'
  },
  {
    id: 'lib-2',
    name: 'University Research Hub',
    location: 'Campus North',
    books_count: 120000,
    established_date: '1960',
    description: 'Academic research library specializing in science, technology, and medical resources.',
    max_return_period: '30 days',
    fine_per_day: '$1.00',
    books_allowed: 10,
    standards: ['Research Grade', 'Peer Reviewed'],
    created_by: 'University Board',
    theme_color: '#059669'
  },
  {
    id: 'lib-3',
    name: 'Children\'s Wonder Library',
    location: 'Family District',
    books_count: 15000,
    established_date: '1995',
    description: 'Magical space dedicated to young readers with interactive storytelling areas.',
    max_return_period: '14 days',
    fine_per_day: '$0.25',
    books_allowed: 3,
    standards: ['Child Safe', 'Educational'],
    created_by: 'Education Dept',
    theme_color: '#DC2626'
  }
];

// Floating Book Component
function FloatingBook({ position, color, scale = 1 }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8 + position[0]) * 0.1;
  });

  return (
    <group ref={meshRef} position={position} scale={scale}>
      <Box args={[0.3, 0.4, 0.05]}>
        <meshStandardMaterial color={color} metalness={0.1} roughness={0.8} />
      </Box>
      <Box args={[0.25, 0.35, 0.06]} position={[0, 0, 0.025]}>
        <meshStandardMaterial color="white" />
      </Box>
    </group>
  );
}

// Bookshelf Component
function Bookshelf({ position, booksCount }) {
  const books = useMemo(() => {
    const bookColors = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'];
    return Array.from({ length: Math.min(booksCount / 5000, 12) }, (_, i) => ({
      id: i,
      position: [
        position[0] + (i % 4 - 1.5) * 0.4,
        position[1] + Math.floor(i / 4) * 0.3,
        position[2]
      ],
      color: bookColors[i % bookColors.length],
      scale: 0.8 + Math.random() * 0.4
    }));
  }, [booksCount, position]);

  return (
    <group>
      {/* Shelf structure */}
      <Box args={[2, 0.05, 0.3]} position={[position[0], position[1] - 0.2, position[2]]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>
      <Box args={[2, 0.05, 0.3]} position={[position[0], position[1] + 0.1, position[2]]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>
      <Box args={[2, 0.05, 0.3]} position={[position[0], position[1] + 0.4, position[2]]}>
        <meshStandardMaterial color="#8B4513" />
      </Box>
      
      {/* Books */}
      {books.map((book) => (
        <FloatingBook
          key={book.id}
          position={book.position}
          color={book.color}
          scale={book.scale}
        />
      ))}
    </group>
  );
}

// 3D Library Scene Component
function LibraryScene({ library, isHovered }) {
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
      <Environment preset="sunset" />
      
      {/* Background library building */}
      <Box args={[3, 2, 1]} position={[0, 0, -1]}>
        <meshStandardMaterial color={library.theme_color} opacity={0.3} transparent />
      </Box>
      
      {/* Main bookshelf */}
      <Bookshelf position={[0, 0, 0]} booksCount={library.books_count} />
      
      {/* Floating accent books */}
      <FloatingBook position={[-1.5, 1, 0.5]} color={library.theme_color} scale={0.6} />
      <FloatingBook position={[1.5, 0.8, 0.3]} color="#FFD700" scale={0.7} />
      <FloatingBook position={[0, 1.5, 0.2]} color="#FF6B6B" scale={0.5} />
      
      {/* Decorative spheres (reading lamps) */}
      <Sphere args={[0.1]} position={[-1, 1.2, 0.8]}>
        <meshStandardMaterial color="#FFF" emissive="#FFF" emissiveIntensity={0.3} />
      </Sphere>
      <Sphere args={[0.1]} position={[1, 1.2, 0.8]}>
        <meshStandardMaterial color="#FFF" emissive="#FFF" emissiveIntensity={0.3} />
      </Sphere>
      
      {/* Library name in 3D */}
      <Text
        position={[0, -1.2, 0]}
        fontSize={0.2}
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

// Library Card Component
function LibraryCard({ library, onAction }) {
  const [isHovered, setIsHovered] = useState(false);
  const [activeTab, setActiveTab] = useState('info');

  return (
    <div 
      className="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ background: `linear-gradient(135deg, ${library.theme_color}15 0%, white 50%)` }}
    >
      {/* 3D Scene Header */}
      <div className="h-48 relative overflow-hidden rounded-t-2xl">
        <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <Suspense fallback={null}>
            <LibraryScene library={library} isHovered={isHovered} />
          </Suspense>
        </Canvas>
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        
        {/* Status badge */}
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          Active
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-1">{library.name}</h3>
          <p className="text-sm text-gray-600 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            {library.location}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold" style={{ color: library.theme_color }}>
              {(library.books_count / 1000).toFixed(0)}K
            </div>
            <div className="text-xs text-gray-600">Books</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">{library.books_allowed}</div>
            <div className="text-xs text-gray-600">Limit</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-amber-600">{library.fine_per_day}</div>
            <div className="text-xs text-gray-600">Fine/Day</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-3">
          {['info', 'details', 'actions'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[120px]">
          {activeTab === 'info' && (
            <div className="space-y-2">
              <p className="text-sm text-gray-700">{library.description}</p>
              <div className="flex flex-wrap gap-1 mt-3">
                {library.standards.map((standard, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {standard}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Established:</span>
                <span className="text-sm font-medium">{library.established_date}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Created by:</span>
                <span className="text-sm font-medium">{library.created_by}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Return Period:</span>
                <span className="text-sm font-medium">{library.max_return_period}</span>
              </div>
            </div>
          )}

          {activeTab === 'actions' && (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onAction('defaulters', library)}
                className="p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm font-medium transition-colors"
              >
                📚 Defaulters
              </button>
              <button
                onClick={() => onAction('borrowers', library)}
                className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-colors"
              >
                👥 Borrowers
              </button>
              <button
                onClick={() => onAction('viewBooks', library)}
                className="p-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm font-medium transition-colors"
              >
                📖 View Books
              </button>
              <button
                onClick={() => onAction('analytics', library)}
                className="p-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-sm font-medium transition-colors"
              >
                📊 Analytics
              </button>
            </div>
          )}
        </div>

        {/* Main Actions */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
          <button 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors"
            onClick={() => onAction('view', library)}
          >
            View Details
          </button>
          <button 
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors"
            onClick={() => onAction('edit', library)}
          >
            Edit Library
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Dashboard Component
export default function LibraryDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const handleAction = (action, library) => {
    console.log(`Action: ${action} for library:`, library.name);
    // Implement your action handlers here
  };

  const filteredLibraries = sampleLibraries
    .filter(library => 
      library.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      library.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'books') return b.books_count - a.books_count;
      if (sortBy === 'established') return new Date(a.established_date) - new Date(b.established_date);
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Library Management System</h1>
        <p className="text-gray-600">Manage your library network with immersive 3D visualization</p>
      </div>

      {/* Controls */}
      <div className="mb-8 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4 flex-1 min-w-0">
          <input
            type="text"
            placeholder="Search libraries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="name">Sort by Name</option>
            <option value="books">Sort by Books Count</option>
            <option value="established">Sort by Established Date</option>
          </select>
        </div>
        
        <button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200">
          ➕ Add New Library
        </button>
      </div>

      {/* Library Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredLibraries.map((library) => (
          <LibraryCard
            key={library.id}
            library={library}
            onAction={handleAction}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredLibraries.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No libraries found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
}