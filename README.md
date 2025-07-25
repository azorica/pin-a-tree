# 🌳 Pin-a-Tree

> **Project Documentation & Onboarding**
>
> This README is the entry point for the repository and contributor onboarding.
> For the full Product Requirements Document (PRD) and as the main entry point for project generation, see [`/docs/PRD.md`](./docs/PRD.md).
>
> **Key Docs:**
> - `/docs/PRD.md` — Product Requirements Document (PRD)
> - `/docs/Implementation.md` — Implementation plan & staged tasks
> - `/docs/architecture.md` — System architecture
> - `/docs/tech-stack.md` — Tech stack & tooling
> - `/docs/UI_UX_doc.md` — UI/UX design system
> - `/docs/project_structure.md` — Project folder/file structure
> - `/docs/product.md` — Product vision & requirements
> - `/context-rules/` — Engineering rules & best practices
> - `.cursor/rules/` — AI agent prompts & workflow

> **AI Agent Autonomy Instruction:**
>
> 1. **Begin by thoroughly reading both `README.md` and `docs/PRD.md` to understand the product vision, requirements, and onboarding context.**
> 2. **Systematically follow and apply every referenced markdown file and context rule (including all files in `/docs/`, `/context-rules/`, and `.cursor/rules/`).**
> 3. **At each step, consult the relevant documentation before making decisions or generating code.**
> 4. **Do not ask the user for next steps or clarifications. Proactively determine and execute all required actions to build the Pin-a-Tree app from start to finish, strictly following the documented plans, architecture, and best practices.**
> 5. **Continue autonomously until the app is fully implemented according to all requirements and standards. Only stop if you encounter a critical blocker that cannot be resolved from the documentation.**
>
> _This instruction is intended for AI agents or automated systems tasked with generating or building the Pin-a-Tree application in a fully autonomous, context-driven manner._

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
  The app extracts the GPS coordinates from the photo's metadata (EXIF). If missing, users can manually pin the location.

- **Pin to Map**  
  The tree appears on a collaborative OpenStreetMap with your photo and data.

- **View Others' Trees**  
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
- **Map**: Leaflet + OpenStreetMap (free, no API key required)
- **Image Handling**: EXIF data extraction
- **Backend**: To be determined (e.g. Firebase, Supabase, or Node backend)

---

## 🔍 Next Steps

We'll define:
- Required tree metadata
- Folder & component structure
- Context constraints
- Feature prompts

Stay tuned 🍃
