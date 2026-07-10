---
'@tabula-lens/node': patch
'@tabula-lens/react': patch
---

Implement comprehensive npm package publishing best practices and fix critical configuration issues.

Changes:

- Add required package.json fields (author, license, repository, bugs, homepage, engines)
- Fix exports field configuration for proper TypeScript resolution (types → import → default order)
- Add sideEffects field for tree-shaking optimization
- Create .npmignore files for proper package publishing
- Add LICENSE files to package directories
- Configure .npmrc for public access to scoped packages
- Update GitHub Actions workflow for trusted publishing with OIDC
- Enable package provenance generation for supply chain security
- Update READMEs with correct license information, contributing guidelines, and support links
- Fix React badge to reflect React 19+ requirement
