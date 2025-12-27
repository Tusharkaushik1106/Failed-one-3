'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html, MeshDistortMaterial } from '@react-three/drei'
import gsap from 'gsap'
import AsteroidBelt from './AsteroidBelt'
import BlackHole from './BlackHole'

export default function GalaxyMenu({ onSectionSelect }) {
    const groupRef = useRef()
    const { camera, controls } = useThree()

    const planets = [
        { name: 'Projects', color: '#4f46e5', x: 6 },
        { name: 'Experience', color: '#10b981', x: 9 },
        { name: 'Skills', color: '#f59e0b', x: 12 },
        { name: 'Contact', color: '#ef4444', x: 15 },
    ]

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta / 5 // Slow rotation
        }
    })

    const handlePlanetClick = (planetName, x) => {
        if (controls) {
            controls.enabled = false
        }

        // Animate Camera Position
        gsap.to(camera.position, {
            x: x,
            y: 0,
            z: 4,
            duration: 2,
            ease: 'power3.inOut',
        })

        // Animate Controls Target (Focus Point)
        if (controls) {
            gsap.to(controls.target, {
                x: x,
                y: 0,
                z: 0,
                duration: 2,
                ease: 'power3.inOut',
            })
        }

        // Trigger Section Change (Flash) early to mask the cut
        setTimeout(() => {
            onSectionSelect && onSectionSelect(planetName.toLowerCase())
        }, 1000)
    }

    return (
        <group>
            <AsteroidBelt />

            {/* Sun */}
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[2, 32, 32]} />
                <MeshDistortMaterial
                    color="#FDB813"
                    emissive="#FF8C00"
                    emissiveIntensity={4}
                    roughness={0}
                    distort={0.3}
                    speed={2}
                />
                <Html position={[0, 2.5, 0]} center>
                    <div className="text-white text-sm font-bold bg-black/50 px-2 py-1 rounded pointer-events-none select-none whitespace-nowrap">
                        About Me
                    </div>
                </Html>
            </mesh>

            {/* Planets Group */}
            <group ref={groupRef}>
                {planets.map((planet) => (
                    planet.name === 'Contact' ? (
                        <BlackHole
                            key={planet.name}
                            position={[planet.x, 0, 0]}
                            onClick={() => handlePlanetClick(planet.name, planet.x)}
                        />
                    ) : (
                        <mesh
                            key={planet.name}
                            position={[planet.x, 0, 0]}
                            onClick={() => handlePlanetClick(planet.name, planet.x)}
                            className="cursor-pointer"
                        >
                            <sphereGeometry args={[1, 24, 24]} />
                            <meshStandardMaterial
                                color={planet.color}
                                roughness={0.7}
                                metalness={0.1}
                                emissive={planet.color}
                                emissiveIntensity={0.2}
                            />
                            <Html position={[0, 1.5, 0]} center>
                                <div className="text-white text-xs font-bold bg-black/50 px-2 py-1 rounded pointer-events-none select-none">
                                    {planet.name}
                                </div>
                            </Html>
                        </mesh>
                    )
                ))}
            </group>
        </group>
    )
}
