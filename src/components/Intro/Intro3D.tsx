"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, PerspectiveCamera, Text, Environment } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

function FloatingObject() {
    const meshRef = useRef<THREE.Mesh>(null);
    const [mouse, setMouse] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMouse({
                x: (e.clientX / window.innerWidth) * 2 - 1,
                y: -(e.clientY / window.innerHeight) * 2 + 1,
            });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    useFrame((state) => {
        if (!meshRef.current) return;
        const t = state.clock.getElapsedTime();

        // Smoothly follow mouse
        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, mouse.y * 0.5, 0.1);
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, mouse.x * 0.5, 0.1);

        // Added subtle breathing motion + Beat
        const beat = 1 + Math.pow(Math.sin(t * 3), 10) * 0.2;
        meshRef.current.scale.set(beat, beat, beat);
        meshRef.current.position.y = Math.sin(t / 1.5) / 5;
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <mesh ref={meshRef}>
                <Sphere args={[1.2, 64, 64]}>
                    <MeshDistortMaterial
                        color="#1DB954"
                        speed={4}
                        distort={0.4}
                        radius={1}
                    />
                </Sphere>
            </mesh>
        </Float>
    );
}

export default function Intro3D({ onComplete }: { onComplete: () => void }) {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false);
            setTimeout(onComplete, 1000);
        }, 6000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="fixed inset-0 z-[100] bg-black"
                >
                    <Canvas>
                        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1.5} color="#1DB954" />
                        <pointLight position={[-10, -10, -10]} intensity={1} color="#000" />
                        <Environment preset="city" />

                        <FloatingObject />

                        <Text
                            position={[0, -2, 0]}
                            fontSize={0.4}
                            color="white"
                            anchorX="center"
                            anchorY="middle"
                        >
                            TELUGUBEATS
                        </Text>
                    </Canvas>

                    <div className="absolute top-8 right-8">
                        <button
                            onClick={() => {
                                setShow(false);
                                setTimeout(onComplete, 1000);
                            }}
                            className="px-6 py-2 border border-white/20 rounded-full text-white/60 hover:text-white hover:border-white transition-all text-sm uppercase tracking-widest"
                        >
                            Skip Intro
                        </button>
                    </div>

                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 5, ease: "linear" }}
                            className="w-48 h-[2px] bg-spotify-green origin-left"
                            style={{ backgroundColor: "#1DB954" }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
