// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Tabula Lens',
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
			sidebar: [
				{
					label: 'Quick Start',
					items: [
						{ label: 'Getting Started', slug: 'quick-start/getting-started' },
					],
				},
				{
					label: 'Guides',
					items: [
						{ label: 'Frontend Implementation', slug: 'guides/frontend-implementation' },
						{ label: 'React Component Architecture', slug: 'guides/react-component-architecture' },
						{ label: 'TanStack Query Integration', slug: 'guides/tanstack-query-integration' },
						{ label: 'TanStack Table Integration', slug: 'guides/tanstack-table-integration' },
						{ label: 'Backend Implementation', slug: 'guides/backend-implementation' },
						{ label: 'Database Integration', slug: 'guides/database-integration' },
						{ label: 'Logging System', slug: 'guides/logging-system' },
						{ label: 'Authentication', slug: 'guides/authentication' },
						{ label: 'Styling Customization', slug: 'guides/styling-customization' },
						{ label: 'Deployment', slug: 'guides/deployment' },
						{ label: 'Performance Optimization', slug: 'guides/performance-optimization' },
						{ label: 'Testing', slug: 'guides/testing' },
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
					label: 'Concepts',
					items: [
						{ label: 'Architecture', slug: 'concepts/architecture' },
						{ label: 'Backend Architecture', slug: 'concepts/backend-architecture' },
						{ label: 'Database Architecture', slug: 'concepts/database-architecture' },
						{ label: 'Security Model', slug: 'concepts/security' },
						{ label: 'Design System', slug: 'concepts/design-system' },
						{ label: 'Performance Characteristics', slug: 'concepts/performance-characteristics' },
						{ label: 'Caching Strategies', slug: 'concepts/caching-strategies' },
						{ label: 'Scalability', slug: 'concepts/scalability' },
						{ label: 'Architecture Decision Records', slug: 'concepts/architecture-decisions' },
					],
				},
			],
		}),
	],
});
