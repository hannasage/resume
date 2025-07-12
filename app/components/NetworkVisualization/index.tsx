'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface NetworkVisualizationProps {
  className?: string;
}

interface NetworkNode {
  id: string;
  name: string;
  type: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
  position: THREE.Vector3;
  mesh: THREE.Mesh;
  connections: string[];
}

export default function NetworkVisualization({ className = '' }: NetworkVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    console.log('NetworkVisualization useEffect triggered');
    
    if (!containerRef.current) {
      console.log('Container ref not available');
      return;
    }

    const container = containerRef.current;
    console.log('Container found, initializing network visualization...');

    try {
      // Scene
      const scene = new THREE.Scene();
      scene.background = null;

      // Get container dimensions
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      // Camera
      const aspectRatio = containerWidth / containerHeight;
      const camera = new THREE.PerspectiveCamera(60, aspectRatio, 0.1, 1000);
      camera.position.set(0, 0, 25);

      // Renderer
      const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance"
      });
      
      renderer.setSize(containerWidth, containerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
      console.log('Renderer added to container with size:', containerWidth, 'x', containerHeight);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(10, 10, 5);
      scene.add(directionalLight);

      // Create network nodes
      const nodes: NetworkNode[] = [];
      
      // Primary nodes (core skills)
      const primaryNodes = [
        { id: 'react', name: 'React', position: new THREE.Vector3(-6, 4, 0) },
        { id: 'python', name: 'Python', position: new THREE.Vector3(6, 4, 0) },
        { id: 'aws', name: 'AWS', position: new THREE.Vector3(0, -6, 0) },
        { id: 'ai', name: 'AI/ML', position: new THREE.Vector3(0, 6, 0) },
        { id: 'typescript', name: 'TypeScript', position: new THREE.Vector3(-8, 0, 0) },
        { id: 'nodejs', name: 'Node.js', position: new THREE.Vector3(8, 0, 0) }
      ];

      // Secondary nodes
      const secondaryNodes = [
        { id: 'docker', name: 'Docker', position: new THREE.Vector3(-4, -8, 0) },
        { id: 'kubernetes', name: 'Kubernetes', position: new THREE.Vector3(4, -8, 0) },
        { id: 'langchain', name: 'LangChain', position: new THREE.Vector3(-3, 8, 0) },
        { id: 'postgresql', name: 'PostgreSQL', position: new THREE.Vector3(3, 8, 0) },
        { id: 'nextjs', name: 'Next.js', position: new THREE.Vector3(-7, -3, 0) },
        { id: 'express', name: 'Express', position: new THREE.Vector3(7, -3, 0) },
        { id: 'graphql', name: 'GraphQL', position: new THREE.Vector3(-6, 7, 0) },
        { id: 'terraform', name: 'Terraform', position: new THREE.Vector3(6, 7, 0) },
        { id: 'go', name: 'Go', position: new THREE.Vector3(-10, 2, 0) },
        { id: 'java', name: 'Java', position: new THREE.Vector3(10, 2, 0) },
        { id: 'kotlin', name: 'Kotlin', position: new THREE.Vector3(10, -2, 0) },
        { id: 'supabase', name: 'Supabase', position: new THREE.Vector3(2, 10, 0) }
      ];

      // Tertiary nodes
      const tertiaryNodes = [
        { id: 'azure', name: 'Azure', position: new THREE.Vector3(-2, -10, 0) },
        { id: 'gcp', name: 'GCP', position: new THREE.Vector3(2, -10, 0) },
        { id: 'huggingface', name: 'Hugging Face', position: new THREE.Vector3(-4, 9, 0) },
        { id: 'openai', name: 'OpenAI API', position: new THREE.Vector3(4, 9, 0) },
        { id: 'pandas', name: 'Pandas', position: new THREE.Vector3(-3, 10, 0) },
        { id: 'numpy', name: 'NumPy', position: new THREE.Vector3(3, 10, 0) },
        { id: 'git', name: 'Git', position: new THREE.Vector3(-8, -4, 0) },
        { id: 'github', name: 'GitHub', position: new THREE.Vector3(8, -4, 0) },
        { id: 'jest', name: 'Jest', position: new THREE.Vector3(-7, 5, 0) },
        { id: 'cypress', name: 'Cypress', position: new THREE.Vector3(7, 5, 0) },
        { id: 'tailwind', name: 'Tailwind CSS', position: new THREE.Vector3(-6, -5, 0) },
        { id: 'framer', name: 'Framer Motion', position: new THREE.Vector3(6, -5, 0) },
        { id: 'redis', name: 'Redis', position: new THREE.Vector3(-2, 11, 0) },
        { id: 'mongodb', name: 'MongoDB', position: new THREE.Vector3(2, 11, 0) }
      ];

      // Quaternary nodes (additional skills)
      const quaternaryNodes = [
        { id: 'vite', name: 'Vite', position: new THREE.Vector3(-12, 3, 0) },
        { id: 'webpack', name: 'Webpack', position: new THREE.Vector3(12, 3, 0) },
        { id: 'eslint', name: 'ESLint', position: new THREE.Vector3(-12, 1, 0) },
        { id: 'prettier', name: 'Prettier', position: new THREE.Vector3(12, 1, 0) },
        { id: 'storybook', name: 'Storybook', position: new THREE.Vector3(-10, -3, 0) },
        { id: 'playwright', name: 'Playwright', position: new THREE.Vector3(10, -3, 0) },
        { id: 'prisma', name: 'Prisma', position: new THREE.Vector3(-3, 12, 0) },
        { id: 'typeorm', name: 'TypeORM', position: new THREE.Vector3(3, 12, 0) },
        { id: 'socketio', name: 'Socket.io', position: new THREE.Vector3(-4, 11, 0) },
        { id: 'websocket', name: 'WebSocket', position: new THREE.Vector3(4, 11, 0) },
        { id: 'jwt', name: 'JWT', position: new THREE.Vector3(-7, 6, 0) },
        { id: 'oauth', name: 'OAuth', position: new THREE.Vector3(7, 6, 0) },
        { id: 'stripe', name: 'Stripe', position: new THREE.Vector3(-8, 7, 0) },
        { id: 'paypal', name: 'PayPal API', position: new THREE.Vector3(8, 7, 0) },
        { id: 'sentry', name: 'Sentry', position: new THREE.Vector3(-5, 9, 0) },
        { id: 'datadog', name: 'Datadog', position: new THREE.Vector3(5, 9, 0) },
        { id: 'jenkins', name: 'Jenkins', position: new THREE.Vector3(-9, -6, 0) },
        { id: 'circleci', name: 'CircleCI', position: new THREE.Vector3(9, -6, 0) },
        { id: 'nginx', name: 'Nginx', position: new THREE.Vector3(-7, -7, 0) },
        { id: 'apache', name: 'Apache', position: new THREE.Vector3(7, -7, 0) }
      ];

      // Create all nodes
      [...primaryNodes, ...secondaryNodes, ...tertiaryNodes, ...quaternaryNodes].forEach((nodeData) => {
        let size, color;
        
        if (primaryNodes.some(n => n.id === nodeData.id)) {
          size = 1.0;
          color = 0x1F2937; // Dark gray
        } else if (secondaryNodes.some(n => n.id === nodeData.id)) {
          size = 0.7;
          color = 0x6B7280; // Medium gray
        } else if (tertiaryNodes.some(n => n.id === nodeData.id)) {
          size = 0.5;
          color = 0x9CA3AF; // Light gray
        } else {
          size = 0.4;
          color = 0xD1D5DB; // Very light gray
        }
        
        const geometry = new THREE.SphereGeometry(size, 16, 16);
        const material = new THREE.MeshPhongMaterial({ 
          color,
          transparent: true,
          opacity: 0.8
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(nodeData.position);
        
        scene.add(mesh);
        nodes.push({
          id: nodeData.id,
          name: nodeData.name,
          type: primaryNodes.some(n => n.id === nodeData.id) ? 'primary' : 
                secondaryNodes.some(n => n.id === nodeData.id) ? 'secondary' : 
                tertiaryNodes.some(n => n.id === nodeData.id) ? 'tertiary' : 'quaternary',
          position: nodeData.position,
          mesh,
          connections: []
        });
      });

      // Create connections between related nodes
      const connections: THREE.Line[] = [];
      
      // React ecosystem
      createConnection(nodes, 'react', 'typescript', scene, connections);
      createConnection(nodes, 'react', 'nextjs', scene, connections);
      createConnection(nodes, 'react', 'nodejs', scene, connections);
      createConnection(nodes, 'react', 'tailwind', scene, connections);
      createConnection(nodes, 'react', 'framer', scene, connections);
      createConnection(nodes, 'react', 'jest', scene, connections);
      createConnection(nodes, 'react', 'cypress', scene, connections);
      createConnection(nodes, 'react', 'storybook', scene, connections);
      createConnection(nodes, 'react', 'playwright', scene, connections);
      
      // TypeScript ecosystem
      createConnection(nodes, 'typescript', 'eslint', scene, connections);
      createConnection(nodes, 'typescript', 'prettier', scene, connections);
      createConnection(nodes, 'typescript', 'webpack', scene, connections);
      createConnection(nodes, 'typescript', 'vite', scene, connections);
      
      // Backend connections
      createConnection(nodes, 'python', 'aws', scene, connections);
      createConnection(nodes, 'python', 'ai', scene, connections);
      createConnection(nodes, 'python', 'pandas', scene, connections);
      createConnection(nodes, 'python', 'numpy', scene, connections);
      createConnection(nodes, 'python', 'huggingface', scene, connections);
      createConnection(nodes, 'python', 'openai', scene, connections);
      
      createConnection(nodes, 'nodejs', 'express', scene, connections);
      createConnection(nodes, 'nodejs', 'postgresql', scene, connections);
      createConnection(nodes, 'nodejs', 'mongodb', scene, connections);
      createConnection(nodes, 'nodejs', 'redis', scene, connections);
      createConnection(nodes, 'nodejs', 'socketio', scene, connections);
      createConnection(nodes, 'nodejs', 'websocket', scene, connections);
      createConnection(nodes, 'nodejs', 'jwt', scene, connections);
      createConnection(nodes, 'nodejs', 'oauth', scene, connections);
      
      // Infrastructure connections
      createConnection(nodes, 'aws', 'docker', scene, connections);
      createConnection(nodes, 'aws', 'kubernetes', scene, connections);
      createConnection(nodes, 'aws', 'terraform', scene, connections);
      createConnection(nodes, 'aws', 'nginx', scene, connections);
      createConnection(nodes, 'aws', 'apache', scene, connections);
      
      createConnection(nodes, 'docker', 'kubernetes', scene, connections);
      createConnection(nodes, 'docker', 'jenkins', scene, connections);
      createConnection(nodes, 'docker', 'circleci', scene, connections);
      
      createConnection(nodes, 'azure', 'docker', scene, connections);
      createConnection(nodes, 'gcp', 'docker', scene, connections);
      
      // AI connections
      createConnection(nodes, 'ai', 'langchain', scene, connections);
      createConnection(nodes, 'ai', 'huggingface', scene, connections);
      createConnection(nodes, 'ai', 'openai', scene, connections);
      createConnection(nodes, 'ai', 'pandas', scene, connections);
      createConnection(nodes, 'ai', 'numpy', scene, connections);
      
      // Database connections
      createConnection(nodes, 'postgresql', 'supabase', scene, connections);
      createConnection(nodes, 'postgresql', 'prisma', scene, connections);
      createConnection(nodes, 'postgresql', 'typeorm', scene, connections);
      createConnection(nodes, 'mongodb', 'redis', scene, connections);
      
      // Development tools
      createConnection(nodes, 'git', 'github', scene, connections);
      createConnection(nodes, 'github', 'jenkins', scene, connections);
      createConnection(nodes, 'github', 'circleci', scene, connections);
      
      // Additional connections
      createConnection(nodes, 'typescript', 'graphql', scene, connections);
      createConnection(nodes, 'go', 'docker', scene, connections);
      createConnection(nodes, 'java', 'kubernetes', scene, connections);
      createConnection(nodes, 'kotlin', 'java', scene, connections);
      createConnection(nodes, 'stripe', 'paypal', scene, connections);
      createConnection(nodes, 'sentry', 'datadog', scene, connections);
      createConnection(nodes, 'nextjs', 'tailwind', scene, connections);
      createConnection(nodes, 'express', 'graphql', scene, connections);

      console.log('Network created with', nodes.length, 'nodes and', connections.length, 'connections');

      // Animation loop
      let time = 0;
      const animate = () => {
        requestAnimationFrame(animate);
        time += 0.01;

        // Animate nodes
        nodes.forEach((node, index) => {
          // Gentle floating motion
          node.mesh.position.y += Math.sin(time + index) * 0.003;
          node.mesh.position.x += Math.cos(time * 0.5 + index) * 0.002;
          
          // Pulsing effect
          const scale = 1 + Math.sin(time * 2 + index) * 0.15;
          node.mesh.scale.setScalar(scale);
          
          // Rotation
          node.mesh.rotation.x += 0.003;
          node.mesh.rotation.y += 0.003;
        });

        // Animate connections
        connections.forEach((connection, index) => {
          const material = connection.material as THREE.LineBasicMaterial;
          material.opacity = 0.2 + Math.sin(time * 3 + index) * 0.3;
        });

        // Rotate entire scene back and forth 30 degrees
        const rotationRange = Math.PI / 6; // 30 degrees
        const rotationSpeed = 0.05; // Very slow, subtle rotation
        scene.rotation.y = Math.sin(time * rotationSpeed) * rotationRange;

        renderer.render(scene, camera);
      };

      animate();
      console.log('Animation started');
      setIsLoaded(true);
      console.log('Network visualization initialized successfully');
      
    } catch (err) {
      console.error('Error initializing network visualization:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, []);

  const createConnection = (
    nodes: NetworkNode[], 
    fromId: string, 
    toId: string, 
    scene: THREE.Scene, 
    connections: THREE.Line[]
  ) => {
    const fromNode = nodes.find(n => n.id === fromId);
    const toNode = nodes.find(n => n.id === toId);
    
    if (fromNode && toNode) {
      const geometry = new THREE.BufferGeometry().setFromPoints([
        fromNode.position,
        toNode.position
      ]);
      
      const material = new THREE.LineBasicMaterial({ 
        color: 0x9CA3AF,
        transparent: true,
        opacity: 0.2
      });
      
      const line = new THREE.Line(geometry, material);
      scene.add(line);
      connections.push(line);
      
      fromNode.connections.push(toId);
      toNode.connections.push(fromId);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full ${className}`}
    >
      {/* Loading overlay */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
        </div>
      )}
      
      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-full">
          <div className="text-red-600 text-sm text-center">
            <div>Error loading visualization</div>
            <div className="text-xs mt-1">{error}</div>
          </div>
        </div>
      )}
    </div>
  );
} 