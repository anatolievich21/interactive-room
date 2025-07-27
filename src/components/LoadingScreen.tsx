import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import './LoadingScreen.css'

interface LoadingScreenProps {
    progress: number
    onComplete: () => void
}

export function LoadingScreen({ progress, onComplete }: LoadingScreenProps) {
    const barRef = useRef<HTMLDivElement>(null)
    const textRef = useRef<HTMLParagraphElement>(null)

    useEffect(() => {
        const tl = gsap.timeline()

        tl.fromTo('.loading-bar-container',
            { opacity: 0, scaleX: 0 },
            { opacity: 1, scaleX: 1, duration: 0.8, ease: 'power2.out' }
        )
            .fromTo(textRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
                '-=0.3'
            )
    }, [])

    useEffect(() => {
        if (progress > 0) {
            gsap.to(barRef.current, {
                width: `${progress}%`,
                duration: 0.3,
                ease: 'power2.out'
            })
        }
    }, [progress])

    useEffect(() => {
        if (progress >= 100) {
            const tl = gsap.timeline()

            tl.to([barRef.current, textRef.current], {
                opacity: 0,
                y: -30,
                duration: 0.8,
                ease: 'power2.in',
                stagger: 0.1
            })
                .to('.loading-screen', {
                    opacity: 0,
                    duration: 0.5,
                    ease: 'power2.in',
                    onComplete
                })
        }
    }, [progress, onComplete])

    return (
        <div className="loading-screen">
            <div className="loading-content">
                <div className="loading-bar-container">
                    <div ref={barRef} className="loading-bar"></div>
                </div>
                <p ref={textRef} className="loading-text">
                    Preparing your immersive experience... {progress}%
                </p>
            </div>
        </div>
    )
} 