'use client'

import { useRef, useLayoutEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import gsap from 'gsap'

export default function ProjectSystem({ onBack }) {
    const groupRef = useRef()
    const { camera, controls } = useThree()

    useLayoutEffect(() => {
        // Match Cut: Start close (where the flight ended)
        camera.position.set(0, 0, 4)
        camera.lookAt(0, 0, 0)
        if (controls) controls.target.set(0, 0, 0)

        // Pull Back Animation (Arrival)
        gsap.to(camera.position, {
            z: 20,
            duration: 2.5,
            ease: 'power2.out',
        })
    }, [camera, controls])

    const projects = [
        { name: 'Website', color: '#3b82f6', x: 4 },
        { name: 'App', color: '#8b5cf6', x: -4 },
        { name: 'Design', color: '#ec4899', x: 0, z: 4 },
    ]

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta / 3
        }
    })

    return (
        <group>
            {/* Back Button */}
            <Html position={[-5, 5, 0]}>
                <button
                    onClick={onBack}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded border border-white/30 backdrop-blur-sm transition-colors"
                >
                    ← Back to Galaxy
                </button>
            </Html>

            {/* Central Planet - Projects */}
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[2.5, 32, 32]} />
                <meshStandardMaterial color="#3b82f6" emissive="#1d4ed8" emissiveIntensity={0.5} />
                <Html position={[0, 3, 0]} center>
                    <div className="text-white text-lg font-bold bg-black/50 px-3 py-1 rounded pointer-events-none select-none">
                        Projects
                    </div>
                </Html>
            </mesh>

            {/* Orbiting Project Moons */}
            <group ref={groupRef}>
                {projects.map((project) => (
                    <mesh
                        key={project.name}
                        position={[project.x, 0, project.z || 0]}
                    >
                        <sphereGeometry args={[0.8, 32, 32]} />
                        <meshStandardMaterial color={project.color} />
                        <Html position={[0, 1.2, 0]} center>
                            <div className="text-white text-xs font-bold bg-black/50 px-2 py-1 rounded pointer-events-none select-none">
                                {project.name}
                            </div>
                        </Html>
                    </mesh>
                ))}
            </group>
        </group>
    )
}
