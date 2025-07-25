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
- OpenStreetMap with Leaflet used for map rendering and pinning

---

## 🧪 Mock Backend Data & Axios Usage

### Mock Backend Data (Development Only)

- Until the backend/API is implemented, all frontend API calls (e.g., via Axios) will return mock JSON data.
- Mock data should be stored in `/src/mocks/` as JS/JSON files.
- API client modules in `/src/services/` are responsible for fetching mock data and updating Pinia stores accordingly.
- This approach allows frontend development and UI testing to proceed independently of backend progress.
- When the real backend/API is ready, update the service modules to point to the live endpoints.
- All mock endpoints and data structures should match the planned API contract as closely as possible.
- **When generating new features, services, or entities, always create or update corresponding mock data files in `/src/mocks/`. Each new API endpoint or data model must have a representative mock data file, which should be used by the service layer until the real backend is available.**

### Axios Usage Rules

- Use [axios](https://github.com/axios/axios) for all HTTP requests in the frontend.
- All axios logic must be encapsulated in service modules under `/src/services/`.
- Do not call axios directly from components or Pinia stores.
- Always handle errors gracefully and provide meaningful error messages.
- Use async/await syntax for clarity.
- When using mock data, replace axios calls with local imports or fetches from `/src/mocks/`.
- Document all service functions with JSDoc comments, including expected input/output and error cases.

#### Example: Service Using Axios with Mock Fallback

```js
// src/services/treeService.js
import axios from 'axios';
// For mock data
import mockTrees from '@/mocks/trees.json';

export async function fetchTrees(useMock = false) {
  if (useMock) {
    // Simulate async fetch
    return Promise.resolve(mockTrees);
  }
  try {
    const response = await axios.get('/api/trees');
    return response.data;
  } catch (error) {
    // Handle error (log, rethrow, or return fallback)
    throw new Error('Failed to fetch trees: ' + error.message);
  }
}
```

- Pinia stores should call these service functions to update state.
- When switching to the real backend, set `useMock` to `false` or remove the mock logic.

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

