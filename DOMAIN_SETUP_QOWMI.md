# Domain Setup Guide - qowmi.mvp.bd

**Domain**: qowmi.mvp.bd  
**Provider**: Ready.BD  
**Expires**: June 9, 2027  
**Current Status**: Active  
**Target**: Vercel deployment

---

## 📋 Current DNS Configuration

Your domain currently has:

```
Type: A
Name: qowmi.mvp.bd
Content: 103.174.51.100
TTL: 3600

Type: CNAME
Name: www.qowmi.mvp.bd
Content: qowmi.mvp.bd
TTL: 3600
```

---

## 🚀 Step-by-Step: Connect to Vercel

### Step 1: Deploy to Vercel (if not done yet)

1. Go to https://vercel.com/new
2. Import your GitHub repository: `sakibian/madrasha-connect-bd`
3. Configure:
   - Framework: Vite (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add environment variables (copy from `.env.example`)
5. Click **Deploy**
6. Wait for deployment to complete
7. Note your Vercel URL (e.g., `your-project.vercel.app`)

### Step 2: Add Custom Domain in Vercel

1. In Vercel dashboard, go to your project
2. Click **Settings** → **Domains**
3. Click **Add Domain**
4. Enter: `qowmi.mvp.bd`
5. Click **Add**

Vercel will show you the DNS records you need to configure.

### Step 3: Update DNS Records in Ready.BD

You have **two options**:

#### Option A: Point directly to Vercel (Recommended)

**Delete existing A record** and **update CNAME**:

```
Type: CNAME
Name: qowmi.mvp.bd
Content: cname.vercel-dns.com
TTL: 3600

Type: CNAME
Name: www.qowmi.mvp.bd
Content: cname.vercel-dns.com
TTL: 3600
```

**Note**: Some DNS providers don't allow CNAME on root domain. If Ready.BD doesn't support this, use Option B.

#### Option B: Use A Records (if CNAME fails)

Get Vercel's IP addresses and update your A records:

```
Type: A
Name: qowmi.mvp.bd
Content: 76.76.21.21
TTL: 3600

Type: CNAME
Name: www.qowmi.mvp.bd
Content: cname.vercel-dns.com
TTL: 3600
```

**Vercel IP addresses** (use all for redundancy):
- 76.76.21.21
- 76.76.21.142
- 76.76.21.164
- 76.76.21.241

### Step 4: Verify in Vercel

1. Go back to Vercel → Settings → Domains
2. Vercel will automatically verify DNS records
3. Wait 5-10 minutes for DNS propagation
4. Status should change from "Invalid Configuration" to "Valid Configuration"
5. SSL certificate will be automatically provisioned (1-2 minutes)

### Step 5: Set as Primary Domain (Optional)

If you want `qowmi.mvp.bd` to be the main domain:

1. In Vercel → Settings → Domains
2. Find `qowmi.mvp.bd`
3. Click **...** → **Set as Primary Domain**
4. All other domains will redirect to this one

---

## ✅ DNS Configuration Summary

**What to do in Ready.BD Control Panel:**

1. **Delete** the existing A record pointing to `103.174.51.100`
2. **Add new records**:

### For Root Domain (qowmi.mvp.bd)

**Option 1 - CNAME (Preferred):**
```
Type: CNAME
Name: @ (or qowmi.mvp.bd)
Content: cname.vercel-dns.com
TTL: 3600
```

**Option 2 - A Records (if CNAME not allowed):**
```
Type: A
Name: @ (or qowmi.mvp.bd)
Content: 76.76.21.21
TTL: 3600
```

### For WWW Subdomain

```
Type: CNAME
Name: www
Content: cname.vercel-dns.com
TTL: 3600
```

---

## 🔍 Verification Steps

After updating DNS:

1. **Check DNS propagation**:
   ```bash
   nslookup qowmi.mvp.bd
   nslookup www.qowmi.mvp.bd
   ```

2. **Test in browser**:
   - http://qowmi.mvp.bd (should redirect to HTTPS)
   - https://qowmi.mvp.bd (should work)
   - https://www.qowmi.mvp.bd (should work)

3. **Wait for SSL**:
   - Vercel auto-provisions Let's Encrypt SSL
   - Takes 1-2 minutes after DNS is verified
   - Green padlock should appear in browser

---

## ⏱️ Expected Timeline

| Step | Time |
|------|------|
| Deploy to Vercel | 2-3 minutes |
| Add domain in Vercel | 1 minute |
| Update DNS in Ready.BD | 2 minutes |
| DNS propagation | 5-30 minutes |
| SSL certificate provisioning | 1-2 minutes |
| **Total** | **10-40 minutes** |

---

## 🐛 Troubleshooting

### DNS Not Updating

**Issue**: Changes not visible after 30 minutes  
**Fix**: 
- Clear DNS cache: `sudo dscacheutil -flushcache` (Mac)
- Check with: `dig qowmi.mvp.bd`
- Try different DNS server: `nslookup qowmi.mvp.bd 8.8.8.8`

### Vercel Says "Invalid Configuration"

**Issue**: Domain verification failing  
**Fix**:
- Double-check DNS records match exactly
- Wait 10-15 minutes for propagation
- Use online tool: https://dnschecker.org

### SSL Certificate Not Provisioning

**Issue**: "Not Secure" warning in browser  
**Fix**:
- Ensure DNS is fully propagated
- Vercel auto-retries every few minutes
- Check Vercel → Settings → Domains for status
- Can take up to 24 hours in rare cases

### www Not Working

**Issue**: www.qowmi.mvp.bd not resolving  
**Fix**:
- Ensure CNAME for www is set correctly
- Add `www.qowmi.mvp.bd` as separate domain in Vercel
- Both domains need to be added individually

---

## 📧 Email Configuration (Optional)

If you want email (e.g., contact@qowmi.mvp.bd):

1. Add MX records in Ready.BD
2. Use Google Workspace, Zoho Mail, or similar
3. Example for Google Workspace:

```
Type: MX
Name: @
Content: ASPMX.L.GOOGLE.COM
Priority: 1
TTL: 3600
```

---

## 🔐 Security Headers

Your app already has security headers configured in `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Strict-Transport-Security", "value": "max-age=31536000" }
      ]
    }
  ]
}
```

These will automatically apply to your custom domain.

---

## 📊 Post-Setup Checklist

After domain is connected:

- [ ] https://qowmi.mvp.bd loads ✅
- [ ] https://www.qowmi.mvp.bd loads ✅
- [ ] SSL certificate (green padlock) ✅
- [ ] Login/registration works ✅
- [ ] Mobile responsive ✅
- [ ] PWA installable ✅
- [ ] Google Search Console configured
- [ ] Analytics tracking (PostHog/GA4)

---

## 🎯 Quick Reference Commands

```bash
# Check DNS
nslookup qowmi.mvp.bd
dig qowmi.mvp.bd

# Test SSL
curl -I https://qowmi.mvp.bd

# Check DNS propagation globally
# Visit: https://dnschecker.org
# Enter: qowmi.mvp.bd
```

---

## 📞 Need Help?

- **Ready.BD Support**: Check their control panel for support options
- **Vercel Documentation**: https://vercel.com/docs/custom-domains
- **DNS Checker**: https://dnschecker.org
- **SSL Checker**: https://www.ssllabs.com/ssltest/

---

**Status**: ⏳ Awaiting deployment and DNS configuration  
**Next Step**: Deploy to Vercel, then update DNS in Ready.BD
