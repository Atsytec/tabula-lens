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
			description: 'Full-stack database viewer library for React and Node with PostgreSQL support',
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
						{
							label: 'Overview',
							slug: 'user-guides',
						},
						{
							label: 'Frontend',
							items: [
								{ label: 'Overview', slug: 'user-guides/frontend' },
								{ label: 'Frontend Implementation', slug: 'user-guides/frontend/frontend-implementation' },
								{ label: 'TanStack Query Integration', slug: 'user-guides/frontend/tanstack-query-integration' },
								{ label: 'TanStack Table Integration', slug: 'user-guides/frontend/tanstack-table-integration' },
								{ label: 'Styling Customization', slug: 'user-guides/frontend/styling-customization' },
							],
						},
						{
							label: 'Backend',
							items: [
								{ label: 'Overview', slug: 'user-guides/backend' },
								{ label: 'Backend Implementation', slug: 'user-guides/backend/backend-implementation' },
								{ label: 'Database Integration', slug: 'user-guides/backend/database-integration' },
								{ label: 'Logging System', slug: 'user-guides/backend/logging-system' },
							],
						},
						{
							label: 'Integrations',
							items: [
								{ label: 'Overview', slug: 'user-guides/integrations' },
								{
									label: 'Authentication',
									items: [
										{ label: 'Overview', slug: 'user-guides/integrations/authentication' },
										{ label: 'Auth.js', slug: 'user-guides/integrations/authjs' },
										{ label: 'Auth0', slug: 'user-guides/integrations/auth0' },
										{ label: 'Better Auth', slug: 'user-guides/integrations/better-auth' },
										{ label: 'Clerk', slug: 'user-guides/integrations/clerk' },
										{ label: 'Firebase Auth', slug: 'user-guides/integrations/firebase-auth' },
										{ label: 'Kinde', slug: 'user-guides/integrations/kinde' },
										{ label: 'Lucia Auth', slug: 'user-guides/integrations/lucia' },
										{ label: 'Supabase Auth', slug: 'user-guides/integrations/supabase-auth' },
									],
								},
								{
									label: 'Databases',
									items: [
										{ label: 'Neon', slug: 'user-guides/integrations/neon' },
										{ label: 'Supabase Database', slug: 'user-guides/integrations/supabase' },
									],
								},
								{
									label: 'Developer Tools',
									items: [
										{ label: 'ORM Coexistence', slug: 'user-guides/integrations/orm-coexistence' },
										{ label: 'Sentry', slug: 'user-guides/integrations/sentry' },
									],
								},
							],
						},
						{
							label: 'Production',
							items: [
								{ label: 'Overview', slug: 'user-guides/production' },
								{ label: 'Deployment', slug: 'user-guides/production/deployment' },
								{ label: 'Performance Optimization', slug: 'user-guides/production/performance-optimization' },
								{ label: 'Testing', slug: 'user-guides/production/testing' },
							],
						},
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
						{
							label: 'Overview',
							slug: 'contributor-docs',
						},
						{
							label: 'Architecture',
							items: [
								{ label: 'Overview', slug: 'contributor-docs/architecture' },
								{ label: 'Architecture Overview', slug: 'contributor-docs/architecture/architecture' },
								{ label: 'Backend Architecture', slug: 'contributor-docs/architecture/backend-architecture' },
								{ label: 'Database Architecture', slug: 'contributor-docs/architecture/database-architecture' },
								{ label: 'Architecture Decision Records', slug: 'contributor-docs/architecture/architecture-decisions' },
							],
						},
						{
							label: 'Component Architecture',
							items: [
								{ label: 'Overview', slug: 'contributor-docs/component-architecture' },
								{ label: 'React Component Architecture', slug: 'contributor-docs/component-architecture/react-component-architecture' },
							],
						},
						{
							label: 'Internal Systems',
							items: [
								{ label: 'Overview', slug: 'contributor-docs/internal-systems' },
								{ label: 'Design System', slug: 'contributor-docs/internal-systems/design-system' },
								{ label: 'Error Handling', slug: 'contributor-docs/internal-systems/error-handling' },
							],
						},
						{
							label: 'Performance & Scaling',
							items: [
								{ label: 'Overview', slug: 'contributor-docs/performance-scaling' },
								{ label: 'Performance Characteristics', slug: 'contributor-docs/performance-scaling/performance-characteristics' },
								{ label: 'Caching Strategies', slug: 'contributor-docs/performance-scaling/caching-strategies' },
								{ label: 'Scalability', slug: 'contributor-docs/performance-scaling/scalability' },
							],
						},
						{
							label: 'Security',
							items: [
								{ label: 'Overview', slug: 'contributor-docs/security' },
								{ label: 'Security Model', slug: 'contributor-docs/security/security' },
							],
						},
					],
				},
				{
					label: 'Contributing',
					items: [
						{ label: 'Contributing to Documentation', slug: 'contributing' },
					],
				},
				{
					label: 'About',
					items: [
						{ label: 'Accessibility', slug: 'accessibility' },
					],
				},
			],
		}),
	],
});
