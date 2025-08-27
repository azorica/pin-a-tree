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
