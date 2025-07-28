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
    const contentRef = useRef<HTMLDivElement>(null)
    const [isVideoPlaying, setIsVideoPlaying] = useState(false)
    const [hasAnimatedIn, setHasAnimatedIn] = useState(false)

    useEffect(() => {
        if (!hasAnimatedIn) {
            gsap.set('.start-scene', { opacity: 0 })
            gsap.set(titleRef.current, { opacity: 0, y: -50 })
            gsap.set(subtitleRef.current, { opacity: 0, y: 30 })
            gsap.set(buttonRef.current, { opacity: 0, scale: 0.8 })

            const tl = gsap.timeline()

            tl.to('.start-scene', {
                opacity: 1,
                duration: 0.5,
                ease: 'power2.out'
            })
                .to(titleRef.current,
                    { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
                    '-=0.3'
                )
                .to(subtitleRef.current,
                    { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
                    '-=0.5'
                )
                .to(buttonRef.current,
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
                .to(contentRef.current, {
                    opacity: 0,
                    scale: 0.95,
                    y: -20,
                    duration: 0.6,
                    ease: 'power2.in'
                }, '-=0.3')
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
        const tl = gsap.timeline()

        tl.to('.start-video', {
            opacity: 0,
            scale: 1.05,
            duration: 0.8,
            ease: 'power2.in'
        })
            .to('.start-overlay', {
                opacity: 0,
                scale: 0.95,
                duration: 0.6,
                ease: 'power2.in'
            }, '-=0.4')
            .to('.start-scene', {
                opacity: 0,
                duration: 0.4,
                ease: 'power2.in',
                onComplete: onStart
            }, '-=0.2')
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
                <div className="start-content" ref={contentRef}>
                    <h1 ref={titleRef} className="start-title">Welcome to Your Relaxation Room</h1>
                    <p ref={subtitleRef} className="start-subtitle">Discover every corner of your perfect space</p>

                    <button
                        ref={buttonRef}
                        className="start-button"
                        onClick={handleStartClick}
                    >
                        Explore the Room
                    </button>
                </div>
            </div>
        </div>
    )
} 