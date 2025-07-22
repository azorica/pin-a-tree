# AI Collaboration Guidelines (Pin-a-Tree)

These rules apply to all developers and AI agents (e.g. Cursor, GitHub Copilot, ChatGPT) working on the frontend codebase.

## General Responsibilities

- **Do not change the appearance, behavior, or styles of existing components unless explicitly requested.**
- By default, focus only on:
  - Improving comments and docstrings
  - Organizing and formatting code
  - Refactoring for clarity (when explicitly instructed)

## Review Process

- All AI-generated code must be reviewed before being merged or committed.
- Developers are responsible for ensuring generated code follows the standards in:
  - `best-practices.md`
  - `pinia.md`
  - `style-guide.md`
  - `vue.md`

## Using Cursor or Other AI Agents

When collaborating with Cursor or similar tools, it's sufficient to instruct the AI:

> “Follow all rules defined in /context-rules/frontend/ before making any changes.”

This ensures the agent works within the agreed-upon standards and does not introduce unintended behavior or style changes.

## Scope of Autonomy

AI agents may:
- Improve naming
- Clean up unused variables or imports
- Reorganize code structure without changing logic
- Add missing comments or documentation

AI agents may **not**:
- Redesign UI
- Change styles or colors
- Remove logic or handlers unless specifically requested

## What Counts as an Explicit Request?

Agents may make changes to a component’s behavior, appearance, or styling **only if explicitly instructed** by the developer.

For example:
- ✅ “Add an `icon` prop to `Button.vue` that allows left or right icon placement.”
- ✅ “Update `Card.vue` so it can display a loading spinner.”
- ✅ “Modify `Modal.vue` to accept a fullscreen mode.”

But:
- ❌ “Improve `Button.vue`” _(Too vague. Does not justify changing layout or styles.)_
- ❌ “Refactor `Form.vue`” _(Only allowed if behavior or styles remain unchanged.)_
- ❌ “Optimize `Header.vue`” _(Requires clarification of intent before changing anything.)_

Be clear and intentional in your prompts to avoid unintended modifications.
