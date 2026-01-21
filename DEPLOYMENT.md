# News Generator - Deployment Guide

## 🚀 Deploy to Vercel

### Option 1: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. For production deployment:
```bash
vercel --prod
```

### Option 2: Using Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Vite and configure build settings
6. Click "Deploy"

### Environment Variables (Vercel)

If you want to use environment variables for API key:

1. Go to your project settings on Vercel
2. Navigate to "Environment Variables"
3. Add: `VITE_GEMINI_API_KEY` = your-api-key
4. Update `config.js` to use: `import.meta.env.VITE_GEMINI_API_KEY`

---

## 🌐 Deploy to Netlify

### Option 1: Using Netlify CLI

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Login to Netlify:
```bash
netlify login
```

3. Initialize and deploy:
```bash
netlify init
netlify deploy --prod
```

### Option 2: Using Netlify Dashboard

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect to GitHub and select your repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy site"

### Option 3: Drag and Drop

1. Build your project locally:
```bash
npm run build
```

2. Go to [netlify.com/drop](https://app.netlify.com/drop)
3. Drag and drop the `dist` folder

### Environment Variables (Netlify)

1. Go to Site settings → Environment variables
2. Add: `VITE_GEMINI_API_KEY` = your-api-key
3. Update `config.js` to use: `import.meta.env.VITE_GEMINI_API_KEY`

---

## 📝 Pre-Deployment Checklist

- [ ] Update `config.js` with your Gemini API key
- [ ] Test build locally: `npm run build`
- [ ] Test preview: `npm run preview`
- [ ] Commit all changes to Git
- [ ] Push to GitHub/GitLab/Bitbucket
- [ ] Configure environment variables (if using)
- [ ] Set up custom domain (optional)

---

## 🔒 Security Best Practices

### For Production Deployment:

1. **Use Environment Variables**:
   - Don't commit API keys to Git
   - Use `.env` files (add to `.gitignore`)
   - Configure environment variables in hosting platform

2. **API Key Restrictions** (Google Cloud Console):
   - Set HTTP referrer restrictions
   - Limit to your domain only
   - Set usage quotas

3. **Example `.env` file**:
```env
VITE_GEMINI_API_KEY=your-api-key-here
```

4. **Update `config.js`**:
```javascript
export const CONFIG = {
  GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_API_KEY_HERE',
  // ... rest of config
};
```

---

## 🧪 Testing Before Deployment

### Local Build Test:

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Preview the build
npm run preview
```

Visit `http://localhost:4173` to test the production build.

### Check Build Output:

- Build should complete without errors
- `dist` folder should be created
- Check file sizes (should be optimized)

---

## 🌍 Custom Domain Setup

### Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

### Netlify:
1. Go to Site settings → Domain management
2. Add custom domain
3. Configure DNS records or use Netlify DNS

---

## 📊 Post-Deployment

### Monitor Your App:

1. **Vercel Analytics**: Enable in project settings
2. **Netlify Analytics**: Available in team plans
3. **Google Analytics**: Add tracking code if needed

### Performance:

- Check Lighthouse scores
- Monitor API usage
- Set up error tracking (Sentry, etc.)

---

## 🔧 Troubleshooting

### Build Fails:

1. Check Node.js version (use v18 or higher)
2. Clear cache: `rm -rf node_modules package-lock.json && npm install`
3. Check build logs for specific errors

### API Key Issues:

1. Verify API key is correct
2. Check environment variable name
3. Ensure API key restrictions allow your domain

### 404 Errors:

1. Check `vercel.json` or `netlify.toml` configuration
2. Ensure SPA redirect rules are set

---

## 📚 Additional Resources

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Google Gemini API Docs](https://ai.google.dev/docs)
