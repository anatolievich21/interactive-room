import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import './ObjectModal.css'

interface ObjectInfo {
    id: string
    name: string
    icon: string
    description: string
    features: string[]
    details: string
}

interface ObjectModalProps {
    isVisible: boolean
    onClose: () => void
    objectInfo: ObjectInfo | null
}

export function ObjectModal({ isVisible, onClose, objectInfo }: ObjectModalProps) {
    const [isAnimating, setIsAnimating] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isVisible) {
            setIsMounted(true)
        }
    }, [isVisible])

    useEffect(() => {
        if (isMounted && containerRef.current) {
            gsap.killTweensOf(containerRef.current)

            gsap.set(containerRef.current, {
                scale: 0,
                y: 20,
                rotation: -5
            })

            requestAnimationFrame(() => {
                containerRef.current?.classList.add('visible')
                if (contentRef.current) {
                    gsap.set(contentRef.current.children, { opacity: 0, y: 20 })
                    // Встановлюємо початковий стан для feature items
                    const featureItems = contentRef.current.querySelectorAll('.feature-item')
                    gsap.set(featureItems, { opacity: 0, x: -20 })
                }
            })

            setIsAnimating(true)

            gsap.to(containerRef.current, {
                scale: 1,
                y: 0,
                rotation: 0,
                duration: 0.6,
                ease: 'back.out(1.7)',
                onComplete: () => {
                    setIsAnimating(false)
                    if (contentRef.current) {
                        gsap.fromTo(contentRef.current.children,
                            { opacity: 0, y: 20 },
                            {
                                opacity: 1,
                                y: 0,
                                duration: 0.4,
                                stagger: 0.1,
                                ease: 'power2.out'
                            }
                        )

                        // Додаткова анімація для feature items
                        const featureItems = contentRef.current.querySelectorAll('.feature-item')
                        if (featureItems.length > 0) {
                            gsap.fromTo(featureItems,
                                { opacity: 0, x: -20 },
                                {
                                    opacity: 1,
                                    x: 0,
                                    duration: 0.3,
                                    stagger: 0.05,
                                    ease: 'power2.out',
                                    delay: 0.2
                                }
                            )
                        }
                    }
                }
            })
        }
    }, [isMounted])

    useEffect(() => {
        if (!isVisible && containerRef.current) {
            containerRef.current.classList.remove('visible')
            setIsAnimating(false)
        }
    }, [isVisible])

    const handleClose = useCallback(() => {
        if (isAnimating) return

        setIsAnimating(true)
        gsap.to(containerRef.current, {
            scale: 0,
            y: 20,
            rotation: 5,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                setIsAnimating(false)
                containerRef.current?.classList.remove('visible')
                onClose()
                setIsMounted(false)
            }
        })
    }, [onClose, isAnimating])

    if (!isMounted || !objectInfo) return null

    return (
        <div className="object-modal-overlay" onClick={handleClose}>
            <div className="object-modal" ref={containerRef} onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={handleClose}>
                    Close
                </button>

                <div className="modal-content" ref={contentRef}>
                    <div className="object-icon">
                        {objectInfo.icon}
                    </div>

                    <h2 className="object-title">
                        {objectInfo.name}
                    </h2>

                    <p className="object-description">
                        {objectInfo.description}
                    </p>

                    <div className="object-features">
                        <h3 className="features-title">Features</h3>
                        <ul className="features-list">
                            {objectInfo.features.map((feature, index) => {
                                const featureIcons = ['✨', '🌟', '💎', '🔥', '⚡', '🎯', '💡', '🔧', '🎨', '🚀']
                                const icon = featureIcons[index % featureIcons.length]

                                return (
                                    <li key={index} className="feature-item">
                                        <span className="feature-icon">{icon}</span>
                                        <span>{feature}</span>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>

                    <div className="object-details">
                        <span className="details-icon">
                            {objectInfo.id === 'sofa' && '🛋️'}
                            {objectInfo.id === 'fireplace' && '🔥'}
                            {objectInfo.id === 'tv' && '📺'}
                            {objectInfo.id === 'bookshelf' && '📚'}
                            {!['sofa', 'fireplace', 'tv', 'bookshelf'].includes(objectInfo.id) && '💡'}
                        </span>
                        <span>{objectInfo.details}</span>
                    </div>
                </div>
            </div>
        </div>
    )
} 