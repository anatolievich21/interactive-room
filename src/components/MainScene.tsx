import { useEffect, useRef, useCallback, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './MainScene.css'

gsap.registerPlugin(ScrollTrigger)

export function MainScene() {
    const videoRef = useRef<HTMLVideoElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [isMouseInside, setIsMouseInside] = useState(false)

    const handleMouseLeave = useCallback(() => {
        setIsMouseInside(false)

        const video = videoRef.current
        if (!video) return

        gsap.killTweensOf(video)

        gsap.to(video, {
            scale: 1,
            x: '0%',
            y: '0%',
            duration: 0.6,
            ease: 'power2.out'
        })
    }, [])

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isMouseInside) return

        const video = videoRef.current
        const container = containerRef.current

        if (!video || !container) return

        const rect = container.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        if (x < 0 || x > rect.width || y < 0 || y > rect.height) return

        const normalizedX = x / rect.width
        const normalizedY = y / rect.height

        const maxMoveX = (1.15 - 1) * 100
        const maxMoveY = (1.15 - 1) * 100

        const moveX = (0.5 - normalizedX) * maxMoveX
        const moveY = (0.5 - normalizedY) * maxMoveY

        gsap.to(video, {
            scale: 1.15,
            x: `${moveX}%`,
            y: `${moveY}%`,
            duration: 1.0,
            ease: 'power2.out'
        })
    }, [isMouseInside])

    const handleMouseEnter = useCallback(() => {
        setIsMouseInside(true)
    }, [])

    useEffect(() => {
        const video = videoRef.current
        const container = containerRef.current

        if (!video || !container) return

        video.currentTime = 0

        container.addEventListener('mouseenter', handleMouseEnter)
        container.addEventListener('mouseleave', handleMouseLeave)

        const scrollTrigger = ScrollTrigger.create({
            trigger: container,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.1,
            onUpdate: (self) => {
                const progress = self.progress
                const duration = video.duration || 0

                if (duration > 0) {
                    let targetTime: number

                    if (progress > 0.5) {
                        const reverseProgress = 1 - (progress - 0.5) * 2
                        targetTime = reverseProgress * duration
                    } else {
                        targetTime = progress * 2 * duration
                    }

                    if (Math.abs(video.currentTime - targetTime) > 0.1) {
                        video.currentTime = targetTime
                    }
                }
            }
        })

        return () => {
            scrollTrigger.kill()
            container.removeEventListener('mouseenter', handleMouseEnter)
            container.removeEventListener('mouseleave', handleMouseLeave)
        }
    }, [handleMouseEnter, handleMouseLeave])

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        if (isMouseInside) {
            container.addEventListener('mousemove', handleMouseMove, { passive: true })
        } else {
            container.removeEventListener('mousemove', handleMouseMove)
        }

        return () => {
            container.removeEventListener('mousemove', handleMouseMove)
        }
    }, [isMouseInside, handleMouseMove])

    return (
        <div className="main-scene" ref={containerRef}>
            <video
                ref={videoRef}
                className="main-video"
                muted
                playsInline
                loop={false}
            >
                <source src="/videos/main-scene.mp4" type="video/mp4" />
            </video>
        </div>
    )
} 
