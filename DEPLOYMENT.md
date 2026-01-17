# Deployment Guide for E-Commerce Website

## Pre-Deployment Checklist

This document provides step-by-step instructions for deploying your e-commerce application to production.

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or MongoDB server)
- Braintree account for payment processing
- Email account for sending notifications
- Hosting platform (Heroku, AWS, DigitalOcean, etc.)

## Environment Configuration

### 1. Production Environment Variables

Create a `.env.production` file with the following variables:

```dotenv
PORT=5000
CURRENT_RUN_MODE=production
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret_key
JWT_EXPIRY=1d
BRAINTREE_MERCHANT_ID=your_braintree_merchant_id
BRAINTREE_PUBLIC_KEY=your_braintree_public_key
BRAINTREE_PRIVATE_KEY=your_braintree_private_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
CLIENT_URL=https://yourdomain.com
```

### 2. Client Production Environment

Create a `client/.env.production` file:

```dotenv
VITE_API_URL=https://yourdomain.com/api/v1
```

**Important:** Replace `yourdomain.com` with your actual production domain.

## Security Best Practices

### Sensitive Data
- ✅ Never commit `.env` files to version control
- ✅ Use strong JWT_SECRET (minimum 32 characters)
- ✅ Rotate credentials periodically
- ✅ Use environment variables for all sensitive data
- ✅ Enable HTTPS on your production domain

### Email Configuration
- Use application-specific passwords (not your main email password)
- For Gmail: Enable 2FA and generate an app-specific password

## Deployment Steps

### 1. Build the Client

```bash
npm run build
```

This creates an optimized production build in `client/dist/`.

### 2. Install Production Dependencies

```bash
npm install --only=production
cd client
npm install --only=production
cd ..
```

### 3. Set Environment Mode

Export production environment before starting:

```bash
export CURRENT_RUN_MODE=production
export NODE_ENV=production
```

### 4. Start the Server

```bash
npm start
```

The server will:
- Run on the port specified in `.env` (default: 5000)
- Serve static client files from `client/dist/`
- Route all non-API requests to `index.html` (SPA fallback)
- Use combined logging format in production

## Deployment Platforms

### Option 1: Heroku

```bash
# Install Heroku CLI and login
heroku login

# Create a new app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URL=your_mongodb_url
heroku config:set JWT_SECRET=your_secret
# ... set all other variables

# Deploy
git push heroku main
```

### Option 2: AWS (Elastic Beanstalk)

```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p node.js-18 your-app-name

# Create environment
eb create production

# Deploy
eb deploy
```

### Option 3: DigitalOcean / Linode / Other VPS

1. SSH into your server
2. Install Node.js and MongoDB
3. Clone your repository
4. Install dependencies: `npm install`
5. Set environment variables
6. Use PM2 for process management:

```bash
npm install -g pm2

# Start the app
pm2 start server.js --name "ecommerce"

# Setup auto-restart on system reboot
pm2 startup
pm2 save
```

7. Set up Nginx as reverse proxy
8. Configure SSL with Let's Encrypt

## Database Migration

Ensure your MongoDB database is accessible from your production server:

```javascript
// Test connection from production environment
node -e "import('./config/db.js').then(() => console.log('DB Connected'))"
```

## Performance Optimization

### Already Configured
- ✅ CORS with specific origin
- ✅ Express request size limits
- ✅ Vite build optimization
- ✅ Static file serving
- ✅ Morgan logging (combined format in production)

### Recommended Additional Steps
- Enable gzip compression
- Use CDN for static assets
- Implement caching headers
- Monitor server performance with APM tools

## Monitoring & Logging

### Log Files
Monitor server logs:

```bash
pm2 logs ecommerce
```

### Production Monitoring
- Set up error tracking (Sentry, Rollbar)
- Monitor database performance
- Track API response times
- Monitor server resources (CPU, memory, disk)

## Troubleshooting

### Issue: Port Already in Use
```bash
# Find and kill process on port
lsof -i :5000
kill -9 <PID>
```

### Issue: Client Files Not Found
- Ensure `npm run build` completed successfully
- Check that `client/dist/` exists
- Verify `CURRENT_RUN_MODE=production` is set

### Issue: CORS Errors
- Update `CLIENT_URL` in `.env` to match your domain
- Check browser console for specific CORS errors
- Verify CORS origin in server.js

### Issue: Database Connection Failed
- Test MongoDB connection string
- Ensure MongoDB Atlas allows your server IP
- Check `MONGODB_URL` in environment variables

## Backup & Recovery

Before deploying:

```bash
# Backup your MongoDB database
# Using MongoDB Atlas: Use the automated backup feature

# Keep version control up to date
git tag v1.0.0
git push origin v1.0.0
```

## Post-Deployment

1. ✅ Test all major features in production
2. ✅ Verify email notifications work
3. ✅ Test payment processing with Braintree test cards
4. ✅ Check HTTPS certificate validity
5. ✅ Monitor error logs for issues
6. ✅ Set up automated backups
7. ✅ Configure uptime monitoring

## API Endpoints Reference

- `GET /api/v1/auth/login` - User login
- `POST /api/v1/product` - Create product (admin)
- `GET /api/v1/product` - Get all products
- `POST /api/v1/order` - Create order
- `GET /api/v1/order` - Get user orders

## Support

For deployment issues:
1. Check server logs: `pm2 logs`
2. Verify environment variables are set correctly
3. Check database connectivity
4. Review browser console for client-side errors

## Version Information

- Node.js: v16+
- Express: v5.1.0
- React: v19.1.0
- MongoDB: Latest
- Vite: v7.0.0
