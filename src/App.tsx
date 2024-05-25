import './App.css'
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { ACESFilmicToneMapping, Vector2 } from 'three'
import { OrbitControls, Preload, Sky } from '@react-three/drei'
import OffsetAnimator from './components/OffsetAnimator'
import { ExtendedScrollComp } from '@scroll/index'

function App() {

  return (
    <>
      <Canvas
        id='mainCanvas'
        shadows={true}
        gl={{
          toneMapping: ACESFilmicToneMapping,
          antialias: true,
        }}
        dpr={1}
        camera={{ fov: 45, zoom: 1, near: 0.01, far: 2000000, position: [5, 5, 5] }}
        style={{ width: '100vw', height: '100vh' }}
        onContextMenu={(e) => e.preventDefault()}
      >
        <Suspense>
          <ExtendedScrollComp>
            {({ ModelLoader, TextureLoader }) => {
              return (
                <>
                  <ModelLoader
                    // ref 
                    // group props
                    position={[0, 0, 2]}
                    url='/chair.glb' // pass url of the glb
                    min={0.5} // min offset 0-1
                    max={1} // max offset 0-1
                  />
                  <ModelLoader
                    position={[0, 0, 4]}
                    url='/table.glb'
                    min={0}
                    max={1}
                  />
                  <TextureLoader
                    // ref
                    // group props
                    url='/chair.png' // pass png file
                    min={0} // min offset 0-1
                    max={0.5} // max offset 0-1
                    size={new Vector2(3, 3)} // size of the plane geometry
                    rotation={[0, 0, Math.PI]}
                    position={[0, 0, 0]}
                  />
                </>
              );
            }}
          </ExtendedScrollComp>

          <OffsetAnimator />

        </Suspense>

        <hemisphereLight intensity={1.5} color="white" groundColor="#f88" />
        <directionalLight color="#ffd7b5" intensity={2} position={[20, 30, 20]} castShadow shadow-mapSize={1024} shadow-normalBias={0.07}
        >
          <orthographicCamera attach="shadow-camera" args={[-10, 10, 10, -10, 0.01, 100000]} />
        </directionalLight>

        <Sky />
        <OrbitControls />
        <Preload all />
      </Canvas>
    </>
  )
}

export default App
