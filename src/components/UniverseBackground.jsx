'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'

export default function UniverseBackground() {
    const ref = useRef()

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.y += delta / 10
        }
    })

    return (
        <group ref={ref}>
            <Stars
                radius={300}
                depth={50}
                count={5000}
                factor={4}
                saturation={0}
                fade={true}
            />
        </group>
    )
}
