# Quick Start Guide - Deployment

## For Development (Testing Locally)

```bash
# Install dependencies for server
npm install

# Install dependencies for client
cd client
npm install
cd ..

# Start both server and client in development mode
npm run dev
```

Access at: `http://localhost:5173` (client) and `http://localhost:3000` (API)

## For Production Deployment

### Step 1: Prepare Environment
```bash
# Create .env.production file with:
# - Your actual domain (replace yourdomain.com)
# - Correct database credentials
# - API keys for payments and email
```

### Step 2: Build the Client
```bash
npm run build
```

This creates a `client/dist/` folder with optimized production files.

### Step 3: Deploy to Your Hosting Platform

**Option A: Heroku**
```bash
heroku create your-app-name
heroku config:set MONGODB_URL=your_db_url
# ... set all env vars
git push heroku main
```

**Option B: Local/VPS Server**
```bash
npm install
npm run prod
# Or with PM2:
pm2 start server.js --name "ecommerce"
```

### Step 4: Verify Deployment
1. Open your domain in browser
2. Test user registration
3. Test login
4. Test product browsing
5. Test payment (use Braintree test cards)
6. Check server logs for errors

## Important Configuration Files

| File | Purpose | Development | Production |
|------|---------|-------------|-----------|
| `.env` | Dev config | ✅ Use | ❌ Ignore |
| `.env.production` | Prod config | ❌ Ignore | ✅ Use |
| `server.js` | Express server | ✅ Updated for prod | ✅ Ready |
| `client/.env` | Client dev URL | ✅ Use | ❌ Ignore |
| `client/.env.production` | Client prod URL | ❌ Ignore | ✅ Use |
| `package.json` | Scripts | ✅ build & prod added | ✅ Ready |

## Essential npm Scripts

```bash
npm run dev          # Development: server + client together
npm run server       # Server only (with nodemon)
npm run client       # Client only
npm run build        # Build client for production
npm run start        # Production: serve client + API
npm run prod         # Build + start (quick production setup)
```

## Troubleshooting

**"Port already in use"**
```bash
# Change PORT in .env.production or use:
PORT=5001 npm start
```

**"Cannot find module"**
```bash
npm install
cd client && npm install && cd ..
```

**"Database connection failed"**
- Check MONGODB_URL in .env.production
- Ensure MongoDB Atlas allows your IP
- Test connection locally first

**"CORS errors"**
- Update CLIENT_URL in .env.production to your domain
- Ensure browser uses https

## Key Features Verified ✅

- ✅ User authentication with JWT
- ✅ Email verification on registration
- ✅ Password reset functionality
- ✅ Product management (CRUD)
- ✅ Shopping cart functionality
- ✅ Braintree payment integration
- ✅ Order tracking
- ✅ Admin dashboard
- ✅ Responsive design
- ✅ Error handling

## What's Included in Production Build

```
client/dist/
├── index.html          # Main HTML file
├── assets/
│   ├── images/        # Optimized images
│   └── css/           # Minified CSS
└── js/                # Minified JavaScript
```

All served automatically by Express server from `server.js`

---

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)
