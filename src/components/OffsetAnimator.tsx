import { useState } from 'react';
import { useFrame } from '@react-three/fiber'
import { useOffsetScroll } from '@scroll/index';

const speed = 0.002
const OffsetAnimator = () => {

    const scroll = useOffsetScroll();
    const [isRising, setIsRising] = useState(false)

    useFrame(() => {
        if (scroll.offset > 1 && isRising) {
            setIsRising(false)
        }

        if (scroll.offset < 0 && !isRising) {
            setIsRising(true)
        }

        if (isRising) {
            scroll.offset += speed
            return
        }
        scroll.offset -= speed
    })
    return (
        null)
}

export default OffsetAnimator