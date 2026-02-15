# Google AdSense & Search Console Setup Guide for LabDesk

## 1️⃣ Google Search Console Setup

### Step 1: Go to Google Search Console
- Visit: https://search.google.com/search-console
- Click "Add Property"
- Select "URL prefix" → Enter: `https://labdesk-18c70.web.app`

### Step 2: Verify Ownership
**Method 1 (Recommended): HTML Meta Tag**
- Google will give you a meta tag like:
  ```html
  <meta name="google-site-verification" content="YOUR_CODE_HERE">
  ```
- Add it to `landing.html` inside `<head>` tag
- Deploy and click "Verify"

**Method 2: HTML File**
- Download the verification file from Google
- Place it in root folder
- Deploy and verify

### Step 3: Submit Sitemap
- Go to Search Console → Sitemaps
- Enter: `sitemap.xml`
- Click Submit

---

## 2️⃣ Bing Webmaster Tools Setup

### Step 1: Go to Bing Webmaster Tools
- Visit: https://www.bing.com/webmasters
- Sign in with Microsoft account
- Click "Add a site"
- Enter: `https://labdesk-18c70.web.app`

### Step 2: Verify
**Method 1: XML File**
- Update `BingSiteAuth.xml` with code from Bing
- Deploy

**Method 2: Meta Tag**
- Add meta tag to `landing.html`:
  ```html
  <meta name="msvalidate.01" content="YOUR_BING_CODE">
  ```

### Step 3: Submit Sitemap
- Go to Sitemaps section
- Submit: `https://labdesk-18c70.web.app/sitemap.xml`

---

## 3️⃣ Google AdSense Setup

### Step 1: Apply for AdSense
- Visit: https://www.google.com/adsense
- Sign up with your Google account
- Add site: `labdesk-18c70.web.app`

### Step 2: Add AdSense Code
- Google will give you a Publisher ID: `ca-pub-XXXXXXXXXXXXXXXX`
- Replace `ca-pub-XXXXXXXXXXXXXXXX` in `landing.html` with your actual ID

### Step 3: Ad Slots
There are 3 ad slots already placed in `landing.html`:
1. **After Hero** - Leaderboard ad (auto format)
2. **After Test Templates** - Horizontal ad
3. **Before Footer** - Auto format ad

### Step 4: Replace Ad Slot IDs
- For each `data-ad-slot="XXXXXXXXXX"`, replace with actual ad unit IDs from AdSense

### Step 5: Wait for Approval
- AdSense review takes 1-14 days
- Make sure landing page has good content (it does!)
- Once approved, ads will auto-appear

---

## 4️⃣ Google Analytics (Already Done!)

Your GA4 is already configured:
- **Measurement ID**: `G-EMBYS1CSGJ`
- Added to both `landing.html` and `index.html`
- Firebase Analytics also running in the app

### What to Track:
- Landing page visits
- Login/Signup events
- Report generation events
- Print events

---

## 5️⃣ Quick Deploy Commands

```bash
# Login to Firebase
firebase login

# Deploy everything
firebase deploy

# Deploy only hosting
firebase deploy --only hosting
```

---

## 6️⃣ File Structure for SEO

```
labdesk/
├── landing.html        ← Main landing page (SEO optimized)
├── index.html          ← App dashboard (noindex)
├── sitemap.xml         ← For search engines
├── robots.txt          ← Crawler instructions
├── manifest.json       ← PWA manifest
├── BingSiteAuth.xml    ← Bing verification
├── firebase.json       ← Hosting config
├── css/
│   └── style.css
├── js/
│   ├── firebase-config.js
│   ├── db.js
│   ├── auth.js
│   ├── app.js
│   ├── dashboard.js
│   ├── patients.js
│   ├── newReport.js
│   ├── reports.js
│   ├── settings.js
│   ├── profile.js
│   ├── templates.js
│   └── utils.js
```
