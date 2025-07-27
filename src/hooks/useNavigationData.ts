import { useMemo, useState, useCallback } from 'react'

export interface NavigationPoint {
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

export interface VideoHighlight {
    id: string
    name: string
    icon: string
    highlightRange: {
        start: number
        end: number
    }
    position: {
        x: number
        y: number
    }
}

const baseNavigationData = [
    {
        id: 'sofa',
        name: 'Sofa',
        icon: '🛋️',
        description: 'Comfort zone',
        defaultPosition: { x: 25, y: 70 }
    },
    {
        id: 'fireplace',
        name: 'Fireplace',
        icon: '🔥',
        description: 'Warm and cozy',
        defaultPosition: { x: 75, y: 60 }
    },
    {
        id: 'tv',
        name: 'TV',
        icon: '📺',
        description: 'Entertainment hub',
        defaultPosition: { x: 50, y: 30 }
    },
    {
        id: 'bookshelf',
        name: 'Bookshelf',
        icon: '📚',
        description: 'Knowledge corner',
        defaultPosition: { x: 20, y: 40 }
    }
]

const defaultTimeRanges = {
    sofa: { start: 0.02, end: 0.04 },
    fireplace: { start: 0.13, end: 0.16 },
    tv: { start: 0.30, end: 0.35 },
    bookshelf: { start: 0.66, end: 0.70 }
}

export function useNavigationData() {
    const [timeRanges, setTimeRanges] = useState(defaultTimeRanges)

    const navigationPoints = useMemo((): NavigationPoint[] => {
        return baseNavigationData.map(item => {
            const range = timeRanges[item.id as keyof typeof timeRanges]
            const scrollPosition = (range.start + range.end) / 2

            return {
                id: item.id,
                name: item.name,
                icon: item.icon,
                scrollPosition,
                description: item.description,
                highlightRange: range
            }
        })
    }, [timeRanges])

    const videoHighlights = useMemo((): VideoHighlight[] => {
        return baseNavigationData.map(item => {
            const range = timeRanges[item.id as keyof typeof timeRanges]

            return {
                id: item.id,
                name: item.name,
                icon: item.icon,
                highlightRange: range,
                position: item.defaultPosition
            }
        })
    }, [timeRanges])

    const updateTimeRange = useCallback((id: string, newRange: { start: number, end: number }) => {
        setTimeRanges(prev => ({
            ...prev,
            [id]: newRange
        }))
    }, [])

    const resetTimeRanges = useCallback(() => {
        setTimeRanges(defaultTimeRanges)
    }, [])

    return {
        navigationPoints,
        videoHighlights,
        timeRanges,
        updateTimeRange,
        resetTimeRanges
    }
} 