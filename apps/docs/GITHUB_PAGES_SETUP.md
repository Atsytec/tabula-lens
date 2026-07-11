# GitHub Pages Configuration

This document explains how to configure GitHub Pages for the Tabula Lens documentation site.

## Prerequisites

- GitHub repository with admin access
- Custom domain: `docs.tabula-lens.dev`

## Setup Steps

### 1. Configure GitHub Pages Settings

1. Go to your repository on GitHub
2. Navigate to **Settings** > **Pages**
3. Under **Build and deployment**, set:
   - **Source**: GitHub Actions
   - **Branch**: (leave blank when using GitHub Actions)

### 2. Configure Custom Domain

1. In the Pages settings, click on **Custom domain**
2. Enter: `docs.tabula-lens.dev`
3. GitHub will provide you with DNS records to add

### 3. Configure DNS Records

Add the following DNS records to your domain registrar:

**If using a subdomain (docs.tabula-lens.dev):**

```
Type: CNAME
Name: docs
Value: [your-username].github.io
TTL: 3600
```

**If using an apex domain (tabula-lens.dev):**

```
Type: A
Name: @
Value: 185.199.108.153
TTL: 3600

Type: A
Name: @
Value: 185.199.109.153
TTL: 3600

Type: A
Name: @
Value: 185.199.110.153
TTL: 3600

Type: A
Name: @
Value: 185.199.111.153
TTL: 3600
```

### 4. Enable HTTPS

1. After DNS propagation, GitHub will automatically provision an SSL certificate
2. Wait for the certificate to be issued (may take up to 24 hours)
3. Enable **Enforce HTTPS** in the Pages settings

### 5. Verify Configuration

1. Run the release workflow to trigger documentation deployment
2. Visit `https://docs.tabula-lens.dev` to verify the site is live
3. Check that all links work correctly

## Workflow Configuration

The documentation deployment is configured in `.github/workflows/release.yml`:

- **Trigger**: Runs after successful package publication
- **Build**: Uses `pnpm --filter @tabula-lens/docs run build`
- **Deploy**: Uses GitHub Actions Pages deployment
- **Permissions**: Requires `pages: write` and `id-token: write`

## Preview Deployments

Pull requests that modify documentation will trigger the `preview-docs.yml` workflow, which:

- Builds the documentation
- Runs type checking and linting
- Validates the build
- Comments on the PR with build status

Preview deployments are not deployed to GitHub Pages but provide validation before merging.

## Troubleshooting

### Deployment Fails

- Check that the workflow has the correct permissions
- Verify that the build output exists in `apps/docs/dist`
- Check the workflow logs for specific errors

### Custom Domain Not Working

- Verify DNS records are correctly configured
- Wait for DNS propagation (can take up to 48 hours)
- Check that the domain is correctly entered in GitHub Pages settings
- Ensure HTTPS is enabled after DNS propagation

### Build Errors

- Check that all dependencies are installed
- Verify that the Astro configuration is correct
- Run `pnpm --filter @tabula-lens/docs run build` locally to reproduce errors

## Security Notes

- The workflow uses GitHub's OIDC provider for secure deployment
- No secrets are required for deployment
- The workflow only runs after successful package publication
- Custom domain should have HTTPS enforced
