# 🚀 DEPLOYMENT QUICK REFERENCE CARD

## In 30 Seconds
```bash
# 1. Install dependencies
npm install && cd client && npm install && cd ..

# 2. Update environment
# Edit .env.production - set CLIENT_URL to your domain

# 3. Build for production
npm run build

# 4. Test locally
npm start  # Visit http://localhost:5000

# 5. Deploy to your platform (see DEPLOYMENT.md)
```

---

## Essential Commands

| Command | What it does |
|---------|------------|
| `npm install` | Install dependencies |
| `npm run dev` | Development (server + client) |
| `npm run build` | Build for production |
| `npm start` | Run production build |
| `npm run prod` | Build + start production |

---

## Key Files to Update

| File | Change | Example |
|------|--------|---------|
| `.env.production` | Set CLIENT_URL | `https://yoursite.com` |
| `.env.production` | Set MONGODB_URL | Your MongoDB Atlas URL |
| `client/.env.production` | Set API URL | `https://yoursite.com/api/v1` |

---

## Port Configuration

- **Dev Client**: 5173 (Vite)
- **Dev Server**: 3000 (Node)
- **Production**: 5000 (configurable via PORT env)

---

## Files Created/Modified

✅ **New Files:**
- `.env.production` - Production config
- `client/.env.production` - Client prod config
- `.gitignore` - Security
- `DEPLOYMENT.md` - Full guide
- `DEPLOYMENT_CHECKLIST.md` - Checklist
- `README_DEPLOYMENT.md` - Quick guide
- `DEPLOYMENT_SUMMARY.md` - Summary
- `prepare-deployment.sh` - Linux setup
- `prepare-deployment.bat` - Windows setup

✅ **Modified:**
- `server.js` - Production support
- `package.json` - Build scripts

---

## Deployment Platforms

**Choose one:**

1. **Heroku** (Easiest)
   ```
   heroku create app-name
   heroku config:set MONGODB_URL=...
   git push heroku main
   ```

2. **DigitalOcean** (Full control)
   ```
   SSH to server
   npm install && npm run build
   npm start
   ```

3. **AWS** (Scalable)
   ```
   Use Elastic Beanstalk
   Set env vars in console
   Deploy
   ```

See `DEPLOYMENT.md` for full instructions.

---

## Verify Deployment

After deploying:
- [ ] Website loads
- [ ] Can register user
- [ ] Can login
- [ ] Can browse products
- [ ] Can add to cart
- [ ] Can checkout (use test Braintree cards)
- [ ] Emails send
- [ ] No JS errors in browser console

---

## Common Issues & Fixes

| Problem | Fix |
|---------|-----|
| "Port in use" | Change PORT in .env.production |
| "Cannot find module" | Run `npm install` again |
| "DB connection failed" | Check MONGODB_URL, allow server IP in Atlas |
| "CORS error" | Update CLIENT_URL to your domain |
| "Files not found" | Run `npm run build` |

---

## Environment Variables Template

```
PORT=5000
CURRENT_RUN_MODE=production
MONGODB_URL=mongodb+srv://...
JWT_SECRET=YourSecureSecretHere_Min32Chars
JWT_EXPIRY=1d
BRAINTREE_MERCHANT_ID=xxx
BRAINTREE_PUBLIC_KEY=xxx
BRAINTREE_PRIVATE_KEY=xxx
EMAIL_USER=your@gmail.com
EMAIL_PASS=app_password
CLIENT_URL=https://yourdomain.com
```

---

## Security Checklist

- [ ] Strong JWT_SECRET (32+ characters)
- [ ] .env files in .gitignore
- [ ] No secrets in git history
- [ ] HTTPS/SSL enabled
- [ ] CORS restricted to your domain
- [ ] Database access limited to your IP
- [ ] Backups configured
- [ ] Error logs monitored

---

## Production Build Details

```
client/dist/
├── index.html (main HTML)
├── assets/
│   ├── css/ (minified styles)
│   └── js/ (minified scripts)
└── images/ (optimized images)
```

- **Size**: ~300-400KB (uncompressed)
- **Gzipped**: ~100-150KB
- **Served by**: Express static middleware
- **Fallback**: index.html (for React Router)

---

## Useful Links

- [DEPLOYMENT.md](DEPLOYMENT.md) - Comprehensive guide
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Pre-deploy checklist
- [README_DEPLOYMENT.md](README_DEPLOYMENT.md) - Quick start
- [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md) - What changed

---

## Status: ✅ READY TO DEPLOY

Your project is production-ready!

1. Update `.env.production` with your domain
2. Run `npm run build`
3. Follow deployment guide for your platform
4. Deploy with confidence!

---

**Need Help?** See DEPLOYMENT.md for detailed instructions.
