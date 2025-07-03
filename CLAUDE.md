# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue.js parcel tracking application with Flowbite styling and Tailwind CSS. The application allows users to look up parcel status and view a timeline of status updates. It supports URL-based tracking where parcel IDs can be passed via URL parameters.

## Development Commands

### Core Development
- `npm run dev` - Start development server (Vite) on port 3000
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

### Testing
- `npm test` - Run tests in watch mode with Vitest
- `npm test -- --run` - Run tests once
- `npm run test:ui` - Open Vitest UI for interactive testing
- `npm run coverage` - Generate test coverage report

### Code Quality
- `npm run lint` - Run ESLint and auto-fix issues
- `npm run lint:check` - Run ESLint without auto-fixing (used in CI)

### Running Single Tests
```bash
# Run specific test file
npm test src/components/__tests__/TrackingInput.test.js

# Run tests matching pattern
npm test -- --run -t "should render correctly"
```

## Architecture

### Application Structure
The app uses Vue 3 with the Options API and Vue Router for navigation. It follows a component-based architecture with clear separation between views and reusable components.

**Key Components:**
- `App.vue` - Root layout with navigation and router-view
- `views/ParcelTracker.vue` - Main view handling tracking logic and state management
- `components/TrackingInput.vue` - Input form for tracking numbers with validation
- `components/ParcelTimeline.vue` - Visual timeline display of parcel status updates

### Routing Architecture
The router supports both home and tracking routes:
- `/` - Home page with empty tracking form
- `/track/:id?` - Tracking page with optional parcel ID parameter

When a parcel ID is in the URL, it automatically populates the tracking input and displays results. The ParcelTracker view watches for route parameter changes and manages the initial tracking number state.

### State Management Pattern
The application uses a parent-child communication pattern without external state management:
- `ParcelTracker.vue` manages tracking data state and URL synchronization
- `TrackingInput.vue` emits `track-parcel` events and accepts `initial-tracking-number` prop
- `ParcelTimeline.vue` receives `tracking-data` prop for display

URL changes trigger component watchers that update the tracking input and fetch new data.

### Testing Architecture
Uses Vitest with Vue Test Utils for component testing:
- Test setup in `src/test/setup.js` stubs router components globally
- Component tests in `__tests__` directories alongside source files
- Mock router and navigation for testing route-dependent functionality
- Comprehensive coverage including user interactions, props, events, and edge cases

### Styling System
- **Tailwind CSS** - Utility-first CSS framework
- **Flowbite** - Component library built on Tailwind
- **Dark mode support** - Uses Tailwind's dark mode classes
- **Responsive design** - Mobile-first approach with Tailwind breakpoints

### Mock Data
The application currently uses mock data generated in `ParcelTracker.vue#getMockTrackingData()`. This simulates a realistic parcel journey with timestamps, locations, and status descriptions.

## Code Conventions

### Vue Components
- Use PascalCase for component names in templates
- Props use camelCase naming
- Events use kebab-case (track-parcel)
- Explicitly declare emitted events with `emits` option

### ESLint Configuration
- Vue 3 recommended rules enabled
- Prettier integration for code formatting  
- CommonJS config file (.eslintrc.cjs) due to package.json type: "module"
- Test globals (describe, it, expect, vi, beforeEach, afterEach) configured
- Component naming rules enforced

### Testing Patterns
- Mock router navigation to avoid "No match for route" errors in tests
- Use `vi.fn()` for mocking functions and router methods
- Test both automatic and manual triggers for component methods
- Verify component communication through props and events
- Test edge cases like empty states and error conditions

## Important Notes

### Router Testing
When testing components that use Vue Router, always mock `$router.push` and `$route.params` to prevent navigation errors. The test setup provides global stubs, but individual tests may need specific router mocking.

### ESLint Module Configuration
The ESLint config uses `.eslintrc.cjs` (CommonJS) because package.json specifies `"type": "module"`. This prevents module import errors in the linting configuration.

### URL Parameter Handling
The tracking input clears when navigating back to home (`/`) because the ParcelTracker component watches `$route.params.id` and sets `initialTrackingNumber` to empty string when the parameter is undefined.