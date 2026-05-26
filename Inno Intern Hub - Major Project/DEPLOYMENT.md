# InnoInternHUB - Deployment Guide

## Overview

This guide covers deploying InnoInternHUB to production. The architecture consists of:
- **Frontend**: Next.js 16 deployed to Vercel
- **Backend**: Node.js/Express deployed to Railway/Render
- **Database**: PostgreSQL on Supabase/Neon
- **File Storage**: Cloudinary

---

## Prerequisites

- Node.js 20+
- PostgreSQL database
- Domain name (optional but recommended)
- Accounts on: Vercel, Railway/Render, Supabase/Neon, Cloudinary

---

## 1. Database Setup (Supabase/Neon)

### Using Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > Database > Connection String
3. Copy the connection string (URI format)

### Using Neon

1. Create a new project at [neon.tech](https://neon.tech)
2. Copy the connection string from the dashboard

### Initialize Database

```bash
cd server
npm install
npx prisma db push
```

---

## 2. Backend Deployment (Railway)

### Option A: Railway

1. Create account at [railway.app](https://railway.app)
2. Create new project from GitHub repo
3. Set root directory to `server`
4. Add environment variables:

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=your_postgres_connection_string
JWT_ACCESS_SECRET=generate-strong-secret-key-1
JWT_REFRESH_SECRET=generate-strong-secret-key-2
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
APP_URL=https://your-frontend-domain.vercel.app
EMAIL_HOST=smtp.resend.com
EMAIL_PORT=587
EMAIL_USER=resend
EMAIL_PASS=your_resend_api_key
EMAIL_FROM=noreply@yourdomain.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

5. Deploy

### Option B: Render

1. Create account at [render.com](https://render.com)
2. Create new Web Service from GitHub
3. Configure:
   - Root Directory: `server`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
4. Add environment variables (same as above)
5. Deploy

---

## 3. Frontend Deployment (Vercel)

1. Create account at [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Configure:
   - Root Directory: `web`
   - Framework Preset: Next.js
4. Add environment variables:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

5. Deploy

---

## 3.1. Simulated Backend Mode (Frontend Only)

Currently, the `lib/auth-context.tsx` is configured to run in **Simulated Mode** using `localStorage`. This allows the frontend to be deployed and demonstrated without a live backend connection.

**To Enable Live Backend Integration:**

1.  Open `web/lib/auth-context.tsx`.
2.  Locate the `login` and `register` functions.
3.  Remove the simulation delay: `await new Promise(resolve => setTimeout(resolve, 800));`
4.  Remove the local storage simulated logic.
5.  Uncomment the `fetch` calls to your API endpoint.
6.  Ensure `NEXT_PUBLIC_API_URL` is set in Vercel environment variables.

---

## 4. Domain Configuration

### Custom Domain on Vercel

1. Go to Project Settings > Domains
2. Add your domain
3. Configure DNS records as instructed

### SSL/TLS

Vercel and Railway automatically provision SSL certificates.

---

## 5. Environment Variables Reference

### Backend (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | production/development | ✅ |
| `PORT` | Server port (default: 5000) | ✅ |
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `JWT_ACCESS_SECRET` | Access token secret | ✅ |
| `JWT_REFRESH_SECRET` | Refresh token secret | ✅ |
| `JWT_ACCESS_EXPIRY` | Access token expiry (e.g., 15m) | ✅ |
| `JWT_REFRESH_EXPIRY` | Refresh token expiry (e.g., 7d) | ✅ |
| `APP_URL` | Frontend URL | ✅ |
| `EMAIL_HOST` | SMTP host | ✅ |
| `EMAIL_PORT` | SMTP port | ✅ |
| `EMAIL_USER` | SMTP user | ✅ |
| `EMAIL_PASS` | SMTP password | ✅ |
| `EMAIL_FROM` | From email address | ✅ |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | ✅ |
| `CLOUDINARY_API_KEY` | Cloudinary API key | ✅ |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | ✅ |
| `REDIS_URL` | Redis connection (optional) | ❌ |

### Frontend (.env.local)

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | ✅ |
| `NEXT_PUBLIC_APP_URL` | Frontend app URL | ✅ |

---

## 6. Post-Deployment Checklist

- [ ] Verify database connection
- [ ] Test user registration and email verification
- [ ] Test login/logout flow
- [ ] Verify JWT authentication
- [ ] Test project creation and listing
- [ ] Test application submission
- [ ] Verify certificate generation
- [ ] Test all dashboard features
- [ ] Check mobile responsiveness
- [ ] Verify SEO metadata
- [ ] Test 404 and error pages
- [ ] Monitor error logs

---

## 7. Monitoring & Logging

### Application Monitoring

- Use Vercel Analytics for frontend
- Use Railway/Render logs for backend
- Consider adding Sentry for error tracking

### Database Monitoring

- Use Supabase/Neon dashboards
- Set up connection pooling for production

---

## 8. Scaling Considerations

### Frontend
- Vercel auto-scales based on traffic
- Enable ISR for frequently accessed pages

### Backend
- Use horizontal scaling on Railway/Render
- Implement Redis for session caching
- Add connection pooling for database

### Database
- Use read replicas for heavy read workloads
- Implement proper indexing
- Regular backups

---

## 9. Security Checklist

- [ ] Use HTTPS everywhere
- [ ] Set secure cookie flags
- [ ] Implement rate limiting
- [ ] Validate all inputs
- [ ] Sanitize outputs
- [ ] Use prepared statements (Prisma handles this)
- [ ] Keep dependencies updated
- [ ] Regular security audits
- [ ] Implement CORS properly
- [ ] Use Content Security Policy

---

## 10. Backup & Recovery

### Database Backups
- Enable automatic backups on Supabase/Neon
- Schedule daily backups
- Test restoration regularly

### File Backups
- Cloudinary handles media backups
- Export configuration regularly

---

## Troubleshooting

### Common Issues

1. **CORS errors**: Ensure `APP_URL` in backend matches frontend domain
2. **Database connection**: Check connection string and SSL settings
3. **Email not sending**: Verify SMTP credentials and from address
4. **JWT errors**: Ensure secrets match between deployments

### Getting Help

- Check server logs in Railway/Render
- Check browser console for frontend errors
- Review Prisma logs for database issues
