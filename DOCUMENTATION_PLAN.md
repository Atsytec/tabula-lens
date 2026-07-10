# Tabula Lens Documentation Site & AI Skills - Implementation Plan

## Overview

This document outlines the comprehensive plan for creating a documentation website for Tabula Lens packages and implementing AI agent skills for cross-platform compatibility.

## Project Decisions Summary

### Documentation Site Architecture

**Structure & Navigation**

- **Approach:** User journey structure with hybrid Diataxis framework
- **Navigation:** "Quick Start" (tutorial), "Guides" (how-to), "API Reference" (reference), "Concepts" (explanation)
- **Architecture Focus:** Emphasize HTTP API as the universal interface with interchangeable frontend/backend implementations

**Content Organization**

- **Frontend Integration:** Frontend Architecture + React Implementation
- **Backend Integration:** Backend Architecture + Node Implementation
- **Database Support:** Database Architecture + PostgreSQL Support
- **HTTP API:** Comprehensive API reference (complete OpenAPI spec style)

**Design & Branding**

- **Approach:** Custom design system in `shared/styles/` folder
- **Brand Identity:** Modern, data-focused, professional but approachable
- **Color Palette:** Blue-teal primary (#0ea5e9 to #0284c7), warm accent (#f59e0b), refined neutrals
- **Typography:** Clean, modern sans-serif (Inter or system fonts)
- **Design Principles:** High contrast data readability, subtle depth, rounded corners (4-8px), generous whitespace

**Technical Stack**

- **Framework:** Astro with Starlight theme (heavily customized)
- **Deployment:** GitHub Actions with preview deployments
- **Versioning:** Major version documentation with version selector
- **Accessibility:** WCAG 2.1 AA compliance + enhancements (reduced motion, high contrast mode, dyslexia-friendly fonts)
- **SEO:** Advanced SEO (structured data/JSON-LD, Open Graph tags, Twitter cards, performance optimization)

**Content Strategy**

- **Quick Start:** Minimal full-stack example (local PostgreSQL, Node + Express, React frontend)
- **Content Migration:** Hybrid approach - keep READMEs as quick reference, migrate and expand content to docs
- **Existing READMEs:** Both packages have comprehensive READMEs with:
  - Installation instructions
  - Quick start examples
  - API reference tables
  - Usage examples
  - Troubleshooting sections
  - Peer dependencies documentation
  - Feature lists with badges
- **README Content to Leverage:**
  - @tabula-lens/node README: 15+ framework adapters listed, peer dependencies for each, security considerations
  - @tabula-lens/react README: Modular architecture mentioned, TanStack integration, performance optimization
- **Contributing:** Comprehensive contributor guide with docs-as-code requirement (no feature complete without docs)
- **Priority:** Quick Start tutorial first, then architecture pages, then implementation guides

### AI Agent Skills

**Standard & Distribution**

- **Standard:** Agent Skills specification (`.agents/skills/` directory)
- **Compatibility:** Cross-platform (Claude Code, OpenAI Codex, Gemini CLI, VS Code Copilot, Cursor, JetBrains)
- **Distribution:** GitHub repository with future marketplace expansion (SkillRepo, AI Skill Store)
- **Format:** SKILL.md with YAML frontmatter following agentskills.io specification

**Initial Skills**

- **Focus:** User-facing skills first
- **Skill 1:** `setup-tabula-lens` - Full stack setup guidance (backend + frontend)
- **Skill 2:** `generate-database-viewer` - React component generation with specific configurations

**Best Practices**

- Keep SKILL.md under 500 lines (progressive disclosure)
- Optimize description for discoverability (what + when to use)
- Include negative triggers (when NOT to use)
- Use semantic versioning
- Include proper licensing
- Follow Agent Skills specification strictly

## Implementation Phases

### Phase 1: Foundation & Structure ✅

**Documentation Site**

- [x] Restructure Starlight navigation to match hybrid Diataxis approach
- [x] Create new sidebar structure: Quick Start, Guides, API Reference, Concepts
- [x] Set up content directories for each section
- [x] Configure Starlight for proper routing and navigation
- [x] Set up versioning infrastructure for future major versions

**AI Skills**

- [x] Create `.agents/skills/` directory structure
- [x] Set up skill directory structure (SKILL.md, scripts/, references/, assets/)
- [x] Create skill template following Agent Skills specification
- [x] Set up skill metadata and frontmatter standards

### Phase 2: Design System

**Shared Design System**

- [ ] Review existing CSS custom properties in React package
- [ ] Document existing design tokens (colors, spacing, typography, border-radius)
- [ ] Document existing CSS custom properties for theming
- [ ] Document existing light/dark mode support implementation
- [ ] Evaluate if shared/styles/ directory is needed or if React package CSS should be the source of truth
- [ ] Document design system usage and patterns

**Apply to Documentation**

- [ ] Customize Starlight theme with Tabula Lens brand identity
- [ ] Integrate shared design system into docs site
- [ ] Apply custom colors, typography, and spacing
- [ ] Ensure design consistency across all pages
- [ ] Test responsive design

**Apply to React Package**

- [ ] Review existing CSS custom properties implementation
- [ ] Document existing CSS custom properties (variables.css, global.css)
- [ ] Document existing dark mode support
- [ ] Ensure design system documentation aligns with existing implementation
- [ ] Test React component with documented design system

### Phase 3: Content Development - Quick Start

**Quick Start Tutorial**

- [ ] Create minimal full-stack example (PostgreSQL + Node/Express + React)
- [ ] Write comprehensive Quick Start tutorial
- [ ] Include step-by-step instructions for backend setup
- [ ] Include step-by-step instructions for frontend setup
- [ ] Add troubleshooting section for common issues
- [ ] Test all code examples for accuracy
- [ ] Add screenshots/diagrams where helpful

**Architecture Pages**

- [ ] Write Frontend Architecture page (HTTP API contract, interchangeability)
- [ ] Write Backend Architecture page (HTTP API contract, interchangeability)
- [ ] Write Database Architecture page (database connection patterns)
- [ ] Create architecture diagrams showing system design
- [ ] Explain the interchangeability concept clearly

### Phase 4: Content Development - Implementation Guides

**Frontend Implementation**

- [ ] Write React Implementation guide
- [ ] Document modular component architecture:
  - Main DatabaseViewer component
  - Sub-components: LoadingState, ErrorState, EmptyState, TableSelector, FilterInput, Pagination, DataTable, FilterColumnSelector
  - Custom hooks: useLogger, useTableState, useDatabaseData, buildQueryParams
  - Utility functions: fetchHelpers, validationHelpers, styleHelpers
  - Runtime prop validation system
- [ ] Document all component props and configurations
- [ ] Include authentication examples
- [ ] Include styling customization examples:
  - CSS custom properties integration
  - Style object customization
  - Class name overrides
  - Design system tokens
- [ ] Add advanced usage examples:
  - Custom component patterns for all UI elements
  - TanStack Query integration patterns
  - TanStack Table integration patterns
  - Performance optimization with React.memo
  - Advanced sorting with column validation
  - Filter column selector usage
- [ ] Document prop validation system and error messages

**React Component Architecture**

- [ ] Write component architecture overview
- [ ] Document sub-component composition patterns
- [ ] Explain custom hook usage and patterns
- [ ] Document utility function usage
- [ ] Include component composition examples
- [ ] Document performance optimization strategies
- [ ] Explain React.memo usage throughout
- [ ] Document state management patterns

**TanStack Integration**

- [ ] Write TanStack Query integration guide
- [ ] Document data fetching patterns
- [ ] Explain caching strategies
- [ ] Include query invalidation examples
- [ ] Document error handling with TanStack Query
- [ ] Write TanStack Table integration guide
- [ ] Document table configuration patterns
- [ ] Explain sorting and filtering with TanStack Table
- [ ] Include column definition examples
- [ ] Document performance optimization with TanStack Table

**Backend Implementation**

- [ ] Write Node Implementation guide
- [ ] Document all 15 framework adapters:
  - Traditional: Express (4.x & 5.x), Fastify, Koa, Hapi, Restify
  - Modern: Next.js, TanStack Start, Remix, SvelteKit
  - Edge: Hono, Elysia, Fresh
  - Native: Native adapter for custom implementations
- [ ] Include configuration options for each adapter
- [ ] Document peer dependencies for each adapter
- [ ] Add comprehensive logging system documentation:
  - Logger configuration and levels (debug, info, warn, error, silent)
  - Log formats (json, text, pretty)
  - Request and query logging
  - Sensitive data masking
  - Custom logger integration
  - Environment-specific defaults (production, test, development)
- [ ] Document TabulaLensError class and error handling patterns
- [ ] Add monitoring and observability guidance
- [ ] Document security best practices

**Database Support**

- [ ] Write PostgreSQL Support guide
- [ ] Document connection setup
- [ ] Include query optimization tips
- [ ] Add troubleshooting for database issues
- [ ] Document database-specific features

**Logging System**

- [ ] Write comprehensive logging system guide
- [ ] Document logger configuration options
- [ ] Explain log levels and when to use each
- [ ] Document log format options (json, text, pretty)
- [ ] Cover request logging patterns
- [ ] Cover query logging patterns
- [ ] Document sensitive data masking
- [ ] Include custom logger integration examples
- [ ] Add logging best practices
- [ ] Document performance considerations for logging

### Phase 5: Content Development - API Reference

**HTTP API Reference**

- [ ] Document all API endpoints comprehensively
- [ ] Include request/response formats
- [ ] Document all parameters and headers
- [ ] Add authentication documentation
- [ ] Create error catalog with causes and fixes
- [ ] Include code examples for each endpoint
- [ ] Add OpenAPI specification if applicable

**Package API References**

- [ ] Leverage existing comprehensive JSDoc documentation
- [ ] Evaluate TypeDoc integration with existing JSDoc for automated API docs
- [ ] Configure TypeDoc to supplement (not replace) existing JSDoc
- [ ] Integrate API documentation into documentation site
- [ ] Ensure API docs stay in sync with code changes
- [ ] Add automated API documentation generation to CI

### Phase 6: Guides & Concepts

**How-to Guides**

- [ ] Create authentication guide
- [ ] Create styling customization guide:
  - Document existing CSS custom properties (variables.css)
  - Document existing global styles (global.css)
  - Document existing dark mode implementation
  - Include component-level styling examples
  - Document design token overrides
  - Document style object customization patterns
  - Document class name override patterns
  - Include theming examples for custom branding
- [ ] Create deployment guide
- [ ] Create performance optimization guide
- [ ] Create testing guide:
  - Document testing setup and configuration
  - Vitest configuration for both packages
  - jsdom environment for React testing
  - node environment for Node package testing
  - React Testing Library setup
  - Test setup files and configuration
  - Include test writing best practices
  - Add testing examples for components
  - Document test utilities and helpers
  - Document existing test coverage and patterns
  - Include testing for custom components and hooks

**Conceptual Documentation**

- [ ] Write security model explanation
- [ ] Document performance characteristics
- [ ] Explain caching strategies
- [ ] Document scalability considerations
- [ ] Add architecture decision records
- [ ] Document error handling patterns:
  - TabulaLensError class structure
  - Error codes and status codes
  - Client-side error handling
  - Server-side error handling
  - Error catalog with causes and fixes

### Phase 7: AI Skills Implementation

**Setup Skill**

- [ ] Create `setup-tabula-lens` skill directory
- [ ] Write comprehensive SKILL.md following Agent Skills specification
- [ ] Include step-by-step setup instructions
- [ ] Add troubleshooting guidance
- [ ] Test skill across different AI platforms
- [ ] Add examples and common use cases

**Component Generation Skill**

- [ ] Create `generate-database-viewer` skill directory
- [ ] Write SKILL.md for component generation
- [ ] Include prop configuration guidance
- [ ] Add styling customization options
- [ ] Test skill with various component configurations
- [ ] Document skill usage patterns

### Phase 8: Advanced Features

**Accessibility**

- [ ] Implement WCAG 2.1 AA compliance
- [ ] Add reduced motion support
- [ ] Implement high contrast mode
- [ ] Ensure keyboard navigation works properly
- [ ] Add screen reader optimization
- [ ] Test with accessibility tools
- [ ] Add accessibility statement to documentation

**SEO Implementation**

- [ ] Add structured data (JSON-LD) for technical content
- [ ] Implement Open Graph tags for social sharing
- [ ] Add Twitter card meta tags
- [ ] Optimize Core Web Vitals
- [ ] Generate and submit sitemap
- [ ] Add canonical URLs
- [ ] Implement robots.txt
- [ ] Test SEO with relevant tools

**Search Functionality**

- [ ] Configure Starlight's built-in search
- [ ] Optimize search indexing
- [ ] Add search analytics
- [ ] Test search functionality across content

### Phase 9: Deployment & CI/CD

**GitHub Actions Setup**

- [ ] Create GitHub Actions workflow for documentation
- [ ] Set up automatic deployment on push to main
- [ ] Configure preview deployments for pull requests
- [ ] Add deployment status checks
- [ ] Test deployment workflow

**Documentation Testing**

- [ ] Set up automated link checking
- [ ] Add build validation to CI
- [ ] Implement code example testing where possible
- [ ] Add accessibility testing to CI
- [ ] Set up SEO validation in CI

### Phase 10: Contributor Experience

**Contributing Guide**

- [ ] Write comprehensive contributing guide
- [ ] Document Diataxis framework usage
- [ ] Include writing style guide
- [ ] Add code example standards
- [ ] Document how to test documentation changes
- [ ] Explain PR review process
- [ ] Emphasize docs-as-code requirement

**Documentation Maintenance**

- [ ] Set up documentation review process
- [ ] Create documentation update checklist
- [ ] Add documentation tasks to issue templates
- [ ] Document how to handle version updates
- [ ] Create documentation issue templates

### Phase 11: Content Migration & Enhancement

**README Updates**

- [ ] Update package READMEs to reference new documentation
- [ ] Keep READMEs focused on installation + basic usage
- [ ] Add cross-links between README and documentation
- [ ] Ensure consistency between README and docs

**Content Enhancement**

- [ ] Expand content from existing READMEs into proper documentation structure
- [ ] Add missing examples and use cases
- [ ] Improve explanations based on real-world usage
- [ ] Add more diagrams and visual content
- [ ] Ensure all code examples are tested and accurate

### Phase 12: Polish & Launch

**Final Testing**

- [ ] Test all documentation links
- [ ] Verify all code examples work
- [ ] Test responsive design on various devices
- [ ] Verify accessibility compliance
- [ ] Test SEO implementation
- [ ] Perform user testing if possible

**Performance Optimization**

- [ ] Optimize images and assets
- [ ] Implement lazy loading where appropriate
- [ ] Test and optimize Core Web Vitals
- [ ] Minimize bundle sizes
- [ ] Enable caching strategies

**Launch Preparation**

- [ ] Set up domain configuration (if applicable)
- [ ] Configure analytics (if desired)
- [ ] Prepare launch announcement
- [ ] Create documentation feedback mechanism
- [ ] Set up monitoring for documentation issues

**Post-Launch**

- [ ] Monitor documentation usage and feedback
- [ ] Address any immediate issues
- [ ] Plan for regular content updates
- [ ] Set up documentation review schedule
- [ ] Collect user feedback for improvements

## Notes

### Important Constraints

- Do not mention the internal `example-vite` app in documentation
- Only document currently implemented packages (React, Node, PostgreSQL)
- Do not hint at future packages or ongoing work
- Emphasize interchangeability of implementations
- HTTP API is the stable interface contract
- Document all 15 framework adapters for Node package
- Include comprehensive logging system documentation
- Document modular React component architecture
- Cover TanStack Query and TanStack Table integrations
- Include error handling patterns and TabulaLensError
- Leverage existing comprehensive READMEs as content foundation
- Document peer dependencies for each adapter and package
- Node.js >= 18 requirement for all packages

### Design System Location

- React package already has CSS custom properties (variables.css, global.css)
- Evaluate if shared/styles/ directory is needed or if React package CSS should be source of truth
- This is internal monorepo code, not published
- Can expand to include other shared utilities in the future

### Build System & Tooling

- Monorepo uses Turborepo for build orchestration
- Package builds use tsup for TypeScript compilation
- ESM format with TypeScript declarations
- Source maps enabled for debugging
- External dependencies properly configured
- Testing uses Vitest with jsdom for React, node for Node package
- ESLint and Prettier for code quality
- Husky for git hooks
- lint-staged for pre-commit checks
- Package manager: pnpm@9.0.0
- Changesets for version management
- Node.js >= 18 required

### Existing CSS Implementation

- React package already has comprehensive CSS custom properties in variables.css
- Existing design tokens include:
  - Primary colors (with hover states)
  - Text colors (primary, secondary)
  - Background colors (white, header, hover, sorted, error, spinner track)
  - Border colors (default, error)
  - Error colors (with hover states)
  - Spacing tokens (xs, sm, md, lg)
  - Font sizes (base, sm)
  - Animation duration
- Dark mode already implemented via @media (prefers-color-scheme: dark)
- Global styles include animations and interaction states (global.css)
- Spinner animation, table row hover/focus effects
- Sort indicators, pagination button states
- FilterColumnSelector styles for Base UI components

### React Dependencies

- @base-ui/react for UI components (FilterColumnSelector uses Base UI)
- @tanstack/react-query for data fetching and caching
- @tanstack/react-table for table functionality
- React 19.2.7 and React DOM 19.2.7
- These should be documented in integration guides

### AI Skills Location

- Skills will be in `.agents/skills/` directory
- Follows Agent Skills specification for cross-platform compatibility
- Published on GitHub with future marketplace expansion
- Focus on user-facing skills initially

### Documentation as Code

- Documentation updates are required for all code changes
- No feature is considered complete without documentation
- This should be enforced in contribution guidelines and PR process
- Documentation is treated as first-class project artifact

## Success Metrics

- Documentation builds without errors
- All code examples are tested and accurate
- Users can successfully complete Quick Start tutorial
- Documentation is accessible (WCAG 2.1 AA)
- SEO scores are good for technical documentation
- AI skills work across multiple platforms
- Contributors can easily update documentation
- Documentation stays in sync with code changes
