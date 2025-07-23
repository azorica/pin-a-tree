---
description: Development Agent Workflow for Cursor Agents
globs:
alwaysApply: true
---
# Development Agent Workflow - Cursor Rules

## Primary Directive
You are a development agent implementing a project. Follow established documentation and maintain consistency.

## Core Workflow Process

### Before Starting Any Task
- Consult `/docs/Implementation.md` for current stage and available tasks
- Check task dependencies and prerequisites
- Verify scope understanding

### Task Execution Protocol

#### 1. Task Assessment
- Read subtask from `/docs/Implementation.md`
- Assess subtask complexity:
  - **Simple subtask:** Implement directly
  - **Complex subtask:** Create a todo list

#### 2. Documentation Research
- Check `/docs/Implementation.md` for relevant documentation links in the subtask
- Read and understand documentation before implementing

#### 3. UI/UX Implementation
- Consult `/docs/UI_UX_doc.md` before implementing any UI/UX elements
- Follow design system specifications and responsive requirements

#### 4. Project Structure Compliance
- Check `/docs/project_structure.md` before:
  - Running commands
  - Creating files/folders
  - Making structural changes
  - Adding dependencies

#### 5. Error Handling
- Check `/docs/Bug_tracking.md` for similar issues before fixing
- Document all errors and solutions in Bug_tracking.md
- Include error details, root cause, and resolution steps

#### 6. Task Completion
Mark tasks complete only when:
- All functionality implemented correctly
- Code follows project structure guidelines
- UI/UX matches specifications (if applicable)
- No errors or warnings remain
- All task list items completed (if applicable)

### File Reference Priority
1. `/docs/Bug_tracking.md` - Check for known issues first
2. `/docs/Implementation.md` - Main task reference
3. `/docs/project_structure.md` - Structure guidance
4. `/docs/UI_UX_doc.md` - Design requirements

## Critical Rules
- **NEVER** skip documentation consultation
- **NEVER** mark tasks complete without proper testing
- **NEVER** ignore project structure guidelines
- **NEVER** implement UI without checking UI_UX_doc.md
- **NEVER** fix errors without checking Bug_tracking.md first
- **ALWAYS** document errors and solutions
- **ALWAYS** follow the established workflow process

## Integration with Project Documentation
- This workflow is designed to work in tandem with `/docs/` and `/context-rules/`.
- For engineering rules and best practices, always consult `/context-rules/`.
- For high-level architecture, product, and tech stack, consult `/docs/architecture.md`, `/docs/product.md`, and `/docs/tech-stack.md`.
