# Release Process

This document describes the release process for mcp-echarts.

## Prerequisites

Before releasing, ensure:
1. All changes are committed and tests pass
2. NPM_TOKEN secret is configured in GitHub repository settings

## Setting up NPM_TOKEN Secret

The workflow requires an `NPM_TOKEN` secret to publish to npm. To configure it:

1. Generate an npm access token:
   - Go to https://www.npmjs.com/settings/[your-username]/tokens
   - Click "Generate New Token"
   - Select "Automation" token type
   - Copy the generated token

2. Add the token to GitHub repository:
   - Go to repository Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Paste your npm token
   - Click "Add secret"

## Release Steps

### Option 1: Using npm version command (Recommended)

The `npm version` command automatically updates package.json, creates a commit, and creates a tag:

```bash
# For patch release (0.8.0 → 0.8.1)
npm version patch

# For minor release (0.8.0 → 0.9.0)
npm version minor

# For major release (0.8.0 → 1.0.0)
npm version major
```

Then push the commit and tag:

```bash
git push origin main
git push origin --tags
```

### Option 2: Manual version update

1. **Manually update version in package.json**:
   Edit the `version` field in `package.json` to the new version (e.g., `0.8.0`)

2. **Commit the changes**:
   ```bash
   git add package.json
   git commit -m "chore: bump version to x.y.z"
   git push origin main
   ```

3. **Create and push a git tag**:
   ```bash
   # Tag format must be vX.Y.Z (semantic versioning)
   git tag v0.8.0
   git push origin v0.8.0
   ```

### After Pushing the Tag

1. **Monitor the workflow**:
   - Go to Actions tab in GitHub repository
   - Watch the "Publish to NPM" workflow execute
   - Verify it completes successfully

2. **Verify the release**:
   - Check npm: https://www.npmjs.com/package/mcp-echarts
   - Check GitHub Releases: https://github.com/hustcc/mcp-echarts/releases

## Workflow Details

The publish workflow (`.github/workflows/publish.yml`) performs:
- ✅ Validates semantic versioning format (vX.Y.Z)
- ✅ Checks tag matches package.json version
- ✅ Installs dependencies
- ✅ Runs all tests
- ✅ Publishes to npm (build happens automatically via prepublishOnly script)
- ✅ Creates GitHub release

## Semantic Versioning

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (0.9.0): New features, backward compatible
- **PATCH** (0.8.1): Bug fixes, backward compatible

## Troubleshooting

### Workflow fails with "npm ERR! 403 Forbidden"
- Verify NPM_TOKEN is set correctly in repository secrets
- Check the token has appropriate permissions for publishing

### Workflow fails with "Tag version does not match package.json"
- Ensure the tag version (without 'v' prefix) matches package.json version
- Example: tag `v0.8.0` must match `"version": "0.8.0"` in package.json

### Workflow fails with "Tag does not follow semantic versioning"
- Ensure tag follows the format `vX.Y.Z` where X, Y, Z are numbers
- Examples: `v1.0.0`, `v0.8.0`, `v2.3.1`
- Invalid: `0.8.0` (missing 'v'), `v1.0` (missing patch), `v1.0.0-beta` (pre-release not supported)
