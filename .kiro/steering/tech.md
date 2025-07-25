# Technology Stack

## Core Framework
- **Next.js 15.4.2** with App Router
- **React 19.1.0** with TypeScript
- **Turbopack** for fast development builds

## Styling & UI
- **Tailwind CSS v4** with custom design tokens
- **shadcn/ui** components (New York style)
- **Radix UI** primitives for accessible components
- **Lucide React** for icons
- **next-themes** for theme switching
- **class-variance-authority** for component variants

## Authentication
- **Clerk** for user authentication and management

## Development Tools
- **TypeScript 5** with strict mode
- **ESLint** with Next.js configuration
- **Bun** as package manager (bun.lock present)

## Common Commands

### Development
```bash
# Start development server with Turbopack
bun dev

# Build for production
bun run build

# Start production server
bun start

# Run linting
bun run lint
```

### Package Management
```bash
# Install dependencies
bun install

# Add new dependency
bun add <package>

# Add dev dependency
bun add -d <package>
```

## Configuration Notes
- Uses `@/*` path alias for src directory imports
- Custom Tailwind theme with OKLCH color space
- Dark theme as default with comprehensive CSS variables
- TypeScript strict mode enabled with modern ES2017 target