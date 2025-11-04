# Globe Explorer

An interactive 3D globe visualization application with country filtering, flight path animations, and theme switching.

## Features

- **Interactive 3D Globe**: Orthographic projection with auto-rotation and manual drag controls
- **Country Selection**: Search and select countries with visual highlighting and persistent state
- **Flight Path Animations**: Animated arcs connecting selected countries along great circle routes
- **Responsive Design**: Optimized for desktop and mobile with touch gesture support
- **Dark/Light Themes**: Seamless theme switching with smooth transitions
- **Zoom Controls**: Smooth zooming with scale limits and programmatic controls

## Architecture

The application is built with performance and maintainability in mind:

### Custom Hooks
- `useGlobeData` - Manages world topology data fetching and caching
- `useDimensions` - ResizeObserver-based responsive sizing
- `useKV` - Spark persistent storage for selected countries
- `useIsMobile` - Responsive breakpoint detection

### Optimized Components
All major components use `React.memo` to prevent unnecessary re-renders:
- `Globe` - D3-powered SVG visualization with imperative API
- `FilterPanel` - Searchable country list with memoized buttons
- `ZoomControls` - Grouped control buttons
- `ThemeToggle` - Animated theme switcher
- `AnimatedCounter` - Spring-based number animations

### Performance Optimizations
- **Memoization**: All callbacks wrapped in `useCallback`, expensive computations in `useMemo`
- **Efficient D3 Updates**: Data joins for minimal DOM manipulation
- **RequestAnimationFrame**: Smooth flight path marker animations
- **Cleanup**: All timers, intervals, and animation frames properly cleaned up
- **GPU Acceleration**: CSS `will-change` and `vector-effect` for smooth SVG rendering
- **Lazy Loading**: World data fetched once and cached

### Utility Libraries
- `globe-utils.ts` - D3 helper functions (interpolation, path generation, visibility)
- `constants.ts` - Country list data

## Technology Stack

- **React 19** with TypeScript
- **D3.js** for geographic projections and path generation
- **TopoJSON** for world map data
- **Framer Motion** for animations
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Phosphor Icons** for iconography

## Development

The app uses Vite for fast development and optimized builds.

```bash
npm install
npm run dev
```

## Performance Notes

- Globe renders at consistent 60fps on modern hardware
- Flight path animations use RAF for optimal performance
- Component re-renders minimized through memo and callback optimization
- Responsive design adapts seamlessly from mobile to desktop
- All interactions feel immediate with <100ms response times
