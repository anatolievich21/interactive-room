import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import './StartScene.css'

interface StartSceneProps {
    onStart: () => void
}

export function StartScene({ onStart }: StartSceneProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const titleRef = useRef<HTMLHeadingElement>(null)
    const subtitleRef = useRef<HTMLParagraphElement>(null)
    const [isVideoPlaying, setIsVideoPlaying] = useState(false)
    const [hasAnimatedIn, setHasAnimatedIn] = useState(false)

    useEffect(() => {
        if (!hasAnimatedIn) {
            const tl = gsap.timeline()

            tl.fromTo(titleRef.current,
                { opacity: 0, y: -50 },
                { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
            )
                .fromTo(subtitleRef.current,
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
                    '-=0.5'
                )
                .fromTo(buttonRef.current,
                    { opacity: 0, scale: 0.8 },
                    { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' },
                    '-=0.3'
                )
                .call(() => setHasAnimatedIn(true))
        }
    }, [hasAnimatedIn])

    const handleStartClick = () => {
        if (!isVideoPlaying) {
            setIsVideoPlaying(true)

            const tl = gsap.timeline()

            tl.to(buttonRef.current, {
                scale: 0.95,
                duration: 0.1,
                ease: 'power2.in'
            })
                .to(buttonRef.current, {
                    scale: 1,
                    duration: 0.1,
                    ease: 'power2.out'
                })
                .to([titleRef.current, subtitleRef.current, buttonRef.current], {
                    opacity: 0,
                    y: -30,
                    duration: 0.5,
                    ease: 'power2.in',
                    stagger: 0.1
                })
                .call(() => {
                    if (videoRef.current) {
                        videoRef.current.currentTime = 0
                        videoRef.current.play().catch((error) => {
                            console.error('StartScene: Failed to play video:', error)
                        })
                    }
                })
        }
    }

    const handleVideoEnded = () => {
        gsap.to('.start-scene', {
            opacity: 0,
            duration: 0.8,
            ease: 'power2.in',
            onComplete: onStart
        })
    }

    return (
        <div className="start-scene">
            <video
                ref={videoRef}
                className="start-video"
                onEnded={handleVideoEnded}
                muted
                playsInline
            >
                <source src="/videos/start-scene.mp4" type="video/mp4" />
            </video>

            <div className="start-overlay">
                <div className="start-content">
                    <h1 ref={titleRef} className="start-title">Welcome to the Journey</h1>
                    <p ref={subtitleRef} className="start-subtitle">Experience the cinematic adventure</p>

                    <button
                        ref={buttonRef}
                        className="start-button"
                        onClick={handleStartClick}
                    >
                        Begin Your Journey
                    </button>
                </div>
            </div>
        </div>
    )
} 