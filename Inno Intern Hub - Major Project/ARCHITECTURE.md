# InnoInternHUB - System Architecture

## 1. System Overview

InnoInternHUB is a production-ready innovation internship platform that connects:
- **Innovators** who post project ideas
- **Students** who apply and work on projects
- **Investors** who discover and invest in promising ideas
- **Admins** who manage the platform

### Core Value Proposition
- Students gain real-world experience working on innovative projects
- Innovators get execution support from talented students
- Students receive verified internship certificates
- Investors access early-stage validated ideas

---

## 2. Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 16 | React framework with App Router |
| TypeScript | Type safety |
| TailwindCSS | Utility-first styling |
| Shadcn/UI | Component library |
| React Hook Form | Form management |
| Zod | Schema validation |
| Zustand | State management |
| React Query | Server state management |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | HTTP server |
| TypeScript | Type safety |
| Prisma | ORM |
| PostgreSQL | Primary database |
| Redis | Session cache & rate limiting |
| JWT | Authentication tokens |
| Nodemailer | Email service |
| PDFKit | Certificate generation |

### Infrastructure
| Technology | Purpose |
|------------|---------|
| Vercel | Frontend hosting |
| Railway/Render | Backend hosting |
| Supabase/Neon | PostgreSQL hosting |
| Cloudinary | Image/file storage |
| Resend | Transactional emails |

---

## 3. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Public    │  │  Dashboard  │  │    Admin    │              │
│  │   Pages     │  │   (RBAC)    │  │   Panel     │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY / BACKEND                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │   Auth   │  │ Projects │  │  Users   │  │  Certs   │        │
│  │  Module  │  │  Module  │  │  Module  │  │  Module  │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐       │
│  │              Middleware Layer                         │       │
│  │  • JWT Validation  • RBAC Guards  • Rate Limiting    │       │
│  │  • Input Validation  • Error Handling  • Logging     │       │
│  └──────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATA LAYER                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │  PostgreSQL  │    │    Redis     │    │  Cloudinary  │      │
│  │  (Primary)   │    │   (Cache)    │    │   (Files)    │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. User Roles & Permissions

### Role Hierarchy
```
ADMIN > INVESTOR > INNOVATOR > STUDENT > GUEST
```

### Permission Matrix

| Feature | Guest | Student | Innovator | Investor | Admin |
|---------|-------|---------|-----------|----------|-------|
| View landing page | ✅ | ✅ | ✅ | ✅ | ✅ |
| View public projects | ✅ | ✅ | ✅ | ✅ | ✅ |
| Register/Login | ✅ | ✅ | ✅ | ✅ | ✅ |
| Apply to projects | ❌ | ✅ | ❌ | ❌ | ✅ |
| Create projects | ❌ | ❌ | ✅ | ❌ | ✅ |
| Review applications | ❌ | ❌ | ✅ | ❌ | ✅ |
| Express investment interest | ❌ | ❌ | ❌ | ✅ | ✅ |
| Issue certificates | ❌ | ❌ | ✅ | ❌ | ✅ |
| Download certificates | ❌ | ✅ | ❌ | ❌ | ✅ |
| Manage users | ❌ | ❌ | ❌ | ❌ | ✅ |
| Platform settings | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 5. Authentication Flow

### Registration Flow
```
1. User fills registration form
2. Server validates input
3. Check if email exists
4. Hash password (bcrypt, 12 rounds)
5. Create user with role
6. Generate email verification token
7. Send verification email
8. User clicks verification link
9. Mark email as verified
10. User can now login
```

### Login Flow
```
1. User submits credentials
2. Validate email exists
3. Check email is verified
4. Compare password hash
5. Generate access token (15min expiry)
6. Generate refresh token (7 days expiry)
7. Store refresh token in httpOnly cookie
8. Return access token in response
9. Client stores access token in memory
```

### Token Refresh Flow
```
1. Access token expires
2. Client sends refresh token (from cookie)
3. Server validates refresh token
4. Generate new access token
5. Optionally rotate refresh token
6. Return new tokens
```

### OAuth Flow (Google/LinkedIn)
```
1. User clicks OAuth button
2. Redirect to provider
3. User authorizes
4. Provider redirects with code
5. Exchange code for tokens
6. Fetch user profile
7. Find or create user
8. Generate JWT tokens
9. Redirect to dashboard
```

---

## 6. Certificate System

### Certificate Generation Flow
```
1. Innovator marks project complete
2. System validates all milestones submitted
3. Generate unique certificate ID (UUID)
4. Create certificate record in database
5. Generate QR code with verification URL
6. Generate PDF using template:
   - Platform logo & branding
   - Student name
   - Project title
   - Innovator name
   - Duration (start - end date)
   - Skills used
   - Certificate ID
   - QR code
   - Digital signature
7. Upload PDF to storage
8. Notify student
9. Certificate downloadable from dashboard
```

