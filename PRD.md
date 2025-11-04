# Planning Guide

An interactive 2D globe application that allows users to explore countries around the world with zoom capabilities, country filters, and beautiful day/night theme switching.

**Experience Qualities**:
1. **Immersive** - The globe should feel like a living, interactive world map that responds naturally to user interactions
2. **Elegant** - Clean, modern interface with smooth animations and thoughtful visual hierarchy that doesn't distract from exploration
3. **Intuitive** - Controls and filters should be immediately discoverable with minimal learning curve

**Complexity Level**: Light Application (multiple features with basic state)
  - The app provides interactive globe visualization with zoom, pan, country filtering, and theme switching - making it more than a single-purpose tool but not requiring complex state management or accounts.

## Essential Features

### Interactive Globe Visualization
- **Functionality**: Render a 2D world map as an interactive globe projection that users can pan and zoom
- **Purpose**: Provides an engaging, spatial way to explore world geography
- **Trigger**: Automatically rendered on app load
- **Progression**: App loads → Globe renders with all countries visible → User can drag to rotate → User can scroll to zoom
- **Success criteria**: Globe renders smoothly at 60fps, all countries are visible and properly labeled, zoom transitions are smooth

### Country Filtering System
- **Functionality**: Allow users to filter and highlight specific countries or regions from a searchable list
- **Purpose**: Helps users quickly find and focus on countries of interest
- **Trigger**: User clicks filter button in top-left corner
- **Progression**: User opens filter panel → Types country name or selects from list → Globe highlights selected countries → User can clear filters to reset
- **Success criteria**: Filter response is instant (<100ms), highlighted countries are visually distinct, clear affordance for removing filters

### Zoom Controls
- **Functionality**: Smooth zoom in/out on the globe with mouse wheel or touch gestures, limited to country-level detail
- **Purpose**: Allow users to see countries more clearly without overwhelming detail
- **Trigger**: Mouse wheel scroll or pinch gesture
- **Progression**: User scrolls/pinches → Globe smoothly zooms → Countries become more visible → Zoom stops at maximum country-level detail
- **Success criteria**: Zoom feels natural (200-300ms transitions), minimum zoom shows full globe, maximum zoom shows country details clearly

### Day/Night Theme Toggle
- **Functionality**: Switch between dark and light color schemes with smooth transitions
- **Purpose**: Provides comfortable viewing in different lighting conditions and personal preference
- **Trigger**: User clicks theme toggle button
- **Progression**: User clicks toggle → Theme smoothly transitions → All UI elements adapt → Preference is saved
- **Success criteria**: Theme transition is smooth (300ms), all elements remain readable, preference persists across sessions

### Flight Path Animations
- **Functionality**: Display animated flight paths connecting selected countries with smooth arc trajectories
- **Purpose**: Visualize connections and relationships between geographic locations with engaging animations
- **Trigger**: Automatically appears when 2 or more countries are selected
- **Progression**: User selects multiple countries → Flight paths appear with arc trajectories → Animated markers travel along paths → Paths fade in/out smoothly
- **Success criteria**: Paths follow great circle routes, animations are smooth (60fps), visual hierarchy keeps paths subtle but visible

## Edge Case Handling

- **No countries selected**: Globe shows all countries in neutral state with clear call-to-action in filter panel
- **Search with no results**: Display helpful "No countries found" message with suggestion to try different terms
- **Small screens/mobile**: Globe remains interactive with touch gestures, filters adapt to drawer/modal on mobile
- **Zoom limits**: Graceful resistance feedback when reaching min/max zoom levels
- **Fast interactions**: Debounce rapid zoom/pan events to maintain smooth performance

## Design Direction

The design should evoke a sense of exploration and wonder, feeling both modern and timeless. It should balance the richness of geographic data with a clean, uncluttered interface. The globe itself is the hero element, with controls elegantly receding until needed. The aesthetic should feel sophisticated and professional - like a premium digital atlas or geographic intelligence tool.

## Color Selection

Complementary color scheme (opposite colors) with oceanic blues contrasted against warm earth tones for a natural geographic feel.

- **Primary Color**: Deep Ocean Blue (oklch(0.35 0.08 240)) - Communicates exploration, depth, and geographic context as the water/ocean color
- **Secondary Colors**: 
  - Soft Earth (oklch(0.88 0.02 80)) - Represents land masses with a subtle warm tone
  - Slate Gray (oklch(0.45 0.02 240)) - For UI elements and borders, maintains professional feel
