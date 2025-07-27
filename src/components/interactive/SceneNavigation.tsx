import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import './SceneNavigation.css'

interface SceneNavigationProps {
    onNavigate: (scrollPosition: number) => void
}

const navigationPoints = [
    { position: 0.1 },
    { position: 0.3 },
    { position: 0.5 },
    { position: 0.7 },
    { position: 0.9 }
]

export function SceneNavigation({ onNavigate }: SceneNavigationProps) {
    const leftArrowRef = useRef<HTMLButtonElement>(null)
    const rightArrowRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        gsap.set(leftArrowRef.current, { x: -50, opacity: 0, scale: 0.8 })
        gsap.set(rightArrowRef.current, { x: 50, opacity: 0, scale: 0.8 })

        const timer = setTimeout(() => {
            const tl = gsap.timeline()

            tl.to(leftArrowRef.current,
                {
                    x: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    ease: "back.out(1.7)"
                }
            )
                .to(rightArrowRef.current,
                    {
                        x: 0,
                        opacity: 1,
                        scale: 1,
                        duration: 0.8,
                        ease: "back.out(1.7)"
                    },
                    "-=0.6"
                )
        }, 1000)

        return () => clearTimeout(timer)
    }, [])

    const handlePrevious = () => {
        const randomIndex = Math.floor(Math.random() * navigationPoints.length)
        const targetPosition = navigationPoints[randomIndex].position
        onNavigate(targetPosition)

        gsap.to(leftArrowRef.current, {
            scale: 0.9,
            duration: 0.15,
            ease: "power2.out",
            yoyo: true,
            repeat: 1
        })
    }

    const handleNext = () => {
        const randomIndex = Math.floor(Math.random() * navigationPoints.length)
        const targetPosition = navigationPoints[randomIndex].position
        onNavigate(targetPosition)

        gsap.to(rightArrowRef.current, {
            scale: 0.9,
            duration: 0.15,
            ease: "power2.out",
            yoyo: true,
            repeat: 1
        })
    }

    return (
        <div className="scene-navigation">
            <button
                ref={leftArrowRef}
                className="nav-arrow nav-arrow-left"
                onClick={handlePrevious}
                aria-label="Previous location"
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
                <span className="nav-arrow-label">Prev</span>
            </button>

            <button
                ref={rightArrowRef}
                className="nav-arrow nav-arrow-right"
                onClick={handleNext}
                aria-label="Next location"
            >
                <span className="nav-arrow-label">Next</span>
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
    )
}

export default SceneNavigation 