# Frontend Style Guide

This document complements the Vue style guidelines with additional SCSS and CSS styling best practices.

## SCSS Structure

- Use BEM methodology for class naming  
- Import SCSS variables and mixins for consistency  
- Add descriptive comments for complex styles  
- Use CSS custom properties for theming  
- Keep styles scoped unless global styles are needed

## Theming

- Centralize colors, spacing, and font variables in `/assets/sass/variables.scss` and `/assets/sass/colors.scss`  
- Use mixins to handle common styling patterns

## Accessibility Styling

- Use focus-visible styles for keyboard navigation  
- Ensure sufficient color contrast for text and UI elements  
- Use transitions and animations sparingly to reduce motion sickness risks  

## Component-Level Styling

- Follow the rules defined in `vue.md` for all component styling
- Each Vue component must have a **root class** that matches its file name (e.g., `Feedback.vue` → `.Feedback`)
- All styles must be **scoped under this root class**
- Avoid global class styles inside components unless explicitly required
- Style organization (e.g., sections like `// Layout`, `// Typography`, etc.) should be used consistently
