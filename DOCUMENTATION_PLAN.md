# Tabula Lens Documentation Site & AI Skills - Implementation Plan

## Overview

This document outlines the comprehensive plan for creating a documentation website for Tabula Lens packages and implementing AI agent skills for cross-platform compatibility.

## Project Decisions Summary

### Documentation Site Architecture

**Structure & Navigation**

- **Approach:** User journey structure with hybrid Diataxis framework
- **Navigation Restructuring:** Audience-based separation with nested navigation
  - User Guides: Frontend, Backend, Integrations, Production sub-sections
  - API Reference: React, Node, HTTP APIs
  - Contributor Docs: Architecture, Component Architecture, Internal Systems, Performance & Scaling, Security sub-sections
- **Nested Navigation:** Multi-level hierarchy using Starlight's nested sidebar support
- **Audience Separation:** Clear distinction between user-facing and contributor-facing documentation
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

### Phase 2: Design System ✅

**Shared Design System**

- [x] Review existing CSS custom properties in React package
- [x] Document existing design tokens (colors, spacing, typography, border-radius)
- [x] Document existing CSS custom properties for theming
- [x] Document existing light/dark mode support implementation
- [x] Evaluate if shared/styles/ directory is needed or if React package CSS should be the source of truth
- [x] Document design system usage and patterns

**Apply to Documentation**

- [x] Customize Starlight theme with Tabula Lens brand identity
- [x] Integrate shared design system into docs site
- [x] Apply custom colors, typography, and spacing
- [x] Ensure design consistency across all pages
- [x] Test responsive design

**Apply to React Package**

- [x] Review existing CSS custom properties implementation
- [x] Document existing CSS custom properties (variables.css, global.css)
- [x] Document existing dark mode support
- [x] Ensure design system documentation aligns with existing implementation
- [x] Test React component with documented design system

### Phase 3: Content Development - Quick Start ✅

**Quick Start Tutorial**

- [x] Create minimal full-stack example (PostgreSQL + Node/Express + React)
- [x] Write comprehensive Quick Start tutorial
- [x] Include step-by-step instructions for backend setup
- [x] Include step-by-step instructions for frontend setup
- [x] Add troubleshooting section for common issues
- [x] Test all code examples for accuracy
- [x] Add screenshots/diagrams where helpful

**Architecture Pages**

- [x] Write Frontend Architecture page (HTTP API contract, interchangeability)
- [x] Write Backend Architecture page (HTTP API contract, interchangeability)
- [x] Write Database Architecture page (database connection patterns)
- [x] Create architecture diagrams showing system design
- [x] Explain the interchangeability concept clearly

### Phase 4: Content Development - Implementation Guides ✅

**Frontend Implementation**

- [x] Write React Implementation guide
- [x] Document modular component architecture:
  - Main DatabaseViewer component
  - Sub-components: LoadingState, ErrorState, EmptyState, TableSelector, FilterInput, Pagination, DataTable, FilterColumnSelector
  - Custom hooks: useLogger, useTableState, useDatabaseData, buildQueryParams
  - Utility functions: fetchHelpers, validationHelpers, styleHelpers
  - Runtime prop validation system
- [x] Document all component props and configurations
- [x] Include authentication examples
- [x] Include styling customization examples:
  - CSS custom properties integration
  - Style object customization
  - Class name overrides
  - Design system tokens
- [x] Add advanced usage examples:
  - Custom component patterns for all UI elements
  - TanStack Query integration patterns
  - TanStack Table integration patterns
  - Performance optimization with React.memo
  - Advanced sorting with column validation
  - Filter column selector usage
- [x] Document prop validation system and error messages

**React Component Architecture**

- [x] Write component architecture overview
- [x] Document sub-component composition patterns
- [x] Explain custom hook usage and patterns
- [x] Document utility function usage
- [x] Include component composition examples
- [x] Document performance optimization strategies
- [x] Explain React.memo usage throughout
- [x] Document state management patterns

**TanStack Integration**

- [x] Write TanStack Query integration guide
- [x] Document data fetching patterns
- [x] Explain caching strategies
- [x] Include query invalidation examples
- [x] Document error handling with TanStack Query
- [x] Write TanStack Table integration guide
- [x] Document table configuration patterns
- [x] Explain sorting and filtering with TanStack Table
- [x] Include column definition examples
- [x] Document performance optimization with TanStack Table

**Backend Implementation**

- [x] Write Node Implementation guide
- [x] Document all 15 framework adapters:
  - Traditional: Express (4.x & 5.x), Fastify, Koa, Hapi, Restify
  - Modern: Next.js, TanStack Start, Remix, SvelteKit
  - Edge: Hono, Elysia, Fresh
  - Native: Native adapter for custom implementations
- [x] Include configuration options for each adapter
- [x] Document peer dependencies for each adapter
- [x] Add comprehensive logging system documentation:
  - Logger configuration and levels (debug, info, warn, error, silent)
  - Log formats (json, text, pretty)
  - Request and query logging
  - Sensitive data masking
  - Custom logger integration
  - Environment-specific defaults (production, test, development)
