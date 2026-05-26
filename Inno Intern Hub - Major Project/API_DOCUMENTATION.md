# InnoInternHUB API Documentation

## Overview

Base URL: `https://api.innointernhub.com/api`

All endpoints return JSON. Authentication uses Bearer tokens.

---

## Authentication

### Register

```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "STUDENT" // STUDENT | INNOVATOR | INVESTOR
}
```

**Response:**
```json
{
  "message": "Registration successful. Please verify your email.",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "STUDENT"
  }
}
```

### Login

```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "STUDENT",
    "avatar": null
  }
}
```

### Logout

```http
POST /auth/logout
Authorization: Bearer <access_token>
```

### Refresh Token

```http
POST /auth/refresh
```

Uses httpOnly cookie for refresh token.

### Get Current User

```http
GET /auth/me
Authorization: Bearer <access_token>
```

---

## Projects

### List Projects

```http
GET /projects?domain=Technology&skills=React,Node.js&page=1&limit=10
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| domain | string | Filter by domain |
| skills | string | Comma-separated skills |
| difficulty | string | Beginner/Intermediate/Advanced |
| isPaid | boolean | Only paid projects |
| status | string | DRAFT/OPEN/IN_PROGRESS/COMPLETED/CLOSED |
| search | string | Search in title/description |
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10) |

**Response:**
```json
{
  "projects": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

### Get Project

```http
GET /projects/:id
```

### Create Project (Innovator only)

```http
POST /projects
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "title": "Build an AI Chatbot",
  "description": "Full project description...",
  "domain": "AI/ML",
  "skills": ["Python", "NLP", "TensorFlow"],
  "difficulty": "Advanced",
  "teamSize": 2,
  "duration": 8,
  "commitment": "Part-time",
  "isPaid": true,
  "stipend": 15000,
  "milestones": [
    {
      "title": "Research & Planning",
      "description": "Define requirements and architecture"
    },
    {
      "title": "Development",
      "description": "Implement core functionality"
    }
  ]
}
```

### Update Project

```http
PATCH /projects/:id
Authorization: Bearer <access_token>
```

### Publish Project

```http
POST /projects/:id/publish
Authorization: Bearer <access_token>
```

### Complete Project

```http
POST /projects/:id/complete
Authorization: Bearer <access_token>
```

### Delete Project

```http
DELETE /projects/:id
Authorization: Bearer <access_token>
```

---

## Applications

### Get My Applications (Student)

```http
GET /applications
Authorization: Bearer <access_token>
```

### Apply to Project

```http
POST /applications
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "projectId": "project-uuid",
  "coverLetter": "I am excited to apply...",
  "relevantExperience": "I have worked on...",
  "portfolioLinks": ["https://github.com/user"],
  "availability": "20 hours/week"
}
```

### Get Project Applications (Innovator)

```http
GET /applications/project/:projectId
Authorization: Bearer <access_token>
```

### Update Application Status

```http
PATCH /applications/:id
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "status": "ACCEPTED", // SHORTLISTED | ACCEPTED | REJECTED
  "feedback": "Welcome to the team!"
}
```

### Withdraw Application

```http
DELETE /applications/:id
Authorization: Bearer <access_token>
```

---

## Certificates

### Get My Certificates

```http
GET /certificates
Authorization: Bearer <access_token>
```

### Verify Certificate (Public)

```http
GET /certificates/verify/:certificateNo
```

**Response:**
```json
{
  "valid": true,
  "certificate": {
    "certificateNo": "IIH-123-ABC456",
    "studentName": "John Doe",
    "projectTitle": "AI Chatbot",
    "innovatorName": "Jane Smith",
    "skills": ["Python", "NLP"],
    "startDate": "2024-01-01",
    "endDate": "2024-03-01",
    "issuedAt": "2024-03-02",
    "domain": "AI/ML"
  }
}
```

### Download Certificate

```http
GET /certificates/:id/download
Authorization: Bearer <access_token>
```

Returns PDF file.

---

## Users

### Get Public Profile

```http
GET /users/:id
```

### Update Profile

```http
PATCH /users/me
Authorization: Bearer <access_token>
```

### Get Dashboard Stats

```http
GET /users/me/stats
Authorization: Bearer <access_token>
```

### Delete Account

```http
DELETE /users/me
Authorization: Bearer <access_token>
```

---

## Messages

### Get Conversations

```http
GET /messages/conversations
Authorization: Bearer <access_token>
```

### Get Conversation

```http
GET /messages/conversation/:userId
Authorization: Bearer <access_token>
```

### Send Message

```http
POST /messages/send
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "receiverId": "user-uuid",
  "content": "Hello!"
}
```

---

## Notifications

### Get Notifications

```http
GET /notifications?page=1&limit=20&unreadOnly=false
Authorization: Bearer <access_token>
```

### Mark as Read

```http
PATCH /notifications/:id/read
Authorization: Bearer <access_token>
```

### Mark All as Read

```http
PATCH /notifications/read-all
Authorization: Bearer <access_token>
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message",
  "details": [...] // Optional validation details
}
```

### Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

---

## Rate Limiting

- 100 requests per minute per IP
- 429 status code when exceeded

---

## CORS

Allowed origins:
- Production frontend domain
- localhost:3000 (development)
