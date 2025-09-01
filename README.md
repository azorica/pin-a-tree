# 🌳 Pin-a-Tree

> **A Full-Stack Web Application for Creating a Digital Forest Map**
>
> Pin-a-Tree enables users to upload tree photos, share their planting stories, and create a collaborative map of environmental impact. Currently featuring complete user authentication, tree management, and an interactive map interface.

## 🚀 Current Status: **Production Ready Alpha**

The Pin-a-Tree application is fully functional with both frontend and backend implemented. Users can register, login, add trees with photos and location data, and view all trees on an interactive map.

### ✅ Implemented Features

- **User Authentication & Authorization**
  - User registration and login
  - JWT-based authentication
  - Protected routes and API endpoints
  - Persistent login sessions

- **Tree Management**
  - Upload tree photos with EXIF data extraction
  - Add tree metadata (species, planting date, description)
  - Automatic and manual location pinning
  - View personal and community trees

- **Interactive Mapping**
  - Leaflet-powered map interface
  - Tree location markers with popup details
  - Real-time tree display from database
  - Mobile-responsive map controls

- **Full-Stack Architecture**
  - RESTful API with proper error handling
  - PostgreSQL database with Prisma ORM
  - Image upload and processing
  - CORS-enabled cross-origin requests

---

## 🛠️ Tech Stack (Implemented)

### Frontend
- **Vue 3** with Composition API
- **Vite** for fast development and building
- **Pinia** for state management
- **Vue Router** for navigation and route guards
- **Leaflet** for interactive maps
- **Axios** for HTTP requests
- **SASS/SCSS** with BEM methodology

### Backend
- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **Prisma ORM** with PostgreSQL database
- **JWT** for authentication
- **Multer** for file uploads
- **Sharp** for image processing
- **Joi** for request validation

### DevOps & Tools
- **PostgreSQL** database
- **Docker** support (configured)
- **Environment variables** for configuration
- **TSX** for TypeScript execution

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/azorica/pin-a-tree.git
   cd pin-a-tree
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Set up the database**
   ```bash
   # Create .env file in backend directory
   cp .env.example .env
   
   # Edit .env with your database credentials
   # DATABASE_URL="postgresql://username:password@localhost:5432/pin_a_tree"
   # JWT_SECRET="your-secret-key"
   
   # Generate Prisma client and push schema
   npm run db:generate
   npm run db:push
   ```