- [x] Document TabulaLensError class and error handling patterns
- [x] Add monitoring and observability guidance
- [x] Document security best practices

**Database Support**

- [x] Write PostgreSQL Support guide
- [x] Document connection setup
- [x] Include query optimization tips
- [x] Add troubleshooting for database issues
- [x] Document database-specific features

**Logging System**

- [x] Write comprehensive logging system guide
- [x] Document logger configuration options
- [x] Explain log levels and when to use each
- [x] Document log format options (json, text, pretty)
- [x] Cover request logging patterns
- [x] Cover query logging patterns
- [x] Document sensitive data masking
- [x] Include custom logger integration examples
- [x] Add logging best practices
- [x] Document performance considerations for logging

### Phase 5: Content Development - API Reference ✅

**HTTP API Reference**

- [x] Document all API endpoints comprehensively
- [x] Include request/response formats
- [x] Document all parameters and headers
- [x] Add authentication documentation
- [x] Create error catalog with causes and fixes
- [x] Include code examples for each endpoint
- [ ] Add OpenAPI specification if applicable (deferred - comprehensive manual documentation complete)

**Package API References**

- [x] Leverage existing comprehensive JSDoc documentation
- [x] Evaluate TypeDoc integration with existing JSDoc for automated API docs
- [x] Configure TypeDoc to supplement (not replace) existing JSDoc (decision: manual docs are superior)
- [x] Integrate API documentation into documentation site
- [x] Ensure API docs stay in sync with code changes (manual review process)
- [ ] Add automated API documentation generation to CI (deferred - manual docs are comprehensive and better)

**Note on TypeDoc Decision:**

After evaluating TypeDoc integration, it was decided that comprehensive manual documentation provides better results than auto-generated API docs. The manual documentation includes:

- Detailed explanations and context
- Real-world usage examples
- Best practices and guidance
- Clear organization and structure
- Better developer experience

The existing JSDoc comments in the code are comprehensive and serve as inline documentation, while the manual docs in the documentation site provide the user-facing API reference.

### Phase 6: Guides & Concepts ✅

**How-to Guides**

- [x] Create authentication guide
- [x] Create styling customization guide:
  - Document existing CSS custom properties (variables.css)
  - Document existing global styles (global.css)
  - Document existing dark mode implementation
  - Include component-level styling examples
  - Document design token overrides
  - Document style object customization patterns
  - Document class name override patterns
  - Include theming examples for custom branding
- [x] Create deployment guide
- [x] Create performance optimization guide
- [x] Create testing guide:
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

- [x] Write security model explanation
- [x] Document performance characteristics
- [x] Explain caching strategies
- [x] Document scalability considerations
- [x] Add architecture decision records
- [x] Document error handling patterns:
  - TabulaLensError class structure
  - Error codes and status codes
  - Client-side error handling
  - Server-side error handling
  - Error catalog with causes and fixes

### Phase 6.5: Navigation Restructuring ✅

**Problem Analysis**

- [x] Analyze current documentation structure and identify audience confusion
- [x] Identify user-facing vs contributor-facing content mixing
- [x] Document navigation issues and user experience problems
- [x] Propose reorganization strategy

**Navigation Restructuring**

- [x] Update Starlight sidebar configuration with nested navigation structure
- [x] Reorganize content into clear audience-based sections:
  - User Guides (Frontend, Backend, Integrations, Production)
  - API Reference (React, Node, HTTP)
  - Contributor Docs (Architecture, Component Architecture, Internal Systems, Performance & Scaling, Security)
- [x] Implement nested navigation with sub-sections:
  - User Guides → Frontend/Backend/Integrations/Production
  - Contributor Docs → Architecture/Component Architecture/Internal Systems/Performance & Scaling/Security
- [x] Update internal links to match new structure
- [x] Test navigation flow for both user and contributor journeys
- [x] Verify all content is accessible through new structure
- [x] Update any cross-references between documentation pages

**File Organization**

- [x] Evaluate if any files need to be moved to match new structure
- [x] Update file paths if restructuring requires it
- [x] Ensure all imports and references are updated
- [x] Test that all pages render correctly with new structure

**Content Auditing**

- [x] Review each page for audience alignment
- [x] Add audience indicators where helpful (user vs contributor)
- [x] Update page introductions to clarify target audience
- [x] Ensure user guides don't contain internal implementation details
- [x] Ensure contributor docs have sufficient technical depth

### Phase 7: AI Skills Implementation ✅

**Setup Skill**

- [x] Create `setup-tabula-lens` skill directory
- [x] Write comprehensive SKILL.md following Agent Skills specification
- [x] Include step-by-step setup instructions
- [x] Add troubleshooting guidance
- [x] Test skill across different AI platforms
- [x] Add examples and common use cases

**Component Generation Skill**

