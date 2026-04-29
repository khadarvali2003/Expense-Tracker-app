# 📋 Expense Tracker API Documentation

## Overview

The Expense Tracker API is a RESTful backend service built with **Node.js**, **Express.js**, and **MongoDB**. It provides secure user authentication, expense management, and analytics endpoints for the Expense Tracker mobile application.

---

## Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Runtime | Node.js | 18+ |
| Framework | Express.js | 5.x |
| Database | MongoDB Atlas | 7.x |
| ODM | Mongoose | 9.x |
| Auth | JWT (jsonwebtoken) | 9.x |
| Password Hashing | bcryptjs | 3.x |
| Validation | express-validator | 7.x |
| Security | helmet, cors, express-rate-limit | Latest |
| Logging | morgan | 1.x |
| Firebase | Firebase Auth & Hosting | Latest |

---

## Project Structure

```
backend/
├── config/
│   └── db.js               # MongoDB connection configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── expenseController.js # Expense CRUD operations
│   └── dashboardController.js # Analytics & summaries
├── middleware/
│   ├── auth.js              # JWT verification middleware
│   ├── errorHandler.js      # Global error handling
│   └── validators.js        # Request validation rules
├── models/
│   ├── User.js              # User schema & methods
│   └── Expense.js           # Expense schema & indexes
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   ├── expenseRoutes.js     # Expense endpoints
│   └── dashboardRoutes.js   # Dashboard endpoints
├── .env                     # Environment variables
├── .gitignore               # Git ignore rules
├── package.json             # Project config & scripts
├── seed.js                  # Database seeder
└── server.js                # Main application entry
```

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `MONGODB_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | Token expiration time | `30d` |
| `CORS_ORIGIN` | Allowed CORS origins | `*` |

---

## Database Models

### User Model

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | String | Yes | User's full name (2-50 chars) |
| `email` | String | Yes | Unique email address |
| `password` | String | Yes | Hashed password (min 6 chars) |
| `avatar` | String | No | Profile picture URL |
| `currency` | String | No | Preferred currency (₹, $, €, £, ¥) |
| `monthlyBudget` | Number | No | Monthly spending budget |
| `createdAt` | Date | Auto | Account creation date |

**Features:**
- Password is automatically hashed using bcrypt (12 salt rounds)
- Password field is excluded from query results by default
- `matchPassword()` instance method for login verification

### Expense Model

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `user` | ObjectId | Yes | Reference to User |
| `amount` | Number | Yes | Expense amount (min 0.01) |
| `category` | String | Yes | Expense category |
| `date` | Date | Yes | Expense date |
| `note` | String | No | Description (max 200 chars) |
| `paymentMethod` | String | No | Payment method used |

**Categories:** `Food`, `Travel`, `Shopping`, `Bills`, `Health`, `Entertainment`, `Education`, `Others`

**Payment Methods:** `Cash`, `Card`, `UPI`, `Net Banking`, `Other`

**Indexes:**
- `{ user: 1, date: -1 }` - For efficient user expense queries sorted by date
- `{ user: 1, category: 1 }` - For category-based filtering

---

## API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Authentication Header
Protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

### 🔐 Authentication

#### Register
```
POST /api/auth/register
```
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
**Response (201):**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "currency": "₹",
      "monthlyBudget": 0,
      "createdAt": "2026-04-28T..."
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### Login
```
POST /api/auth/login
```
**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### Get Profile
```
GET /api/auth/profile
Authorization: Bearer <token>
```

#### Update Profile
```
PUT /api/auth/profile
Authorization: Bearer <token>
```
**Body:**
```json
{
  "name": "Updated Name",
  "currency": "$",
  "monthlyBudget": 25000
}
```

#### Change Password
```
PUT /api/auth/change-password
Authorization: Bearer <token>
```
**Body:**
```json
{
  "currentPassword": "oldpass123",
  "newPassword": "newpass456"
}
```

---

### 💰 Expenses

#### Create Expense
```
POST /api/expenses
Authorization: Bearer <token>
```
**Body:**
```json
{
  "amount": 250,
  "category": "Food",
  "date": "2026-04-28",
  "note": "Lunch at restaurant",
  "paymentMethod": "UPI"
}
```

#### List Expenses
```
GET /api/expenses?sort=latest&category=Food&startDate=2026-04-01&endDate=2026-04-30&page=1&limit=20&search=lunch
Authorization: Bearer <token>
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `sort` | String | `latest` | Sort order: `latest`, `oldest`, `highest`, `lowest` |
| `category` | String | - | Filter by category |
| `startDate` | Date | - | Filter from date |
| `endDate` | Date | - | Filter to date |
| `page` | Number | `1` | Page number |
| `limit` | Number | `20` | Items per page |
| `search` | String | - | Search in notes |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "expenses": [ ... ],
    "pagination": {
      "current": 1,
      "pages": 2,
      "total": 30,
      "limit": 20
    }
  }
}
```

#### Get Single Expense
```
GET /api/expenses/:id
Authorization: Bearer <token>
```

#### Update Expense
```
PUT /api/expenses/:id
Authorization: Bearer <token>
```

#### Delete Expense
```
DELETE /api/expenses/:id
Authorization: Bearer <token>
```

---

### 📊 Dashboard

#### Monthly Summary
```
GET /api/dashboard/summary?month=4&year=2026
Authorization: Bearer <token>
```
**Response:**
```json
{
  "success": true,
  "data": {
    "month": 4,
    "year": 2026,
    "summary": {
      "totalSpent": 16550,
      "expenseCount": 15,
      "averageExpense": 1103.33,
      "highestExpense": 5000,
      "lowestExpense": 100
    },
    "comparison": {
      "previousMonthTotal": 12000,
      "percentageChange": 37.9,
      "trend": "up"
    },
    "recentExpenses": [ ... ]
  }
}
```

#### Category Breakdown
```
GET /api/dashboard/category-breakdown?month=4&year=2026
Authorization: Bearer <token>
```
**Response:**
```json
{
  "success": true,
  "data": {
    "month": 4,
    "year": 2026,
    "grandTotal": 16550,
    "categories": [
      {
        "category": "Shopping",
        "totalAmount": 6500,
        "count": 2,
        "averageAmount": 3250,
        "percentage": 39.27
      },
      ...
    ]
  }
}
```

#### Daily Spending Trend
```
GET /api/dashboard/daily-trend?month=4&year=2026
Authorization: Bearer <token>
```

---

### 🏥 Health Check

```
GET /                    # API info & version
GET /api/health          # Health status with uptime
GET /api/docs            # Interactive API documentation
```

---

## Security Features

| Feature | Implementation |
|---------|---------------|
| **Password Hashing** | bcrypt with 12 salt rounds |
| **JWT Authentication** | Bearer token in Authorization header |
| **Input Validation** | express-validator on all endpoints |
| **Rate Limiting** | 100 req/15min (general), 20 req/15min (auth) |
| **Security Headers** | helmet middleware |
| **CORS** | Configurable origins |
| **Request Size Limit** | 10kb max body size |
| **Error Masking** | Stack traces only in development mode |

---

## Firebase Configuration

| Property | Value |
|----------|-------|
| **Project ID** | `expense-tracker-app-e4a97` |
| **App ID** | `1:945708918818:web:9da1504cbe1d87632e027b` |
| **Auth Domain** | `expense-tracker-app-e4a97.firebaseapp.com` |
| **API Key** | `AIzaSyDwyGXj1c4pxMOn6mThFBp-6VsjkRev5po` |
| **Messaging Sender ID** | `945708918818` |
| **Measurement ID** | `G-PBVCD0FDLB` |

**Firebase Features Enabled:**
- ✅ Firebase Authentication (Email/Password, Anonymous)
- ✅ Firebase Hosting

---

## Getting Started

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and set your values.

### 3. Seed Database (Optional)
```bash
npm run seed
```
Test credentials: `test@example.com` / `password123`

### 4. Start Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

### 5. Test API
```bash
# Health check
curl http://localhost:5000

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"123456"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

---

## Error Response Format

All error responses follow this format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Internal Server Error |
