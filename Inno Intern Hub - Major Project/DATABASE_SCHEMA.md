# InnoInternHUB - Database Schema

## Entity Relationship Diagram (ERD)

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│    Users     │       │   Projects   │       │ Applications │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id           │───────│ innovatorId  │       │ id           │
│ email        │       │ id           │───────│ projectId    │
│ password     │       │ title        │       │ studentId    │──┐
│ role         │       │ description  │       │ status       │  │
│ ...          │       │ skills       │       │ coverLetter  │  │
└──────────────┘       │ ...          │       │ ...          │  │
       │               └──────────────┘       └──────────────┘  │
       │                      │                                  │
       │                      │                                  │
       │               ┌──────────────┐       ┌──────────────┐  │
       │               │  Milestones  │       │ Submissions  │  │
       │               ├──────────────┤       ├──────────────┤  │
       │               │ id           │       │ id           │  │
       │               │ projectId    │───────│ milestoneId  │  │
       │               │ title        │       │ studentId    │──┤
       │               │ order        │       │ files        │  │
       │               │ ...          │       │ ...          │  │
       │               └──────────────┘       └──────────────┘  │
       │                                                        │
       │               ┌──────────────┐       ┌──────────────┐  │
       │               │ Certificates │       │   Messages   │  │
       │               ├──────────────┤       ├──────────────┤  │
       │               │ id           │       │ id           │  │
       └───────────────│ studentId    │       │ senderId     │──┘
                       │ projectId    │       │ receiverId   │
                       │ certificateNo│       │ content      │
                       │ ...          │       │ ...          │
                       └──────────────┘       └──────────────┘

┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│  Investments │       │   Reviews    │       │Notifications │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id           │       │ id           │       │ id           │
│ investorId   │       │ projectId    │       │ userId       │
│ projectId    │       │ reviewerId   │       │ type         │
│ status       │       │ revieweeId   │       │ message      │
│ ...          │       │ rating       │       │ read         │
└──────────────┘       │ ...          │       │ ...          │
                       └──────────────┘       └──────────────┘
