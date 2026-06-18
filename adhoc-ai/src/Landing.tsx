import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// 3D Animated glowing energy core with nested meshes
function AICore() {
    const meshRef = useRef<THREE.Mesh>(null);
    const coreRef = useRef<THREE.Mesh>(null);

    // Animate rotations and scales over time to feel alive
    useFrame((state) => {
        const elapsed = state.clock.getElapsedTime();
        if (meshRef.current) {
            meshRef.current.rotation.x = elapsed * 0.15;
            meshRef.current.rotation.y = elapsed * 0.25;
            // Pulsing scale effect for the distort outer mesh
            const pulse = 1.9 + Math.sin(elapsed * 2.0) * 0.1;
            meshRef.current.scale.setScalar(pulse);
        }
        if (coreRef.current) {
            coreRef.current.rotation.y = -elapsed * 0.4;
            // Inner core breathing scale
            const corePulse = 0.55 + Math.sin(elapsed * 4.0) * 0.05;
            coreRef.current.scale.setScalar(corePulse);
        }
    });

    return (
        <group>
            {/* Central Solid Power Core */}
            <Sphere ref={coreRef} args={[0.5, 32, 32]}>
                <meshBasicMaterial color="#FF7A18" toneMapped={false} />
            </Sphere>

            {/* Middle energy wireframe sphere */}
            <Sphere args={[0.85, 32, 32]}>
                <meshBasicMaterial color="#E879F9" transparent opacity={0.25} wireframe={true} toneMapped={false} />
            </Sphere>

            {/* Distorting interactive wireframe mesh */}
            <Sphere ref={meshRef} args={[1.0, 64, 64]} scale={1.9}>
                <MeshDistortMaterial
                    color="#D946EF"
                    emissive="#8B5CF6"
                    emissiveIntensity={2.0}
                    attach="material"
                    distort={0.45}
                    speed={2.2}
                    roughness={0.1}
                    metalness={0.9}
                    wireframe={true}
                />
            </Sphere>
        </group>
    );
}

export default function Landing({ onEnter }: { onEnter: () => void }) {
    return (
        <div className="min-h-screen text-white overflow-hidden relative font-sans bg-[#05010d]">
            
            {/* Centered Radial Gradient Background for Hero Section with Blending */}
            <div 
                className="absolute inset-0 pointer-events-none -z-20"
                style={{
                    background: 'radial-gradient(circle at 35% 50%, rgba(217, 70, 239, 0.16) 0%, rgba(139, 92, 246, 0.08) 45%, rgba(5, 1, 13, 1) 100%)'
                }}
            />
            
            {/* DEEP-ILLUMINATION BACKLIGHTING HALOS */}
            {/* Primary center-right glow halo backing the entire content layer */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gradient-to-r from-fuchsia-500/20 via-violet-600/20 to-orange-500/10 rounded-full blur-[160px] pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '9s' }}></div>
            {/* Soft cyan atmospheric light on upper-left to frame the header */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none -z-10"></div>
            {/* Deep violet/magenta back glow specifically behind the text block */}
            <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-purple-700/10 rounded-full blur-[150px] pointer-events-none -z-10"></div>

            {/* FAINT TECH GRID AT BOTTOM */}
            <div className="absolute bottom-0 left-0 w-full h-[350px] bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_top,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:45px_45px] [mask-image:radial-gradient(ellipse_at_bottom,white_30%,transparent_75%)] pointer-events-none -z-10"></div>

            {/* ILLUMINATED TOP NAVIGATION */}
            <nav className="fixed top-0 w-full h-20 bg-glass/60 backdrop-blur-xl z-50 flex items-center justify-between px-8 md:px-16 border-b border-white/5">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(255,255,255,0.45)]">
                    ADhoc.ai
                </h1>
                <div className="space-x-4 text-sm font-medium text-gray-400 hidden md:flex">
                    <a href="#" className="px-4 py-2 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/5 hover:text-white">Features</a>
                    <a href="#" className="px-4 py-2 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/5 hover:text-white">AI Agents</a>
                    <a href="#" className="px-4 py-2 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/5 hover:text-white">Architecture</a>
                </div>
                <button
                    onClick={onEnter}
                    className="border border-white/20 hover:border-white/60 text-white hover:bg-white/5 hover:scale-[1.02] px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 bg-white/5 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                >
                    Dashboard Login
                </button>
            </nav>

            {/* HERO SCENE */}
            <div className="container mx-auto px-8 md:px-16 h-screen flex flex-col md:flex-row items-center pt-20">

                {/* Left Side Content - Central Text Block (Higher z-index layer) */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="w-full md:w-1/2 z-10"
                >
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight mb-6">
                        Voice AI for the <br />
                        <span className="bg-gradient-to-r from-purple-400 via-orange-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(168,85,247,0.55)]">
                            Future
                        </span> of Education
                    </h1>
                    <p className="text-lg text-gray-300 mb-8 max-w-lg font-light leading-relaxed">
                        Transform admissions, counselling, placements, and student engagement with enterprise-grade conversational AI.
                    </p>
                    <div className="flex space-x-5">
                        <button 
                            onClick={onEnter}
                            className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-300 hover:scale-[1.04] drop-shadow-[0_0_20px_rgba(249,115,22,0.65)] hover:drop-shadow-[0_0_30px_rgba(249,115,22,0.9)]"
                        >
                            Book a Demo
                        </button>
                        <button className="bg-white/5 hover:bg-white/10 border border-cyan-400 text-cyan-300 px-8 py-3.5 rounded-full font-semibold transition-all duration-300 hover:scale-[1.04] drop-shadow-[0_0_15px_rgba(34,211,238,0.55)] hover:drop-shadow-[0_0_25px_rgba(34,211,238,0.85)]">
                            Watch Product
                        </button>
                    </div>
                </motion.div>

                {/* Right Side Content - Pulsing Core Glow Mesh (Lower z-index z-0) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="w-full md:w-1/2 h-[500px] md:h-[700px] absolute right-0 md:relative cursor-grab active:cursor-grabbing flex items-center justify-center z-0"
                >
                    {/* Pulsing, diffused purple/orange CSS glow container */}
                    <div className="absolute w-[80%] h-[80%] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(217,70,239,0.3)_0%,_rgba(249,115,22,0.2)_40%,_transparent_75%)] blur-3xl animate-pulse -z-10 pointer-events-none" style={{ animationDuration: '6s' }}></div>

                    <Canvas camera={{ position: [0, 0, 5.5] }} style={{ background: 'transparent' }}>
                        <ambientLight intensity={0.9} />
                        <pointLight position={[0, 0, 0]} intensity={12} color="#D946EF" distance={9} decay={1.5} />
                        <pointLight position={[2.5, 2.5, 2]} intensity={8} color="#FF7A18" distance={9} decay={1.5} />
                        <pointLight position={[-2.5, -2.5, 2]} intensity={8} color="#a855f7" distance={9} decay={1.5} />
                        <pointLight position={[0, 3, -1]} intensity={5} color="#22d3ee" distance={8} decay={1.5} />
                        <AICore />
                        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.0} />
                    </Canvas>
                </motion.div>
            </div>
        </div>
    );
}