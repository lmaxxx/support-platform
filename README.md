# AI-Powered Customer Support Platform

A modern, full-stack customer support platform that brings AI-powered assistance to your website through an embeddable widget. Built with Next.js, Convex, and cutting-edge AI technology.

## Features

### Core Capabilities
- **AI-Powered Support Agent** - Intelligent conversational AI that handles customer inquiries using RAG (Retrieval-Augmented Generation)
- **Embeddable Widget** - Easy-to-integrate support widget for any website
- **Real-time Chat** - Instant messaging with automatic AI responses
- **Voice Support** - Voice call integration via Vapi for audio interactions
- **Multi-organization Support** - Manage multiple organizations with Clerk authentication
- **Conversation Management** - Track, escalate, and resolve customer conversations
- **Customizable Widget** - Personalize greet messages, suggestions, and appearance
- **Knowledge Base Integration** - RAG-powered responses from your documentation
- **Analytics Dashboard** - Monitor conversations, track resolutions, and analyze performance

### Technical Features
- **Monorepo Architecture** - Organized pnpm workspace with Turborepo
- **Real-time Database** - Convex backend with instant updates
- **Type-safe** - End-to-end TypeScript with strict type checking
- **Modern UI** - shadcn/ui components with Tailwind CSS
- **Scalable Backend** - Serverless Convex functions with automatic scaling
- **Authentication** - Clerk-powered auth with organization management
- **Hot Reload** - Fast development with instant updates

## Architecture

### Applications
- **Web Dashboard** (`apps/web`) - Admin dashboard for managing conversations, settings, and integrations (port 3000)
- **Support Widget** (`apps/widget`) - Customer-facing chat interface (port 3001)
- **Embed Script** (`apps/embed`) - Lightweight script for website integration (port 3002)

### Packages
- **Backend** (`packages/backend`) - Shared Convex serverless backend
- **UI** (`packages/ui`) - Shared shadcn/ui component library
- **ESLint Config** (`packages/eslint-config`) - Shared linting rules
- **TypeScript Config** (`packages/typescript-config`) - Shared TypeScript configuration

## Tech Stack

- **Frontend:** Next.js 15, React 19, Tailwind CSS, shadcn/ui
- **Backend:** Convex (serverless TypeScript with real-time database)
- **Authentication:** Clerk
- **AI:** Convex AI Agents, RAG, Vapi (voice), AI SDK (Anthropic, OpenAI, Cohere)
- **Build System:** Turborepo, pnpm workspaces
- **Language:** TypeScript

## Prerequisites

