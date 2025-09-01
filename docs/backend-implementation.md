# 🔧 Backend Implementation Plan — Pin-a-Tree

## 🎯 Backend Architecture Options

### Option 1: Node.js + Express/Fastify (Recommended)
**Best for:** Full control, TypeScript compatibility, easy integration with Vue frontend

#### Tech Stack:
- **Runtime:** Node.js 18+
- **Framework:** Express.js or Fastify
- **Language:** TypeScript
- **Database:** PostgreSQL + Prisma ORM
- **Authentication:** JWT + bcrypt or Auth.js
- **File Upload:** Multer + AWS S3/MinIO
- **API:** RESTful API
- **Testing:** Jest/Vitest
- **Deployment:** Docker + Railway/Render/Vercel

#### Project Structure:
```
backend/
├── src/
│   ├── controllers/     # Route handlers
│   ├── services/        # Business logic
│   ├── models/          # Prisma schema
│   ├── middleware/      # Auth, validation, etc.
│   ├── routes/          # API route definitions
│   ├── utils/           # Helper functions
│   ├── config/          # Database, env config
│   └── types/           # TypeScript definitions
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── migrations/      # Database migrations
├── uploads/             # Local file storage (dev)
├── docker-compose.yml   # Local development
└── package.json
```

---

### Option 2: Supabase (Fastest MVP)
**Best for:** Rapid prototyping, built-in auth, real-time features

#### Features:
- **Database:** PostgreSQL with auto-generated APIs
- **Authentication:** Built-in auth with social providers
- **Storage:** Built-in file storage
- **Real-time:** WebSocket subscriptions
- **Edge Functions:** Serverless functions

---

### Option 3: Firebase (Google Ecosystem)
**Best for:** Quick setup, real-time database, Google integrations

#### Features:
- **Database:** Firestore NoSQL
- **Authentication:** Firebase Auth
- **Storage:** Firebase Storage
- **Functions:** Cloud Functions
- **Hosting:** Firebase Hosting

---

## 🏗️ Recommended Implementation: Node.js Backend

### Database Schema (Prisma)

```prisma
// prisma/schema.prisma
model User {
  id          String   @id @default(cuid())
  email       String   @unique
  username    String   @unique
  firstName   String?
  lastName    String?
  avatar      String?
  password    String
  isVerified  Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  trees       Tree[]
  @@map("users")
}

model Tree {
  id          String   @id @default(cuid())
  name        String
  species     String?
  description String?
  datePlanted DateTime?
  latitude    Float
  longitude   Float
  address     String?
  imageUrl    String
  imageAlt    String?
  status      TreeStatus @default(HEALTHY)
  tags        String[]
  
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("trees")
}

enum TreeStatus {
  HEALTHY
  FLOWERING
  DISEASED
  DEAD
}
```

### API Endpoints

```typescript
// Authentication
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/me

// Trees
GET    /api/trees           # Get all trees (with pagination)
GET    /api/trees/:id       # Get single tree
POST   /api/trees           # Create new tree
PUT    /api/trees/:id       # Update tree
DELETE /api/trees/:id       # Delete tree
GET    /api/trees/user/:id  # Get user's trees

// Users
GET    /api/users/profile   # Get current user profile
PUT    /api/users/profile   # Update profile
POST   /api/users/avatar    # Upload avatar

// File Upload
POST   /api/upload/image    # Upload tree image
```

### Authentication Flow

```typescript
// middleware/auth.ts
import jwt from 'jsonwebtoken'

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }
  
  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' })
    req.user = user
    next()
  })
}
```

---

## 🚀 Implementation Phases

### Phase 1: Backend Foundation (Week 1)
- [ ] Set up Node.js + TypeScript project
- [ ] Configure Prisma + PostgreSQL
- [ ] Implement user authentication (JWT)
- [ ] Create basic API structure
- [ ] Set up development environment

### Phase 2: Core APIs (Week 2)
- [ ] Implement Tree CRUD operations
- [ ] Add file upload functionality
- [ ] Integrate EXIF data extraction on backend
- [ ] Add input validation and error handling
- [ ] Write API tests

### Phase 3: Integration (Week 3)
- [ ] Update frontend services to use real APIs
- [ ] Replace mock data with API calls
- [ ] Add loading states and error handling
- [ ] Implement authentication in frontend
- [ ] Test full-stack functionality

### Phase 4: Deployment (Week 4)
- [ ] Set up production database
- [ ] Configure file storage (S3/MinIO)
- [ ] Deploy backend to cloud service
- [ ] Update frontend API URLs
- [ ] Set up monitoring and logging

---

## 🔄 Frontend Integration Changes

### Update API Services

```typescript
// src/services/api.ts
import axios from 'axios'

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3001/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// Add auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### Update Tree Service

```typescript
// src/services/treeService.ts
import { api } from './api'

export const treeService = {
  async getAllTrees() {
    const response = await api.get('/trees')
    return response.data
  },
  
  async createTree(treeData: CreateTreeDto) {
    const response = await api.post('/trees', treeData)
    return response.data
  },
  
  async uploadImage(file: File) {
    const formData = new FormData()
    formData.append('image', file)
    
    const response = await api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  }
}
```

---

## 🎯 Next Steps

1. **Choose your preferred option** (I recommend Node.js for full control)
2. **Set up the backend project structure**
3. **Implement authentication first**
4. **Create database schema and migrations**
5. **Build APIs incrementally**
6. **Update frontend to use real APIs**

Would you like me to help implement any specific part of this backend architecture?
