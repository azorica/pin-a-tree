
# Pinia Usage Guidelines

This document outlines conventions and best practices for using Pinia within the **Pin-a-Tree** frontend codebase. These rules ensure clarity, maintainability, and alignment with the rest of our Vue architecture.

## ✅ Use Option Stores

Always use **Option Stores** instead of Setup Stores. They provide a clean and intuitive structure that fits well with the Vue Options API and simplifies onboarding for contributors.

```ts
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    name: 'Eduardo',
  }),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    },
  },
})
```

### 🔍 Structure Mapping

- `state`: store's reactive data  
- `getters`: computed properties based on state  
- `actions`: functions that modify the state (can be async)

---

## 📁 File Organization

- Place all stores inside: `src/stores/`  
- Each store should be in its own file, named using kebab-case, e.g. `tree-data-store.ts`  
- The store name (as passed to `defineStore`) must be globally unique.

```bash
src/
└── stores/
    ├── tree-data-store.ts
    └── user-auth-store.ts
```

---

## 🧩 Naming Conventions

- Prefix every store with `use`, e.g. `useTreeDataStore`  
- File name and function name should match  
- Avoid abbreviations or unclear names

✅ Correct:
```ts
export const useUserStore = defineStore('user', { ... })
```

🚫 Incorrect:
```ts
export const user = defineStore('user', { ... }) // unclear
```

---

## ♻️ SSR Compatibility

When using server-side rendering (SSR), ensure that your state is defined as a **function** to avoid sharing data across users:

```ts
state: () => ({
  count: 0
})
```

Do **not** define state as an object literal.

---

## 🛑 Avoid Direct Store Mutation Outside Actions

Only mutate store state inside defined `actions`. Never modify the state directly in components or views.

🚫 Avoid:
```ts
store.count++
```

✅ Do:
```ts
store.increment()
```

---

## 🧪 Testing

- Keep logic in `actions` so they can be easily unit tested  
- You can mock stores using Pinia’s testing utilities  

---

## 🤖 AI Agent Reminder

> **Important for All Developers and AI Agents:**
>
> - **Do not change the appearance, behavior, or logic of existing stores unless explicitly requested.**
> - **By default, only improve docstrings, section comments, and organization.**
> - **All AI-generated code must be reviewed for compliance with these conventions before being merged or committed.**
> - **If using Cursor or another AI agent, instruct it to follow the guidelines in this document.**

---

This document is part of the [`/context-rules/frontend/`] folder for the Pin-a-Tree application.
