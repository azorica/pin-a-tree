# Product Requirements Document (PRD) — Pin-a-Tree

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
  The tree appears on a collaborative interactive map (Leaflet) with your photo and data.
- **View Others’ Trees**  
  Browse trees pinned by other users and explore a global map of green activity.

---

## 🎯 Target Audience

- Eco-conscious individuals
- Schools & environmental educators
- Community tree-planting initiatives
- NGOs and sustainability programs

---

## 🧰 Tech Stack (Summary)

- **Frontend**: Vue 3 + Vite + Composition API + Pinia
- **Map**: Leaflet + OpenStreetMap
- **Image Handling**: EXIF data extraction
- **Backend**: To be determined (e.g. Firebase, Supabase, or Node backend)

---

## 🔍 Next Steps

- Define required tree metadata
- Define folder & component structure
- Define context constraints
- Define feature prompts

---

> For detailed requirements, architecture, implementation plans, and UI/UX guidelines, see the `/docs/` folder—especially:
>
> - `/docs/Implementation.md` for the staged implementation plan
> - `/docs/architecture.md` for system architecture and folder structure
> - `/docs/UI_UX_doc.md` for design system and user flows
> - `/docs/tech-stack.md` for technology choices
> - `/docs/project_structure.md` for the current file/folder map
>   For engineering rules and best practices, see the `/context-rules/` folder.
>   For AI agent prompts, automated planning, and workflow rules, see:
> - `.cursor/rules/generate.md` — Implementation plan generation prompt
> - `.cursor/rules/workflow.md` — Development agent workflow and process

---

## How to Generate the Pin-a-Tree App: Step-by-Step Process

This section describes the detailed, step-by-step process for generating the Pin-a-Tree app from scratch, ensuring all documentation, rules, and best practices are followed. This process is designed for both AI agents and human contributors.

### 1. Entry Point: PRD

- Start by reading this PRD (`/docs/PRD.md`) to understand the product vision, user stories, features, and high-level requirements.

### 2. Discover Documentation Structure

- Note the existence of `/docs/` for detailed requirements, `/context-rules/` for engineering rules, and `.cursor/rules/` for agent prompts and workflow.

### 3. Product Vision & Requirements

- Deepen understanding by reviewing `/docs/product.md` for value proposition, user types, use cases, and roadmap.

### 4. Implementation Plan

- Read `/docs/Implementation.md` for the actionable, staged plan for building the MVP (and beyond), including initial setup, feature breakdown, and resource links.

### 5. Architecture

- Consult `/docs/architecture.md` for intended folder structure, state management, API integration, and mock data rules.

### 6. Tech Stack

- Review `/docs/tech-stack.md` for frameworks, libraries, and tools to use for frontend, backend (post-MVP), and testing.

### 7. Project Structure

- Reference `/docs/project_structure.md` for a concrete, up-to-date map of the actual codebase structure. Ensure all generated files and folders match this structure.

### 8. UI/UX Design System

- Follow `/docs/UI_UX_doc.md` for branding, color palette, typography, layout, component guidelines, accessibility, and user flows. Generate UI components, styles, and layouts that match the design system and user experience requirements.

### 9. Engineering Rules & Best Practices

- Apply all rules in `/context-rules/frontend/` (best-practices.md, style-guide.md, vue.md, pinia.md, ai-colaboration.md) for coding standards, style conventions, state management, and AI collaboration.

### 10. AI/Agent Prompts & Workflow

- If using AI agents, follow `.cursor/rules/generate.md` for implementation plan generation and `.cursor/rules/workflow.md` for the development workflow. These files ensure context-driven, rules-compliant, and automated project generation.

### 11. Bug Tracking

- Log and resolve any issues in `/docs/Bug_tracking.md` as the project evolves.

### 12. Continuous Documentation

- As you build, keep all documentation up to date, especially `/docs/Implementation.md`, `/docs/project_structure.md`, and `/docs/Bug_tracking.md`.

---

**By following this process, you ensure a consistent, high-quality, and context-driven build for the Pin-a-Tree app, whether you are a human contributor or an AI agent.**
