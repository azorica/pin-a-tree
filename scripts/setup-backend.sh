#!/bin/bash

# Pin-a-Tree Backend Setup Script
# This script sets up the Node.js backend for the Pin-a-Tree application

echo "🌳 Setting up Pin-a-Tree Backend..."

# Create backend directory structure
mkdir -p backend/src/{controllers,services,models,middleware,routes,utils,config,types}
mkdir -p backend/prisma
mkdir -p backend/uploads

cd backend

# Initialize package.json
cat > package.json << 'EOF'
{
  "name": "pin-a-tree-backend",
  "version": "1.0.0",
  "description": "Backend API for Pin-a-Tree application",
  "main": "dist/index.js",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:reset": "prisma migrate reset",
    "db:studio": "prisma studio"
  },
  "keywords": ["trees", "map", "api", "backend"],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "@prisma/client": "^5.6.0",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "multer": "^1.4.5-lts.1",
    "sharp": "^0.32.6",
    "exif-reader": "^2.0.2",
    "joi": "^17.11.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.5",
    "@types/multer": "^1.4.11",
    "@types/node": "^20.9.0",
    "@types/jest": "^29.5.8",
    "typescript": "^5.2.2",
    "tsx": "^4.4.0",
    "jest": "^29.7.0",
    "ts-jest": "^29.1.1",
    "prisma": "^5.6.0"
  }
}
EOF

# Create TypeScript config
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
EOF

# Create Prisma schema
cat > prisma/schema.prisma << 'EOF'
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

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
  id          String     @id @default(cuid())
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
  user        User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  
  @@map("trees")
}

enum TreeStatus {
  HEALTHY
  FLOWERING
  DISEASED
  DEAD
}
EOF

# Create basic Express server
cat > src/index.ts << 'EOF'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

// Import routes
import authRoutes from './routes/auth'
import treeRoutes from './routes/trees'
import uploadRoutes from './routes/upload'

// Load environment variables
dotenv.config()

const app = express()
const prisma = new PrismaClient()
const PORT = process.env.PORT || 3001

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/trees', treeRoutes)
app.use('/api/upload', uploadRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

// Start server
app.listen(PORT, () => {
  console.log(`🌳 Pin-a-Tree Backend running on port ${PORT}`)
})

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...')
  await prisma.$disconnect()
  process.exit(0)
})
EOF

# Create environment file template
cat > .env.example << 'EOF'
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/pin_a_tree"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"

# File Upload
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE="5242880" # 5MB

# AWS S3 (Optional)
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_BUCKET_NAME=""
AWS_REGION=""
EOF

# Create basic middleware
cat > src/middleware/auth.ts << 'EOF'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface JWTPayload {
  userId: string
  email: string
}

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }
  
  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' })
    }
    req.user = user as JWTPayload
    next()
  })
}
EOF

# Create basic routes structure
mkdir -p src/routes

cat > src/routes/auth.ts << 'EOF'
import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, username, password, firstName, lastName } = req.body
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        firstName,
        lastName
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        createdAt: true
      }
    })
    
    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )
    
    res.status(201).json({ user, token })
  } catch (error) {
    res.status(400).json({ error: 'Registration failed' })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    
    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )
    
    const userResponse = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      createdAt: user.createdAt
    }
    
    res.json({ user: userResponse, token })
  } catch (error) {
    res.status(400).json({ error: 'Login failed' })
  }
})

export default router
EOF

cat > src/routes/trees.ts << 'EOF'
import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authenticateToken } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

// Get all trees
router.get('/', async (req, res) => {
  try {
    const trees = await prisma.tree.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    res.json(trees)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trees' })
  }
})

// Create tree (protected)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, species, description, datePlanted, latitude, longitude, address, imageUrl, tags } = req.body
    
    const tree = await prisma.tree.create({
      data: {
        name,
        species,
        description,
        datePlanted: datePlanted ? new Date(datePlanted) : null,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        address,
        imageUrl,
        tags: tags || [],
        userId: req.user!.userId
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true
          }
        }
      }
    })
    
    res.status(201).json(tree)
  } catch (error) {
    res.status(400).json({ error: 'Failed to create tree' })
  }
})

export default router
EOF

cat > src/routes/upload.ts << 'EOF'
import { Router } from 'express'
import multer from 'multer'
import sharp from 'sharp'
import path from 'path'
import { authenticateToken } from '../middleware/auth'

const router = Router()

// Configure multer for file upload
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880') // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  }
})

// Upload image
router.post('/image', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' })
    }
    
    // Generate unique filename
    const filename = `tree-${Date.now()}-${Math.round(Math.random() * 1E9)}.jpg`
    const filepath = path.join(process.env.UPLOAD_DIR || './uploads', filename)
    
    // Process image with sharp (resize, optimize)
    await sharp(req.file.buffer)
      .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(filepath)
    
    // Return the file URL
    const imageUrl = `/uploads/${filename}`
    res.json({ imageUrl, filename })
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload image' })
  }
})

export default router
EOF

# Create docker-compose for development
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: pin_a_tree
      POSTGRES_PASSWORD: password
      POSTGRES_DB: pin_a_tree
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
EOF

# Create README
cat > README.md << 'EOF'
# Pin-a-Tree Backend

Node.js + Express + TypeScript + Prisma backend for the Pin-a-Tree application.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Start PostgreSQL (using Docker):**
   ```bash
   docker-compose up -d postgres
   ```

4. **Run database migrations:**
   ```bash
   npm run db:push
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Trees
- `GET /api/trees` - Get all trees
- `POST /api/trees` - Create new tree (auth required)

### Upload
- `POST /api/upload/image` - Upload tree image (auth required)

## Database Commands

- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and run migration
- `npm run db:studio` - Open Prisma Studio
EOF

echo "✅ Backend structure created!"
echo ""
echo "Next steps:"
echo "1. cd backend"
echo "2. npm install"
echo "3. cp .env.example .env"
echo "4. Edit .env with your database settings"
echo "5. docker-compose up -d postgres"
echo "6. npm run db:push"
echo "7. npm run dev"
echo ""
echo "🌳 Happy coding!"
