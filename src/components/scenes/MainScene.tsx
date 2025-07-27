import { useEffect, useRef, useCallback, useState, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { NavigationMap } from '../interactive/NavigationMap'
import SceneNavigation from '../interactive/SceneNavigation'
import { InstructionsModal } from '../interactive/InstructionsModal'
import './MainScene.css'

gsap.registerPlugin(ScrollTrigger)

export function MainScene() {
    const videoRef = useRef<HTMLVideoElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [isMouseInside, setIsMouseInside] = useState(false)
    const [scrollProgress, setScrollProgress] = useState(0)
    const [showInstructions, setShowInstructions] = useState(false)
    const [hasShownInitialHelp, setHasShownInitialHelp] = useState(false)

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

        const maxMoveX = (1.1 - 1) * 100
        const maxMoveY = (1.1 - 1) * 100

        const moveX = (0.5 - normalizedX) * maxMoveX
        const moveY = (0.5 - normalizedY) * maxMoveY

        gsap.to(video, {
            scale: 1.1,
            x: `${moveX}%`,
            y: `${moveY}%`,
            duration: 1.0,
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
                    setScrollProgress(progress)
                    const duration = video.duration || 0

                    if (duration > 0) {
                        const targetTime = progress * duration

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

        const targetScroll = scrollDistance * scrollPosition

        window.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
        })
    }, [])

    const handleInstructionsClose = useCallback(() => {
        setShowInstructions(false)
        setHasShownInitialHelp(true)
    }, [])

    const handleHelpClick = useCallback(() => {
        setShowInstructions(true)
    }, [])

    useEffect(() => {
        if (!hasShownInitialHelp) {
            const timer = setTimeout(() => {
                setShowInstructions(true)
            }, 1000)

            return () => clearTimeout(timer)
        }
    }, [hasShownInitialHelp])

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
                onHelpClick={handleHelpClick}
            />

            <SceneNavigation
                onNavigate={handleNavigate}
            />

            <InstructionsModal
                isVisible={showInstructions}
                onClose={handleInstructionsClose}
                isAutoShow={!hasShownInitialHelp}
            />
        </div>
    )
} 
