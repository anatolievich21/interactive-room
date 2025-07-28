import { useMemo, useState, useCallback, useEffect } from 'react'
import { highlightStorage } from '../utils/highlightStorage'

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
        defaultPosition: { x: 64, y: 78 }
    },
    {
        id: 'fireplace',
        name: 'Fireplace',
        icon: '🔥',
        description: 'Warm and cozy',
        defaultPosition: { x: 44, y: 67 }
    },
    {
        id: 'tv',
        name: 'TV',
        icon: '📺',
        description: 'Entertainment hub',
        defaultPosition: { x: 25, y: 66 }
    },
    {
        id: 'bookshelf',
        name: 'Bookshelf',
        icon: '📚',
        description: 'Knowledge corner',
        defaultPosition: { x: 90, y: 53 }
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
    const [defaultPositions, setDefaultPositions] = useState(() => {
        const savedDefaults = highlightStorage.getDefaultPositions()
        const savedPositions = highlightStorage.loadPositions()
        const positions: Record<string, { x: number, y: number }> = {}

        baseNavigationData.forEach(item => {
            const savedDefault = savedDefaults.find(p => p.id === item.id)
            if (savedDefault) {
                positions[item.id] = savedDefault.position
            } else {
                const savedPosition = savedPositions.find(p => p.id === item.id)
                positions[item.id] = savedPosition ? savedPosition.position : item.defaultPosition
            }
        })

        return positions
    })

    useEffect(() => {
        const savedPositions = highlightStorage.loadPositions()
        const newPositions: Record<string, { x: number, y: number }> = {}

        baseNavigationData.forEach(item => {
            const savedPosition = savedPositions.find(p => p.id === item.id)
            newPositions[item.id] = savedPosition ? savedPosition.position : item.defaultPosition
        })

        setDefaultPositions(newPositions)
    }, [])

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
            const position = defaultPositions[item.id] || item.defaultPosition

            return {
                id: item.id,
                name: item.name,
                icon: item.icon,
                highlightRange: range,
                position: position
            }
        })
    }, [timeRanges, defaultPositions])

    const updateTimeRange = useCallback((id: string, newRange: { start: number, end: number }) => {
        setTimeRanges(prev => ({
            ...prev,
            [id]: newRange
        }))
    }, [])

    const resetTimeRanges = useCallback(() => {
        setTimeRanges(defaultTimeRanges)
    }, [])

    const updateDefaultPositions = useCallback(() => {
        const savedPositions = highlightStorage.loadPositions()
        const newPositions: Record<string, { x: number, y: number }> = {}

        baseNavigationData.forEach(item => {
            const savedPosition = savedPositions.find(p => p.id === item.id)
            newPositions[item.id] = savedPosition ? savedPosition.position : item.defaultPosition
        })

        setDefaultPositions(newPositions)
    }, [])

    return {
        navigationPoints,
        videoHighlights,
        timeRanges,
        updateTimeRange,
        resetTimeRanges,
        updateDefaultPositions
    }
} 