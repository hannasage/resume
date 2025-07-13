import * as THREE from 'three';
import type { NetworkNode, NetworkConnection } from './types';

interface AnimationState {
  time: number;
  autoRotation: boolean;
  rotationSpeed: number;
  hoveredNodeId: string | null;
}

export function setupAnimations(
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  nodes: NetworkNode[],
  connections: NetworkConnection[]
) {
  const state: AnimationState = {
    time: 0,
    autoRotation: true,
    rotationSpeed: 0.02,
    hoveredNodeId: null,
  };

  function animate() {
    state.time += 0.016; // ~60fps

    // Auto-rotation
    if (state.autoRotation) {
      scene.rotation.y += state.rotationSpeed;
    }

    // Node animations
    nodes.forEach((node) => {
      // Pulsing effect
      const pulseScale = 1 + 0.05 * Math.sin(state.time * 2 + node.pulsePhase);
      node.mesh.scale.setScalar(node.scale * pulseScale);

      // Gentle drift
      const driftX = Math.sin(state.time * 0.5 + node.pulsePhase) * 0.1;
      const driftY = Math.cos(state.time * 0.7 + node.pulsePhase) * 0.1;
      const driftZ = Math.sin(state.time * 0.3 + node.pulsePhase) * 0.1;
      
      node.mesh.position.x = node.originalPosition.x + driftX;
      node.mesh.position.y = node.originalPosition.y + driftY;
      node.mesh.position.z = node.originalPosition.z + driftZ;

      // Hover effects
      if (state.hoveredNodeId === node.id) {
        node.mesh.scale.setScalar(node.scale * 1.2);
        node.glowIntensity = Math.min(node.glowIntensity + 0.1, 1);
      } else {
        node.glowIntensity = Math.max(node.glowIntensity - 0.05, 0);
      }

      // Update material based on glow
      const material = node.mesh.material as THREE.MeshPhongMaterial;
      material.emissive.setHex(0xffffff);
      material.emissiveIntensity = node.glowIntensity * 0.3;
    });

    // Connection animations
    connections.forEach((connection) => {
      // Enhanced shimmer effect
      const shimmer = Math.sin(state.time * 2 + connection.shimmerPhase) * 0.3 + 0.7;
      connection.material.opacity = connection.originalOpacity * shimmer;

      // Highlight connections to hovered node
      if (state.hoveredNodeId && 
          (connection.from === state.hoveredNodeId || connection.to === state.hoveredNodeId)) {
        connection.material.opacity = Math.min(connection.originalOpacity * 1.5, 1);
        connection.material.color.setHex(0x60A5FA); // Bright blue
      } else {
        connection.material.color.setHex(0x93C5FD); // Reset to light blue
      }
    });

    // Camera subtle movement
    const cameraDrift = Math.sin(state.time * 0.3) * 0.5;
    camera.position.y = 5 + cameraDrift;
    camera.lookAt(0, 0, 0);
  }

  function setHoveredNode(nodeId: string | null) {
    state.hoveredNodeId = nodeId;
  }

  function setAutoRotation(enabled: boolean) {
    state.autoRotation = enabled;
  }

  function setRotationSpeed(speed: number) {
    state.rotationSpeed = speed;
  }

  return {
    animate,
    setHoveredNode,
    setAutoRotation,
    setRotationSpeed,
  };
} 