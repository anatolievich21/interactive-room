# Interactive Relaxation Room Experience

A modern, cinematic web interface with scroll-controlled animations and interactive highlights.

## Features

- **Interactive Video Experience**: Scroll-controlled video playback with smooth transitions
- **Smart Highlights**: Interactive objects that appear at specific video timestamps
- **Edit Mode**: Drag-and-drop functionality to reposition highlights
- **Navigation System**: Multiple ways to navigate between highlights (arrows, map, list)
- **Responsive Design**: Optimized for desktop and mobile devices
- **Smooth Animations**: GSAP-powered animations for all interactions
- **Resource Preloading**: Efficient loading of videos, images, and assets
- **Persistent Storage**: Highlight positions saved in localStorage

## Technologies

- **React 19** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **GSAP (GreenSock Animation Platform)** - Professional animations and ScrollTrigger
- **CSS3** - Modern styling with animations and responsive design

## Project Structure

```
src/
├── components/
│   ├── interactive/
│   │   ├── buttons/          # UI buttons (Help, Edit, Burger)
│   │   ├── highlights/       # Video highlight components
│   │   ├── indicators/       # Status indicators
│   │   ├── modals/          # Modal components
│   │   ├── navigation/      # Navigation components
│   │   └── data/           # Data and configuration
│   ├── scenes/             # Main scene components
│   └── ui/                 # Shared UI components
├── hooks/                  # Custom React hooks
├── utils/                  # Utility functions
└── assets/                 # Static assets
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Preview Build

```bash
npm run preview
```

## Linting

```bash
npm run lint
```

## Key Components

### Interactive Elements
- **VideoHighlights**: Renders interactive highlights with drag-and-drop editing
- **NavigationMap**: List-based navigation between highlights
- **SceneNavigation**: Arrow-based navigation controls
- **InstructionsModal**: Step-by-step user guidance
- **ObjectModal**: Detailed object information display

### Scene Management
- **LoadingScreen**: Preload progress and initial experience
- **StartScene**: Introduction with video background
- **MainScene**: Main interactive experience with video and highlights

### Custom Hooks
- **useNavigationData**: Centralized navigation and highlight data management
- **useVideoPreloader**: Resource preloading for smooth experience

## Features in Detail

### Edit Mode
- Toggle edit mode with dedicated button
- Drag highlights to reposition them
- Save/Reset functionality with visual feedback
- Persistent storage of positions

### Navigation
- Multiple navigation methods (arrows, map, list)
- Smooth transitions between highlights
- Prevents intermediate highlight flashing
- Synchronized with video playback

### Animations
- GSAP-powered smooth animations
- Context-based animation management
- Proper cleanup to prevent memory leaks
- Staggered and sequenced animations

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Performance

- Optimized video loading and playback
- Efficient DOM manipulation
- Debounced scroll events
- Resource preloading for smooth experience

## Contributing

1. Follow TypeScript best practices
2. Use functional components with hooks
3. Maintain consistent code style
4. Add proper error handling
5. Test on multiple devices and browsers
