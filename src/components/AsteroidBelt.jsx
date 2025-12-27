'use client'

import { useRef, useMemo, useLayoutEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

export default function AsteroidBelt() {
    const groupRef = useRef()
    const meshRef = useRef()
    const count = 200
    const radiusMin = 8
    const radiusMax = 12

    // Hero Skills Data
    const skills = [
        { name: 'React', color: '#61dafb' },
        { name: 'Next.js', color: '#ffffff' },
        { name: 'Three.js', color: '#000000' }, // White text on black rock? Or maybe just white rock
        { name: 'Java', color: '#f89820' },
        { name: 'Tailwind', color: '#38bdf8' },
        { name: 'Python', color: '#3776ab' },
    ]

    // Generate positions for hero skills (evenly spaced)
    const skillMeshes = useMemo(() => {
        return skills.map((skill, i) => {
            const angle = (i / skills.length) * Math.PI * 2
            const radius = 10 // Middle of the belt
            const x = Math.cos(angle) * radius
            const z = Math.sin(angle) * radius
            return { ...skill, position: [x, (Math.random() - 0.5) * 2, z] }
        })
    }, [])

    // Generate random matrices for instanced mesh
    const dummy = useMemo(() => new THREE.Object3D(), [])

    useLayoutEffect(() => {
        if (meshRef.current) {
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2
                const radius = THREE.MathUtils.lerp(radiusMin, radiusMax, Math.random())
                const x = Math.cos(angle) * radius
                const z = Math.sin(angle) * radius
                const y = (Math.random() - 0.5) * 2 // Vertical spread

                dummy.position.set(x, y, z)
                dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
                const scale = Math.random() * 0.2 + 0.1
                dummy.scale.set(scale, scale, scale)
                dummy.updateMatrix()
                meshRef.current.setMatrixAt(i, dummy.matrix)
            }
            meshRef.current.instanceMatrix.needsUpdate = true
        }
    }, [dummy])

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta / 15 // Very slow rotation
        }
    })

    return (
        <group ref={groupRef}>
            {/* Instanced Dust/Rocks */}
            <instancedMesh ref={meshRef} args={[null, null, count]}>
                <dodecahedronGeometry args={[0.2, 0]} />
                <meshStandardMaterial color="#888888" roughness={0.8} />
            </instancedMesh>

            {/* Hero Skills */}
            {skillMeshes.map((skill) => (
                <mesh key={skill.name} position={skill.position}>
                    <dodecahedronGeometry args={[0.5, 0]} />
                    <meshStandardMaterial color={skill.color} roughness={0.5} />
                    <Html distanceFactor={15}>
                        <div className="text-white text-xs font-bold bg-black/50 px-2 py-1 rounded pointer-events-none select-none whitespace-nowrap">
                            {skill.name}
                        </div>
                    </Html>
                </mesh>
            ))}
        </group>
    )
}
