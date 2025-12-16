# NPM Package Installation Workflow - Security Documentation

## Overview

The `install-npm-package.yml` workflow provides a secure, automated way to install npm packages and create pull requests. This workflow implements multiple layers of security validation to prevent common attack vectors.

## 🔒 Security Measures

### 1. Authorization Control

**What it does:**
- Verifies that only users with write access (admin, maintain, or write permissions) can trigger the workflow
- Uses GitHub's API to check the caller's permission level

**Protection against:**
- Unauthorized package installations by external contributors
- Malicious actors without proper access rights

**Implementation:**
```yaml
gh api /repos/${{ github.repository }}/collaborators/${{ github.actor }}/permission
```

### 2. Input Validation

**What it does:**
- Validates package name against official npm naming rules
- Checks for dangerous characters that could indicate injection attempts
- Ensures package name length is within limits (max 214 characters)
- Validates format matches: `[@scope/]name[@version]`

**Protection against:**
- Command injection attacks
- Path traversal attempts
- Shell injection via special characters

**Blocked characters:**
- `;` - Command chaining
- `&` - Background execution
- `|` - Pipe commands
- `` ` `` - Command substitution
- `$` - Variable expansion
- `<>` - Redirects
- `(){}` - Subshells and brace expansion
- `\` - Escape sequences
- `..` - Path traversal

**Valid package name examples:**
- `lodash`
- `@types/node`
- `react@18.0.0`
- `@babel/core@7.23.0`

**Invalid examples that will be rejected:**
- `package; rm -rf /` - Command injection
- `../../../etc/passwd` - Path traversal
- `package$(whoami)` - Command substitution
- `pack age` - Contains spaces

### 3. Safe Installation Process

**What it does:**
- First verifies package exists using `--package-lock-only`
- Installs package with `--ignore-scripts` flag
- Prevents execution of postinstall, preinstall, and other lifecycle scripts

**Protection against:**
- Arbitrary code execution during installation
- Malicious scripts in packages
- Supply chain attacks via install scripts

**Installation command:**
```bash
npm install "$PACKAGE" --ignore-scripts --no-audit --no-fund --save
```

### 4. Change Verification

**What it does:**
- Verifies that `package.json` and `package-lock.json` were actually modified
- Shows diff of changes before committing
- Ensures the installation had the expected effect

**Protection against:**
- Silent failures
- Unexpected behavior
- Race conditions

### 5. Network Resilience

**What it does:**
- Implements exponential backoff retry logic for git push
- Retries up to 4 times with delays: 2s, 4s, 8s, 16s
- Gracefully handles temporary network issues

**Protection against:**
- Transient network failures
- Partial commits due to connection drops

## 🚨 Known Limitations & Residual Risks

### 1. Package Content is Not Scanned

**Risk:** The workflow does not analyze the actual code within the package.

**Mitigation:**
- The PR includes a security checklist for manual review
- Recommends running `npm audit` to check for known vulnerabilities
- Encourages reviewing the package repository and maintainers

### 2. Install Scripts are Disabled

**Risk:** Some packages may require install scripts to function properly (e.g., native modules).

**Mitigation:**
- The PR documentation explains how to rebuild packages post-merge
- Instructions provided for running `npm rebuild` if needed

### 3. Dependency Chain is Not Validated

**Risk:** The package may bring in malicious dependencies.

**Mitigation:**
- PR checklist includes reviewing dependencies
- Recommends checking the full dependency tree before merging

### 4. Typosquatting Detection

**Risk:** Similar package names could be malicious (e.g., `loadash` instead of `lodash`).

**Mitigation:**
- Manual review required before merging PR
- Requires write access, limiting the attack surface

## 📋 Usage Instructions

### Triggering the Workflow

1. Go to the **Actions** tab in your GitHub repository
2. Select **"Install NPM Package (Secure)"** from the workflow list
3. Click **"Run workflow"**
4. Enter the package name (with optional version):
   - Just package: `lodash`
   - With version: `lodash@4.17.21`
   - Scoped package: `@types/node`
   - Scoped with version: `@types/node@18.0.0`
5. Click **"Run workflow"**

### What Happens Next

1. ✅ Permission check verifies you have write access
2. ✅ Package name is validated for security
3. ✅ Package existence is verified in npm registry
4. ✅ Package is installed with scripts disabled
5. ✅ Changes are committed to a new branch
6. ✅ Pull request is created with security checklist

### Reviewing the Pull Request

**Before merging, complete the security checklist:**

- [ ] Verify this is the correct package (check for typosquatting)
- [ ] Review the package repository on GitHub/npm
- [ ] Check package maintainers are trustworthy
- [ ] Run `npm audit` to scan for vulnerabilities
- [ ] Review what dependencies are being added
- [ ] Test that the application still works
- [ ] Check bundle size impact

### After Merging

If the package requires install scripts to work:

```bash
# Rebuild the specific package
npm rebuild package-name

