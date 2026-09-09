# Workspaacing

An AI-powered admin dashboard IDE built with Next.js, React, TypeScript, and shadcn/ui.

## Tech Stack

- **Framework**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Monorepo**: Turborepo (apps/web, apps/desktop, packages/*)
- **Desktop**: Electron
- **Tooling**: Biome, Husky, Vercel

## Getting Started

```bash
git clone https://github.com/devconnecting1/Workspaacing.git
cd IDE
npm install
turbo run dev
```

App runs at [http://localhost:3000](http://localhost:3000).

## Project Structure

```text
apps/
  web/          ← Next.js app
  desktop/      ← Electron app
packages/
  ui/           ← Shared shadcn/ui components
  theme/        ← Theme presets
```

## Commands

```bash
turbo run build       # Build all packages
turbo run dev         # Start all dev servers
turbo run lint        # Lint all packages
turbo run typecheck   # Type check all packages
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

MIT