5. **Start the development servers**
   
   **Backend** (in `backend/` directory):
   ```bash
   npm run dev
   # Server runs on http://localhost:3001
   ```
   
   **Frontend** (in root directory):
   ```bash
   npm run dev
   # App runs on http://localhost:5173
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001/api
   - API Health Check: http://localhost:3001/api/health

---

## 📁 Project Structure

```
pin-a-tree/
├── src/                      # Frontend Vue.js application
│   ├── components/           # Reusable Vue components
│   ├── views/               # Page components
│   ├── stores/              # Pinia state management
│   ├── services/            # API service functions
│   ├── router/              # Vue Router configuration
│   ├── styles/              # SCSS stylesheets
│   └── composables/         # Vue composition functions
├── backend/                 # Node.js backend API
│   ├── src/                 # TypeScript source code
│   │   ├── routes/          # API route handlers
│   │   ├── middleware/      # Express middleware
│   │   └── index.ts         # Main server file
│   ├── prisma/              # Database schema and migrations
│   └── uploads/             # File upload storage
├── docs/                    # Project documentation
├── context-rules/           # Development guidelines
├── public/                  # Static frontend assets
└── scripts/                 # Setup and utility scripts
```

---

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Trees
- `GET /api/trees` - Get all trees
- `POST /api/trees` - Create new tree (protected)
- `GET /api/trees/:id` - Get specific tree
- `PUT /api/trees/:id` - Update tree (protected)
- `DELETE /api/trees/:id` - Delete tree (protected)

### Utility
- `GET /api/health` - Health check endpoint
- `POST /api/upload` - Upload tree image (protected)

---

## 🎨 Design System

The application follows a comprehensive design system with:

- **Color Palette**: Green-focused environmental theme
- **Typography**: Inter and Poppins font families
- **Components**: Accessible, reusable UI components
- **Layout**: Responsive design with mobile-first approach
- **Navigation**: Intuitive user flows with proper routing

See [`/docs/UI_UX_doc.md`](./docs/UI_UX_doc.md) for complete design specifications.

---

## 📖 Documentation

### Core Documentation
- [`/docs/PRD.md`](./docs/PRD.md) — Product Requirements Document
- [`/docs/Implementation.md`](./docs/Implementation.md) — Implementation roadmap
- [`/docs/architecture.md`](./docs/architecture.md) — System architecture
- [`/docs/tech-stack.md`](./docs/tech-stack.md) — Technology decisions
- [`/docs/UI_UX_doc.md`](./docs/UI_UX_doc.md) — Design system
- [`/docs/Bug_tracking.md`](./docs/Bug_tracking.md) — Known issues and fixes

### Development Guidelines
- [`/context-rules/`](./context-rules/) — Code standards and best practices
- [`/docs/frontend-integration.md`](./docs/frontend-integration.md) — Frontend/backend integration
- [`/docs/backend-implementation.md`](./docs/backend-implementation.md) — Backend architecture

---

## 🌱 Contributing

1. **Fork the repository**
2. **Read the documentation** in `/docs/` and `/context-rules/`
3. **Follow the style guide** and coding standards
4. **Create feature branches** from `main`
5. **Write tests** for new functionality
6. **Submit pull requests** with detailed descriptions

---

## 🔮 Roadmap

### Completed ✅
- User authentication and authorization
- Tree CRUD operations with image upload
- Interactive map with tree markers
- Responsive UI with modern design
- RESTful API with proper error handling
- Database schema and ORM integration

### Next Phase 🚧
- Enhanced tree filtering and search
- User profiles and statistics
- Tree achievement system
- Social features and tree sharing
- Advanced map features (clustering, filters)
- Mobile app development
- Performance optimizations

### Future Vision 🌟
- Community challenges and events
- Environmental impact metrics
- Integration with tree-planting organizations
- Geolocation-based tree recommendations
- AI-powered tree species identification

---

## 🤝 Support

For questions, bug reports, or feature requests:

- **Issues**: Use GitHub Issues for bug reports
- **Documentation**: Check `/docs/` for detailed guides
- **Code Standards**: Review `/context-rules/` for guidelines

---

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

---

**🌳 Join us in creating a digital forest that celebrates environmental action! 🌍**

## Quickstart for Contributors

1. **Read this README for repo info and onboarding.**
2. **Start with [`/docs/PRD.md`](./docs/PRD.md) for product requirements and project generation.**
3. **Review `/docs/` for detailed requirements, architecture, and plans.**
4. **Check `/context-rules/` for coding standards and best practices.**
5. **If using AI agents, follow the prompts and workflow in `.cursor/rules/`.**
6. **See `/docs/Bug_tracking.md` for known issues and bug reporting.**

---

## How to Generate the Project from the PRD

To generate the project from scratch, an AI agent (or a well-trained human) should:

1. **Read `/docs/PRD.md`** for the product vision, user stories, and high-level requirements.
2. **Consult `/docs/Implementation.md`** for the staged implementation plan and initial setup.
3. **Review `/docs/architecture.md`** for the intended folder structure, state management, and integration rules.
4. **Check `/docs/tech-stack.md`** for the frameworks, libraries, and tools to use.
5. **Reference `/docs/project_structure.md`** for the up-to-date file/folder map.
6. **Follow `/docs/UI_UX_doc.md`** for design system, branding, and user flows.
7. **Apply all rules in `/context-rules/`** for code style, best practices, and AI collaboration.
8. **Use `.cursor/rules/`** for agent prompts and workflow.
9. **Log and resolve bugs in `/docs/Bug_tracking.md`** as the project evolves.

This ensures a consistent, context-driven, and high-quality build process for both humans and AI.

---

## 🌱 Purpose

The goal of Pin-a-Tree is to create a digital forest — a living, growing map that celebrates the positive environmental actions of individuals and communities. It promotes environmental education, community engagement, and a sense of connection to nature.

---

## 📸 What Users Can Do

- **Upload a Tree Photo**  
  Take or upload a photo of a tree you planted or admire.

- **Provide Tree Info**  
  Add basic details (e.g. tree name, species, date planted — more TBA).

- **Auto-detect Location**  
  The app extracts the GPS coordinates from the photo’s metadata (EXIF). If missing, users can manually pin the location.

- **Pin to Map**  
  The tree appears on a collaborative Google Map with your photo and data.

- **View Others’ Trees**  
  Browse trees pinned by other users and explore a global map of green activity.

---

## 🎯 Target Audience

- Eco-conscious individuals
- Schools & environmental educators
- Community tree-planting initiatives
- NGOs and sustainability programs

---

## 🧰 Tech Stack (Planned)

- **Frontend**: Vue 3 + Vite + Composition API + Pinia
- **Map**: Google Maps API
- **Image Handling**: EXIF data extraction
- **Backend**: To be determined (e.g. Firebase, Supabase, or Node backend)

---

## 🔍 Next Steps

We’ll define:
- Required tree metadata
- Folder & component structure
- Context constraints
- Feature prompts

Stay tuned 🍃