# Or reinstall all packages (runs all scripts)
npm install
```

## 🛡️ Validation Rules Reference

### Package Name Format

The workflow validates package names using this regex:

```regex
^(@[a-z0-9-~][a-z0-9-._~]*/)?[a-z0-9-~][a-z0-9-._~]*(@[a-z0-9-_.]+)?$
```

**Breaking down the pattern:**
- `(@[a-z0-9-~][a-z0-9-._~]*/)?` - Optional scope
  - Must start with `@`
  - First char: lowercase letter, number, hyphen, or tilde
  - Rest: also allows dots and underscores
  - Ends with `/`
- `[a-z0-9-~][a-z0-9-._~]*` - Package name (required)
  - First char: lowercase letter, number, hyphen, or tilde
  - Rest: also allows dots and underscores
- `(@[a-z0-9-_.]+)?` - Optional version
  - Must start with `@`
  - Can contain: letters, numbers, hyphens, dots, underscores

### Character Validation

Additional character checks beyond regex:

1. **No dangerous characters:** `; & | \` $ < > ( ) { } \\`
2. **No spaces:** Package names cannot contain whitespace
3. **No double dots:** Prevents path traversal (`..)
4. **No leading dot:** Prevents hidden file patterns (except `@` for scopes)
5. **Length limit:** Maximum 214 characters

## 🔍 Testing the Workflow

### Test with Valid Packages

```
lodash
express
@types/node
react@18.0.0
@babel/core@7.23.0
```

### Test Blocked Malicious Inputs

These should all fail validation:

```
package; whoami          # Command injection
package && ls            # Command chaining
package | cat            # Pipe injection
package$(id)             # Command substitution
package`id`              # Backtick execution
../../../etc/passwd      # Path traversal
package..name            # Double dots
pack age                 # Spaces
```

## 📚 Additional Resources

- [npm package naming rules](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#name)
- [GitHub Actions security hardening](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
- [npm install script security](https://docs.npmjs.com/cli/v9/using-npm/scripts#npm-install-scripts)
- [OWASP Command Injection](https://owasp.org/www-community/attacks/Command_Injection)

## 🆘 Troubleshooting

### "Insufficient permissions" error

**Cause:** You don't have write access to the repository.

**Solution:** Contact a repository admin to grant you write or maintain permissions.

### "Invalid package name format" error

**Cause:** The package name doesn't match npm naming conventions.

**Solution:**
- Ensure the name is lowercase
- Check for typos
- Verify the package exists on npm: `npm info <package-name>`

### "Package name contains dangerous characters" error

**Cause:** The input contains characters that could indicate an injection attempt.

**Solution:**
- Remove any special characters
- Use only: `a-z`, `0-9`, `-`, `_`, `.`, `@`, `/`

### PR created but package doesn't work

**Cause:** The package may require install scripts that were disabled.

**Solution:**
```bash
# After merging, rebuild the package
npm rebuild <package-name>
```

## 🔄 Workflow Maintenance

### Regular Updates

- Keep GitHub Actions runners updated
- Update Node.js version in workflow as needed
- Review and update security patterns based on new threats

### Monitoring

- Review workflow run logs regularly
- Monitor for unusual package installation patterns
- Track failed runs for potential attack attempts

---

**Last Updated:** 2025-12-16
**Workflow Version:** 1.0.0
**Maintainer:** Repository Owners
