import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useNavigationData } from '../../../hooks/useNavigationData'
import './SceneNavigation.css'

interface SceneNavigationProps {
    onNavigate: (scrollPosition: number) => void
    currentProgress: number
}

export function SceneNavigation({ onNavigate, currentProgress }: SceneNavigationProps) {
    const leftArrowRef = useRef<HTMLButtonElement>(null)
    const rightArrowRef = useRef<HTMLButtonElement>(null)
    const [currentIndex, setCurrentIndex] = useState(0)
    const { navigationPoints } = useNavigationData()

    const activePoint = navigationPoints.find(point =>
        currentProgress >= point.highlightRange.start &&
        currentProgress <= point.highlightRange.end
    )

    useEffect(() => {
        if (activePoint) {
            const activeIndex = navigationPoints.findIndex(point => point.id === activePoint.id)
            if (activeIndex !== -1 && activeIndex !== currentIndex) {
                setCurrentIndex(activeIndex)
            }
        }
    }, [activePoint, currentIndex])

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
        const newIndex = currentIndex > 0 ? currentIndex - 1 : navigationPoints.length - 1
        const targetPoint = navigationPoints[newIndex]

        setCurrentIndex(newIndex)
        onNavigate(targetPoint.scrollPosition)

        gsap.to(leftArrowRef.current, {
            scale: 0.9,
            duration: 0.15,
            ease: "power2.out",
            yoyo: true,
            repeat: 1
        })
    }

    const handleNext = () => {
        const newIndex = currentIndex < navigationPoints.length - 1 ? currentIndex + 1 : 0
        const targetPoint = navigationPoints[newIndex]

        setCurrentIndex(newIndex)
        onNavigate(targetPoint.scrollPosition)

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