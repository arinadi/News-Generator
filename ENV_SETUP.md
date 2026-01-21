# News Generator - Environment Variables Setup

## 🔐 Secure API Key Management

Aplikasi ini sekarang menggunakan **environment variables** untuk menyimpan API key dengan aman.

## 📝 Setup untuk Development Lokal

### 1. Copy Template File

```bash
copy .env.example .env
```

Atau manual: buat file `.env` di root project.

### 2. Edit File `.env`

Buka file `.env` dan masukkan API key Anda:

```env
VITE_GEMINI_API_KEY=your-actual-api-key-here
```

### 3. Get Your API Key

Jika belum punya API key:
1. Kunjungi [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in dengan Google account
3. Create new API key
4. Copy API key

### 4. Test

```bash
npm run dev
```

Aplikasi akan otomatis membaca API key dari file `.env`.

## 🚀 Setup untuk Production

### Vercel

1. **Via Dashboard:**
   - Go to Project Settings
   - Navigate to "Environment Variables"
   - Add variable:
     - Name: `VITE_GEMINI_API_KEY`
     - Value: your-api-key
   - Save

2. **Via CLI:**
   ```bash
   vercel env add VITE_GEMINI_API_KEY
   ```

3. **Redeploy:**
   ```bash
   vercel --prod
   ```

### Netlify

1. **Via Dashboard:**
   - Go to Site Settings
   - Navigate to "Environment variables"
   - Add variable:
     - Key: `VITE_GEMINI_API_KEY`
     - Value: your-api-key
   - Save

2. **Via CLI:**
   ```bash
   netlify env:set VITE_GEMINI_API_KEY your-api-key
   ```

3. **Redeploy:**
   ```bash
   netlify deploy --prod
   ```

## 🔒 Security Best Practices

### ✅ DO:
- ✅ Use `.env` file for local development
- ✅ Add `.env` to `.gitignore` (already done)
- ✅ Use environment variables in hosting platform
- ✅ Set API key restrictions in Google Cloud Console
- ✅ Keep `.env.example` as template (without real keys)

### ❌ DON'T:
- ❌ Commit `.env` file to Git
- ❌ Share your API key publicly
- ❌ Hardcode API key in `config.js`
- ❌ Push API key to GitHub/GitLab

## 🔧 How It Works

### Priority Order:

1. **Environment Variable** (`.env` or hosting platform)
   ```javascript
   import.meta.env.VITE_GEMINI_API_KEY
   ```

2. **Fallback** (hardcoded in `config.js`)
   ```javascript
   'YOUR_API_KEY_HERE'
   ```

### Code in `config.js`:

```javascript
GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_API_KEY_HERE',
```

## 📋 Checklist

### Local Development:
- [ ] Copy `.env.example` to `.env`
- [ ] Add your API key to `.env`
- [ ] Verify `.env` is in `.gitignore`
- [ ] Test: `npm run dev`

### Production Deployment:
- [ ] Set environment variable in hosting platform
- [ ] Remove hardcoded API key from `config.js` (optional)
- [ ] Deploy application
- [ ] Test production build

## 🛡️ API Key Restrictions

Untuk keamanan tambahan, set restrictions di Google Cloud Console:

### 1. Application Restrictions:
- **HTTP referrers**: Add your domain
  - Example: `https://your-app.vercel.app/*`
  - Example: `https://your-app.netlify.app/*`

### 2. API Restrictions:
- Limit to: "Generative Language API"

### 3. Usage Quotas:
- Set daily/monthly limits

## 🔍 Troubleshooting

### API Key Not Working:

1. **Check Environment Variable Name:**
   - Must be: `VITE_GEMINI_API_KEY`
   - Vite requires `VITE_` prefix

2. **Restart Dev Server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

3. **Check .env File:**
   - No quotes needed: `VITE_GEMINI_API_KEY=abc123`
   - No spaces: `VITE_GEMINI_API_KEY=abc123` ✅
   - Not: `VITE_GEMINI_API_KEY = abc123` ❌

4. **Verify in Browser Console:**
   ```javascript
   console.log(import.meta.env.VITE_GEMINI_API_KEY)
   ```

### Production Build Issues:

1. **Rebuild After Adding Env Var:**
   ```bash
   npm run build
   ```

2. **Check Hosting Platform:**
   - Verify environment variable is set
   - Check spelling
   - Redeploy after adding

## 📚 Additional Resources

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Netlify Environment Variables](https://docs.netlify.com/configure-builds/environment-variables/)
- [Google Cloud API Key Best Practices](https://cloud.google.com/docs/authentication/api-keys)

---

**✅ Setup Complete!** Your API key is now securely managed with environment variables.
