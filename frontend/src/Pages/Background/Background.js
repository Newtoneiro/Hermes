import React from 'react';
import {Sphere, MeshDistortMaterial } from "@react-three/drei";
import { Canvas } from '@react-three/fiber';
import './background.css'

const Background = () => {
  return (<>
        <Canvas className='background_canvas'>
            <ambientLight intensity={0.5}/>
            <directionalLight position={[-2, 5, 2]} intensity={1}/>
            <Sphere visible args={[1, 100, 200]} scale={1}>
                <MeshDistortMaterial
                color="#f08605"
                attach="material"
                distort={1}
                speed={1.4}
                roughness={1}/>
            </Sphere>
        </Canvas>
        </>
    )
};

export default Background;
