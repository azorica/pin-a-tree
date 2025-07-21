# 🏗️ Architecture — Pin-a-Tree

## Overview

Pin-a-Tree follows a modular, scalable architecture with a clean separation between frontend and backend. The design ensures frontend independence, accessibility, and ease of AI-assisted development.

---

## Folder Structure

/src/
├── assets/ # Images, icons, fonts, static resources
├── components/ # Base reusable Vue components (Button, Dialog, etc.)
├── views/ # Pages or route-level components
├── composables/ # Reusable Vue Composition API functions
├── stores/ # Pinia stores for state management
├── services/ # API clients, EXIF extraction, geolocation, auth
├── router/ # Vue Router config and routes
├── styles/ # Global and component styles (SCSS)
└── utils/ # Helper functions and utilities


---

## State Management

- Using **Pinia** for reactive, modular stores  
- Stores organized by domain (e.g., `treeStore`, `userStore`)  
- Prefer Composition API + `defineStore` syntax  
- State changes triggered by UI actions or API results  
- Support for mock stores during frontend-only development

---

## API and Backend Integration

- Backend exposes a **RESTful or GraphQL API** (TBD)  
- Frontend interacts exclusively via API clients in `/services`  
- Services include: tree CRUD, user auth, image upload, geolocation  
- Coordinates extracted from photo EXIF or user input  
- Google Maps API used for map rendering and pinning

---

## Component Design

- Base components live in `/components` and follow [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/)  
- Components are isolated, testable, and documented via Storybook  
- Use scoped styles and CSS variables for theming  
- Avoid 3rd-party UI frameworks — build custom UI primitives  
- Components communicate via props and events; no global state coupling

---

## Routing

- Vue Router manages navigation between views:  
  - Home / Map view  
  - Tree detail / upload form  
  - User profile (future)  
- Route guards handle auth requirements (planned)

---

## Testing Strategy

- Unit tests with **Vitest** and **Vue Testing Library**  
- Accessibility tests using axe DevTools  
- Storybook for visual regression and component documentation

---

## Development Workflow

- Use **Vite** for fast builds and HMR  
- Linting & formatting enforced with ESLint and Prettier  
- Mock backend APIs during frontend-only development  
- Cursor AI prompts leverage context rules to maintain consistency

---

## Scalability Considerations

- Modular stores and services enable easy feature expansion  
- Abstract backend interactions to allow swapping APIs or services  
- Plan for internationalization (i18n) and theming in styles

---

## Related Documents

- [`tech-stack.md`](./tech-stack.md) — Tech and tooling details  
- [`constraints.md`](./constraints.md) — Code style, naming, and best practices  
- [`product.md`](./product.md) — Product overview and user types

