import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import './LoadingScreen.css'
import backgroundImage from '/images/start-scene-blur.png'

interface LoadingScreenProps {
    progress: number
    onComplete: () => void
}

export function LoadingScreen({ progress, onComplete }: LoadingScreenProps) {
    const barRef = useRef<HTMLDivElement>(null)
    const textRef = useRef<HTMLParagraphElement>(null)
    const [displayProgress, setDisplayProgress] = useState(0)
    const [startTime] = useState(Date.now())

    useEffect(() => {
        const tl = gsap.timeline()

        tl.fromTo('.loading-bar-container',
            { opacity: 0 },
            { opacity: 1, duration: 0.8, ease: 'power2.out' }
        )
            .fromTo(textRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
                '-=0.3'
            )
    }, [])

    useEffect(() => {
        const elapsedTime = Date.now() - startTime
        const minLoadingTime = 3000

        setDisplayProgress(progress)

        if (progress >= 100 && elapsedTime >= minLoadingTime) {
            setTimeout(() => {
                setDisplayProgress(100)
            }, 100)
        }
    }, [progress, startTime])

    useEffect(() => {
        if (displayProgress > 0) {
            gsap.to(barRef.current, {
                width: `${displayProgress}%`,
                duration: 0.3,
                ease: 'power2.out'
            })
        }
    }, [displayProgress])

    useEffect(() => {
        if (displayProgress >= 100) {
            const tl = gsap.timeline()

            tl.to([barRef.current, textRef.current], {
                opacity: 0,
                y: -30,
                duration: 0.6,
                ease: 'power2.in',
                stagger: 0.1
            })
                .to('.loading-content', {
                    opacity: 0,
                    scale: 0.95,
                    y: -20,
                    duration: 0.6,
                    ease: 'power2.in'
                }, '-=0.3')
                .to('.loading-screen', {
                    opacity: 0,
                    duration: 0.6,
                    ease: 'power2.in',
                    onComplete
                })
        }
    }, [displayProgress, onComplete])

    return (
        <div
            className="loading-screen"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="loading-content">
                <div className="loading-bar-container">
                    <div ref={barRef} className="loading-bar"></div>
                </div>
                <p ref={textRef} className="loading-text">
                    Preparing your relaxation room experience... {Math.round(displayProgress)}%
                </p>
            </div>
        </div>
    )
} 