# Publishing Guide

## Pre-publish Checklist

Before publishing to npm, update the following in `package.json`:

1. **Version**: Update the version number following semver
2. **Author**: Add your name/email
3. **Repository URLs**: Replace `yourusername` with your actual GitHub username

```json
{
  "version": "0.1.0",  // Update this
  "author": "Your Name <your.email@example.com>",  // Update this
  "repository": {
    "url": "https://github.com/YOUR-USERNAME/ink-web.git"  // Update this
  }
}
```

## Publishing Steps

### First Time Setup

```bash
# Login to npm (only needed once)
npm login
```

### Publishing

```bash
# 1. Update version in package.json
# 2. Build the package
bun run build

# 3. Test the build
bun test

# 4. Publish to npm
npm publish --access public

# Or using bun
bun publish --access public
```

## What Gets Published

Only these files/folders are included (defined in `package.json` `files` field):
- `dist/` - The built library
- `README.md` - Documentation

Everything else (src, demo, tests, config files) is excluded via `.npmignore`.

## Verify Before Publishing

```bash
# Preview what will be published
npm pack --dry-run

# Or create a tarball to inspect
npm pack
tar -xzf ink-web-*.tgz
```

## After Publishing

1. Create a git tag for the release
2. Push the tag to GitHub
3. Create a GitHub release with changelog
4. Update dependent projects

## Unpublishing (Emergency Only)

```bash
# Only works within 72 hours of publishing
npm unpublish ink-web@<version>
```