- **Accent Color**: Vibrant Coral (oklch(0.68 0.18 25)) - For interactive elements, CTAs, and highlighted countries - creates energy and draws attention
- **Foreground/Background Pairings**:
  - Background Light (oklch(0.98 0 0)): Foreground Dark Navy (oklch(0.25 0.05 240)) - Ratio 13.8:1 ✓
  - Background Dark (oklch(0.18 0.03 240)): Foreground Light (oklch(0.98 0 0)) - Ratio 14.2:1 ✓
  - Primary Blue (oklch(0.35 0.08 240)): White text (oklch(1 0 0)) - Ratio 9.1:1 ✓
  - Accent Coral (oklch(0.68 0.18 25)): Dark Navy (oklch(0.25 0.05 240)) - Ratio 6.2:1 ✓
  - Card Light (oklch(1 0 0)): Foreground (oklch(0.25 0.05 240)) - Ratio 14.5:1 ✓
  - Card Dark (oklch(0.22 0.03 240)): Foreground Light (oklch(0.98 0 0)) - Ratio 12.8:1 ✓

## Font Selection

Typography should convey precision and modernity while maintaining excellent readability for geographic labels and UI text - using a clean geometric sans-serif for a contemporary atlas feel.

- **Typographic Hierarchy**:
  - H1 (App Title): Inter Bold / 24px / -0.02em letter spacing
  - H2 (Country Names): Inter SemiBold / 18px / -0.01em letter spacing  
  - H3 (Section Headers): Inter Medium / 16px / normal letter spacing
  - Body (UI Text): Inter Regular / 14px / normal letter spacing / 1.5 line height
  - Small (Labels): Inter Regular / 12px / 0.01em letter spacing
  - Caption (Metadata): Inter Regular / 11px / 0.02em letter spacing / muted color

## Animations

Animations should feel like navigating a physical globe - smooth, natural, and purposeful. Motion creates spatial awareness and makes the digital experience feel tangible. Every animation reinforces the sense of exploring a real geographic space.

- **Purposeful Meaning**: Zoom and rotation animations follow physics-based easing to mimic real-world momentum. Theme transitions feel like ambient lighting changes. Filter selections pulse gently to confirm interaction.
- **Hierarchy of Movement**: 
  - Primary: Globe rotation and zoom (300-400ms custom easing)
  - Secondary: Filter panel slide-in (250ms ease-out)
  - Tertiary: Button hover states and theme toggle (150ms ease-in-out)
  - Micro: Country highlight pulse on selection (200ms)

## Component Selection

- **Components**: 
  - `Card` for filter panel with subtle shadow and backdrop blur for glassmorphic effect
  - `Button` for theme toggle and filter actions with custom Tailwind classes (rounded-full for theme toggle)
  - `Input` for country search with custom styling
  - `ScrollArea` for scrollable country list
  - `Badge` for selected country tags with dismiss buttons
  - `Switch` component styled as sun/moon toggle for theme
  - `Popover` or `Sheet` for mobile filter panel
  - `Separator` for visual dividers in filter panel

- **Customizations**: 
  - Custom SVG globe component using D3.js orthographic projection
  - Custom zoom control overlay (+ / - buttons) positioned bottom-right
  - Animated country path elements with hover and selection states
  - Custom tooltip component for country names on hover

- **States**:
  - Buttons: Subtle scale (0.98) on active, gentle glow on hover, muted when disabled
  - Inputs: Border thickens and color changes on focus, subtle inner shadow
  - Globe: Countries have default, hover (brightened), selected (accent color), and filtered-out (muted) states
  - Theme toggle: Smooth rotation animation (180deg) on toggle with icon transition

- **Icon Selection**:
  - `MagnifyingGlass` for search input
  - `FunnelSimple` for filter panel toggle
  - `X` for clearing selections and closing panels
  - `Sun` and `Moon` for theme toggle (with smooth crossfade)
  - `Plus` and `Minus` for zoom controls
  - `Globe` for app icon/branding

- **Spacing**: 
  - Container padding: p-6 (24px) on desktop, p-4 (16px) on mobile
  - Component gaps: gap-4 (16px) for related groups, gap-2 (8px) for tight groups
  - Filter panel: w-80 (320px) with p-4 internal padding
  - Button padding: px-4 py-2 for primary actions, p-2 for icon-only
  - Consistent 8px grid system throughout

- **Mobile**: 
  - Globe takes full viewport with safe area insets
  - Filter panel becomes bottom sheet drawer (Sheet component) that slides up
  - Theme toggle and filter trigger positioned as floating action buttons (FAB) 
  - Zoom controls remain bottom-right but slightly larger touch targets (44x44px min)
  - Search input becomes full-width in mobile drawer
  - Touch gestures: drag to rotate, pinch to zoom, tap to select country
