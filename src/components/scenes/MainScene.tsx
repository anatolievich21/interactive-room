import { useEffect, useRef, useCallback, useState, useLayoutEffect, useMemo } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { NavigationMap, SceneNavigation } from '../interactive'
import { InstructionsModal } from '../interactive'
import { VideoHighlights } from '../interactive'
import { ObjectModal } from '../interactive'
import { EditModeIndicators } from '../interactive'
import { objectData } from '../interactive'
import type { ObjectInfo } from '../interactive'

import './MainScene.css'

gsap.registerPlugin(ScrollTrigger)

export function MainScene() {
    const videoRef = useRef<HTMLVideoElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [isMouseInside, setIsMouseInside] = useState(false)
    const [scrollProgress, setScrollProgress] = useState(0)
    const [showInstructions, setShowInstructions] = useState(false)
    const [hasShownInitialHelp, setHasShownInitialHelp] = useState(false)
    const [showObjectModal, setShowObjectModal] = useState(false)
    const [selectedObject, setSelectedObject] = useState<ObjectInfo | null>(null)
    const [isEditMode, setIsEditMode] = useState(false)
    const [isNavigating, setIsNavigating] = useState(false)
    const [navigationTarget, setNavigationTarget] = useState<number | null>(null)
    const [showScrollIndicator, setShowScrollIndicator] = useState(false)
    const [isIndicatorHiding, setIsIndicatorHiding] = useState(false)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const scrollTimeoutRef = useRef<number | null>(null)
    const hideTimeoutRef = useRef<number | null>(null)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            const isMobileDevice = window.innerWidth <= 768 ||
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
            setIsMobile(isMobileDevice)
        }

        checkMobile()
        window.addEventListener('resize', checkMobile)

        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const shouldShowIndicator = useCallback(() => {
        return !isMobile &&
            !showInstructions &&
            !showObjectModal &&
            !isNavigating
    }, [isMobile, showInstructions, showObjectModal, isNavigating])

    const startScrollIndicatorCycle = useCallback(() => {
        if (!shouldShowIndicator()) return

        setShowScrollIndicator(true)
        hideTimeoutRef.current = window.setTimeout(() => {
            setIsIndicatorHiding(true)
            setTimeout(() => {
                setShowScrollIndicator(false)
                setIsIndicatorHiding(false)
                // Наступна поява через 10 секунд
                scrollTimeoutRef.current = window.setTimeout(() => {
                    if (shouldShowIndicator()) {
                        setShowScrollIndicator(true)
                        hideTimeoutRef.current = window.setTimeout(() => {
                            setIsIndicatorHiding(true)
                            setTimeout(() => {
                                setShowScrollIndicator(false)
                                setIsIndicatorHiding(false)
                                // Продовжуємо цикл
                                scrollTimeoutRef.current = window.setTimeout(() => {
                                    startScrollIndicatorCycle()
                                }, 10000)
                            }, 400)
                        }, 3000)
                    } else {
                        // Якщо не можемо показати, спробуємо знову через 10 секунд
                        scrollTimeoutRef.current = window.setTimeout(() => {
                            startScrollIndicatorCycle()
                        }, 10000)
                    }
                }, 10000)
            }, 400)
        }, 3000)
    }, [shouldShowIndicator])

    const resetScrollIndicator = useCallback(() => {
        if (showScrollIndicator) {
            setIsIndicatorHiding(true)
            setTimeout(() => {
                setShowScrollIndicator(false)
                setIsIndicatorHiding(false)
            }, 400)
        }
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current)
        }
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current)
        }
        scrollTimeoutRef.current = window.setTimeout(() => {
            startScrollIndicatorCycle()
        }, 10000)
    }, [showScrollIndicator, startScrollIndicatorCycle])

    useEffect(() => {
        gsap.set('.main-scene', { opacity: 0 })
        gsap.to('.main-scene', {
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out'
        })
    }, [])



    const handleMouseLeave = useCallback(() => {
        setIsMouseInside(false)

        const video = videoRef.current
        if (!video) return

        gsap.killTweensOf(video)

        gsap.to(video, {
            scale: 1,
            transform: 'translate3d(0px, 0px, 0)',
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

        const moveX = (0.5 - normalizedX) * 50
        const moveY = (0.5 - normalizedY) * 50

        gsap.to(video, {
            scale: 1.1,
            transform: `translate3d(${moveX}px, ${moveY}px, 0)`,
            duration: 1.0,
            ease: 'power2.out'
        })
    }, [isMouseInside])

    const handleMouseEnter = useCallback(() => {
        setIsMouseInside(true)
    }, [])

    const handleScroll = useCallback(() => {
        resetScrollIndicator()
    }, [resetScrollIndicator])

    const handleGlobalMouseMove = useCallback((e: MouseEvent) => {
        setMousePosition({ x: e.clientX, y: e.clientY })
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
                onUpdate: ({ progress }) => {
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
        if (isNavigating) return

        const container = containerRef.current
        if (!container) return

        setIsNavigating(true)
        setNavigationTarget(scrollPosition)

        const containerHeight = container.offsetHeight
        const windowHeight = window.innerHeight
        const scrollDistance = containerHeight - windowHeight

        const targetScroll = scrollDistance * scrollPosition

        window.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
        })

        setTimeout(() => {
            setIsNavigating(false)
            setNavigationTarget(null)
        }, 800)
    }, [isNavigating])

    const handleInstructionsClose = useCallback(() => {
        setShowInstructions(false)
        setHasShownInitialHelp(true)
    }, [])

    useEffect(() => {
        if (showInstructions || showObjectModal) {
            if (showScrollIndicator) {
                setIsIndicatorHiding(true)
                setTimeout(() => {
                    setShowScrollIndicator(false)
                    setIsIndicatorHiding(false)
                }, 400)
            }
        }
    }, [showInstructions, showObjectModal, showScrollIndicator])

    const handleHelpClick = useCallback(() => {
        setShowInstructions(true)
    }, [])

    const handleObjectClick = useCallback((objectId: string) => {
        const objectInfo = objectData[objectId]
        if (objectInfo) {
            setSelectedObject(objectInfo)
            setShowObjectModal(true)
        }

        resetScrollIndicator()
    }, [resetScrollIndicator])

    const handleObjectModalClose = useCallback(() => {
        setShowObjectModal(false)
        setSelectedObject(null)

        resetScrollIndicator()
    }, [resetScrollIndicator])

    const handleEditModeToggle = useCallback((editMode: boolean) => {
        setIsEditMode(editMode)
    }, [])

    useEffect(() => {
        if (!hasShownInitialHelp) {
            const timer = setTimeout(() => {
                setShowInstructions(true)
            }, 1000)

            return () => clearTimeout(timer)
        }
    }, [hasShownInitialHelp])

    const shouldAutoShow = useMemo(() => {
        return !hasShownInitialHelp && showInstructions
    }, [hasShownInitialHelp, showInstructions])

    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        window.addEventListener('mousemove', handleGlobalMouseMove)

        scrollTimeoutRef.current = window.setTimeout(() => {
            startScrollIndicatorCycle()
        }, 10000)

        return () => {
            window.removeEventListener('scroll', handleScroll)
            window.removeEventListener('mousemove', handleGlobalMouseMove)
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current)
            }
            if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current)
            }
        }
    }, [handleScroll, handleGlobalMouseMove, startScrollIndicatorCycle])

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

            <VideoHighlights
                currentProgress={scrollProgress}
                onObjectClick={handleObjectClick}
                isEditMode={isEditMode}
                isNavigating={isNavigating}
                navigationTarget={navigationTarget}
            />

            <EditModeIndicators isEditMode={isEditMode} />

            <NavigationMap
                onNavigate={handleNavigate}
                currentProgress={scrollProgress}
                onHelpClick={handleHelpClick}
                isEditMode={isEditMode}
                onEditModeToggle={handleEditModeToggle}
            />

            <SceneNavigation
                onNavigate={handleNavigate}
                currentProgress={scrollProgress}
            />

            <InstructionsModal
                isVisible={showInstructions}
                onClose={handleInstructionsClose}
                isAutoShow={shouldAutoShow}
            />

            <ObjectModal
                isVisible={showObjectModal}
                onClose={handleObjectModalClose}
                objectInfo={selectedObject}
            />

            {showScrollIndicator && shouldShowIndicator() && (
                <div
                    className={`scroll-indicator ${isIndicatorHiding ? 'hiding' : ''}`}
                    style={{
                        position: 'fixed',
                        left: mousePosition.x - 50,
                        top: mousePosition.y + 20,
                        zIndex: 1000,
                        pointerEvents: 'none'
                    }}
                >
                    <div className="scroll-indicator-icon">↓</div>
                    <div className="scroll-indicator-text">Scroll to explore</div>
                </div>
            )}
        </div>
    )
} 