```

---

## Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// ENUMS
// ============================================

enum Role {
  GUEST
  STUDENT
  INNOVATOR
  INVESTOR
  ADMIN
}

enum ProjectStatus {
  DRAFT
  OPEN
  IN_PROGRESS
  COMPLETED
  CLOSED
}

enum ApplicationStatus {
  PENDING
  SHORTLISTED
  ACCEPTED
  REJECTED
  WITHDRAWN
}

enum MilestoneStatus {
  PENDING
  IN_PROGRESS
  SUBMITTED
  APPROVED
  REJECTED
}

enum SubmissionStatus {
  SUBMITTED
  UNDER_REVIEW
  APPROVED
  NEEDS_REVISION
}

enum InvestmentStatus {
  INTERESTED
  IN_DISCUSSION
  COMMITTED
  WITHDRAWN
}

enum CertificateStatus {
  PENDING
  ISSUED
  REVOKED
}

enum NotificationType {
  APPLICATION_RECEIVED
  APPLICATION_ACCEPTED
  APPLICATION_REJECTED
  MILESTONE_SUBMITTED
  MILESTONE_APPROVED
  MILESTONE_REJECTED
  PROJECT_COMPLETED
  CERTIFICATE_ISSUED
  NEW_MESSAGE
  INVESTMENT_INTEREST
  SYSTEM
}

// ============================================
// USER & AUTHENTICATION
// ============================================

model User {
  id                String    @id @default(uuid())
  email             String    @unique
  passwordHash      String?
  firstName         String
  lastName          String
  role              Role      @default(STUDENT)
  avatar            String?
  bio               String?
  phone             String?
  
  // Verification
  emailVerified     Boolean   @default(false)
  emailVerifyToken  String?
  emailVerifyExpiry DateTime?
  
  // Password Reset
  resetToken        String?
  resetTokenExpiry  DateTime?
  
  // OAuth
  googleId          String?   @unique
  linkedinId        String?   @unique
  
  // Student-specific
  education         String?
  university        String?
  graduationYear    Int?
  skills            String[]
  portfolioUrl      String?
  resumeUrl         String?
  
  // Innovator-specific
  companyName       String?
  companyWebsite    String?
  designation       String?
  
  // Investor-specific
  investorType      String?
  investmentRange   String?
  sectors           String[]
  
  // Gamification
  points            Int       @default(0)
  level             String    @default("Beginner")
  badges            String[]
  
  // Status
  isActive          Boolean   @default(true)
  isVerified        Boolean   @default(false)
  lastLoginAt       DateTime?
  
  // Timestamps
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  deletedAt         DateTime?
  
  // Relations
  projects          Project[]          @relation("InnovatorProjects")
  applications      Application[]
  submissions       Submission[]
  certificates      Certificate[]
  sentMessages      Message[]          @relation("SentMessages")
  receivedMessages  Message[]          @relation("ReceivedMessages")
  notifications     Notification[]
  investments       Investment[]
  reviewsGiven      Review[]           @relation("ReviewerRelation")
  reviewsReceived   Review[]           @relation("RevieweeRelation")
  refreshTokens     RefreshToken[]
  
  @@index([email])
  @@index([role])
  @@map("users")
}

model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  createdAt DateTime @default(now())
  
  @@index([token])
  @@index([userId])
  @@map("refresh_tokens")
}

// ============================================
// PROJECTS
// ============================================

model Project {
  id              String        @id @default(uuid())
  title           String
  description     String
  shortDescription String?
  
  // Categorization
  domain          String
  skills          String[]
  difficulty      String        @default("Intermediate")
  tags            String[]
  
  // Requirements
  teamSize        Int           @default(1)
  duration        Int           // in weeks
  commitment      String        @default("Part-time") // Part-time, Full-time
  
  // Compensation
  isPaid          Boolean       @default(false)
  stipend         Int?
  stipendPeriod   String?       // per month, per milestone, total
  
  // Dates
  startDate       DateTime?
  endDate         DateTime?
  applicationDeadline DateTime?
  
  // Status
  status          ProjectStatus @default(DRAFT)
  isPublished     Boolean       @default(false)
  isFeatured      Boolean       @default(false)
  
  // Metrics
  viewCount       Int           @default(0)
  applicationCount Int          @default(0)
  
  // Media
  coverImage      String?
  attachments     String[]
  
  // Owner
  innovatorId     String
  innovator       User          @relation("InnovatorProjects", fields: [innovatorId], references: [id])
  
  // Timestamps
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  publishedAt     DateTime?
  completedAt     DateTime?
  deletedAt       DateTime?
  
  // Relations
  applications    Application[]
  milestones      Milestone[]
  certificates    Certificate[]
  investments     Investment[]
  reviews         Review[]
  
  @@index([status])
  @@index([domain])
  @@index([innovatorId])
  @@index([isPublished])
  @@map("projects")
}

// ============================================
// APPLICATIONS
// ============================================

model Application {
  id            String            @id @default(uuid())
  
  projectId     String
  project       Project           @relation(fields: [projectId], references: [id])
  
  studentId     String
  student       User              @relation(fields: [studentId], references: [id])
  
  status        ApplicationStatus @default(PENDING)
  
  coverLetter   String?
  relevantExperience String?
  portfolioLinks String[]
  availability  String?
  
  // Innovator feedback
  feedback      String?
  
  // Timestamps
  appliedAt     DateTime          @default(now())
  shortlistedAt DateTime?
  acceptedAt    DateTime?
  rejectedAt    DateTime?
  updatedAt     DateTime          @updatedAt
  
  @@unique([projectId, studentId])
  @@index([projectId])
  @@index([studentId])
  @@index([status])
  @@map("applications")
}

// ============================================
// MILESTONES & SUBMISSIONS
// ============================================

model Milestone {
  id          String          @id @default(uuid())
  
  projectId   String
  project     Project         @relation(fields: [projectId], references: [id])
  
  title       String
  description String?
  order       Int
  
  // Requirements
  deliverables String[]
  deadline     DateTime?
  
  // Status
  status      MilestoneStatus @default(PENDING)
  
  // Timestamps
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
  completedAt DateTime?
  
  // Relations
  submissions Submission[]
  
  @@index([projectId])
  @@index([order])
  @@map("milestones")
}

model Submission {
  id          String           @id @default(uuid())
  
  milestoneId String
  milestone   Milestone        @relation(fields: [milestoneId], references: [id])
  
  studentId   String
  student     User             @relation(fields: [studentId], references: [id])
  
  // Content
  description String?
  files       String[]
  links       String[]
  
  // Status
  status      SubmissionStatus @default(SUBMITTED)
  
  // Feedback
  feedback    String?
  rating      Int?
  
  // Timestamps
  submittedAt DateTime         @default(now())
  reviewedAt  DateTime?
  updatedAt   DateTime         @updatedAt
  
  @@index([milestoneId])
  @@index([studentId])
  @@map("submissions")
}

// ============================================
// CERTIFICATES
// ============================================

model Certificate {
  id              String            @id @default(uuid())
  certificateNo   String            @unique
  
  studentId       String
  student         User              @relation(fields: [studentId], references: [id])
  
  projectId       String
  project         Project           @relation(fields: [projectId], references: [id])
  
  // Certificate Details
  studentName     String
  projectTitle    String
  innovatorName   String
  skills          String[]
  startDate       DateTime
  endDate         DateTime
  
  // Status
  status          CertificateStatus @default(PENDING)
  
  // File
  pdfUrl          String?
  qrCode          String?
  
  // Timestamps
  issuedAt        DateTime?
  revokedAt       DateTime?
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
  
  @@index([certificateNo])
  @@index([studentId])
  @@index([projectId])
  @@map("certificates")
}

// ============================================
// INVESTMENTS
// ============================================

model Investment {
  id          String           @id @default(uuid())
  
  investorId  String
  investor    User             @relation(fields: [investorId], references: [id])
  
  projectId   String
  project     Project          @relation(fields: [projectId], references: [id])
  
  status      InvestmentStatus @default(INTERESTED)
  
  // Interest Details
  notes       String?
  amount      Int?
  
  // Timestamps
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt
  
  @@unique([investorId, projectId])
  @@index([investorId])
  @@index([projectId])
  @@map("investments")
}

// ============================================
// REVIEWS
// ============================================

model Review {
  id          String   @id @default(uuid())
  
  projectId   String
  project     Project  @relation(fields: [projectId], references: [id])
  
  reviewerId  String
  reviewer    User     @relation("ReviewerRelation", fields: [reviewerId], references: [id])
  
  revieweeId  String
  reviewee    User     @relation("RevieweeRelation", fields: [revieweeId], references: [id])
  
  rating      Int      // 1-5
  comment     String?
  
  // Specific ratings
  communicationRating Int?
  qualityRating       Int?
  timelinessRating    Int?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@unique([projectId, reviewerId, revieweeId])
  @@index([revieweeId])
  @@map("reviews")
}

// ============================================
// MESSAGING
// ============================================

model Message {
  id          String   @id @default(uuid())
  
  senderId    String
  sender      User     @relation("SentMessages", fields: [senderId], references: [id])
  
  receiverId  String
  receiver    User     @relation("ReceivedMessages", fields: [receiverId], references: [id])
  
  content     String
  attachments String[]
  
  isRead      Boolean  @default(false)
  readAt      DateTime?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  deletedAt   DateTime?
  
  @@index([senderId])
  @@index([receiverId])
  @@index([createdAt])
  @@map("messages")
}

// ============================================
// NOTIFICATIONS
// ============================================

model Notification {
  id          String           @id @default(uuid())
  
  userId      String
  user        User             @relation(fields: [userId], references: [id])
  
  type        NotificationType
  title       String
  message     String
  link        String?
  
  isRead      Boolean          @default(false)
  readAt      DateTime?
  
  createdAt   DateTime         @default(now())
  
  @@index([userId])
  @@index([isRead])
  @@index([createdAt])
  @@map("notifications")
}

// ============================================
// ADMIN & SYSTEM
// ============================================

model AuditLog {
  id          String   @id @default(uuid())
  
  userId      String?
  action      String
  entity      String
  entityId    String?
  oldValue    Json?
  newValue    Json?
  ipAddress   String?
  userAgent   String?
  
  createdAt   DateTime @default(now())
  
  @@index([userId])
  @@index([entity])
  @@index([createdAt])
  @@map("audit_logs")
}

model SystemConfig {
  id          String   @id @default(uuid())
  key         String   @unique
  value       Json
  description String?
  
  updatedAt   DateTime @updatedAt
  
  @@map("system_config")
}
```

---

## Database Indexes

### Performance Indexes
```sql
-- Users
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Projects
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_domain ON projects(domain);
CREATE INDEX idx_projects_innovator ON projects(innovator_id);
CREATE INDEX idx_projects_published ON projects(is_published);
CREATE INDEX idx_projects_created_at ON projects(created_at);

-- Applications
CREATE INDEX idx_applications_project ON applications(project_id);
CREATE INDEX idx_applications_student ON applications(student_id);
CREATE INDEX idx_applications_status ON applications(status);

-- Full-text search
CREATE INDEX idx_projects_search ON projects USING gin(
  to_tsvector('english', title || ' ' || description)
);
```

---

## Data Validation Rules

### User
- Email: Valid email format, unique
- Password: Min 8 chars, 1 uppercase, 1 number
- Role: Must be valid enum value
- Phone: Valid phone format (optional)

### Project
- Title: 5-100 characters
- Description: 50-5000 characters
- Domain: Required, from predefined list
- Skills: 1-10 skills required
- Team Size: 1-10
- Duration: 1-52 weeks
- Stipend: 0-100000 (if paid)

### Application
- Cover Letter: 50-2000 characters
- One application per project per student

### Review
- Rating: 1-5
- Comment: Max 1000 characters
