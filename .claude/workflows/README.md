# GitHub Actions Workflows Documentation

> **Note for AI Agents:** This directory (`.claude/workflows/`) contains documentation about GitHub Actions workflows for agent context. The actual workflow files are located in `.github/workflows/`.

This documentation provides comprehensive information about the automated workflows in the Astro Ink project.

## Available Workflows

### 1. CI Workflow (`main.yml`)

**Trigger:** Push to main, Pull Requests, Schedule (every 4 hours), Manual

**Purpose:** Publishes draft blog posts automatically when their publish date arrives.

**Use case:** Automatically move posts from `/src/drafts/` to published when scheduled.

---

### 2. Install NPM Package Workflow (`install-npm-package.yml`)

**Trigger:** Manual (workflow_dispatch)

**Purpose:** Securely install npm packages and create pull requests with proper validation.

**Security Level:** 🔒 High - Multiple validation layers

#### Quick Start

1. Go to **Actions** → **Install NPM Package (Secure)**
2. Click **Run workflow**
3. Enter package name:
   - `lodash`
   - `express@4.18.0`
   - `@types/node`
4. Review the created PR before merging

#### Security Features

✅ **Authorization check** - Only users with write access can run this
✅ **Input validation** - Strict regex validation prevents injection attacks
✅ **Safe installation** - Packages installed with `--ignore-scripts` flag
✅ **Change verification** - Confirms expected files were modified
✅ **Network resilience** - Automatic retries with exponential backoff

#### What Gets Validated

- Package name format (must match npm conventions)
- No dangerous characters (; & | $ < > etc.)
- No path traversal attempts (..)
- Package exists in npm registry
- User has proper permissions

#### Created Pull Request Includes

- 📦 Package details and version
- 🔒 Security checklist for reviewers
- ✅ Verification steps completed
- 📝 Instructions for post-merge actions
- 🔍 Commands to inspect the package

#### Example Usage

**Valid inputs:**
```
lodash
express
react@18.0.0
@types/node@18.0.0
@babel/core
```

**Blocked inputs (security):**
```
package; rm -rf /           ❌ Command injection
package && malicious        ❌ Command chaining
package | cat /etc/passwd   ❌ Pipe injection
../../../etc/passwd         ❌ Path traversal
package$(whoami)            ❌ Command substitution
```

#### For More Details

See [INSTALL_NPM_PACKAGE_SECURITY.md](./INSTALL_NPM_PACKAGE_SECURITY.md) for:
- Complete security documentation
- Detailed validation rules
- Troubleshooting guide
- Testing procedures
- Known limitations

---

## Workflow Permissions

All workflows use minimal required permissions following the principle of least privilege:

| Workflow | Permissions |
|----------|-------------|
| CI | `contents: write` (for publishing drafts) |
| Install NPM Package | `contents: write`, `pull-requests: write`, `issues: read` |

## Security Best Practices

1. **Never disable input validation** in any workflow
2. **Always use `--ignore-scripts`** when installing untrusted packages
3. **Review all PRs** created by automated workflows before merging
4. **Keep workflows updated** with latest GitHub Actions versions
5. **Monitor workflow runs** for suspicious activity

## Adding New Workflows

When creating new workflows:

1. Follow the security pattern from `install-npm-package.yml`
2. Validate all user inputs
3. Use minimal permissions
4. Add error handling and retries
5. Document security measures
6. Include failure summaries
7. Test with malicious inputs

## Troubleshooting

### Workflow not visible in Actions tab

- Check the workflow file is in `.github/workflows/`
- Verify YAML syntax is valid
- Ensure file has `.yml` or `.yaml` extension

### "Insufficient permissions" error

- Check if your user has write access to the repository
- Verify the workflow permissions are correctly set

### Workflow fails silently

- Check the workflow run logs in Actions tab
- Look for the step summary at the end of the run
- Review error messages in failed steps

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Actions Security Guide](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
- [Workflow Syntax Reference](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)

---

**Last Updated:** 2025-12-16
