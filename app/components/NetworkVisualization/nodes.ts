import * as THREE from 'three';
import type { NetworkNode } from './types';

const NODE_DATA = [
  // Primary Nodes (Larger, More Prominent)
  { id: 'react', name: 'React', type: 'primary' as const, category: 'frontend' as const, position: new THREE.Vector3(-3, 2, 0), connections: ['typescript', 'nextjs', 'javascript'] },
  { id: 'python', name: 'Python', type: 'primary' as const, category: 'backend' as const, position: new THREE.Vector3(3, 2, 0), connections: ['ai-ml', 'aws', 'postgresql'] },
  { id: 'aws', name: 'AWS', type: 'primary' as const, category: 'cloud' as const, position: new THREE.Vector3(0, -2, 2), connections: ['docker', 'kubernetes', 'python'] },
  { id: 'typescript', name: 'TypeScript', type: 'primary' as const, category: 'frontend' as const, position: new THREE.Vector3(-2, 0, 3), connections: ['react', 'nextjs', 'nodejs'] },
  { id: 'ai-ml', name: 'AI/ML', type: 'primary' as const, category: 'ai-ml' as const, position: new THREE.Vector3(2, 0, 3), connections: ['python', 'openai', 'langchain'] },

  // Secondary Nodes (Medium Size)
  { id: 'go', name: 'Go', type: 'secondary' as const, category: 'backend' as const, position: new THREE.Vector3(-4, -1, 1), connections: ['docker', 'kubernetes'] },
  { id: 'java', name: 'Java', type: 'secondary' as const, category: 'backend' as const, position: new THREE.Vector3(4, -1, 1), connections: ['kotlin', 'spring'] },
  { id: 'kotlin', name: 'Kotlin', type: 'secondary' as const, category: 'backend' as const, position: new THREE.Vector3(5, 1, -1), connections: ['java', 'android'] },
  { id: 'javascript', name: 'JavaScript', type: 'secondary' as const, category: 'frontend' as const, position: new THREE.Vector3(-5, 1, -1), connections: ['react', 'nodejs'] },
  { id: 'nodejs', name: 'Node.js', type: 'secondary' as const, category: 'backend' as const, position: new THREE.Vector3(-1, -3, 1), connections: ['typescript', 'expressjs'] },
  { id: 'nextjs', name: 'Next.js', type: 'secondary' as const, category: 'frontend' as const, position: new THREE.Vector3(-2, 3, 1), connections: ['react', 'typescript'] },
  { id: 'expressjs', name: 'Express.js', type: 'secondary' as const, category: 'backend' as const, position: new THREE.Vector3(1, -3, 1), connections: ['nodejs', 'javascript'] },
  { id: 'postgresql', name: 'PostgreSQL', type: 'secondary' as const, category: 'backend' as const, position: new THREE.Vector3(3, -1, -2), connections: ['python', 'supabase'] },
  { id: 'docker', name: 'Docker', type: 'secondary' as const, category: 'cloud' as const, position: new THREE.Vector3(-1, 1, -3), connections: ['aws', 'kubernetes'] },
  { id: 'kubernetes', name: 'Kubernetes', type: 'secondary' as const, category: 'cloud' as const, position: new THREE.Vector3(1, 1, -3), connections: ['docker', 'aws'] },
  { id: 'graphql', name: 'GraphQL', type: 'secondary' as const, category: 'backend' as const, position: new THREE.Vector3(0, 4, 0), connections: ['react', 'nodejs'] },
  { id: 'openai', name: 'OpenAI API', type: 'secondary' as const, category: 'ai-ml' as const, position: new THREE.Vector3(4, 1, 2), connections: ['ai-ml', 'langchain'] },
  { id: 'langchain', name: 'LangChain', type: 'secondary' as const, category: 'ai-ml' as const, position: new THREE.Vector3(3, 3, 0), connections: ['ai-ml', 'python'] },

  // Tertiary Nodes (Smaller, Supporting)
  { id: 'github-actions', name: 'GitHub Actions', type: 'tertiary' as const, category: 'cloud' as const, position: new THREE.Vector3(-3, -2, -1), connections: ['docker', 'kubernetes'] },
  { id: 'terraform', name: 'Terraform', type: 'tertiary' as const, category: 'cloud' as const, position: new THREE.Vector3(3, -2, -1), connections: ['aws', 'docker'] },
  { id: 'azure', name: 'Azure', type: 'tertiary' as const, category: 'cloud' as const, position: new THREE.Vector3(-2, -3, 2), connections: ['aws', 'docker'] },
  { id: 'gcp', name: 'GCP', type: 'tertiary' as const, category: 'cloud' as const, position: new THREE.Vector3(2, -3, 2), connections: ['aws', 'kubernetes'] },
  { id: 'jest', name: 'Jest', type: 'tertiary' as const, category: 'frontend' as const, position: new THREE.Vector3(-4, 3, -1), connections: ['react', 'typescript'] },
  { id: 'leadership', name: 'Team Leadership', type: 'tertiary' as const, category: 'leadership' as const, position: new THREE.Vector3(0, 0, -4), connections: ['mentoring'] },
  { id: 'mentoring', name: 'Mentoring', type: 'tertiary' as const, category: 'leadership' as const, position: new THREE.Vector3(0, -4, 0), connections: ['leadership'] },
];

const NODE_COLORS = {
  primary: '#1F2937',    // Dark gray
  secondary: '#6B7280',  // Medium gray
  tertiary: '#9CA3AF',   // Light gray
};

const NODE_SCALES = {
  primary: 1.2,
  secondary: 0.8,
  tertiary: 0.6,
};

export function createNodes(scene: THREE.Scene): NetworkNode[] {
  const nodes: NetworkNode[] = [];
  const geometry = new THREE.SphereGeometry(1, 16, 16);

  NODE_DATA.forEach((nodeData) => {
    const material = new THREE.MeshPhongMaterial({
      color: NODE_COLORS[nodeData.type],
      transparent: true,
      opacity: 0.9,
      shininess: 30,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(nodeData.position);
    mesh.scale.setScalar(NODE_SCALES[nodeData.type]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    // Add userData for raycasting
    mesh.userData = { nodeId: nodeData.id };

    scene.add(mesh);

    nodes.push({
      id: nodeData.id,
      name: nodeData.name,
      type: nodeData.type,
      mesh,
      position: nodeData.position.clone(),
      originalPosition: nodeData.position.clone(),
      scale: NODE_SCALES[nodeData.type],
      connections: nodeData.connections,
      category: nodeData.category,
      color: NODE_COLORS[nodeData.type],
      glowIntensity: 0,
      pulsePhase: Math.random() * Math.PI * 2,
    });
  });

  return nodes;
} 