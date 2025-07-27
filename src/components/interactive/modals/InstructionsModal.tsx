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
            description: "Experience your perfect space through an immersive video journey. Navigate seamlessly through every corner.",
            icon: "🏠",
            details: "Scroll to explore the entire room"
        },
        {
            title: "Smart Navigation",
            description: "Use the navigation map to instantly jump to specific areas: sofa, fireplace, TV, and bookshelf.",
            icon: "🗺️",
            details: "Click the menu icon (☰) in the top-right corner"
        },
        {
            title: "Interactive Highlights",
            description: "Watch for automatic highlights that appear when you reach specific areas in the room.",
            icon: "✨",
            details: "Objects will glow when you're in their viewing range"
        },
        {
            title: "Dynamic Camera Effects",
            description: "Move your mouse over the video to experience realistic camera movements and depth.",
            icon: "🖱️",
            details: "Hover anywhere on the video for parallax effects"
        },
        {
            title: "Customize Highlights",
            description: "Want to adjust highlight positions? Use edit mode to drag and reposition them exactly where you want.",
            icon: "✏️",
            details: "Click the edit icon (✏️) next to the help button"
        }
    ], [])

    useEffect(() => {
        if (isVisible && containerRef.current) {
            gsap.killTweensOf(containerRef.current)

            gsap.set(containerRef.current, {
                opacity: 0,
                scale: isAutoShow ? 0.8 : 0.9,
                y: isAutoShow ? 20 : 10
            })

            setIsAnimating(true)

            if (isAutoShow) {
                const timer = setTimeout(() => {
                    if (containerRef.current && isVisible) {
                        gsap.to(containerRef.current, {
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            duration: 0.8,
                            ease: 'back.out(1.7)',
                            onComplete: () => setIsAnimating(false)
                        })
                    }
                }, 1000)

                return () => clearTimeout(timer)
            } else {
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
        if (currentStep < 4) {
            setIsAnimating(true)
            gsap.to(contentRef.current, {
                opacity: 0,
                x: -30,
                scale: 0.95,
                duration: 0.25,
                ease: 'power2.in',
                onComplete: () => {
                    setCurrentStep(currentStep + 1)
                    gsap.fromTo(contentRef.current,
                        { opacity: 0, x: 30, scale: 0.95 },
                        {
                            opacity: 1,
                            x: 0,
                            scale: 1,
                            duration: 0.35,
                            ease: 'back.out(1.7)',
                            onComplete: () => setIsAnimating(false)
                        }
                    )
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
                x: 30,
                scale: 0.95,
                duration: 0.25,
                ease: 'power2.in',
                onComplete: () => {
                    setCurrentStep(currentStep - 1)
                    gsap.fromTo(contentRef.current,
                        { opacity: 0, x: -30, scale: 0.95 },
                        {
                            opacity: 1,
                            x: 0,
                            scale: 1,
                            duration: 0.35,
                            ease: 'back.out(1.7)',
                            onComplete: () => setIsAnimating(false)
                        }
                    )
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
    const isLastStep = useMemo(() => currentStep === 4, [currentStep])

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
                        <div className="progress-text">
                            Step {currentStep + 1} of {instructions.length}
                        </div>
                        <div className="progress-dots">
                            {instructions.map((_, index) => (
                                <div
                                    key={index}
                                    className={`progress-dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                                    onClick={() => {
                                        if (!isAnimating) {
                                            setCurrentStep(index)
                                        }
                                    }}
                                >
                                    {index < currentStep && (
                                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
                                            <path
                                                d="M20 6L9 17L4 12"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                    )}
                                </div>
                            ))}
                        </div>
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