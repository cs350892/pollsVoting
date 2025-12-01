# Polls Voting System - Render Deployment Guide

This guide will help you deploy the Polls Voting System on Render.

## Prerequisites

1. A [Render](https://render.com) account (free tier available)
2. A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account with a database set up
3. Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### 1. Prepare Your Repository

Make sure your code is committed and pushed to your Git repository:

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Deploy on Render

#### Option A: Using render.yaml (Recommended)

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New"** → **"Blueprint"**
3. Connect your Git repository
4. Render will automatically detect the `render.yaml` file
5. Click **"Apply"**

#### Option B: Manual Setup

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New"** → **"Web Service"**
3. Connect your Git repository
4. Configure the service:
   - **Name**: `pollsvoting` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: Leave empty
   - **Environment**: `Node`
   - **Build Command**: 
     ```
     npm install --prefix backend && npm install --prefix frontend && npm run build --prefix frontend
     ```
   - **Start Command**: 
     ```
     cd backend && npm start
     ```
   - **Plan**: Free

### 3. Configure Environment Variables

In your Render service settings, add the following environment variables:

#### Required Variables:

1. **NODE_ENV**
   - Value: `production`

2. **PORT**
   - Value: `10000` (Render's default)

3. **MONGO_URI**
   - Value: Your MongoDB Atlas connection string
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/pollsdb?retryWrites=true&w=majority`

4. **JWT_SECRET**
   - Value: A strong random string (at least 32 characters)
   - You can generate one using: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

5. **FRONTEND_URL**
   - Value: Your Render service URL
   - Example: `https://pollsvoting.onrender.com`
   - Note: Update this after your service is deployed

### 4. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a cluster (free tier available)
3. Create a database user
4. Whitelist IP addresses:
   - Click **"Network Access"**
   - Click **"Add IP Address"**
   - Select **"Allow Access from Anywhere"** (0.0.0.0/0)
   - This is required for Render to connect
5. Get your connection string:
   - Click **"Connect"**
   - Choose **"Connect your application"**
   - Copy the connection string
   - Replace `<password>` with your database user password

### 5. Deploy and Verify

1. Render will automatically build and deploy your application
2. Monitor the build logs for any errors
3. Once deployed, your service will be available at: `https://your-service-name.onrender.com`
4. Test the application:
   - Visit the URL
   - Try registering a new user
   - Create a poll
   - Vote on the poll

### 6. Update FRONTEND_URL

After your first deployment:
1. Copy your Render service URL (e.g., `https://pollsvoting.onrender.com`)
2. Update the `FRONTEND_URL` environment variable with this URL
3. Render will automatically redeploy

## Important Notes

### Free Tier Limitations

- **Cold Starts**: Free tier services spin down after 15 minutes of inactivity
- **First Load**: May take 30-60 seconds to wake up
- **RAM**: Limited to 512 MB
- **Build Time**: 500 build minutes per month

### Automatic Deploys

Render automatically redeploys your service when you push to your connected Git branch.

### Custom Domain (Optional)

To use a custom domain:
1. Go to your service settings
2. Click **"Custom Domains"**
3. Add your domain
4. Update your DNS records as instructed

## Troubleshooting

### Build Fails

- Check build logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify Node version compatibility

### Application Not Loading

- Check service logs in Render dashboard
- Verify environment variables are set correctly
- Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

### Database Connection Issues

- Verify `MONGO_URI` is correct
- Check MongoDB Atlas network access settings
- Ensure database user has proper permissions

### CORS Errors

- Verify `FRONTEND_URL` environment variable matches your Render URL
- Check that CORS is properly configured in `backend/server.js`

## Local Development

To run the project locally:

```bash
# Install dependencies
npm run install:all

# Start backend (in one terminal)
cd backend
npm run dev

# Start frontend (in another terminal)
cd frontend
npm run dev
```

Make sure to create a `.env` file in the backend folder based on `.env.example`.

## Support

For issues related to:
- **Render**: Check [Render Docs](https://render.com/docs)
- **MongoDB Atlas**: Check [MongoDB Docs](https://docs.atlas.mongodb.com/)

## Project Structure

```
pollsVoting/
├── backend/          # Express API server
├── frontend/         # React Vite application
├── render.yaml       # Render Blueprint configuration
├── package.json      # Root package with helper scripts
└── DEPLOYMENT.md     # This file
```

## Security Checklist

- ✅ Environment variables are not committed to Git
- ✅ `.env` file is in `.gitignore`
- ✅ Strong JWT secret is used
- ✅ MongoDB connection string is secured
- ✅ CORS is properly configured for production

---

**Congratulations!** Your Polls Voting System is now deployed on Render! 🎉
