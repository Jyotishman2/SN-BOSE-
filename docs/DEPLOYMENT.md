# Deployment Guide

## Prerequisites
- GitHub account with repo containing this code
- Render account (https://render.com)
- Vercel account (https://vercel.com)

---

## Backend Deployment (Render)

### Step 1: Prepare Backend

1. Create a `render.yaml` file in the project root:

```yaml
services:
  - type: web
    name: power-demand-api
    runtime: python
    pythonVersion: 3.9
    buildCommand: pip install -r backend/requirements.txt
    startCommand: cd backend && gunicorn app:create_app()
    envVars:
      - key: FLASK_ENV
        value: production
      - key: SECRET_KEY
        generateValue: true
      - key: ALLOWED_ORIGINS
        value: "https://your-frontend-domain.vercel.app"
```

2. Add `render.yaml` to git:
```bash
git add render.yaml
git commit -m "Add render deployment config"
git push
```

### Step 2: Deploy on Render

1. Go to https://render.com
2. Sign in with GitHub
3. Click "New" → "Web Service"
4. Select your GitHub repository
5. Fill in details:
   - **Name**: power-demand-api
   - **Runtime**: Python
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && gunicorn -w 4 -b 0.0.0.0:$PORT app:create_app()`
   - **Instance Type**: Free tier

6. Set environment variables:
   - `FLASK_ENV`: `production`
   - `SECRET_KEY`: Generate a strong key
   - `ALLOWED_ORIGINS`: Your Vercel frontend URL

7. Click "Create Web Service"

### Step 3: Verify Backend

After deployment completes:
```bash
curl https://your-render-app.onrender.com/api/health
```

You should get a 200 response with status "healthy".

---

## Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

1. Create a `vercel.json` in the project root:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "env": {
    "REACT_APP_API_URL": "@react_app_api_url"
  }
}
```

2. Update `frontend/.env.production`:

```env
REACT_APP_API_URL=https://your-render-app.onrender.com/api
```

3. Push to GitHub:
```bash
git add vercel.json frontend/.env.production
git commit -m "Add vercel deployment config"
git push
```

### Step 2: Deploy on Vercel

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "Import Project"
4. Select your repository
5. Configure project:
   - **Framework**: React
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: build

6. Set environment variables:
   - `REACT_APP_API_URL`: Your Render backend URL (e.g., https://power-demand-api-xyz.onrender.com/api)

7. Click "Deploy"

### Step 3: Verify Frontend

After deployment, visit your Vercel URL and test:
- Home page loads
- Can navigate to Upload, Forecast, Anomalies
- API health check shows backend is ready

---

## Post-Deployment Checklist

### Backend (Render)
- [ ] Health check endpoint returns 200
- [ ] CORS is properly configured
- [ ] Environment variables are set
- [ ] Logs show no errors
- [ ] Can upload test CSV file

### Frontend (Vercel)
- [ ] Site loads without errors
- [ ] Navigation works
- [ ] Can upload files
- [ ] Can generate forecasts
- [ ] Can detect anomalies
- [ ] API_URL points to correct backend

### Configuration
- [ ] Backend `ALLOWED_ORIGINS` includes frontend URL
- [ ] Frontend `REACT_APP_API_URL` points to backend
- [ ] Database path is correct for file uploads
- [ ] Model storage directory is accessible

---

## Troubleshooting

### Backend Deployment Issues

**"Build failed"**
- Check Python version (3.9+)
- Verify all dependencies in requirements.txt
- Check for syntax errors

**"Port binding error"**
- Use `$PORT` environment variable
- Don't hardcode port 5000

**"Module not found"**
- Ensure relative imports use full paths
- Check requirements.txt has all dependencies

### Frontend Deployment Issues

**"Blank page after deployment"**
- Check console errors
- Verify API URL in environment variables
- Check CORS headers from backend

**"API requests failing (CORS)"**
- Verify backend ALLOWED_ORIGINS includes frontend URL
- Check if backend is running
- Test with `curl` from browser console

**"Static assets 404"**
- Verify build output folder in Vercel
- Check public folder is correctly configured

---

## Environment Variables

### Backend (Render)
```
FLASK_ENV=production
SECRET_KEY=your-secret-key-here
ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
UPLOAD_FOLDER=temp_uploads
MODEL_FOLDER=models
MAX_CONTENT_LENGTH=52428800
```

### Frontend (Vercel)
```
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

---

## Performance Optimization

### Backend
- Use caching for models
- Implement request timeouts
- Add database for persistence

### Frontend
- Enable code splitting
- Lazy load routes
- Optimize bundle size

---

## Monitoring

### Render Dashboard
- Monitor CPU/Memory usage
- Check error logs
- View request metrics

### Vercel Dashboard
- Monitor deployment status
- Check build logs
- View analytics

---

## Custom Domain (Optional)

### For Backend
1. In Render, go to Settings
2. Add Custom Domain
3. Update DNS records with CNAME
4. Wait for SSL cert generation

### For Frontend
1. In Vercel, go to Settings → Domains
2. Add your domain
3. Update DNS records
4. SSL auto-configured

---

## Cost Estimation

- **Render Free Tier**: Free (limited resources)
  - 0.5 GB RAM
  - 0.5 CPU
  - No credit card required
  
- **Vercel Free Tier**: Free
  - Unlimited deployments
  - No bandwidth limit
  - Includes SSL

**Paid Options Available**: $7-29/month each for higher tiers

---

## Scaling for Production

1. **Database**: Add PostgreSQL for persistence
2. **Caching**: Implement Redis for model caching
3. **Load Balancing**: Use multiple backend instances
4. **CDN**: Vercel includes CDN for frontend
5. **Monitoring**: Add Sentry for error tracking

---

## Rollback Procedures

### Render
- Old deployments accessible from dashboard
- Click "Roll back" on previous build

### Vercel
- Previous deployments in "Deployments" tab
- Click "Promote to Production"

---

Deployment complete! Your system is now live! 🚀
