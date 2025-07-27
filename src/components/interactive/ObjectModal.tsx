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
    const containerRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isVisible && containerRef.current) {
            gsap.killTweensOf(containerRef.current)

            gsap.set(containerRef.current, {
                opacity: 0,
                scale: 0.9,
                y: 10
            })

            setIsAnimating(true)

            gsap.to(containerRef.current, {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 0.3,
                ease: 'power2.out',
                onComplete: () => setIsAnimating(false)
            })
        }
    }, [isVisible])

    useEffect(() => {
        if (!isVisible) {
            setIsAnimating(false)
        }
    }, [isVisible])

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
            }
        })
    }, [onClose])

    if (!isVisible || !objectInfo) return null

    return (
        <div className="object-modal-overlay" onClick={handleClose}>
            <div className="object-modal" ref={containerRef} onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={handleClose}>
                    ✕
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
                            {objectInfo.features.map((feature, index) => (
                                <li key={index} className="feature-item">
                                    <span className="feature-icon">✨</span>
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="object-details">
                        <span className="details-icon">💡</span>
                        <span>{objectInfo.details}</span>
                    </div>
                </div>
            </div>
        </div>
    )
} 