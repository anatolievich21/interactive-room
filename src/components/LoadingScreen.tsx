import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import './LoadingScreen.css'

interface LoadingScreenProps {
    progress: number
    onComplete: () => void
}

export function LoadingScreen({ progress, onComplete }: LoadingScreenProps) {
    const progressBarRef = useRef<HTMLDivElement>(null)
    const textRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (progressBarRef.current) {
            gsap.to(progressBarRef.current, {
                width: `${progress}%`,
                duration: 0.3,
                ease: 'power2.out'
            })
        }
    }, [progress])

    useEffect(() => {
        if (progress >= 100) {
            const tl = gsap.timeline({
                onComplete: () => {
                    setTimeout(onComplete, 500)
                }
            })

            tl.to(textRef.current, {
                opacity: 0,
                y: -20,
                duration: 0.5
            })
                .to(progressBarRef.current, {
                    scaleY: 0,
                    duration: 0.3,
                    ease: 'power2.in'
                }, '-=0.2')
        }
    }, [progress, onComplete])

    return (
        <div className="loading-screen">
            <div className="loading-content">
                <h1 className="loading-title">Loading...</h1>
                <div className="loading-bar-container">
                    <div
                        ref={progressBarRef}
                        className="loading-bar"
                        style={{ width: '0%' }}
                    />
                </div>
                <div ref={textRef} className="loading-text">
                    Preparing your journey...
                </div>
            </div>
        </div>
    )
} 