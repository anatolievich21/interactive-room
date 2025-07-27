import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import './VideoHighlights.css'

interface VideoHighlight {
    id: string
    name: string
    icon: string
    highlightRange: {
        start: number
        end: number
    }
    position: {
        x: number // відсотки від ширини відео
        y: number // відсотки від висоти відео
    }
}

const videoHighlights: VideoHighlight[] = [
    {
        id: 'sofa',
        name: 'Sofa',
        icon: '🛋️',
        highlightRange: { start: 0.0, end: 0.05 },
        position: { x: 25, y: 70 } // позиція дивана на відео
    },
    {
        id: 'fireplace',
        name: 'Fireplace',
        icon: '🔥',
        highlightRange: { start: 0.15, end: 0.20 },
        position: { x: 75, y: 60 } // позиція каміна на відео
    },
    {
        id: 'tv',
        name: 'TV',
        icon: '📺',
        highlightRange: { start: 0.30, end: 0.40 },
        position: { x: 50, y: 30 } // позиція ТВ на відео
    },
    {
        id: 'bookshelf',
        name: 'Bookshelf',
        icon: '📚',
        highlightRange: { start: 0.60, end: 0.65 },
        position: { x: 20, y: 40 } // позиція шкафа на відео
    }
]

interface VideoHighlightsProps {
    currentProgress: number
    onObjectClick?: (objectId: string) => void
}

export function VideoHighlights({ currentProgress, onObjectClick }: VideoHighlightsProps) {
    const highlightsRef = useRef<HTMLDivElement>(null)
    const highlightsMap = useRef<Map<string, HTMLDivElement>>(new Map())

    useEffect(() => {
        if (!highlightsRef.current) return

        videoHighlights.forEach(highlight => {
            const isInRange = currentProgress >= highlight.highlightRange.start &&
                currentProgress <= highlight.highlightRange.end

            let highlightElement = highlightsMap.current.get(highlight.id)

            if (isInRange && !highlightElement) {
                // Створюємо новий елемент
                highlightElement = document.createElement('div')
                highlightElement.className = 'video-highlight'
                highlightElement.style.left = `${highlight.position.x}%`
                highlightElement.style.top = `${highlight.position.y}%`
                highlightElement.innerHTML = `
                        <div class="highlight-icon">${highlight.icon}</div>
                        <div class="highlight-name">${highlight.name}</div>
                        <div class="highlight-pulse-ring"></div>
                    `

                if (onObjectClick) {
                    highlightElement.style.cursor = 'pointer'
                    highlightElement.addEventListener('click', () => {
                        onObjectClick(highlight.id)
                    })
                }

                highlightsRef.current?.appendChild(highlightElement)
                highlightsMap.current.set(highlight.id, highlightElement)

                // Анімація появи
                gsap.fromTo(highlightElement,
                    {
                        opacity: 0,
                        scale: 0.5,
                        rotation: -10
                    },
                    {
                        opacity: 1,
                        scale: 1,
                        rotation: 0,
                        duration: 0.6,
                        ease: 'back.out(1.7)'
                    }
                )
            } else if (!isInRange && highlightElement) {
                // Анімація зникнення
                gsap.to(highlightElement, {
                    opacity: 0,
                    scale: 0.5,
                    rotation: 10,
                    duration: 0.4,
                    ease: 'power2.in',
                    onComplete: () => {
                        if (highlightElement && highlightElement.parentNode) {
                            highlightElement.parentNode.removeChild(highlightElement)
                            highlightsMap.current.delete(highlight.id)
                        }
                    }
                })
            }
        })
    }, [currentProgress])

    useEffect(() => {
        return () => {
            highlightsMap.current.clear()
        }
    }, [])

    return (
        <div className="video-highlights" ref={highlightsRef} />
    )
} 