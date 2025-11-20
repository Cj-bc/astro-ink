# Claude Code Guide for Astro Ink

Welcome! This guide is specifically for Claude Code and Claude AI assistants working on the Astro Ink project.

## Quick Start

For comprehensive information about AI agents working on this project, including project structure, development guidelines, and best practices, please refer to **[AGENTS.md](./AGENTS.md)**.

## Claude-Specific Guidelines

### When Working on This Project

1. **Read AGENTS.md First**: Before making changes, review [AGENTS.md](./AGENTS.md) to understand the project architecture, common patterns, and development guidelines.

2. **Understand the Context**: This is a minimal blog theme. Every change should respect the core principle of staying lightweight and performant.

3. **Use the Right Tools**:
   - Use `Read` tool to examine existing files before making changes
   - Use `Glob` and `Grep` to find patterns across the codebase
   - Use `Edit` for modifying existing files (preferred over `Write`)
   - Use `Bash` for running commands like `npm run dev` or `npm run build`

### Project-Specific Reminders

#### Always Check Configuration
Before adding features, check if there's a configuration flag in `src/config.ts`:
```typescript
export const SITE_CONFIGURATION = {
  // ... existing config
  USE_VIEW_STATS: true,
  USE_AUTHOR_CARD: true,
  USE_POST_IMG_OVERLAY: false,
  // etc.
}
```

#### Respect the Build Mode
This project supports both:
- **SSR (Server-Side Rendering)**: Default mode with `output: 'server'`
- **SSG (Static Site Generation)**: Static builds with `output: 'static'`

Any changes must work in both modes unless specifically related to one mode.

#### Theme System
The project uses a sophisticated theming system:
- Base configuration in `tailwind.config.cjs`
- Theme variants in `tailwind.theme.config.cjs`
- Theme selection via `THEME_KEY` environment variable
- Always test in both light and dark modes

### Common Workflows

#### Adding a New Component

1. Create in `/src/components/`
2. Follow the pattern: one component, one responsibility
3. Use Astro components unless interactivity requires Svelte
4. Support dark mode via Tailwind's `dark:` classes
5. Make it configurable if it's optional functionality

#### Modifying Content Structure

1. Check `/src/content/config.ts` for content schemas
2. Update schema if adding new frontmatter fields
3. Update TypeScript types accordingly
4. Test with existing content

#### Adding Dependencies

⚠️ **Think twice before adding new dependencies!**
- This project values minimal bundle size
- Check if Astro or existing dependencies can solve the problem
- If necessary, prefer lightweight alternatives
- Update `package.json` and document the reason

### Testing Your Changes

Always run these before committing:

```bash
# Test in development
npm run dev

# Test production build
npm run build
npm run preview
```

Check:
- [ ] Light and dark modes both work
- [ ] Responsive design is maintained
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Build completes successfully
- [ ] Bundle size hasn't increased significantly

### Git Workflow

When working on feature branches:
- Develop on the designated branch (usually starts with `claude/`)
- Commit with clear, descriptive messages
- Push to the specified branch with `git push -u origin <branch-name>`
- Create pull requests when features are complete

### Where to Find Information

| What You Need | Where to Look |
|---------------|---------------|
| Project overview & features | [README.md](./README.md) |
| AI agent guidelines & architecture | [AGENTS.md](./AGENTS.md) |
| Site configuration | `src/config.ts` |
| Content schema | `src/content/config.ts` |
| Astro configuration | `astro.config.mjs` |
| Theme configuration | `tailwind.config.cjs` & `tailwind.theme.config.cjs` |
| Available scripts | `package.json` |

### Decision-Making Framework

When uncertain about how to implement something:

1. **Check existing patterns** - Look for similar features in the codebase
2. **Consult AGENTS.md** - Review the guidelines and best practices
3. **Ask clarifying questions** - If the requirement is ambiguous
4. **Stay minimal** - When in doubt, choose the simpler approach
5. **Make it configurable** - Optional features should have config flags

### Common Tasks Quick Reference

| Task | Primary Tool | Notes |
|------|--------------|-------|
| Explore codebase | Task (Explore agent) | For understanding architecture |
| Find specific code | Grep | Use patterns to search |
| Read files | Read | Always read before editing |
| Modify files | Edit | Preferred over Write |
| Create new files | Write | Only when necessary |
| Run commands | Bash | For npm, git, etc. |
| Track tasks | TodoWrite | Use for multi-step work |

## Working with Content

### Blog Posts
- Located in `/src/content/blog/` (or similar)
- Use frontmatter for metadata
- Support markdown and MDX
- Images go in `/public/`

### Drafts and Future Posts
- Drafts in `/src/drafts/`
- Use future dates for scheduled publishing
- GitHub Actions handle auto-publishing

## Special Features to Be Aware Of

1. **View Counter**: Uses Redis/Upstash, configured via environment variables
2. **Search**: Client-side search with Lunr.js
3. **YouTube Integration**: Media page can display YT channel videos
4. **Netlify CMS**: Admin interface at `/admin` (when deployed)
5. **Author Cards**: Optional per-post or site-wide author information

## Final Notes

- **Preserve the minimal philosophy** - This is core to the project
- **Document your changes** - Update relevant docs when needed
- **Test thoroughly** - Both modes, both themes, all viewports
- **When stuck, refer to [AGENTS.md](./AGENTS.md)** - It has detailed guidance

Happy coding! 🚀
