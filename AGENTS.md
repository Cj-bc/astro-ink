# AI Agents Documentation

This document provides comprehensive information for AI agents working on the Astro Ink project.

## Project Overview

Astro Ink is a minimal, markdown-based blog theme built with Astro. It focuses on delivering a lightweight, performant blogging experience with minimal JavaScript.

### Key Technologies

- **Astro 2.x+** - Main framework for static site generation
- **Svelte** - Used for interactive components (theme switcher)
- **Tailwind CSS** - Styling framework
- **TypeScript** - Type-safe development
- **Markdoc** - Content authoring format

## Project Structure

```
astro-ink/
├── src/
│   ├── components/     # Reusable UI components
│   ├── layouts/        # Page layouts
│   ├── pages/          # Astro pages and routes
│   ├── content/        # Content collections (blog posts, etc.)
│   ├── styles/         # Global styles
│   └── config.ts       # Site configuration
├── public/             # Static assets
├── scripts/            # Build and utility scripts
└── [config files]      # Various configuration files
```

## Agent Capabilities

### Understanding the Codebase

1. **Content Management**
   - Blog posts are managed through Astro Content Collections
   - Posts support frontmatter metadata (title, date, tags, author, etc.)
   - Future posts can be scheduled in `/src/drafts`

2. **Theming System**
   - Dark mode support built-in
   - Multiple color themes configurable via `tailwind.config.cjs`
   - Theme can be set using `THEME_KEY` environment variable

3. **Dynamic Features**
   - Tag-based classification with pagination
   - Client-side search using Lunr.js
   - Optional view counter with Redis/Upstash
   - YouTube channel integration for media pages

### Common Tasks

#### Adding New Features

1. Check if the feature aligns with the minimal philosophy of the project
2. Ensure it doesn't significantly increase JavaScript bundle size
3. Consider making features optional via configuration flags in `src/config.ts`
4. Follow the modular component structure

#### Modifying Styles

1. Use Tailwind utility classes where possible
2. Theme-specific colors are in `tailwind.theme.config.cjs`
3. Typography styles use `@tailwindcss/typography`
4. Respect the dark mode implementation

#### Working with Content

1. Content is in `/src/content/` directory
2. Follow the existing frontmatter schema
3. Images should be optimized and placed in `/public/`
4. Use relative paths for internal links

## Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow the existing component structure (one component, one responsibility)
- Keep components minimal and focused
- Prefer Astro components over framework components when possible
- Use Svelte only when interactivity is necessary

### Testing Changes

1. Run `npm run dev` to test locally
2. Verify both light and dark modes
3. Check responsive design on different screen sizes
4. Test build output with `npm run build`
5. Verify static generation works as expected

### Configuration

Important configuration files:
- `src/config.ts` - Main site configuration
- `astro.config.mjs` - Astro framework configuration
- `tailwind.config.cjs` - Tailwind and theme configuration
- `tsconfig.json` - TypeScript configuration

### Environment Variables

Required for full functionality:
- `SITE_URI` - Site URL (e.g., http://localhost:4321 for dev)
- `REDIS_URL` - Redis connection URL (optional, for view counter)
- `THEME_KEY` - Color theme selection (optional, defaults to base theme)

## Best Practices for Agents

1. **Preserve Minimalism**: Don't add unnecessary dependencies or features
2. **Maintain Performance**: Keep JavaScript minimal; prefer static generation
3. **Follow Patterns**: Study existing code patterns before introducing new ones
4. **Document Changes**: Update relevant documentation when making changes
5. **Test Thoroughly**: Verify changes work in both SSR and SSG modes
6. **Respect Configuration**: Use config flags for optional features
7. **Mobile-First**: Ensure responsive design principles are maintained

## Common Pitfalls to Avoid

1. **Don't break SSG mode**: Many users prefer static generation
2. **Don't add heavy dependencies**: Keep the bundle size small
3. **Don't ignore dark mode**: All UI changes must support dark mode
4. **Don't hardcode values**: Use configuration files
5. **Don't remove existing features**: Unless explicitly requested

## Useful Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run astro        # Run Astro CLI commands
```

## Getting Help

- Review the main [README.md](./README.md) for feature details
- Check [Astro documentation](https://docs.astro.build)
- Examine existing components for patterns
- Refer to [CLAUDE.md](./CLAUDE.md) for Claude-specific guidelines

## Additional Resources

- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Svelte Documentation](https://svelte.dev/docs)
- [Original Hugo Ink Theme](https://github.com/knadh/hugo-ink)
