# 🛠️ Tech Stack — Pin-a-Tree

This document outlines the full technology stack for **Pin-a-Tree**, a modern, accessible web app that allows users to upload and pin photos of trees on a map. The stack is built with modularity, accessibility, and AI-assisted development in mind.

---

## 🧩 Architecture Overview

The application is built with a **strict separation between frontend and backend**. All frontend interactions are handled through API contracts. The app is designed to work in both development and production environments using either mock or live backend services.

---

## 🌐 Frontend

| Layer          | Technology           | Notes |
|----------------|----------------------|-------|
| Framework      | **Vue 3**            | Using `<script setup>` + Composition API |
| Build Tool     | **Vite**             | Fast builds and HMR |
| State Mgmt     | **Pinia**            | Modular and reactive store structure |
| UI Components  | **Custom-built**     | No UI libraries (like Vuetify or Tailwind). All components written from scratch |
| Component Dev  | **Storybook (latest)** | Isolated development and documentation of base components like `Button.vue`, `Dialog.vue` |
| Accessibility  | **WAI-ARIA Patterns** | Every UI component must follow official [WAI-ARIA APG patterns](https://www.w3.org/WAI/ARIA/apg/patterns/) |
| Map Integration| **Google Maps JS API** | Used to pin geolocated trees on an interactive map |
| EXIF Data      | **exifr** or similar | To extract geolocation metadata from uploaded photos |
| Testing        | **Vitest + Testing Library** | Unit and component-level tests |
| Linting/Format | **ESLint + Prettier** | Code quality and formatting consistency |

---

## 🔧 Backend (Replaceable API Layer)

| Layer        | MVP Option               | Scalable Option          |
|--------------|--------------------------|--------------------------|
| Hosting      | **Firebase**             | Supabase / Node + DB     |
| Auth         | **Firebase Auth**        | Auth.js / Clerk          |
| Database     | **Firestore (NoSQL)**    | PostgreSQL               |
| File Storage | **Firebase Storage**     | AWS S3 or equivalent     |
| API Layer    | **Cloud Functions / RPC**| REST or GraphQL          |
| Geolocation  | **EXIF + Google Maps API** | GPS fallback optional    |

> Backend is API-first. Frontend never directly accesses any backend SDK or service.

---

## ♿ Accessibility & UI Patterns

All base UI components follow the [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/). Accessibility is a first-class concern from the start.

| Component     | ARIA Pattern         |
|---------------|----------------------|
| `Button.vue`  | [Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/) |
| `Dialog.vue`  | [Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) |
| `Listbox.vue` | [Listbox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/) |
| `Checkbox.vue`| [Checkbox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/) |

> ✅ All components must:
> - Be fully keyboard navigable  
> - Use semantic HTML and ARIA roles  
> - Follow WAI-ARIA interaction guidelines

Testing tools:
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [Lighthouse Accessibility Audit](https://developers.google.com/web/tools/lighthouse)
- Manual keyboard navigation

---

## 🎯 Development Principles

- ⚙️ **Modular Architecture**: Clear separation of views, components, stores, and services
- 🧱 **Component-First**: All base components are isolated and reusable
- 🔁 **Mock-Friendly**: Frontend development can proceed independently of live backend
- 🧠 **AI-Compatible**: Cursor and other agents use `context-rules/` to follow strict coding, naming, and file placement conventions

---

## 📁 Related Files

- [`product.md`](./product.md) – Product vision, features, and user types
- [`context-rules/`](./context-rules/) – Context engineering rules for Cursor/AI
- [`README.md`](../README.md) – App overview and setup instructions
