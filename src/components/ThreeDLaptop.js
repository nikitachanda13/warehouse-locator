import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Box, Plane, RoundedBox, Text, Html } from '@react-three/drei';
import * as THREE from 'three';

const ThreeDLaptop = () => {
  const laptopRef = useRef();
  const screenRef = useRef();
  const videoRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [videoTexture, setVideoTexture] = useState(null);

  // Create video texture
  useEffect(() => {
    const video = document.createElement('video');
    video.src = 'data:video/mp4;base64,'; // We'll use CSS animation instead
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    
    // Since we can't easily embed a video, we'll create an animated canvas
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 320;
    const ctx = canvas.getContext('2d');
    
    // Create animated content
    let frame = 0;
    const animate = () => {
      // Clear canvas
      ctx.fillStyle = '#0f0f23';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw animated gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, `hsl(${(frame * 2) % 360}, 70%, 50%)`);
      gradient.addColorStop(1, `hsl(${(frame * 2 + 60) % 360}, 70%, 30%)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw warehouse optimization interface
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(20, 20, canvas.width - 40, canvas.height - 40);
      
      // Draw title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('WareFlow Analytics', canvas.width / 2, 60);
      
      // Draw animated bars
      ctx.fillStyle = '#6366f1';
      for (let i = 0; i < 8; i++) {
        const height = Math.abs(Math.sin(frame * 0.1 + i * 0.5)) * 80 + 20;
        ctx.fillRect(60 + i * 50, canvas.height - 80 - height, 30, height);
      }
      
      // Draw map points
      ctx.fillStyle = '#ec4899';
      for (let i = 0; i < 12; i++) {
        const x = 100 + Math.sin(frame * 0.05 + i) * 150 + canvas.width / 2 - 150;
        const y = 120 + Math.cos(frame * 0.07 + i) * 50 + 60;
        const radius = Math.abs(Math.sin(frame * 0.1 + i)) * 8 + 4;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Draw connecting lines
      ctx.strokeStyle = '#4facfe';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < 12; i++) {
        const x = 100 + Math.sin(frame * 0.05 + i) * 150 + canvas.width / 2 - 150;
        const y = 120 + Math.cos(frame * 0.07 + i) * 50 + 60;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      
      // Draw stats text
      ctx.fillStyle = '#ffffff';
      ctx.font = '14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('📊 Real-time Analytics', 30, canvas.height - 50);
      ctx.fillText('🗺️ Interactive Mapping', 30, canvas.height - 30);
      ctx.fillText('⚡ AI-Powered Optimization', 280, canvas.height - 50);
      ctx.fillText('📈 Performance Tracking', 280, canvas.height - 30);
      
      frame++;
      requestAnimationFrame(animate);
    };
    
    animate();
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    setVideoTexture(texture);
    
    videoRef.current = { canvas, ctx, texture };
    
    return () => {
      if (texture) {
        texture.dispose();
      }
    };
  }, []);

  useFrame((state) => {
    if (laptopRef.current) {
      laptopRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
      laptopRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.08;
    }
    
    // Update video texture
    if (videoTexture && videoRef.current) {
      videoTexture.needsUpdate = true;
    }
  });

  return (
    <group 
      ref={laptopRef}
      scale={hovered ? 1.05 : 1}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Laptop Base */}
      <RoundedBox
        args={[4.2, 0.25, 3.2]}
        position={[0, -0.12, 0]}
        radius={0.12}
        smoothness={4}
      >
        <meshStandardMaterial 
          color="#1a1a2e"
          metalness={0.9}
          roughness={0.1}
        />
      </RoundedBox>

      {/* Screen Assembly */}
      <group position={[0, 1.3, -1.3]} rotation={[-0.15, 0, 0]}>
        {/* Screen Frame */}
        <RoundedBox
          args={[4.0, 2.6, 0.12]}
          position={[0, 0, -0.06]}
          radius={0.08}
          smoothness={4}
        >
          <meshStandardMaterial 
            color="#0f0f23"
            metalness={0.95}
            roughness={0.05}
          />
        </RoundedBox>

        {/* Screen Display with Video */}
        <Plane 
          ref={screenRef}
          args={[3.6, 2.2]}
          position={[0, 0, 0.001]}
        >
          {videoTexture ? (
            <meshBasicMaterial
              map={videoTexture}
              toneMapped={false}
            />
          ) : (
            <meshStandardMaterial
              color="#0f0f23"
              emissive="#6366f1"
              emissiveIntensity={0.3}
            />
          )}
        </Plane>

        {/* Screen Reflection */}
        <Plane args={[3.6, 2.2]} position={[0, 0, 0.002]}>
          <meshPhysicalMaterial
            transparent
            opacity={0.1}
            roughness={0}
            metalness={0}
            reflectivity={0.9}
            clearcoat={1}
            clearcoatRoughness={0}
          />
        </Plane>

        {/* Screen Glow Effect */}
        <Plane args={[4.2, 2.8]} position={[0, 0, -0.02]}>
          <meshBasicMaterial
            color="#6366f1"
            transparent
            opacity={0.05}
          />
        </Plane>

        {/* Camera Notch */}
        <Box
          args={[0.08, 0.08, 0.05]}
          position={[0, 1.0, 0.001]}
        >
          <meshStandardMaterial 
            color="#000000"
          />
        </Box>
      </group>

      {/* Keyboard Area */}
      <RoundedBox
        args={[3.4, 0.08, 2.4]}
        position={[0, 0.04, 0.2]}
        radius={0.02}
        smoothness={4}
      >
        <meshStandardMaterial 
          color="#2d3748"
          roughness={0.8}
        />
      </RoundedBox>

      {/* Individual Keys (simplified) */}
      {Array.from({ length: 60 }, (_, i) => {
        const row = Math.floor(i / 12);
        const col = i % 12;
        const x = (col - 5.5) * 0.25;
        const z = (row - 2) * 0.25 + 0.2;
        
        return (
          <Box
            key={i}
            args={[0.18, 0.02, 0.18]}
            position={[x, 0.09, z]}
          >
            <meshStandardMaterial 
              color="#4a5568"
              roughness={0.6}
            />
          </Box>
        );
      })}

      {/* Trackpad */}
      <RoundedBox
        args={[1.4, 0.02, 0.9]}
        position={[0, 0.09, 0.9]}
        radius={0.06}
        smoothness={4}
      >
        <meshStandardMaterial 
          color="#1a1a2e"
          roughness={0.2}
          metalness={0.8}
        />
      </RoundedBox>

      {/* Power LED */}
      <Box
        args={[0.04, 0.01, 0.04]}
        position={[1.8, 0.13, -1.4]}
      >
        <meshStandardMaterial 
          color={hovered ? "#00ff00" : "#666666"}
          emissive={hovered ? "#00ff00" : "#000000"}
          emissiveIntensity={hovered ? 0.5 : 0}
        />
      </Box>

      {/* Ambient Lighting */}
      <pointLight
        position={[0, 3, 2]}
        color="#6366f1"
        intensity={0.3}
        distance={12}
      />
      
      <pointLight
        position={[2, 1, 1]}
        color="#ec4899"
        intensity={0.2}
        distance={8}
      />
    </group>
  );
};

export default ThreeDLaptop;
