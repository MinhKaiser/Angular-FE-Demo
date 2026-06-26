# Security Guidelines

## 🔐 Environment Variables & Secrets

### What Goes Into `.env`
✅ **SAFE TO COMMIT in `.env.example`:**
- Public API URLs
- Feature flags (non-sensitive)
- Environment names
- Timeouts & limits
- General configuration

❌ **NEVER COMMIT (keep in `.env` only):**
- API Keys
- OAuth tokens
- Database credentials
- Private secrets
- Passwords
- JWT signing keys

### File Structure

```
.env.example          ✅ COMMIT (public template)
.env                  ❌ NEVER COMMIT (local development)
.env.production       ❌ NEVER COMMIT (production secrets)
.env.staging          ❌ NEVER COMMIT (staging secrets)
```

### .gitignore Protection
```gitignore
.env
.env.local
.env.*.local
.env.production
!.env.example
```

The `.env.example` file is version-controlled with placeholder values, helping new developers see what env variables are needed.

## 📁 What to Commit vs Ignore

### ✅ COMMIT TO GIT
```
src/
  ├── app/                    # All source code
  ├── environments/           # Config (public values only)
  ├── main.ts
  └── styles.css

package.json                  # Dependencies
package-lock.json            # Locked versions
tsconfig.json               # TypeScript config
angular.json                # Angular config
.env.example                # Template only
ARCHITECTURE.md             # Documentation
README.md                   # Documentation
LICENSE                     # License
.prettierrc                  # Formatting rules
.eslintrc.js               # Linting rules
.editorconfig              # Editor config
```

### ❌ DO NOT COMMIT
```
node_modules/               # Generated, huge
dist/                       # Generated
out-tsc/                    # Generated
.angular/                   # Generated cache

.env                        # Local secrets
.env.local                  # Local secrets
.env.production             # Production secrets

.DS_Store                   # OS files
Thumbs.db                   # OS files

.idea/                      # IDE files
.vscode/                    # IDE files (except templates)

coverage/                   # Test coverage
karma-coverage/             # Test coverage

*.log                       # Log files
logs/                       # Log files
```

## 🔒 Environment Configuration

### Development Setup
```bash
# 1. Copy template
cp .env.example .env

# 2. Update .env with local values
NG_APP_API_URL=https://dummyjson.com
NG_APP_DEBUG=true

# 3. DO NOT commit .env
git status   # Should show .env in gitignore
```

### Production Setup
```bash
# 1. Create .env.production (CI/CD only, never commit)
NG_APP_API_URL=https://api.yourproduction.com
NG_APP_DEBUG=false
NG_APP_ENABLE_SENTRY=true

# 2. Set via CI/CD system (GitHub Actions, GitLab CI, etc.)
# Store secrets in: Settings > Secrets > New secret
```

## 🚀 CI/CD Best Practices

### GitHub Actions Example
```yaml
# .github/workflows/deploy.yml
env:
  NG_APP_API_URL: ${{ secrets.PROD_API_URL }}
  NG_APP_DEBUG: false
  NG_APP_ENABLE_SENTRY: ${{ secrets.ENABLE_SENTRY }}
```

### GitLab CI Example
```yaml
# .gitlab-ci.yml
variables:
  NG_APP_API_URL: $PROD_API_URL
  NG_APP_DEBUG: "false"
```

## 🛡️ Additional Security Best Practices

### 1. No Sensitive Data in Version Control
```typescript
// ❌ BAD
const API_KEY = 'sk-1234567890abcdef';
const DATABASE_PASSWORD = 'MySecurePassword123';

// ✅ GOOD
const API_KEY = process.env['NG_APP_API_KEY'];
const DATABASE_PASSWORD = process.env['NG_APP_DB_PASSWORD'];
```

### 2. Angular Environment Detection
```typescript
import { getEnvironmentConfig } from '@core/services';

const config = getEnvironmentConfig();
if (!config.production) {
  // Enable debugging only in development
  console.log('Debug info...');
}
```

### 3. Secure Token Storage
- **Access Token**: In-memory (cleared on browser close)
- **Refresh Token**: HttpOnly Cookie (more secure)
- **Never**: localStorage for sensitive tokens (XSS vulnerable)

### 4. HTTP Headers Security
```typescript
// Interceptor automatically adds:
Authorization: Bearer ${accessToken}

// Over HTTPS only (Secure flag set on cookies)
HttpOnly: true
Secure: true (production)
SameSite: Strict
```

### 5. CORS Configuration
- Only allow trusted domains
- Whitelist API endpoints
- Use credentials mode carefully

### 6. Content Security Policy
```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline';">
```

## 📋 Security Checklist Before Deploy

- [ ] No `.env` files in git history
- [ ] No API keys in source code
- [ ] No passwords in code/config
- [ ] HTTPS enabled in production
- [ ] CORS properly configured
- [ ] HttpOnly cookies for tokens
- [ ] CSP headers set
- [ ] Error messages don't leak sensitive info
- [ ] Logging doesn't expose secrets
- [ ] Dependencies up-to-date (`npm audit`)
- [ ] Auth interceptor properly configured
- [ ] Input validation on all forms
- [ ] XSS protection enabled

## 🚨 Emergency: Secret Leaked in Git

```bash
# 1. Immediately revoke the secret
# 2. Remove from git history
git filter-branch --tree-filter 'rm -f .env' HEAD

# 3. Force push (CAREFUL! Affects all developers)
git push --force

# 4. Alert team to re-clone
```

## 📚 Resources
- [Angular Security Guide](https://angular.dev/guide/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [npm Audit](https://docs.npmjs.com/cli/v8/commands/npm-audit)
