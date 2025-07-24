# Frontend Style Guide

This document complements the Vue style guidelines with additional SCSS and CSS styling best practices.

## SCSS Structure

- Use BEM methodology for class naming  
- Import SCSS variables and mixins for consistency  
- Add descriptive comments for complex styles  
- Use CSS custom properties for theming  
- Keep styles scoped unless global styles are needed

## Use SASS Variables for All Values

- **Always use SASS variables for CSS property values.**
- Do **not** use hardcoded values for spacing, colors, font sizes, etc.
- Store variables in dedicated files (e.g., `styles/variables.scss`, `styles/colors.scss`).

**Examples:**
```scss
// GOOD
padding: layout.$spacing-2;
color: colors.$black;

// BAD
padding: 1.2rem;
color: #000000;
```

## REM Units & Base Font Size

- Always use `rem` units for sizing (font, spacing, layout, etc.) for scalability and consistency.
- Set the base font size so that `1rem = 10px` for easier calculations:

```css
// Base font size: 62.5% of 16px = 10px
// This makes 1rem = 10px for easier calculations
html {
  font-size: 62.5%;
}
```

## Responsive Layout & Breakpoints

- Use a mobile-first, Bootstrap-like responsive layout system with SCSS mixins for breakpoints.
- Define breakpoints as follows:

```scss
@use 'sass:map';

$breakpoints: (
  'small': 576px,
  'medium': 768px, // everything under medium is considered mobile
  'large': 992px,
  'xlarge': 1200px,
  'xxlarge': 1920px,
);
```

- Use the following mixins for responsive styles:

```scss
@mixin width-at-least($breakpoint) {
  $value: map.get($breakpoints, $breakpoint);
  @if $value != null {
    @media (min-width: $value) {
      @content;
    }
  } @else {
    @warn "No value for breakpoint `#{$breakpoint}` in $breakpoints map.";
  }
}

@mixin width-less-than($breakpoint) {
  $value: map.get($breakpoints, $breakpoint);
  @if $value != null {
    @media (max-width: ($value - 1)) {
      @content;
    }
  } @else {
    @warn "No value for breakpoint `#{$breakpoint}` in $breakpoints map.";
  }
}

@mixin width-between($min, $max) {
  $min-value: map.get($breakpoints, $min);
  $max-value: map.get($breakpoints, $max);
  @if $min-value and $max-value {
    @media (min-width: $min-value) and (max-width: ($max-value - 1)) {
      @content;
    }
  } @else {
    @warn "Invalid breakpoint range: #{$min} to #{$max}.";
  }
}
```

- **Example usage:**

```scss
.element {
  width: 5rem; // applies to all screen sizes

  @include width-at-least('medium') {
    width: 10rem; // applies to medium and up
  }
}
```

## SCSS File Structure Best Practices

- Organize the `src/styles/` folder for maintainability and scalability:
  - `styles/variables.scss` — All global variables (colors, spacing, font sizes, etc.)
  - `styles/colors.scss` — Color palette variables
  - `styles/mixins.scss` — All global mixins (responsive, utility, etc.)
  - `styles/base.scss` — Base styles (reset, typography, html/body)
  - `styles/layout.scss` — Layout/grid system styles
  - `styles/components/` — Component-specific styles (if not scoped in Vue SFCs)
  - `styles/utilities.scss` — Utility/helper classes
- Use `@use` and `@forward` for modular SCSS imports.
- Import only what you need in each file to keep the build efficient.
- Keep global styles minimal; prefer scoped styles in Vue SFCs for components.

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
