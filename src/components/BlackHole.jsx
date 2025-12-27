'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'

export default function BlackHole({ position, onClick }) {
    const diskRef = useRef()

    useFrame((state, delta) => {
        if (diskRef.current) {
            diskRef.current.rotation.z += delta * 2 // Fast swirl
        }
    })

    return (
        <group position={position} onClick={onClick} className="cursor-pointer">
            {/* Event Horizon (Core) */}
            <mesh>
                <sphereGeometry args={[1.5, 32, 32]} />
                <meshBasicMaterial color="#000000" />
            </mesh>

            {/* Accretion Disk (Glow) */}
            <points ref={diskRef}>
                <torusGeometry args={[2.5, 0.5, 16, 100]} />
                <pointsMaterial
                    color="#ff4500"
                    size={0.1}
                    transparent
                    opacity={0.8}
                    sizeAttenuation={true}
                />
            </points>

            {/* Label */}
            <Html position={[0, 2, 0]} center>
                <div className="text-white text-xs font-bold bg-black/50 px-2 py-1 rounded pointer-events-none select-none whitespace-nowrap">
                    Contact Me
                </div>
            </Html>
        </group>
    )
}
