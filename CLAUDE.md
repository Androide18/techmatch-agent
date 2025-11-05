# CLAUDE.mdDd

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TechMatch Agent is a Next.js 16 application for intelligent matching of technical resources to projects. The application features an AI-powered search interface that analyzes skills, experience, and availability to recommend the best developer matches.

## Development Commands

```bash
# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

**⚠️ IMPORTANT**: Do not run server commands (`npm run dev`, `npm run build`, `npm start`) automatically. The user will run these commands manually when needed.

## Tech Stack & Configuration

- **Framework**: Next.js 16.0.1 (App Router)
- **React**: 19.2.0
- **TypeScript**: 5
- **Styling**: Tailwind CSS v4 with custom theme
- **UI Components**: shadcn/ui (New York style)
- **Path Aliases**: `@/*` maps to project root

### Tailwind CSS v4 Setup

This project uses **Tailwind CSS v4** (not v3), which has a different configuration approach:

- No `tailwind.config.js` file
- Configuration is done inline in `app/globals.css` using `@theme inline` directive
- Uses `@tailwindcss/postcss` package
- Custom CSS variables defined in `@theme inline` block

### shadcn/ui Configuration

- **Style**: New York
- **Base Color**: neutral
- **Icon Library**: lucide-react
- **Component Location**: `components/ui/`
- **Utils Location**: `lib/utils.ts`
- **CSS Variables**: Enabled

To add new shadcn components:

```bash
npx shadcn@latest add [component-name]
```

## Architecture

### Directory Structure

```
app/
├── api/
│   └── search/
│       └── route.ts          # POST endpoint for tech matching search
├── features/
│   └── TechMatchInput.tsx   # Main search interface component
├── layout.tsx               # Root layout with fonts
├── page.tsx                 # Landing page with hero and features
└── globals.css             # Tailwind v4 config and custom theme

components/
└── ui/                     # shadcn components (button, input, label)

lib/
└── utils.ts               # cn() utility for className merging
```

### Component Architecture

**Component Export Convention**:

- **Always use named exports** (non-default exports) for components to clarify imports and improve discoverability
- Example: `export function MyComponent() {}` or `export const MyComponent = () => {}`
- Avoid: `export default function MyComponent() {}`

**Feature Components** (`app/features/`):

- `TechMatchInput.tsx`: Client-side search interface that POSTs to `/api/search`
  - Manages search query state
  - Handles loading states
  - Uses shadcn Input, Label, and Button components

**API Routes** (`app/api/`):

- `/api/search`: POST endpoint that accepts `{ query: string }` and returns `{ results: Result[] }`
  - Currently returns mocked data
  - Ready to integrate with real AI/database backend

### Theming System

The app uses a custom design system with CSS variables defined in `app/globals.css`:

**Custom Color Palette**:

- Primary colors: `main-light-blue` (#69c6e1), `pink` (#e745ff)
- Background: `bg` (#081924)
- Gradient: `left-to-right-gradient` (pink to cyan)

**CSS Variable Usage**:

```tsx
// Custom variables
className = 'bg-bg text-main-light-blue';

// shadcn variables (auto-configured)
className = 'border-border bg-background text-foreground';
```

### Import Patterns

When working with components, use these import paths:

```tsx
// shadcn UI components (always named exports)
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Utils
import { cn } from '@/lib/utils';

// Features (use named exports for new components)
import { TechMatchInput } from '@/app/features/TechMatchInput';
```

## Key Implementation Details

### Search Functionality

The search flow:

1. User enters requirement in `TechMatchInput`
2. Component POSTs to `/api/search` with query
3. API currently returns mocked results (2 developer profiles)
4. Results are stored in component state

**Future Integration Point**: The `searchTechMatch()` function in `app/api/search/route.ts` is where real AI/database logic should be implemented.

### Styling Approach

- Use Tailwind utility classes for layout and spacing
- Reference custom CSS variables with `var(--color-*)` for brand colors
- Use `cn()` utility from `@/lib/utils` to merge className strings conditionally
- shadcn components come pre-styled with variant support

### Client vs Server Components

- Most components are Server Components by default
- `TechMatchInput` is a Client Component (`"use client"`) for state management
- API routes are Server-Side only

## Localization Note

The application is currently in Spanish. UI text includes:

- "Escribe tu requerimiento" (Enter your requirement)
- "Buscando..." (Searching...)
- Feature descriptions in Spanish

When adding new features, maintain Spanish language for user-facing text.
