import { useEffect, useRef, useCallback, useState, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { NavigationMap } from '../interactive/NavigationMap'
import SceneNavigation from '../interactive/SceneNavigation'
import './MainScene.css'

gsap.registerPlugin(ScrollTrigger)

export function MainScene() {
    const videoRef = useRef<HTMLVideoElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [isMouseInside, setIsMouseInside] = useState(false)
    const [scrollProgress, setScrollProgress] = useState(0)

    const handleMouseLeave = useCallback(() => {
        setIsMouseInside(false)

        const video = videoRef.current
        if (!video) return

        gsap.killTweensOf(video)

        gsap.to(video, {
            scale: 1,
            x: '0%',
            duration: 0.6,
            ease: 'power2.out'
        })

        gsap.to(video, {
            objectPosition: 'center center',
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

        const maxMoveX = (1.1 - 1) * 100
        const panIntensity = 15

        const moveX = (0.5 - normalizedX) * maxMoveX
        const moveY = (0.5 - normalizedY) * panIntensity

        const objectPositionX = 50 + moveX * 0.5
        const objectPositionY = 50 + moveY

        gsap.to(video, {
            scale: 1.1,
            x: `${moveX}%`,
            duration: 2,
            ease: 'power2.out'
        })

        gsap.to(video, {
            objectPosition: `${objectPositionX}% ${objectPositionY}%`,
            duration: 2,
            ease: 'power2.out'
        })
    }, [isMouseInside])

    const handleMouseEnter = useCallback(() => {
        setIsMouseInside(true)
    }, [])

    useLayoutEffect(() => {
        const video = videoRef.current
        const container = containerRef.current

        if (!video || !container) return

        video.currentTime = 0

        const ctx = gsap.context(() => {
            container.addEventListener('mouseenter', handleMouseEnter)
            container.addEventListener('mouseleave', handleMouseLeave)

            const scrollTrigger = ScrollTrigger.create({
                trigger: container,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1,
                onUpdate: (self) => {
                    const progress = self.progress
                    // Invert progress: scroll down = forward in video, scroll up = backward
                    const invertedProgress = 1 - progress
                    setScrollProgress(invertedProgress)
                    const duration = video.duration || 0

                    if (duration > 0) {
                        const targetTime = invertedProgress * duration

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
        })

        return () => ctx.revert()
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

    const handleNavigate = useCallback((scrollPosition: number) => {
        const container = containerRef.current
        if (!container) return

        const containerHeight = container.offsetHeight
        const windowHeight = window.innerHeight
        const scrollDistance = containerHeight - windowHeight

        // Invert scroll position to match the inverted video progress
        const invertedScrollPosition = 1 - scrollPosition
        const targetScroll = scrollDistance * invertedScrollPosition

        window.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
        })
    }, [])

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


            <NavigationMap
                onNavigate={handleNavigate}
                currentProgress={scrollProgress}
            />

            <SceneNavigation
                onNavigate={handleNavigate}
            />
        </div>
    )
} 
