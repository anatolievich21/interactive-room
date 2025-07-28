import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { EditModeToggle } from '../buttons/EditModeToggle'
import { HelpButton } from '../buttons/HelpButton'
import { BurgerButton } from '../buttons/BurgerButton'
import { useNavigationData } from '../../../hooks/useNavigationData'
import type { NavigationPoint } from '../../../hooks/useNavigationData'
import './NavigationMap.css'

interface NavigationMapProps {
    onNavigate: (scrollPosition: number) => void
    currentProgress: number
    onHelpClick?: () => void
    isEditMode?: boolean
    onEditModeToggle?: (isEditMode: boolean) => void
}

export function NavigationMap({
    onNavigate,
    currentProgress,
    onHelpClick,
    isEditMode = false,
    onEditModeToggle
}: NavigationMapProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [hoveredPoint, setHoveredPoint] = useState<string | null>(null)
    const toggleRef = useRef<HTMLButtonElement>(null)
    const pointsRef = useRef<HTMLDivElement>(null)
    const controlsRef = useRef<HTMLDivElement>(null)
    const { navigationPoints } = useNavigationData()

    const activePoint = navigationPoints.find(point =>
        currentProgress >= point.highlightRange.start &&
        currentProgress <= point.highlightRange.end
    )

    const handlePointClick = (point: NavigationPoint) => {
        onNavigate(point.scrollPosition)

        gsap.to(toggleRef.current, {
            scale: 0.9,
            duration: 0.1,
            ease: "power2.out",
            yoyo: true,
            repeat: 1
        })
    }

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded)

        gsap.to(toggleRef.current, {
            scale: 0.85,
            duration: 0.1,
            ease: "power2.out",
            yoyo: true,
            repeat: 1
        })
    }

    useEffect(() => {
        if (controlsRef.current) {
            const buttons = controlsRef.current.querySelectorAll('.navigation-controls > *')

            gsap.set(buttons, {
                y: -50,
                opacity: 0,
                scale: 0.8
            })

            const tl = gsap.timeline()

            tl.to(buttons, {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.6,
                stagger: 0.15,
                ease: "back.out(1.7)",
                delay: 1.0
            })
        }
    }, [])

    useEffect(() => {
        if (pointsRef.current) {
            const points = pointsRef.current.querySelectorAll('.navigation-point')
            const closeButton = pointsRef.current.querySelector('.close-button')

            if (isExpanded) {
                gsap.set(pointsRef.current, {
                    opacity: 0,
                    scale: 0.95,
                    y: -10
                })

                const tl = gsap.timeline()

                tl.to(pointsRef.current, {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.2,
                    ease: "power2.out"
                })
                    .to(closeButton, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.2,
                        ease: "back.out(1.7)"
                    }, '-=0.1')
                    .to(points, {
                        x: 0,
                        opacity: 1,
                        scale: 1,
                        duration: 0.3,
                        stagger: 0.03,
                        ease: "back.out(1.4)"
                    }, '-=0.05')
            }
        }
    }, [isExpanded])

    return (
        <div className={`navigation-map ${isExpanded ? 'expanded' : ''}`}>
            <div className="navigation-controls" ref={controlsRef}>
                <HelpButton onClick={onHelpClick} />

                {onEditModeToggle && (
                    <EditModeToggle
                        isEditMode={isEditMode}
                        onToggle={onEditModeToggle}
                    />
                )}

                <BurgerButton
                    ref={toggleRef}
                    onClick={toggleExpanded}
                    isExpanded={isExpanded}
                />
            </div>

            {isExpanded && (
                <div className="navigation-points" ref={pointsRef}>
                    <div className="navigation-header">
                        <h3>Navigation</h3>
                        <button
                            className="close-button"
                            onClick={toggleExpanded}
                            aria-label="Close navigation"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="points-list">
                        {navigationPoints.map((point) => {
                            const isActive = activePoint?.id === point.id
                            const isInHighlightRange = currentProgress >= point.highlightRange.start &&
                                currentProgress <= point.highlightRange.end

                            return (
                                <button
                                    key={point.id}
                                    className={`navigation-point ${isActive ? 'active' : ''} ${isInHighlightRange ? 'highlighted' : ''}`}
                                    onClick={() => handlePointClick(point)}
                                    onMouseEnter={() => setHoveredPoint(point.id)}
                                    onMouseLeave={() => setHoveredPoint(null)}
                                    aria-label={`Navigate to ${point.name}`}
                                >
                                    <span className="point-icon">{point.icon}</span>
                                    <div className="point-info">
                                        <span className="point-name">{point.name}</span>
                                        {hoveredPoint === point.id && (
                                            <span className="point-description">{point.description}</span>
                                        )}
                                    </div>
                                    {isActive && <div className="active-indicator" />}
                                    {isInHighlightRange && <div className="highlight-pulse" />}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
} 