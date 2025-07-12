import * as THREE from 'three';

export interface NetworkNode {
  id: string;
  name: string;
  type: 'primary' | 'secondary' | 'tertiary';
  mesh: THREE.Mesh;
  position: THREE.Vector3;
  originalPosition: THREE.Vector3;
  scale: number;
  connections: string[];
  category: 'frontend' | 'backend' | 'ai-ml' | 'cloud' | 'leadership';
  color: string;
  glowIntensity: number;
  pulsePhase: number;
}

export interface NetworkConnection {
  id: string;
  from: string;
  to: string;
  strength: 'strong' | 'medium' | 'weak';
  line: THREE.Line;
  material: THREE.LineBasicMaterial;
  originalOpacity: number;
  shimmerPhase: number;
}

export interface SceneState {
  autoRotation: boolean;
  rotationSpeed: number;
  cameraTarget: THREE.Vector3;
  hoveredNodeId: string | null;
  selectedNodeId: string | null;
  animationTime: number;
}

export interface InteractionState {
  mouse: THREE.Vector2;
  raycaster: THREE.Raycaster;
  intersects: THREE.Intersection[];
} 