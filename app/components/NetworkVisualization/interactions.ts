import * as THREE from 'three';
import type { NetworkNode, NetworkConnection } from './types';

interface InteractionHandlers {
  handleMouseMove: (event: MouseEvent) => void;
  handleMouseLeave: () => void;
  handleClick: (event: MouseEvent) => void;
}

export function setupInteractions(
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  nodes: NetworkNode[],
  connections: NetworkConnection[],
  setHoveredNode: (nodeId: string | null) => void
): InteractionHandlers {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };

  function updateMousePosition(event: MouseEvent) {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  function handleMouseMove(event: MouseEvent) {
    updateMousePosition(event);

    // Raycasting for hover detection
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(
      nodes.map(node => node.mesh),
      false
    );

    if (intersects.length > 0) {
      const intersectedMesh = intersects[0].object;
      const nodeId = intersectedMesh.userData.nodeId;
      setHoveredNode(nodeId);
      
      // Change cursor
      renderer.domElement.style.cursor = 'pointer';
    } else {
      setHoveredNode(null);
      renderer.domElement.style.cursor = 'default';
    }

    // Camera orbit on drag
    if (isDragging) {
      const deltaX = event.clientX - previousMousePosition.x;
      const deltaY = event.clientY - previousMousePosition.y;
      
      // Rotate camera around the scene
      const rotationSpeed = 0.01;
      camera.position.x = camera.position.x * Math.cos(deltaX * rotationSpeed) - camera.position.z * Math.sin(deltaX * rotationSpeed);
      camera.position.z = camera.position.x * Math.sin(deltaX * rotationSpeed) + camera.position.z * Math.cos(deltaX * rotationSpeed);
      
      // Vertical rotation (limited)
      const verticalAngle = Math.atan2(camera.position.y, Math.sqrt(camera.position.x * camera.position.x + camera.position.z * camera.position.z));
      const newVerticalAngle = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, verticalAngle - deltaY * rotationSpeed));
      const distance = Math.sqrt(camera.position.x * camera.position.x + camera.position.z * camera.position.z);
      camera.position.y = distance * Math.tan(newVerticalAngle);
      
      camera.lookAt(0, 0, 0);
    }

    previousMousePosition = { x: event.clientX, y: event.clientY };
  }

  function handleMouseLeave() {
    setHoveredNode(null);
    renderer.domElement.style.cursor = 'default';
    isDragging = false;
  }

  function handleClick(event: MouseEvent) {
    updateMousePosition(event);
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(
      nodes.map(node => node.mesh),
      false
    );

    if (intersects.length > 0) {
      const intersectedMesh = intersects[0].object;
      const nodeId = intersectedMesh.userData.nodeId;
      
      // Find the node and create a ripple effect
      const node = nodes.find(n => n.id === nodeId);
      if (node) {
        // Create a ripple effect by temporarily scaling the node
        const originalScale = node.scale;
        node.mesh.scale.setScalar(originalScale * 1.5);
        
        setTimeout(() => {
          node.mesh.scale.setScalar(originalScale);
        }, 200);
      }
    }
  }

  // Add mouse event listeners for dragging
  function handleMouseDown(event: MouseEvent) {
    isDragging = true;
    previousMousePosition = { x: event.clientX, y: event.clientY };
  }

  function handleMouseUp() {
    isDragging = false;
  }

  // Add wheel event for zoom
  function handleWheel(event: WheelEvent) {
    event.preventDefault();
    
    const zoomSpeed = 0.1;
    const zoomDirection = event.deltaY > 0 ? 1 : -1;
    
    // Zoom in/out by moving camera closer/further
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    
    const zoomDistance = zoomDirection * zoomSpeed * 2;
    camera.position.add(direction.multiplyScalar(zoomDistance));
    
    // Clamp zoom distance
    const distance = camera.position.length();
    if (distance < 5) camera.position.setLength(5);
    if (distance > 25) camera.position.setLength(25);
    
    camera.lookAt(0, 0, 0);
  }

  // Add these event listeners to the renderer
  renderer.domElement.addEventListener('mousedown', handleMouseDown);
  renderer.domElement.addEventListener('mouseup', handleMouseUp);
  renderer.domElement.addEventListener('wheel', handleWheel);

  return {
    handleMouseMove,
    handleMouseLeave,
    handleClick,
  };
} 