### Certificate Verification
```
URL: /verify/:certificateId

1. Fetch certificate by ID
2. If found, show:
   - Student name
   - Project title
   - Issuing date
   - Status (valid/revoked)
3. If not found, show error
```

---

## 7. API Structure

```
/api
├── /auth
│   ├── POST /register
│   ├── POST /login
│   ├── POST /logout
│   ├── POST /refresh
│   ├── POST /verify-email
│   ├── POST /forgot-password
│   ├── POST /reset-password
│   ├── GET  /oauth/google
│   └── GET  /oauth/linkedin
│
├── /users
│   ├── GET  /me
│   ├── PATCH /me
│   ├── GET  /:id (public profile)
│   └── DELETE /me
│
├── /projects
│   ├── GET  / (list with filters)
│   ├── GET  /:id
│   ├── POST / (innovator only)
│   ├── PATCH /:id
│   ├── DELETE /:id
│   └── POST /:id/complete
│
├── /applications
│   ├── GET  / (my applications)
│   ├── POST / (apply to project)
│   ├── PATCH /:id (accept/reject)
│   └── GET  /project/:projectId (innovator)
│
├── /milestones
│   ├── GET  /project/:projectId
│   ├── POST /project/:projectId
│   ├── PATCH /:id
│   └── POST /:id/submit
│
├── /certificates
│   ├── GET  / (my certificates)
│   ├── GET  /:id/download
│   └── GET  /verify/:id (public)
│
├── /investments
│   ├── GET  / (my interests)
│   ├── POST / (express interest)
│   └── DELETE /:id
│
├── /messages
│   ├── GET  /conversations
│   ├── GET  /conversation/:userId
│   ├── POST /send
│   └── PATCH /:id/read
│
├── /notifications
│   ├── GET  /
│   ├── PATCH /:id/read
│   └── PATCH /read-all
│
└── /admin
    ├── GET  /users
    ├── PATCH /users/:id
    ├── DELETE /users/:id
    ├── GET  /projects
    ├── PATCH /projects/:id/moderate
    ├── GET  /analytics
    └── GET  /certificates
```

---

## 8. Frontend Page Structure

```
/                           → Landing page
/explore                    → Browse projects (public)
/explore/:id                → Project details
/about                      → How it works
/pricing                    → Pricing plans
/stories                    → Success stories
/verify/:certificateId      → Certificate verification

/auth/login                 → Login page
/auth/register              → Registration page
/auth/verify-email          → Email verification
/auth/forgot-password       → Password reset

/dashboard                  → Dashboard router (redirects by role)

/dashboard/student          → Student dashboard
/dashboard/student/applications
/dashboard/student/projects/:id
/dashboard/student/certificates
/dashboard/student/messages
/dashboard/student/profile

/dashboard/innovator        → Innovator dashboard
/dashboard/innovator/projects
/dashboard/innovator/projects/new
/dashboard/innovator/projects/:id
/dashboard/innovator/projects/:id/applicants
/dashboard/innovator/messages

/dashboard/investor         → Investor dashboard
/dashboard/investor/discover
/dashboard/investor/interests
/dashboard/investor/messages

/dashboard/admin            → Admin dashboard
/dashboard/admin/users
/dashboard/admin/projects
/dashboard/admin/certificates
/dashboard/admin/analytics
/dashboard/admin/settings
```

---

## 9. Deployment Configuration

### Environment Variables
```env
# App
NODE_ENV=production
APP_URL=https://innointernhub.com
API_URL=https://api.innointernhub.com

# Database
DATABASE_URL=postgresql://...

# Auth
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
LINKEDIN_CLIENT_ID=...
LINKEDIN_CLIENT_SECRET=...

# Email
RESEND_API_KEY=...
EMAIL_FROM=noreply@innointernhub.com

# Storage
CLOUDINARY_URL=...

# Redis
REDIS_URL=...
```

### Production Checklist
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] SSL certificates configured
- [ ] Rate limiting enabled
- [ ] Error monitoring (Sentry)
- [ ] Analytics (Plausible/Posthog)
- [ ] Backup strategy
- [ ] Logging configured
- [ ] SPA rewrite rules set
- [ ] CORS configured
- [ ] Security headers enabled

---

## 10. Security Measures

### Authentication Security
- Passwords hashed with bcrypt (12 rounds)
- JWT tokens with short expiry
- Refresh tokens in httpOnly cookies
- Token blacklisting on logout

### API Security
- Rate limiting (100 req/min per IP)
- Input validation with Zod
- SQL injection prevention (Prisma)
- XSS prevention (Content Security Policy)
- CSRF tokens for state-changing operations

### Data Security
- Encrypted data at rest
- HTTPS only
- Secure file upload validation
- Audit logging for sensitive operations
