# QueryNotes Development Workflow Guide

This comprehensive guide covers the complete development workflow for QueryNotes, from local development setup to production deployment. It's designed to prevent configuration mismatches and ensure smooth transitions between environments.

## Table of Contents

1. [Local Development & Testing](#local-development--testing)
2. [Production Deployment](#production-deployment)
3. [Configuration Management](#configuration-management)
4. [Troubleshooting](#troubleshooting)

---

## Local Development & Testing

### 1. Environment Configuration Setup

#### Initial Setup
```bash
# Clone and install dependencies
git clone https://github.com/your-username/querynotes.git
cd querynotes
npm install

# Copy environment template
cp .env.example .env.local
```

#### Local Environment Variables (.env.local)
```env
# Site Configuration (CRITICAL: Keep as localhost for local development)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Configuration
OPENAI_API_KEY=your_openai_api_key
SILICONFLOW_API_KEY=your_siliconflow_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key

# Email Configuration (Resend)
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_EMAIL_DOMAIN=mail.querynotes.top

# Webhook Secret (Get from Supabase Dashboard > Authentication > Hooks)
SEND_EMAIL_HOOK_SECRET=your_supabase_webhook_secret_hex_string
```

**⚠️ Critical Notes:**
- `NEXT_PUBLIC_SITE_URL` MUST be `http://localhost:3000` for local development
- `SEND_EMAIL_HOOK_SECRET` should be the raw hex string from Supabase (not base64)
- Never commit `.env.local` to version control

### 2. Supabase Configuration for Local Development

#### Database Setup
1. **Create Supabase Project**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Create new project
   - Note down Project URL and anon key

2. **Configure Authentication**
   ```sql
   -- Enable Row Level Security on all tables
   ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
   ALTER TABLE qa_sessions ENABLE ROW LEVEL SECURITY;
   ALTER TABLE qa_messages ENABLE ROW LEVEL SECURITY;
   
   -- Create RLS policies (example for notes table)
   CREATE POLICY "Users can only see their own notes" ON notes
   FOR ALL USING (auth.uid() = user_id);
   ```

3. **Auth Hook Configuration**
   - Navigate to Authentication > Hooks in Supabase Dashboard
   - **Hook Type**: Send Email Hook
   - **Hook URL**: `http://localhost:3000/api/auth/send-email`
   - **HTTP Method**: POST
   - **Generate and save the webhook secret**

#### URL Allow List Configuration
```
Authentication > URL Configuration > Redirect URLs:
- http://localhost:3000/auth/callback
- https://www.querynotes.top/auth/callback (for production)

Site URL: http://localhost:3000 (for local development)
```

### 3. Email System Testing (Local)

#### Resend Configuration
1. **Domain Setup**
   - Add your domain to Resend
   - Configure DNS records (SPF, DKIM, DMARC)
   - Verify domain ownership

2. **Local Webhook Testing**
   ```bash
   # Start development server
   npm run dev
   
   # Test webhook endpoint manually
   curl -X POST http://localhost:3000/api/auth/send-email \
     -H "Content-Type: application/json" \
     -d '{"test": "payload"}'
   ```

3. **Email Template Testing**
   - Use Resend's testing features
   - Send test emails to verify formatting
   - Check spam folder and deliverability

### 4. Authentication Flow Testing Procedures

#### Complete Local Testing Checklist

**Pre-Testing Setup:**
- [ ] Development server running (`npm run dev`)
- [ ] Supabase project configured
- [ ] Email domain verified in Resend
- [ ] All environment variables set correctly

**Signup Flow Testing:**
1. [ ] Navigate to `/signup`
2. [ ] Enter test email and password
3. [ ] Check browser network tab for successful POST to `/api/auth/send-email`
4. [ ] Verify email received in inbox
5. [ ] Click confirmation link in email
6. [ ] Verify redirect to homepage with welcome message
7. [ ] Check user appears in Supabase Auth dashboard

**Login Flow Testing:**
1. [ ] Navigate to `/login`
2. [ ] Enter credentials for confirmed user
3. [ ] Verify successful login and redirect
4. [ ] Test logout functionality

**Error Scenarios Testing:**
1. [ ] Test signup with existing email
2. [ ] Test login with wrong password
3. [ ] Test expired confirmation links
4. [ ] Test malformed email addresses

### 5. Local Testing Checklist Before Deployment

**Code Quality:**
- [ ] `npm run build` completes successfully
- [ ] `npm run lint` passes without errors
- [ ] TypeScript compilation (`npx tsc --noEmit`) succeeds
- [ ] All tests pass (if applicable)

**Functionality Testing:**
- [ ] Complete authentication flow works
- [ ] Note CRUD operations function correctly
- [ ] AI features (summary, Q&A) work with all providers
- [ ] Search and pagination work correctly
- [ ] Theme switching works in both modes
- [ ] Responsive design works on mobile/desktop

**Performance Testing:**
- [ ] Page load times are acceptable
- [ ] No console errors in browser
- [ ] No memory leaks during navigation
- [ ] Images and assets load correctly

---

## Production Deployment

### 1. Environment Variable Migration

#### Production Environment Variables (Vercel)
```env
# Site Configuration (CRITICAL: Change to production URL)
NEXT_PUBLIC_SITE_URL=https://www.querynotes.top

# Supabase Configuration (Same as local)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Configuration (Same as local)
OPENAI_API_KEY=your_openai_api_key
SILICONFLOW_API_KEY=your_siliconflow_api_key
DEEPSEEK_API_KEY=your_deepseek_api_key

# Email Configuration (Same as local)
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_EMAIL_DOMAIN=mail.querynotes.top

# Webhook Secret (SAME hex string as local)
SEND_EMAIL_HOOK_SECRET=your_supabase_webhook_secret_hex_string
```

#### Vercel Deployment Steps
1. **Connect Repository**
   ```bash
   # Install Vercel CLI (optional)
   npm i -g vercel
   
   # Deploy from command line
   vercel --prod
   ```

2. **Set Environment Variables**
   - Go to Vercel Dashboard > Project > Settings > Environment Variables
   - Add all production environment variables
   - **CRITICAL**: Set `NEXT_PUBLIC_SITE_URL=https://www.querynotes.top`

3. **Domain Configuration**
   - Add custom domain in Vercel Dashboard
   - Configure DNS records to point to Vercel
   - Verify SSL certificate is active

### 2. Supabase Production Configuration Updates

#### Update Auth Hook URL
```
Supabase Dashboard > Authentication > Hooks:
- Change Hook URL from: http://localhost:3000/api/auth/send-email
- To: https://www.querynotes.top/api/auth/send-email
- Keep the same webhook secret (hex string)
```

#### Update URL Allow List
```
Authentication > URL Configuration:
Site URL: https://www.querynotes.top

Redirect URLs:
- https://www.querynotes.top/auth/callback
- http://localhost:3000/auth/callback (keep for local development)
```

#### Additional Security Settings
```
Authentication > Settings:
- Enable email confirmations
- Set appropriate session timeout
- Configure password requirements
- Enable additional security features as needed
```

### 3. DNS and Domain Configuration

#### Cloudflare DNS Configuration
```dns
# Main domain
A    @              192.0.2.1    (Vercel IP)
AAAA @              2001:db8::1  (Vercel IPv6)

# Email subdomain
CNAME mail          mail.resend.com
TXT   mail._domainkey  [DKIM key from Resend]
TXT   @              "v=spf1 include:_spf.resend.com ~all"
TXT   _dmarc         "v=DMARC1; p=quarantine; rua=mailto:dmarc@querynotes.top"
```

#### SSL/TLS Configuration
- Set SSL/TLS encryption mode to "Full (strict)"
- Enable "Always Use HTTPS"
- Configure HSTS settings
- Enable automatic HTTPS rewrites

### 4. Production-Specific Security Configurations

#### Webhook Security
- Webhook secret validation is automatically handled by the application
- Ensure webhook URL uses HTTPS
- Monitor webhook logs for unauthorized attempts

#### CORS Settings
```typescript
// Already configured in middleware.ts
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

#### Environment Security
- Never expose sensitive keys in client-side code
- Use Vercel's environment variable encryption
- Regularly rotate API keys and secrets
- Monitor for exposed credentials in logs

### 5. Post-Deployment Verification Procedures

#### Immediate Verification (within 5 minutes)
- [ ] Site loads at production URL
- [ ] SSL certificate is valid and active
- [ ] No console errors on homepage
- [ ] Basic navigation works

#### Authentication Verification (within 15 minutes)
- [ ] Signup form submits successfully
- [ ] Webhook endpoint responds correctly (check Vercel logs)
- [ ] Confirmation email is received
- [ ] Email confirmation link works
- [ ] User can log in after confirmation
- [ ] User session persists across page refreshes

#### Full Feature Verification (within 30 minutes)
- [ ] Note creation, editing, deletion works
- [ ] AI features function correctly
- [ ] Search and pagination work
- [ ] Theme switching works
- [ ] Mobile responsiveness verified
- [ ] Performance is acceptable

#### Monitoring Setup
- [ ] Set up Vercel analytics
- [ ] Configure error tracking (Sentry, etc.)
- [ ] Monitor email delivery rates in Resend
- [ ] Set up uptime monitoring
- [ ] Configure alerts for critical failures

---

## Configuration Management

### Environment-Specific Settings Matrix

| Setting | Local Development | Production |
|---------|------------------|------------|
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | `https://www.querynotes.top` |
| Supabase Hook URL | `http://localhost:3000/api/auth/send-email` | `https://www.querynotes.top/api/auth/send-email` |
| Supabase Site URL | `http://localhost:3000` | `https://www.querynotes.top` |
| Webhook Secret | Same hex string | Same hex string |
| Redirect URLs | Include both local and production | Include both local and production |

### Critical Configuration Rules

1. **Never change webhook secrets between environments** - Use the same hex string
2. **Always update Supabase hook URL** when deploying to production
3. **Keep redirect URLs inclusive** - Include both local and production URLs
4. **Verify environment variables** before each deployment
5. **Test authentication flow** immediately after deployment

### Common Pitfalls and Prevention

#### Pitfall 1: Wrong Site URL
**Problem**: `NEXT_PUBLIC_SITE_URL` not updated for production
**Prevention**: 
- Use environment-specific checklists
- Automate environment variable validation
- Test signup flow immediately after deployment

#### Pitfall 2: Webhook URL Mismatch
**Problem**: Supabase still pointing to localhost webhook
**Prevention**:
- Update Supabase configuration as part of deployment process
- Verify webhook URL in Supabase dashboard
- Test email sending after deployment

#### Pitfall 3: Missing Redirect URLs
**Problem**: Confirmation links fail due to URL not in allow list
**Prevention**:
- Always include both local and production URLs
- Test confirmation flow in both environments
- Monitor authentication errors in logs

### Best Practices for Environment Management

1. **Use Infrastructure as Code**
   ```bash
   # Example: Automated environment setup script
   ./scripts/setup-environment.sh production
   ```

2. **Implement Configuration Validation**
   ```typescript
   // Add to your app startup
   function validateEnvironment() {
     const required = ['NEXT_PUBLIC_SITE_URL', 'SEND_EMAIL_HOOK_SECRET'];
     required.forEach(key => {
       if (!process.env[key]) {
         throw new Error(`Missing required environment variable: ${key}`);
       }
     });
   }
   ```

3. **Document Configuration Changes**
   - Keep a deployment checklist
   - Document all environment-specific settings
   - Maintain a configuration change log

### Rollback Procedures

#### If Production Deployment Fails

1. **Immediate Rollback**
   ```bash
   # Vercel rollback to previous deployment
   vercel rollback [deployment-url]
   ```

2. **Revert Supabase Configuration**
   - Change hook URL back to previous working version
   - Verify webhook secret hasn't changed
   - Test authentication flow

3. **DNS Rollback (if needed)**
   - Revert DNS changes in Cloudflare
   - Wait for propagation (up to 24 hours)
   - Use DNS propagation checker tools

4. **Communication**
   - Notify users of temporary issues
   - Document the failure cause
   - Plan fix and re-deployment

#### Recovery Checklist
- [ ] Identify root cause of failure
- [ ] Fix configuration issues
- [ ] Test thoroughly in staging/local
- [ ] Re-deploy with verified configuration
- [ ] Verify all systems operational
- [ ] Update documentation with lessons learned

---

## Troubleshooting

### Common Issues and Solutions

#### Authentication Issues
**Symptom**: "Invalid payload sent to hook"
**Solution**: 
1. Verify webhook secret is correct hex string
2. Check webhook URL in Supabase matches deployment
3. Verify environment variables are set correctly

**Symptom**: "No code parameter found in callback"
**Solution**:
1. Check confirmation URL construction in webhook
2. Verify token-based authentication is implemented
3. Test email confirmation link format

#### Email Delivery Issues
**Symptom**: Emails not being sent
**Solution**:
1. Check Resend API key is valid
2. Verify domain is verified in Resend
3. Check webhook logs for errors
4. Test webhook endpoint manually

#### Environment Configuration Issues
**Symptom**: Features work locally but fail in production
**Solution**:
1. Compare environment variables between local and production
2. Verify Supabase configuration matches environment
3. Check domain and SSL configuration
4. Review deployment logs for errors

### Debug Tools and Commands

```bash
# Check environment variables
vercel env ls

# View deployment logs
vercel logs [deployment-url]

# Test webhook endpoint
curl -X POST https://www.querynotes.top/api/auth/send-email \
  -H "Content-Type: application/json" \
  -d '{"test": "payload"}'

# Check DNS propagation
dig querynotes.top
nslookup mail.querynotes.top

# Verify SSL certificate
openssl s_client -connect querynotes.top:443 -servername querynotes.top
```

### Getting Help

1. **Check Application Logs**
   - Vercel function logs
   - Browser console errors
   - Network tab for failed requests

2. **Verify External Services**
   - Supabase dashboard for auth events
   - Resend dashboard for email delivery
   - DNS propagation tools

3. **Community Resources**
   - Next.js documentation
   - Supabase community forum
   - Vercel support documentation

---

This guide should be updated whenever new features are added or configuration requirements change. Keep it as a living document that evolves with the project.
