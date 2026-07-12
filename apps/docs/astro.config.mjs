// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://docs.tabula-lens.dev',
	compressHTML: true,
	build: {
		format: 'directory',
	},
	image: {
		service: {
			entrypoint: 'astro/assets/services/sharp',
		},
	},
	integrations: [
		sitemap(),
		starlight({
			title: 'Tabula Lens',
			description: 'Full-stack database viewer library for React and Node with PostgreSQL, MySQL, SQLite, and SQL Server support',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/Atsytec/tabula-lens' }],
			customCss: ['./src/styles/tlens-theme.css'],
			// Versioning infrastructure for future major versions
			// Uncomment and configure when releasing v2.0.0
			// versions: {
			// 	current: 'v1',
			// 	v1: {
			// 		label: 'v1.x',
			// 		link: '/v1/'
			// 	}
			// },
			head: [
				{
					tag: 'meta',
					attrs: {
						name: 'og:type',
						content: 'website',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'og:site_name',
						content: 'Tabula Lens',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'twitter:card',
						content: 'summary_large_image',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'twitter:site',
						content: '@tabulalens',
					},
				},
				{
					tag: 'meta',
					attrs: {
						name: 'twitter:creator',
						content: '@atsytec',
					},
				},
			],
			sidebar: [
				{
					label: 'Quick Start',
					items: [
						{ label: 'Getting Started', slug: 'quick-start/getting-started' },
					],
				},
				{
					label: 'User Guides',
					items: [
						{ label: 'Frontend Setup', slug: 'user-guides/frontend/frontend-implementation' },
						{ label: 'Backend Setup', slug: 'user-guides/backend/backend-implementation' },
						{
							label: 'Authentication',
							items: [
								{ label: 'Overview', slug: 'user-guides/authentication' },
								{ label: 'Auth.js', slug: 'user-guides/authentication/authjs' },
								{ label: 'Auth0', slug: 'user-guides/authentication/auth0' },
								{ label: 'Better Auth', slug: 'user-guides/authentication/better-auth' },
								{ label: 'Clerk', slug: 'user-guides/authentication/clerk' },
								{ label: 'Firebase Auth', slug: 'user-guides/authentication/firebase-auth' },
								{ label: 'Kinde', slug: 'user-guides/authentication/kinde' },
								{ label: 'Lucia Auth', slug: 'user-guides/authentication/lucia' },
								{ label: 'Supabase Auth', slug: 'user-guides/authentication/supabase-auth' },
							],
						},
						{
							label: 'Database Providers',
							items: [
								{ label: 'PostgreSQL', slug: 'user-guides/postgresql' },
								{ label: 'MySQL', slug: 'user-guides/mysql' },
								{ label: 'SQLite', slug: 'user-guides/sqlite' },
								{ label: 'SQL Server', slug: 'user-guides/mssql' },
							],
						},
						{ label: 'Best Practices', slug: 'user-guides/best-practices' },
					],
				},
				{
					label: 'API Reference',
					items: [
						{ label: 'React API', slug: 'api/react' },
						{ label: 'Node API', slug: 'api/node' },
						{ label: 'HTTP API', slug: 'api/http' },
					],
				},
				{
					label: 'Contributor Docs',
					items: [
						{ label: 'Overview', slug: 'contributor-docs/onboarding' },
						{ label: 'Contributing to Documentation', slug: 'contributing' },
						{
							label: 'Architecture',
							items: [
								{ label: 'Architecture Overview', slug: 'contributor-docs/architecture/architecture' },
								{
									label: 'Backend Architecture',
									slug: 'contributor-docs/architecture/backend-architecture',
								},
								{
									label: 'Database Architecture',
									slug: 'contributor-docs/architecture/database-architecture',
								},
								{
									label: 'Architecture Decision Records',
									slug: 'contributor-docs/architecture/architecture-decisions',
								},
							],
						},
						{
							label: 'Component Architecture',
							items: [
								{
									label: 'React Component Architecture',
									slug: 'contributor-docs/component-architecture/react-component-architecture',
								},
							],
						},
						{
							label: 'Internal Systems',
							items: [
								{ label: 'Design System', slug: 'contributor-docs/internal-systems/design-system' },
								{ label: 'Error Handling', slug: 'contributor-docs/internal-systems/error-handling' },
								{ label: 'Logging System', slug: 'contributor-docs/internal-systems/logging-system' },
							],
						},
						{
							label: 'Performance & Scaling',
							items: [
								{
									label: 'Performance Characteristics',
									slug: 'contributor-docs/performance-scaling/performance-characteristics',
								},
								{
									label: 'Caching Strategies',
									slug: 'contributor-docs/performance-scaling/caching-strategies',
								},
								{ label: 'Scalability', slug: 'contributor-docs/performance-scaling/scalability' },
							],
						},
						{
							label: 'Security',
							items: [{ label: 'Security Model', slug: 'contributor-docs/security/security' }],
						},
						{
							label: 'Testing',
							items: [
								{ label: 'Testing Guide', slug: 'contributor-docs/testing' },
								{ label: 'Advanced Testing', slug: 'contributor-docs/testing-advanced' },
							],
						},
					],
				},
				{
					label: 'About',
					items: [{ label: 'Accessibility', slug: 'about/accessibility' }],
				},
			],
		}),
	],
});
