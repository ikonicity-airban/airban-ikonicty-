import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface Cyberpunk3DModelProps {
  accentColor: 'green' | 'cyan' | 'pink' | 'purple' | 'yellow';
}

export default function Cyberpunk3DModel({ accentColor }: Cyberpunk3DModelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);

  const colors = {
    green: 0x39ff14,
    cyan: 0x00d4ff,
    pink: 0xff007f,
    purple: 0xbd00ff,
    yellow: 0xffe600,
  };

  const getComplementaryColorVal = (color: typeof accentColor) => {
    switch (color) {
      case 'green': return 0x00d4ff; // cyan
      case 'cyan': return 0x39ff14; // green
      case 'pink': return 0xbd00ff; // purple
      case 'purple': return 0xff007f; // pink
      case 'yellow': return 0xff007f; // pink / magenta looks incredible on yellow
      default: return 0x00d4ff;
    }
  };

  const primaryColor = colors[accentColor] || colors.green;

  // Track cursor position for the parallax look
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Normalize from -0.5 to 0.5
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) - 0.5;
      mouseRef.current.y = ((e.clientY - rect.top) / rect.height) - 0.5;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 400;
    const height = containerRef.current.clientHeight || 400;

    // SCENE, CAMERA, RENDERER
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.5);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true, // transparent background as requested ("dont use a card or background color")
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // LIGHTS
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLightFront = new THREE.DirectionalLight(primaryColor, 4.0);
    dirLightFront.position.set(2, 2, 5);
    scene.add(dirLightFront);

    const dirLightBack = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLightBack.position.set(-2, -2, -5);
    scene.add(dirLightBack);

    const pointLight = new THREE.PointLight(primaryColor, 5.0, 15);
    pointLight.position.set(0, 1.5, 0);
    scene.add(pointLight);

    // Root Group to store models or fallback geometries
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Track Animation Mixer for GLTF
    let mixer: THREE.AnimationMixer | null = null;
    const clock = new THREE.Clock();

    let fallbackGroup: THREE.Group | null = null;
    let gltfScene: THREE.Group | null = null;

    // Load file `/cyberpunk_character.glb`
    const loader = new GLTFLoader();
    
    loader.load(
      '/cyberpunk_character.glb',
      (gltf) => {
        setLoading(false);
        setIsFallback(false);
        gltfScene = gltf.scene;

        // Auto-scale and center the model
        const box = new THREE.Box3().setFromObject(gltfScene);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        
        // Recenter geometry coordinates
        gltfScene.position.x += (gltfScene.position.x - center.x);
        gltfScene.position.y += (gltfScene.position.y - center.y);
        gltfScene.position.z += (gltfScene.position.z - center.z);
        
        // Offset downwards slightly for editorial look
        gltfScene.position.y -= 0.6;

        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 2.45 / maxDim;
        gltfScene.scale.setScalar(scale);

        // Enhance materials
        gltfScene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              mat.roughness = Math.min(mat.roughness, 0.4);
              mat.metalness = Math.max(mat.metalness, 0.8);
            }
          }
        });

        rootGroup.add(gltfScene);

        // Setup animations
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(gltfScene);
          // Prefer 'A-pose' (the user's animation name) or falls back to first track
          const animation = gltf.animations.find(a => a.name === 'A-pose') || gltf.animations[0];
          const action = mixer.clipAction(animation);
          action.play();
        }
      },
      (xhr) => {
        // progress callback if needed
      },
      (err) => {
        // Fallback to high tech 3D wireframe core
        console.warn('Could not load glb, initializing holographic fallback.', err);
        setLoading(false);
        setIsFallback(true);

        fallbackGroup = new THREE.Group();

        // 1. Central Icosahedron glowing core (Hologram look)
        const coreGeo = new THREE.IcosahedronGeometry(0.9, 1);
        const coreMat = new THREE.MeshBasicMaterial({
          color: primaryColor,
          wireframe: true,
          transparent: true,
          opacity: 0.7,
        });
        const coreMesh = new THREE.Mesh(coreGeo, coreMat);
        fallbackGroup.add(coreMesh);

        // 2. Beautiful inner solid core
        const solidCoreGeo = new THREE.BoxGeometry(0.3, 0.3, 0.3);
        const solidCoreMat = new THREE.MeshPhongMaterial({
          color: primaryColor,
          emissive: primaryColor,
          emissiveIntensity: 0.8,
          shininess: 100,
        });
        const solidCore = new THREE.Mesh(solidCoreGeo, solidCoreMat);
        fallbackGroup.add(solidCore);

        // 3. Gyroscopic Orbital Outer Rings (Dual axes)
        const ringGeo1 = new THREE.TorusGeometry(1.6, 0.015, 8, 64);
        const ringMat1 = new THREE.MeshBasicMaterial({
          color: primaryColor,
          transparent: true,
          opacity: 0.4,
        });
        const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
        ring1.rotation.x = Math.PI / 2;
        fallbackGroup.add(ring1);

        const ringGeo2 = new THREE.TorusGeometry(1.4, 0.012, 8, 64);
        const ringMat2 = new THREE.MeshBasicMaterial({
          color: getComplementaryColorVal(accentColor), // Intersecting dual-theme glowing color
          transparent: true,
          opacity: 0.5,
        });
        const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
        ring2.rotation.y = Math.PI / 4;
        fallbackGroup.add(ring2);

        // 4. Matrix Holographic Constellation Particles
        const particleCount = 180;
        const particleGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const scales = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
          // Sphere shell distribution
          const u = Math.random();
          const v = Math.random();
          const theta = u * 2.0 * Math.PI;
          const phi = Math.acos(2.0 * v - 1.0);
          const r = 1.3 + Math.random() * 0.7; // Radius between 1.3 and 2.0

          positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
          positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
          positions[i * 3 + 2] = r * Math.cos(phi);

          scales[i] = Math.random() * 10;
        }

        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        // Circular soft star texture
        const pMat = new THREE.PointsMaterial({
          color: primaryColor,
          size: 0.05,
          transparent: true,
          opacity: 0.8,
          sizeAttenuation: true,
        });

        const particles = new THREE.Points(particleGeo, pMat);
        fallbackGroup.add(particles);

        rootGroup.add(fallbackGroup);
      }
    );

    // Animation Loop
    let animationFrameId: number;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      
      // Keep mixer running if loaded
      if (mixer) {
        mixer.update(delta);
      }

      // Smoothly track mouse cursor for beautiful interactive parallax
      targetRotationY = mouseRef.current.x * 1.5;
      targetRotationX = mouseRef.current.y * 1.5;

      rootGroup.rotation.y += (targetRotationY - rootGroup.rotation.y) * 0.05;
      rootGroup.rotation.x += (targetRotationX - rootGroup.rotation.x) * 0.05;

      // Rotate fallback rings/core independently
      if (fallbackGroup) {
        // Inner core rotates slowly
        fallbackGroup.children[0].rotation.y += 0.01;
        fallbackGroup.children[0].rotation.x += 0.005;

        fallbackGroup.children[1].rotation.x -= 0.02;
        fallbackGroup.children[1].rotation.y -= 0.01;

        // Outer rings rotate oppositely
        fallbackGroup.children[2].rotation.z += 0.008;
        fallbackGroup.children[3].rotation.z -= 0.012;
        fallbackGroup.children[3].rotation.x += 0.005;

        // Rotate particles cloud
        fallbackGroup.children[4].rotation.y += 0.002;
      }

      renderer.render(scene, camera);
    };

    animate();

    // RESIZE OBSERVER
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width: newWidth, height: newHeight } = entries[0].contentRect;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    });

    resizeObserver.observe(containerRef.current);

    // CLEANUP
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      renderer.dispose();
      
      // Dipose items
      scene.clear();
    };
  }, [accentColor, primaryColor]);

  const getAccentHexStr = (color: typeof accentColor) => {
    switch (color) {
      case 'green': return '#39FF14';
      case 'cyan': return '#00D4FF';
      case 'pink': return '#FF007F';
      case 'purple': return '#BD00FF';
      case 'yellow': return '#FFE600';
      default: return '#39FF14';
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[320px] sm:h-[400px] md:h-[480px] flex items-center justify-center overflow-visible select-none"
    >
      {/* 3D Canvas */}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block cursor-grab active:cursor-grabbing z-10" 
      />

      {/* Cyber ambient loading state if downloading */}
      {loading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
          <div 
            className="w-12 h-12 rounded-full border-2 border-white/5 animate-spin mb-4" 
            style={{ borderTopColor: getAccentHexStr(accentColor) }}
          />
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#8A9BC4] animate-pulse">
            CONNECTING CORE_LINK_3D...
          </span>
        </div>
      )}

      {/* Retro HUD text showing loaded system or fallback details */}
      <div className="absolute bottom-1 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none font-mono text-[8px] md:text-[9.5px] text-[#8A9BC4] text-center w-full max-w-[280px] bg-black/40 backdrop-blur-md border border-white/5 py-1.5 px-3 rounded-full flex items-center justify-center gap-1.5 opacity-80 uppercase">
        <span 
          className={`w-1.5 h-1.5 rounded-full ${isFallback ? 'bg-amber-400 animate-pulse' : 'animate-ping'}`} 
          style={{ backgroundColor: isFallback ? undefined : getAccentHexStr(accentColor) }}
        />
        <span>
          {isFallback 
            ? "HOLO_HUD ACTIVE · CUSTOM_GLB_READY" 
            : "RENDERER_ON · CYBERPUNK_MODEL_READY"
          }
        </span>
      </div>

      {/* Floating technical indicators */}
      <div className="absolute top-2 left-2 z-20 font-mono text-[7px] text-[#8A9BC4] opacity-50 flex flex-col pointer-events-none">
        <span>SYS_COORD_LAT: 6.42° N</span>
        <span>SYS_COORD_LONG: 7.50° E</span>
      </div>

      <div className="absolute top-2 right-2 z-20 font-mono text-[7px] text-[#8A9BC4] opacity-50 text-right flex flex-col pointer-events-none">
        <span>3D_MATRIX_DEPTH: 8F</span>
        <span>HOLO_FRAME_CAP: 60FPS</span>
      </div>
    </div>
  );
}
