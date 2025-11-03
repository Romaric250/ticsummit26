# SEO Troubleshooting Guide

## 🔍 Quick Verification Checklist

### 1. **Environment Variable (CRITICAL)**
✅ **Check in Vercel Dashboard:**
- Go to: Project → Settings → Environment Variables
- Verify: `NEXT_PUBLIC_SITE_URL` is set to: `https://ticsummit-pink.vercel.app`
- After adding/updating, **redeploy** your project

### 2. **Verify Sitemap is Accessible**
Visit these URLs directly:
- `https://ticsummit-pink.vercel.app/sitemap.xml`
- Should see XML with all your pages

### 3. **Verify Robots.txt**
Visit:
- `https://ticsummit-pink.vercel.app/robots.txt`
- Should reference your sitemap URL

### 4. **Check Meta Tags are Rendering**
**Method 1: View Page Source**
1. Visit your homepage: `https://ticsummit-pink.vercel.app`
2. Right-click → "View Page Source"
3. Search for `<meta` or `<title>`
4. You should see:
   - `<title>TIC Summit - Empowering Young Innovators | TIC Summit</title>`
   - `<meta property="og:title" ...>`
   - `<meta property="og:description" ...>`
   - `<link rel="canonical" href="...">`

**Method 2: Browser DevTools**
1. Open DevTools (F12)
2. Go to "Elements" tab
3. Check `<head>` section for meta tags

### 5. **Check Structured Data**
In View Source, search for:
- `application/ld+json`
- Should see JSON-LD structured data

### 6. **External SEO Validators**

**Google Rich Results Test:**
- https://search.google.com/test/rich-results
- Enter your homepage URL
- Should validate structured data

**Open Graph Debugger (Facebook):**
- https://developers.facebook.com/tools/debug/
- Enter your URL
- Click "Scrape Again" if needed
- Should show preview card

**Twitter Card Validator:**
- https://cards-dev.twitter.com/validator
- Enter your URL
- Should show Twitter card preview

**Schema.org Validator:**
- https://validator.schema.org/
- Enter your URL
- Should validate structured data

## 🚨 Common Issues & Solutions

### Issue 1: Sitemap returns 404
**Solution:**
- Ensure `src/app/sitemap.ts` exists
- Rebuild and redeploy
- Clear Vercel cache if needed

### Issue 2: Meta tags showing default/old values
**Causes:**
- Browser cache (hard refresh: Ctrl+Shift+R / Cmd+Shift+R)
- CDN cache (wait 5-10 minutes or purge in Vercel)
- Environment variable not set correctly

**Solution:**
- Verify `NEXT_PUBLIC_SITE_URL` in Vercel
- Redeploy after setting env variable
- Hard refresh browser (Ctrl+Shift+R)

### Issue 3: Structured data not appearing
**Solution:**
- Check browser console for errors
- Verify `StructuredData` component is in layout
- Check if JSON-LD is valid JSON

### Issue 4: Search engines not indexing
**Note:** This is **NORMAL** - indexing takes time!
- Google: 1-4 weeks typically
- Bing: 1-2 weeks
- Submit sitemap to Google Search Console
- Be patient - SEO results don't appear instantly

## 📊 Submit to Search Engines

### Google Search Console
1. Go to: https://search.google.com/search-console
2. Add your property: `https://ticsummit-pink.vercel.app`
3. Verify ownership (DNS or HTML file)
4. Submit sitemap: `https://ticsummit-pink.vercel.app/sitemap.xml`

### Bing Webmaster Tools
1. Go to: https://www.bing.com/webmasters
2. Add your site
3. Submit sitemap

## ⚡ Quick Test Commands

### Check if sitemap works:
```bash
curl https://ticsummit-pink.vercel.app/sitemap.xml
```

### Check if robots.txt works:
```bash
curl https://ticsummit-pink.vercel.app/robots.txt
```

### View meta tags (from command line):
```bash
curl https://ticsummit-pink.vercel.app | grep -i "meta\|title"
```

## ✅ What "SEO Not Picking Up" Might Mean

1. **Search results not showing?**
   - Normal - takes 1-4 weeks for Google to index
   - Submit sitemap to Google Search Console
   - Can take longer for new domains

2. **Meta tags not visible?**
   - Check View Source (not just DevTools)
   - Clear cache and hard refresh
   - Verify environment variable is set

3. **Structured data errors?**
   - Test with Google Rich Results Test
   - Fix any validation errors shown
   - Ensure JSON-LD is properly formatted

4. **Social media previews not working?**
   - Use Facebook Debugger to scrape again
   - Facebook caches previews - force refresh
   - Verify Open Graph tags in source

## 🎯 Immediate Actions

1. ✅ **Set Environment Variable in Vercel:**
   ```
   NEXT_PUBLIC_SITE_URL=https://ticsummit-pink.vercel.app
   ```

2. ✅ **Redeploy after setting env variable**

3. ✅ **Verify sitemap is accessible:** `https://ticsummit-pink.vercel.app/sitemap.xml`

4. ✅ **Submit sitemap to Google Search Console**

5. ✅ **Test meta tags with validators** (links above)

6. ⏳ **Be patient** - SEO takes time to show results

## 📞 Need More Help?

If meta tags are rendering in View Source but not being picked up:
- This is usually a **cache issue** (browser or search engine)
- Search engines need time to crawl and re-index
- Social platforms cache previews - force refresh in their debuggers

Remember: **SEO is not instant**. Even with perfect implementation, it takes time for search engines to crawl, index, and rank your pages.

