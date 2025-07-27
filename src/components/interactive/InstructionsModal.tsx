import { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { gsap } from 'gsap'
import './InstructionsModal.css'

interface InstructionsModalProps {
    isVisible: boolean
    onClose: () => void
    isAutoShow?: boolean
}

export function InstructionsModal({ isVisible, onClose, isAutoShow = false }: InstructionsModalProps) {
    const [currentStep, setCurrentStep] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)

    const instructions = useMemo(() => [
        {
            title: "Welcome to Your Interactive Room!",
            description: "Explore every corner of your perfect space with intuitive navigation.",
            icon: "🏠",
            details: "Scroll up and down to move through the room"
        },
        {
            title: "Navigation Map",
            description: "Use the navigation map in the top-right corner to jump to specific areas.",
            icon: "🗺️",
            details: "Click the menu icon to open navigation"
        },
        {
            title: "Interactive Elements",
            description: "Look for highlighted areas and click on them to learn more.",
            icon: "✨",
            details: "Hotspots will appear on interactive objects"
        },
        {
            title: "Mouse Movement",
            description: "Move your mouse over the video for dynamic camera effects.",
            icon: "🖱️",
            details: "Hover to see parallax effects"
        }
    ], [])

    useEffect(() => {
        if (isVisible && containerRef.current) {
            gsap.killTweensOf(containerRef.current)

            setIsAnimating(true)

            if (isAutoShow) {
                gsap.set(containerRef.current, {
                    opacity: 0,
                    scale: 0.8,
                    y: 20
                })

                const timer = setTimeout(() => {
                    gsap.to(containerRef.current, {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        duration: 0.8,
                        ease: 'back.out(1.7)',
                        onComplete: () => setIsAnimating(false)
                    })
                }, 1000)

                return () => clearTimeout(timer)
            } else {
                gsap.set(containerRef.current, {
                    opacity: 0,
                    scale: 0.9,
                    y: 10
                })

                gsap.to(containerRef.current, {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.out',
                    onComplete: () => setIsAnimating(false)
                })
            }
        }
    }, [isVisible, isAutoShow])

    useEffect(() => {
        if (!isVisible) {
            setIsAnimating(false)
        }
    }, [isVisible])

    const handleNext = useCallback(() => {
        if (currentStep < 3) {
            setIsAnimating(true)
            gsap.to(contentRef.current, {
                opacity: 0,
                x: -20,
                duration: 0.2,
                ease: 'power2.in',
                onComplete: () => {
                    setCurrentStep(currentStep + 1)
                    gsap.to(contentRef.current, {
                        opacity: 1,
                        x: 0,
                        duration: 0.3,
                        ease: 'power2.out',
                        onComplete: () => setIsAnimating(false)
                    })
                }
            })
        } else {
            handleClose()
        }
    }, [currentStep])

    const handlePrev = useCallback(() => {
        if (currentStep > 0) {
            setIsAnimating(true)
            gsap.to(contentRef.current, {
                opacity: 0,
                x: 20,
                duration: 0.2,
                ease: 'power2.in',
                onComplete: () => {
                    setCurrentStep(currentStep - 1)
                    gsap.to(contentRef.current, {
                        opacity: 1,
                        x: 0,
                        duration: 0.3,
                        ease: 'power2.out',
                        onComplete: () => setIsAnimating(false)
                    })
                }
            })
        }
    }, [currentStep])

    const handleClose = useCallback(() => {
        if (isAnimating) return

        setIsAnimating(true)
        gsap.to(containerRef.current, {
            opacity: 0,
            scale: 0.9,
            y: 20,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                setIsAnimating(false)
                onClose()
                setCurrentStep(0)
            }
        })
    }, [onClose])

    const handleSkip = useCallback(() => {
        if (isAnimating) return
        if (!containerRef.current) return

        setIsAnimating(true)
        gsap.to(containerRef.current, {
            opacity: 0,
            scale: 0.9,
            y: 20,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                setIsAnimating(false)
                onClose()
                setCurrentStep(0)
            }
        })
    }, [onClose])

    const currentInstruction = useMemo(() => instructions[currentStep], [currentStep])
    const isFirstStep = useMemo(() => currentStep === 0, [currentStep])
    const isLastStep = useMemo(() => currentStep === 3, [currentStep])

    if (!isVisible) return null

    return (
        <div className="instructions-modal-overlay" onClick={handleClose}>
            <div className="instructions-modal" ref={containerRef} onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={handleSkip}>
                    Skip
                </button>

                <div className="modal-content" ref={contentRef}>
                    <div className="instruction-icon">
                        {currentInstruction.icon}
                    </div>

                    <h2 className="instruction-title">
                        {currentInstruction.title}
                    </h2>

                    <p className="instruction-description">
                        {currentInstruction.description}
                    </p>

                    <div className="instruction-details">
                        <span className="details-icon">💡</span>
                        <span>{currentInstruction.details}</span>
                    </div>

                    <div className="progress-indicators">
                        {instructions.map((_, index) => (
                            <div
                                key={index}
                                className={`progress-dot ${index === currentStep ? 'active' : ''}`}
                                onClick={() => {
                                    if (!isAnimating) {
                                        setCurrentStep(index)
                                    }
                                }}
                            />
                        ))}
                    </div>
                </div>

                <div className="modal-navigation">
                    <button
                        className={`nav-button prev ${isFirstStep ? 'disabled' : ''}`}
                        onClick={handlePrev}
                        disabled={isFirstStep || isAnimating}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M15 18L9 12L15 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        Previous
                    </button>

                    <button
                        className={`nav-button next ${isLastStep ? 'primary' : ''}`}
                        onClick={handleNext}
                        disabled={isAnimating}
                    >
                        {isLastStep ? 'Get Started!' : 'Next'}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M9 18L15 12L9 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
} 