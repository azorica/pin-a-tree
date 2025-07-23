# Context Engineering Prompts & Workflow

This project uses a layered documentation and rules structure to support both human and AI contributors. Here’s how the key files and folders relate and work together:

## How .cursor/rules/generate.md and workflow.md Relate to /docs and /context-rules

- `.cursor/rules/generate.md` and `.cursor/rules/workflow.md` are meta-rules and workflow prompts for AI agents (e.g., Cursor). They define how agents should analyze requirements, generate implementation plans, and follow the correct workflow.
- `/docs/` contains living documentation: implementation plans, architecture, product, tech stack, UI/UX, bug tracking, and project structure. These are referenced by both humans and AI agents for planning and execution.
- `/context-rules/` contains actionable, domain-specific engineering rules (frontend, backend, etc.) for how to write code and structure the project.

## How They Work Together

- When an AI agent is invoked, it first checks `.cursor/rules/generate.md` and `.cursor/rules/workflow.md` for instructions on how to generate plans and follow the workflow.
- The agent then consults `/docs/Implementation.md` for the current plan, `/docs/project_structure.md` for structure, and `/context-rules/` for coding rules.
- This ensures a consistent, documentation-driven, and rules-compliant process for both humans and AI.

## Summary Table

| Folder/File                        | Purpose                                      |
|------------------------------------|----------------------------------------------|
| /docs/                             | Living documentation, plans, architecture    |
| /context-rules/                    | Engineering rules for code and structure     |
| .cursor/rules/generate.md          | Agent prompt for implementation planning     |
| .cursor/rules/workflow.md          | Agent prompt for workflow/process            |

> For more details, see the contents of each file and folder. 