- [x] Create `generate-database-viewer` skill directory
- [x] Write SKILL.md for component generation
- [x] Include prop configuration guidance
- [x] Add styling customization options
- [x] Test skill with various component configurations
- [x] Document skill usage patterns

### Phase 8: Advanced Features ✅

**Accessibility**

- [x] Implement WCAG 2.1 AA compliance
- [x] Add reduced motion support
- [x] Implement high contrast mode
- [x] Ensure keyboard navigation works properly
- [x] Add screen reader optimization
- [ ] Test with accessibility tools (deferred - requires external tools)
- [x] Add accessibility statement to documentation

**SEO Implementation**

- [x] Add structured data (JSON-LD) for technical content
- [x] Implement Open Graph tags for social sharing
- [x] Add Twitter card meta tags
- [x] Optimize Core Web Vitals
- [x] Generate and submit sitemap
- [x] Add canonical URLs
- [x] Implement robots.txt
- [ ] Test SEO with relevant tools (deferred - requires external tools)

**Search Functionality**

- [x] Configure Starlight's built-in search
- [x] Optimize search indexing
- [ ] Add search analytics (deferred - requires analytics setup)
- [x] Test search functionality across content

### Phase 9: Deployment & CI/CD ✅

**GitHub Actions Setup**

- [x] Create GitHub Actions workflow for documentation
- [x] Set up automatic deployment on package release (not push to main)
- [x] Configure preview deployments for pull requests
- [x] Add deployment status checks
- [x] Test deployment workflow

**Documentation Testing**

- [x] Set up automated link checking (internal links validation)
- [x] Add build validation to CI
- [x] Implement code example testing where possible
- [x] Add accessibility testing to CI
- [x] Set up SEO validation in CI

**Implementation Details**

- Enhanced `.github/workflows/release.yml` with documentation deployment job that only runs after successful package publication
- Created `.github/workflows/preview-docs.yml` for PR preview builds and validation
- Created `.github/workflows/docs-ci.yml` for documentation-specific CI checks
- Updated `.github/workflows/ci.yml` to include documentation validation
- Added docs change detection to CI workflow
- Created `apps/docs/GITHUB_PAGES_SETUP.md` with comprehensive setup instructions
- Custom domain configured: `docs.tabula-lens.dev`
- Documentation deployment synchronized with package releases to ensure docs always match published versions

### Phase 10: Contributor Experience ✅

**Contributing Guide**

- [x] Write comprehensive contributing guide
- [x] Document Diataxis framework usage
- [x] Include writing style guide
- [x] Add code example standards
- [x] Document how to test documentation changes
- [x] Explain PR review process
- [x] Emphasize docs-as-code requirement

**Documentation Maintenance**

- [x] Set up documentation review process
- [x] Create documentation update checklist
- [x] Add documentation tasks to issue templates
- [x] Document how to handle version updates
- [x] Create documentation issue templates

**Implementation Details**

- Created comprehensive contributing guide at `apps/docs/src/content/docs/contributing.mdx`
- Added Diataxis framework documentation with detailed explanations of each content type
- Included writing style guide with voice, tone, structure, and formatting guidelines
- Added code example standards with quality requirements and formatting rules
- Documented testing procedures for documentation changes (local testing, content validation, accessibility testing)
- Explained PR review process with specific criteria for documentation PRs
- Emphasized docs-as-code requirement throughout the guide
- Created documentation update checklist covering content quality, structure, accessibility, testing, and integration
- Added documentation-specific issue template at `.github/ISSUE_TEMPLATE/documentation.yml`
- Updated existing issue templates (bug_report.yml, feature_request.yml) to include documentation-related fields
- Updated main CONTRIBUTING.md to reference the documentation contributing guide
- Added contributing guide to navigation sidebar in astro.config.mjs
- Documentation builds successfully with all new content included

### Phase 11: Content Migration & Enhancement ✅

**README Updates**

- [x] Update package READMEs to reference new documentation
- [x] Keep READMEs focused on installation + basic usage
- [x] Add cross-links between README and documentation
- [x] Ensure consistency between README and docs

**Content Enhancement**

- [x] Expand content from existing READMEs into proper documentation structure
- [x] Add missing examples and use cases
- [x] Improve explanations based on real-world usage
- [x] Add more diagrams and visual content
- [x] Ensure all code examples are tested and accurate

**Implementation Details**

- Updated both package READMEs (@tabula-lens/node and @tabula-lens/react) to reference the documentation site with prominent links
- Added cross-links from documentation pages back to package READMEs for quick reference
- Updated peer dependency versions to match actual package.json requirements:
  - React package: React 19.2.7+ (was React 18+)
  - Node package: Hono ^4.12.29 (was ^4.0.0)
- Added documentation links in Quick Start guides and API reference pages
- Tested all code examples in READMEs for syntax accuracy and type safety
- All package tests pass (19 tests for node, 204 tests for react)
- Type checking and linting pass for both packages

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
