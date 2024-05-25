import * as THREE from 'three'
import * as React from 'react'
import { GroupProps, addEffect, useFrame } from '@react-three/fiber'
import { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react'
import { useGLTF, useTexture } from '@react-three/drei'


// TYPES AND INTERFACES
type ForwardRefComponent<P, T> = ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<T>>

interface ModelLoaderProps extends GroupProps {
    url: string;
    startPosition: number[];
    endPosition: number[];
    min: number;
    max: number;
    enableTranslationAnimation?: boolean
    enableOpacityAnimation?: boolean
}

interface TextureLoaderProps extends GroupProps {
    url: string;
    startPosition: number[];
    endPosition: number[];
    size: THREE.Vector2
    min: number;
    max: number;
    enableTranslationAnimation?: boolean
    enableOpacityAnimation?: boolean
}

type ScrollControlsState = {
    offset: number;
}



// HELPER FUNCTIONS
const getCurrentClampedOfsset = (offset: number, min: number, max: number): number => {
    if (offset < min) return 0
    if (offset > max) return 1
    return ((offset - min) / (max - min))

}


// PROVIDER
export type ScrollControlsProps = {
    enabled?: boolean
    children: (props: {
        GenericGroup: ForwardRefComponent<GroupProps, THREE.Group<THREE.Object3DEventMap>>;
        ModelLoader: ForwardRefComponent<ModelLoaderProps, THREE.Group<THREE.Object3DEventMap>>;
        TextureLoader: ForwardRefComponent<TextureLoaderProps, THREE.Group<THREE.Object3DEventMap>>;

    }) => React.ReactNode;
}


const context = React.createContext<ScrollControlsState>({ offset: 0 })

export function useOffsetScroll() {
    return React.useContext(context)
}

export function ExtendedScrollComp({
    enabled = true,
    children,
}: ScrollControlsProps) {

    const scroll = React.useRef(0)

    const state = React.useMemo(() => {
        const state = {
            offset: 0,
        }
        return state
    }, [])

    useFrame(() => {
        if (!enabled) return
        scroll.current = state.offset
    })
    if (!state) return
    return (
        children({
            GenericGroup,
            ModelLoader,
            TextureLoader
        })
    )


}


export function ExtendedScrollProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const state = React.useMemo(() => {
        const state = {
            offset: 0,
        }
        return state
    }, [])

    const scroll = useOffsetScroll();


    React.useEffect(() => {
        const effect = addEffect(() => {
            scroll.offset = state.offset
        });
        return () => {
            effect();
        };
    }, []);


    return <context.Provider value={state}>
        {children}
    </context.Provider>
}


export const GenericGroup: ForwardRefComponent<GroupProps, THREE.Group> = React.forwardRef(
    ({ ...props }: GroupProps, ref) => {
        return <group ref={ref} {...(props as GroupProps)} />
    }
)


export const ModelLoader: ForwardRefComponent<ModelLoaderProps, THREE.Group> = React.forwardRef(
    ({
        url,
        min,
        max,
        endPosition,
        startPosition,
        enableTranslationAnimation = true,
        enableOpacityAnimation = false,
        ...props }: ModelLoaderProps, ref) => {
        const { scene, materials } = useGLTF(url);

        const endPosVec = new THREE.Vector3(endPosition[0], endPosition[1], endPosition[2]);
        const startPosVec = new THREE.Vector3(startPosition[0], startPosition[1], startPosition[2]);

        const scroll = useOffsetScroll();
        const objRef = React.useRef<THREE.Object3D>(null)

        useFrame(() => {
            if (!objRef || !objRef.current) return

            if (enableTranslationAnimation) {
                objRef.current.position.lerp(
                    endPosVec.clone().add(startPosVec.clone().sub(endPosVec.clone()).multiplyScalar(
                        getCurrentClampedOfsset(scroll.offset, min, max)
                    ))
                    , 0.1
                )
            }

            if (enableOpacityAnimation) {
                Object.keys(materials).forEach(function (key) {
                    const mat = materials[key];
                    mat.transparent = true
                    mat.opacity = getCurrentClampedOfsset(scroll.offset, min, max)
                });
            }
        }, -1)

        return (
            <group ref={ref} {...(props as ModelLoaderProps)} >
                <primitive ref={objRef} object={scene.clone()} />
            </group>
        )
    }
)


export const TextureLoader: ForwardRefComponent<TextureLoaderProps, THREE.Group> = React.forwardRef(
    ({
        size,
        url,
        max,
        min,
        endPosition,
        startPosition,
        enableTranslationAnimation = true,
        enableOpacityAnimation = false,
        ...props }: TextureLoaderProps, ref) => {

        const meshRef = React.useRef<THREE.Mesh>(null)
        const matRef = React.useRef<THREE.MeshStandardMaterial>(null)

        const scroll = useOffsetScroll()

        const texture = useTexture(url, (text) => {
            text.wrapS = text.wrapT = THREE.RepeatWrapping;
            text.offset.set(0, 0);
            text.repeat.set(1, 1);
            text.flipY = false;
        });


        const endPosVec = new THREE.Vector3(endPosition[0], endPosition[1], endPosition[2]);
        const startPosVec = new THREE.Vector3(startPosition[0], startPosition[1], startPosition[2]);

        useFrame(() => {
            if (!meshRef || !meshRef.current) return
            if (!matRef || !matRef.current) return


            if (enableTranslationAnimation) {
                meshRef.current.position.lerp(
                    endPosVec.clone().add(startPosVec.clone().sub(endPosVec.clone()).multiplyScalar(
                        getCurrentClampedOfsset(scroll.offset, min, max)
                    ))
                    , 0.1
                )
            }

            if (enableOpacityAnimation) {
                const clampedOffset = getCurrentClampedOfsset(scroll.offset, min, max)
                matRef.current.opacity = clampedOffset
            }
        }, -1)


        return <group ref={ref} {...(props as GroupProps)} >
            <mesh ref={meshRef}>
                <planeGeometry args={[size.x, size.y]} />
                <meshStandardMaterial
                    ref={matRef}
                    map={texture}
                    transparent
                    emissiveIntensity={0}
                    emissive={'cyan'}
                    side={THREE.DoubleSide}
                />
            </mesh>

        </group>
    }
)

