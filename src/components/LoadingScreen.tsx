import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import './LoadingScreen.css'

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
        const elapsedTime = Date.now() - startTime
        const minLoadingTime = 3000

        if (progress >= 100 && elapsedTime < minLoadingTime) {
            const remainingTime = minLoadingTime - elapsedTime
            const progressStep = 100 / (remainingTime / 100)

            const interval = setInterval(() => {
                setDisplayProgress(prev => {
                    const newProgress = Math.min(prev + progressStep, 100)
                    if (newProgress >= 100) {
                        clearInterval(interval)
                        return 100
                    }
                    return newProgress
                })
            }, 100)

            return () => clearInterval(interval)
        } else {
            setDisplayProgress(progress)
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
                duration: 0.8,
                ease: 'power2.in',
                stagger: 0.1
            })
                .to('.loading-screen', {
                    opacity: 0,
                    duration: 1,
                    ease: 'power2.in',
                    onComplete
                })
        }
    }, [displayProgress, onComplete])

    return (
        <div className="loading-screen">
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