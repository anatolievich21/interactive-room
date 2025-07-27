export interface ObjectInfo {
    id: string
    name: string
    icon: string
    description: string
    features: string[]
    details: string
}

export const objectData: Record<string, ObjectInfo> = {
    sofa: {
        id: 'sofa',
        name: 'Comfortable Sofa',
        icon: '🛋️',
        description: 'A luxurious and comfortable sofa perfect for relaxation and entertainment. Designed with premium materials for ultimate comfort.',
        features: [
            'Premium fabric upholstery',
            'Ergonomic design for maximum comfort',
            'Generous seating space for 3-4 people',
            'Built-in storage compartments',
            'Easy-to-clean materials'
        ],
        details: 'Perfect centerpiece for your living room, offering both style and functionality.'
    },
    fireplace: {
        id: 'fireplace',
        name: 'Cozy Fireplace',
        icon: '🔥',
        description: 'A modern electric fireplace that creates a warm and inviting atmosphere. Perfect for creating a cozy ambiance.',
        features: [
            'Realistic flame effects',
            'Adjustable heat settings',
            'Remote control operation',
            'Energy-efficient LED technology',
            'Safe for children and pets'
        ],
        details: 'Creates the perfect atmosphere for romantic evenings or family gatherings.'
    },
    tv: {
        id: 'tv',
        name: 'Smart TV Entertainment',
        icon: '📺',
        description: 'A state-of-the-art smart TV with stunning picture quality and smart features for endless entertainment.',
        features: [
            '4K Ultra HD resolution',
            'Built-in streaming apps',
            'Voice control capabilities',
            'Multiple HDMI ports',
            'Wireless screen mirroring'
        ],
        details: 'Your gateway to endless entertainment with crystal-clear picture quality.'
    },
    bookshelf: {
        id: 'bookshelf',
        name: 'Elegant Bookshelf',
        icon: '📚',
        description: 'A sophisticated bookshelf that combines storage with style. Perfect for displaying your favorite books and decorative items.',
        features: [
            'Adjustable shelf heights',
            'Solid wood construction',
            'Hidden cable management',
            'Built-in lighting options',
            'Modular design for easy assembly'
        ],
        details: 'Organize your collection while adding elegance to your space.'
    }
} 