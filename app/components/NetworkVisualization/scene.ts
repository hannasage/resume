import * as THREE from 'three';

export function createScene(container: HTMLDivElement) {
  // Scene
  const scene = new THREE.Scene();
  scene.background = null; // Transparent background

  // Camera
  const aspect = container.clientWidth / container.clientHeight;
  const camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
  camera.position.set(0, 5, 15);
  camera.lookAt(0, 0, 0);

  // Renderer
  const renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 10, 5);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  scene.add(directionalLight);

  // Add subtle point lights for depth
  const pointLight1 = new THREE.PointLight(0xffffff, 0.3, 20);
  pointLight1.position.set(-10, 5, -10);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0xffffff, 0.3, 20);
  pointLight2.position.set(10, -5, 10);
  scene.add(pointLight2);

  return { scene, camera, renderer };
} 