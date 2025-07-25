# Project Structure

## Directory Organization

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # Dashboard page route
│   ├── globals.css         # Global styles and Tailwind imports
│   ├── layout.tsx          # Root layout with providers
│   └── page.tsx            # Home page component
├── components/             # Reusable React components
│   ├── common/             # Shared utility components
│   ├── layout/             # Layout-specific components (navbar, etc.)
│   ├── providers/          # Context providers (theme, etc.)
│   └── ui/                 # shadcn/ui components
├── lib/                    # Utility functions and configurations
└── middleware.ts           # Next.js middleware
```

## Component Architecture

### UI Components (`src/components/ui/`)
- Built with shadcn/ui and Radix UI primitives
- Use `class-variance-authority` for variant management
- Follow compound component patterns where appropriate
- Include proper TypeScript interfaces and props

### Common Components (`src/components/common/`)
- Shared components used across multiple pages
- Examples: ModeToggle, navigation elements
- Should be generic and reusable

### Layout Components (`src/components/layout/`)
- Page structure components (Navbar, Footer, Sidebar)
- Handle global layout concerns

## Naming Conventions

### Files
- Use kebab-case for file names: `mode-toggle.tsx`
- Component files should match component name
- Page files use Next.js conventions: `page.tsx`, `layout.tsx`

### Components
- Use PascalCase for component names: `ModeToggle`
- Export components as named exports when possible
- Use default exports for pages and layouts

### Imports
- Use `@/` alias for src directory imports
- Group imports: external packages, then internal modules
- Use absolute imports over relative when possible

## Styling Guidelines

### Tailwind Classes
- Use the `cn()` utility function for conditional classes
- Leverage CSS variables for theme consistency
- Follow mobile-first responsive design patterns

### Component Variants
- Use `class-variance-authority` for component variants
- Define variants in separate objects for reusability
- Include proper TypeScript types for variant props

## Authentication Integration
- Wrap app in `ClerkProvider` at root layout level
- Use Clerk hooks and components throughout the app
- Handle authentication state in middleware when needed