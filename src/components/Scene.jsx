'use client'

import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stats } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import UniverseBackground from './UniverseBackground'
import GalaxyMenu from './GalaxyMenu'
import ProjectSystem from './ProjectSystem'

export default function Scene() {
    const [view, setView] = useState('home')
    const [isTransitioning, setIsTransitioning] = useState(false)

    const handleSectionChange = (targetSection) => {
        setIsTransitioning(true)
        setTimeout(() => {
            setView(targetSection)
            setTimeout(() => {
                setIsTransitioning(false)
            }, 100) // Buffer before fade out
        }, 1000) // Hold flash for 1s
    }

    return (
        <div className="h-screen w-screen relative">
            {/* Warp Flash Overlay */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: '#ffffff',
                    zIndex: 9999999, /* Force it to the front */
                    pointerEvents: 'none', /* Let clicks pass through when invisible */
                    opacity: isTransitioning ? 1 : 0,
                    transition: 'opacity 0.5s ease-in-out',
                }}
            />

            <Canvas
                dpr={[1, 1.5]}
                performance={{ min: 0.5 }}
                gl={{ antialias: false }}
                camera={{ position: [0, 0, 15], fov: 75 }}
            >
                <Stats />
                <color attach="background" args={['#000000']} />

                {/* High-Contrast Lighting */}
                <ambientLight intensity={0.02} />
                <pointLight position={[0, 0, 0]} intensity={25} distance={100} decay={2} />

                <UniverseBackground />

                {view === 'home' ? (
                    <GalaxyMenu onSectionSelect={handleSectionChange} />
                ) : view === 'projects' ? (
                    <ProjectSystem onBack={() => handleSectionChange('home')} />
                ) : (
                    <GalaxyMenu onSectionSelect={handleSectionChange} />
                )}

                <OrbitControls makeDefault />

                {/* Optimized Post-Processing */}
                <EffectComposer disableNormalPass>
                    <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} radius={0.5} />
                </EffectComposer>
            </Canvas>
        </div>
    )
}
