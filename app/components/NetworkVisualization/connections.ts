import * as THREE from 'three';
import type { NetworkNode, NetworkConnection } from './types';

const CONNECTION_STRENGTHS = {
  strong: { opacity: 0.6, width: 2 },
  medium: { opacity: 0.4, width: 1.5 },
  weak: { opacity: 0.2, width: 1 },
};

export function createConnections(scene: THREE.Scene, nodes: NetworkNode[]): NetworkConnection[] {
  const connections: NetworkConnection[] = [];
  const nodeMap = new Map(nodes.map(node => [node.id, node]));

  // Define connection strengths based on relationships
  const connectionRules = [
    // Strong connections (frequently used together)
    { from: 'react', to: 'typescript', strength: 'strong' as const },
    { from: 'python', to: 'ai-ml', strength: 'strong' as const },
    { from: 'aws', to: 'docker', strength: 'strong' as const },
    { from: 'typescript', to: 'nextjs', strength: 'strong' as const },
    { from: 'ai-ml', to: 'openai', strength: 'strong' as const },
    { from: 'docker', to: 'kubernetes', strength: 'strong' as const },
    { from: 'python', to: 'postgresql', strength: 'strong' as const },
    { from: 'react', to: 'javascript', strength: 'strong' as const },
    { from: 'nodejs', to: 'expressjs', strength: 'strong' as const },
    { from: 'ai-ml', to: 'langchain', strength: 'strong' as const },

    // Medium connections (platform relationships)
    { from: 'aws', to: 'kubernetes', strength: 'medium' as const },
    { from: 'aws', to: 'python', strength: 'medium' as const },
    { from: 'typescript', to: 'nodejs', strength: 'medium' as const },
    { from: 'react', to: 'nextjs', strength: 'medium' as const },
    { from: 'go', to: 'docker', strength: 'medium' as const },
    { from: 'java', to: 'kotlin', strength: 'medium' as const },
    { from: 'graphql', to: 'react', strength: 'medium' as const },
    { from: 'graphql', to: 'nodejs', strength: 'medium' as const },
    { from: 'openai', to: 'langchain', strength: 'medium' as const },
    { from: 'github-actions', to: 'docker', strength: 'medium' as const },
    { from: 'terraform', to: 'aws', strength: 'medium' as const },
    { from: 'azure', to: 'aws', strength: 'medium' as const },
    { from: 'gcp', to: 'aws', strength: 'medium' as const },
    { from: 'jest', to: 'react', strength: 'medium' as const },
    { from: 'jest', to: 'typescript', strength: 'medium' as const },

    // Weak connections (cross-domain skills)
    { from: 'leadership', to: 'mentoring', strength: 'weak' as const },
    { from: 'leadership', to: 'react', strength: 'weak' as const },
    { from: 'leadership', to: 'python', strength: 'weak' as const },
    { from: 'mentoring', to: 'typescript', strength: 'weak' as const },
    { from: 'mentoring', to: 'aws', strength: 'weak' as const },
  ];

  connectionRules.forEach((rule) => {
    const fromNode = nodeMap.get(rule.from);
    const toNode = nodeMap.get(rule.to);

    if (fromNode && toNode) {
      const connection = createConnection(fromNode, toNode, rule.strength);
      if (connection) {
        connections.push(connection);
        scene.add(connection.line);
      }
    }
  });

  return connections;
}

function createConnection(
  fromNode: NetworkNode, 
  toNode: NetworkNode, 
  strength: 'strong' | 'medium' | 'weak'
): NetworkConnection | null {
  const { opacity, width } = CONNECTION_STRENGTHS[strength];

  // Create line geometry
  const points = [
    fromNode.position.clone(),
    toNode.position.clone()
  ];
  
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  
  // Create material with glow effect
  const material = new THREE.LineBasicMaterial({
    color: 0xE5E7EB, // Light gray
    transparent: true,
    opacity: opacity,
    linewidth: width,
  });

  const line = new THREE.Line(geometry, material);
  
  return {
    id: `${fromNode.id}-${toNode.id}`,
    from: fromNode.id,
    to: toNode.id,
    strength,
    line,
    material,
    originalOpacity: opacity,
    shimmerPhase: Math.random() * Math.PI * 2,
  };
} 