- **Node.js** >= 20.0.0
- **pnpm** >= 10.4.1
- **Convex Account** - [Sign up at convex.dev](https://convex.dev)
- **Clerk Account** - [Sign up at clerk.com](https://clerk.com)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd support-platform
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

#### Backend Environment (`packages/backend/.env.local`)

```bash
# Convex
CONVEX_DEPLOYMENT=<your-convex-deployment>

# Clerk
CLERK_WEBHOOK_SECRET=<your-clerk-webhook-secret>

# AI Providers (optional, choose one or more)
ANTHROPIC_API_KEY=<your-anthropic-key>
OPENAI_API_KEY=<your-openai-key>
COHERE_API_KEY=<your-cohere-key>

# Vapi (optional, for voice support)
VAPI_API_KEY=<your-vapi-key>
```

#### Web Dashboard Environment (`apps/web/.env.local`)

```bash
# Convex
NEXT_PUBLIC_CONVEX_URL=<your-convex-url>

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
CLERK_SECRET_KEY=<your-clerk-secret-key>
```

#### Widget Environment (`apps/widget/.env.local`)

```bash
# Convex
NEXT_PUBLIC_CONVEX_URL=<your-convex-url>
```

### 4. Initialize Convex Backend

```bash
cd packages/backend
pnpm setup
```

This will initialize your Convex deployment and run until successful.

### 5. Start Development Servers

#### Option A: Run All Apps (Recommended)

```bash
# From project root
turbo dev
```

This starts all applications concurrently:
- Web Dashboard: http://localhost:3000
- Widget: http://localhost:3001
- Embed Script: http://localhost:3002
- Convex Backend: Running in development mode

#### Option B: Run Individual Apps

```bash
# Web Dashboard
cd apps/web && pnpm dev

# Widget
cd apps/widget && pnpm dev

# Embed Script
cd apps/embed && pnpm dev

# Backend (Convex)
cd packages/backend && pnpm dev
```

### 6. Access the Applications

- **Dashboard:** http://localhost:3000 - Sign in with Clerk to manage your support platform
- **Widget:** http://localhost:3001 - Preview the customer-facing widget
- **Embed Script:** http://localhost:3002 - Test the embed integration

## Development Workflow

### Building

```bash
# Build all packages and apps
pnpm build

# Build specific app
cd apps/web && pnpm build
```

### Adding UI Components

```bash
# Add shadcn/ui component (run from root)
pnpm dlx shadcn@latest add [component-name] -c apps/web
```

Components are automatically placed in `packages/ui/src/components` and available to all apps via:

```tsx
import { Button } from "@workspace/ui/components/button"
```

## Project Structure

```
support-platform/
├── apps/
│   ├── web/                 # Admin dashboard (Next.js)
│   │   ├── app/
│   │   │   ├── (auth)/      # Authentication routes
│   │   │   └── (dashboard)/ # Protected dashboard routes
│   │   └── package.json
│   ├── widget/              # Customer widget (Next.js)
│   │   ├── modules/widget/  # Feature-based organization
│   │   └── package.json
│   └── embed/               # Embed script (Vite)
│       └── package.json
├── packages/
│   ├── backend/             # Convex backend
│   │   ├── convex/
│   │   │   ├── public/      # Unauthenticated functions
│   │   │   ├── private/     # Authenticated functions
│   │   │   ├── system/      # Internal functions & AI agents
│   │   │   ├── schema.ts    # Database schema
│   │   │   └── http.ts      # HTTP endpoints
│   │   └── package.json
│   ├── ui/                  # Shared UI components
│   │   ├── src/components/  # shadcn/ui components
│   │   └── package.json
│   ├── eslint-config/       # Shared ESLint config
│   └── typescript-config/   # Shared TypeScript config
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

## Contributing

We welcome contributions! Here's how you can help:

### Getting Started

1. **Fork the repository** and clone your fork
2. **Create a branch** for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** following our coding standards
4. **Test your changes** thoroughly
5. **Commit your changes** with clear, descriptive messages
6. **Push to your fork** and create a pull request

### Development Guidelines

#### Code Standards
- **TypeScript:** Use strict type checking, avoid `any` types
- **ESLint:** Follow the project's ESLint configuration
- **Naming:** Use clear, descriptive names for variables, functions, and components

#### Convex Backend
- **Function Organization:** Place functions in appropriate directories (`public/`, `private/`, `system/`)
- **Validation:** Always validate function arguments using Convex validators
- **Error Handling:** Implement proper error handling and logging
- **Indexes:** Add necessary database indexes in `schema.ts`

#### Frontend Components
- **Component Structure:** Follow React best practices and hooks conventions
- **Styling:** Use Tailwind CSS utility classes
- **Accessibility:** Ensure components are keyboard-navigable and screen-reader friendly
- **Responsiveness:** Test on mobile, tablet, and desktop viewports

### Commit Messages

Follow conventional commit format:

```
type(scope): description

[optional body]
[optional footer]
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

**Examples:**
```bash
feat(widget): add customizable color themes
fix(dashboard): resolve conversation status update issue
docs: update setup instructions in README
refactor(backend): extract conversation logic to separate module
```

### Pull Request Process

1. **Update documentation** if you've changed functionality
2. **Ensure all checks pass** (linting, type checking, builds)
3. **Provide clear PR description** with:
   - What changes were made
   - Why the changes were necessary
   - How to test the changes
   - Any breaking changes or migration notes
4. **Link related issues** using GitHub keywords (Fixes #123, Closes #456)
5. **Request review** from maintainers
6. **Address feedback** and update your PR as needed

### Need Help?

- Check existing [issues](../../issues) and [pull requests](../../pulls)
- Review [CLAUDE.md](./CLAUDE.md) for detailed architecture documentation
- Ask questions in [discussions](../../discussions)

## Troubleshooting

### Convex Functions Not Updating
- Ensure `packages/backend` has `pnpm dev` running
- Check Convex dashboard for deployment status
- Clear `.convex` cache and restart dev server

### UI Components Not Found
- Verify `packages/ui` is built
- Check import path uses `@workspace/ui`
- Run `pnpm install` from root to ensure workspace links


### Build Failures
- Clear Turbo cache: `rm -rf .turbo`
- Clear node_modules: `rm -rf node_modules`
- Reinstall dependencies: `pnpm install`
- Ensure Node.js version >= 20


## Support

For questions, issues, or suggestions:
- Create an [issue](../../issues)
- Start a [discussion](../../discussions)
- Contact the maintainers

---

Built with ❤️ using Next.js, Convex, and AI