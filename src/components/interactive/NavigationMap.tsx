import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import './NavigationMap.css'

interface NavigationPoint {
    id: string
    name: string
    icon: string
    scrollPosition: number
    description: string
    highlightRange: {
        start: number
        end: number
    }
}

const navigationPoints: NavigationPoint[] = [
    {
        id: 'sofa',
        name: 'Sofa',
        icon: '🛋️',
        scrollPosition: 0.03, // середина діапазону 1-5%
        description: 'Comfort zone',
        highlightRange: { start: 0.01, end: 0.05 }
    },
    {
        id: 'fireplace',
        name: 'Fireplace',
        icon: '🔥',
        scrollPosition: 0.175, // середина діапазону 15-20%
        description: 'Warm and cozy',
        highlightRange: { start: 0.15, end: 0.20 }
    },
    {
        id: 'tv',
        name: 'TV',
        icon: '📺',
        scrollPosition: 0.35, // середина діапазону 30-40%
        description: 'Entertainment hub',
        highlightRange: { start: 0.30, end: 0.40 }
    },
    {
        id: 'bookshelf',
        name: 'Bookshelf',
        icon: '📚',
        scrollPosition: 0.625, // середина діапазону 60-65%
        description: 'Knowledge corner',
        highlightRange: { start: 0.60, end: 0.65 }
    }
]

interface NavigationMapProps {
    onNavigate: (scrollPosition: number) => void
    currentProgress: number
    onHelpClick?: () => void
}

export function NavigationMap({ onNavigate, currentProgress, onHelpClick }: NavigationMapProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [hoveredPoint, setHoveredPoint] = useState<string | null>(null)
    const toggleRef = useRef<HTMLButtonElement>(null)
    const pointsRef = useRef<HTMLDivElement>(null)

    // Визначаємо активний об'єкт на основі поточного прогресу
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
        if (isExpanded && pointsRef.current) {
            const points = pointsRef.current.querySelectorAll('.navigation-point')
            const header = pointsRef.current.querySelector('.navigation-header h3')
            const closeButton = pointsRef.current.querySelector('.close-button')

            gsap.set(points, { x: 40, opacity: 0, scale: 0.9 })
            gsap.set(header, { opacity: 0, y: -10 })
            gsap.set(closeButton, { opacity: 0, scale: 0.8 })

            const tl = gsap.timeline()

            tl.to(header, {
                opacity: 1,
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
    }, [isExpanded])

    return (
        <div className={`navigation-map ${isExpanded ? 'expanded' : ''}`}>
            <div className="navigation-controls">
                <button
                    className="help-button"
                    onClick={onHelpClick}
                    aria-label="Show help"
                    title="Help"
                >
                    ?
                </button>

                <button
                    ref={toggleRef}
                    className="navigation-toggle"
                    onClick={toggleExpanded}
                    aria-label="Toggle navigation map"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>
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