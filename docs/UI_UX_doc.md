# UI/UX Documentation — Pin-a-Tree

> **Asset References for AI Agents:**
> - **Wireframes & Mockups:** `/docs/assets/wireframes/` - Visual layouts and user flow designs
> - **Brand Assets:** `/docs/assets/branding/` - Logos, color swatches, typography samples
> - **Design System:** `/docs/assets/design-system/` - Component examples and style guides
> - **Reference Images:** `/docs/assets/references/` - Inspiration and style references
>
> **Important:** 
> - When implementing the application, copy relevant assets from `/docs/assets/` to `/src/assets/` following the project structure guidelines
> - **If asset folders are empty or files don't exist, proceed with implementation using the documented specifications** (colors, typography, etc.) and placeholder content
> - Do not fail the build process due to missing asset files - use fallbacks and continue development

## 1. Design System Overview
- The design is clean, modern, and nature-inspired, with a focus on accessibility and clarity.
- The interface uses a dark background with green accents to evoke an eco-friendly, community-driven feel.
- Layout is mobile-first and responsive, using clear visual hierarchy and generous spacing.

---

## 2. Branding
### Logo
- The logo is a green map pin with a leaf motif, symbolizing tree planting and location.
- Use the logo on the top left of the navigation bar and in marketing materials.
- **Asset Location:** `/docs/assets/branding/logo/` - Contains logo variations (SVG, PNG, different sizes)
- **Required Variants:** 
  - `logo.svg` - Main logo (full color)
  - `logo-white.svg` - White variant for dark backgrounds
  - `logo-icon.svg` - Icon-only version
  - `favicon.ico` - Browser favicon
- **Fallback:** If logo files don't exist, use a placeholder or create a simple text-based logo using the brand colors and typography specifications

### Brand Colors
Extracted from the landing page design:
- **Primary Green:** #2E7D32 (buttons, highlights)
- **Secondary Green:** #388E3C (logo, accents)
- **Light Green:** #A5D6A7 (map pins, backgrounds)
- **Off-White:** #F5F5F5 (cards, map background)
- **Dark Background:** #111111 (main background)
- **Text:** #FFFFFF (main text), #222222 (dark text on light backgrounds)

#### Color Palette Table
| Name            | Hex      | Usage                        |
|-----------------|----------|------------------------------|
| Primary Green   | #2E7D32  | Buttons, highlights          |
| Secondary Green | #388E3C  | Logo, icons, accents         |
| Light Green     | #A5D6A7  | Map pins, backgrounds        |
| Off-White       | #F5F5F5  | Card backgrounds, map area   |
| Dark Background | #111111  | Main background              |
| White           | #FFFFFF  | Main text                    |
| Dark Text       | #222222  | Text on light backgrounds    |

---

## 3. Typography
- **Font Family:** Use a modern, geometric sans-serif font (e.g., "Poppins", "Inter", or "Montserrat").
- **Headings:** Bold, large, and clear (e.g., 3.2rem for main heading, 2.4rem for section headings).
- **Body Text:** Regular weight, 1.6rem for readability.
- **Buttons:** Uppercase, bold, 1.6rem.
- **All font sizes use rem units (1rem = 10px).**

---

## 4. Spacing & Sizing
- Use a consistent spacing scale: 0.5rem, 1rem, 2rem, 4rem, etc.
- Cards and buttons have generous padding (e.g., 2rem inside cards, 1.2rem vertical in buttons).
- Border radius: 1.2rem for cards and buttons for a soft, friendly look.
- Shadows: Subtle, soft drop shadows for cards and modals.

---

## 5. Component Library & Guidelines
- **Button:**
  - Primary: Filled with Primary Green, white text, rounded corners.
  - Secondary: Outlined or ghost style, green border, green text.
  - States: Hover (slightly lighter green), Active (darker green), Disabled (gray).
- **Card:**
  - Off-white background, rounded corners, shadow, clear icon or image at top.
- **Input:**
  - Rounded, clear border, focus state with green outline.
- **Navigation Bar:**
  - Logo left, "Signup" button right, sticky on scroll.
- **Map Section:**
  - Large, interactive, with green map pins.
- **Icons:**
  - Use simple, line or filled icons in green or white.

---

## 6. Layout & Grid
- Mobile-first, responsive grid using SCSS mixins (see style guide).
- Max content width: 120rem.
- Cards in a 1-column layout on mobile, 3-column on desktop.
- Generous vertical spacing between sections (4rem+).

---

## 7. Imagery & Iconography
- Use illustrations and icons that are friendly, simple, and nature-themed.
- Images should have rounded corners and subtle shadows.
- Logo and map pin icons should be consistent in style and color.

**Asset Locations:**
- **Custom Illustrations:** `/docs/assets/imagery/illustrations/` - Nature-themed custom graphics
- **Map Pin Designs:** `/docs/assets/imagery/map-pins/` - Various map pin styles and states
- **Background Images:** `/docs/assets/imagery/backgrounds/` - Hero sections and pattern backgrounds
- **UI Elements:** `/docs/assets/imagery/ui-elements/` - Custom buttons, cards, and component examples

**Fallback Strategy:** If imagery folders are empty, use CSS-based designs, gradients, or placeholder images with the specified brand colors. Prioritize functionality over missing visuals.

**Icons:**
- **All icons in the app should use the [Lucide icon library for Vue 3](https://lucide.dev/guide/packages/lucide-vue-next).**
  - Install with: `npm install lucide-vue-next`
  - Import icons as Vue components:
    ```vue
    <script setup>
    import { Camera } from 'lucide-vue-next';
    </script>
    <template>
      <Camera color="#2E7D32" :size="32" />
    </template>
    ```
  - Only import the icons you use to keep the bundle size small.

---

## 8. Accessibility
- Ensure color contrast meets WCAG AA standards (e.g., green on black/white is accessible).
- All buttons and links must be keyboard accessible.
- Use semantic HTML for all interactive elements.
- Add ARIA labels to icons and custom controls.
- Focus states must be visible and clear.

---

## 9. Animation & Motion
- Use subtle transitions for button hover, card elevation, and modal open/close.
- Avoid excessive animation; keep motion minimal for accessibility.

---

## 10. User Flows
**Wireframe Location:** `/docs/assets/wireframes/` - Contains detailed wireframes for all user flows

- **Landing Page:**
  - Logo and navigation at top.
  - Main call-to-action: "Get Started" button.
  - Three feature cards: Create Account, Add a Tree, View the Map.
  - Map section with interactive pins.
  - Footer with additional info/links.
  - **Wireframe:** `/docs/assets/wireframes/landing-page.png`

- **Key Flows:**
  - Signup → Add Tree → View Map
  - **Flow Wireframes:**
    - `/docs/assets/wireframes/user-signup-flow.png`
    - `/docs/assets/wireframes/add-tree-flow.png`
    - `/docs/assets/wireframes/map-view.png`
    - `/docs/assets/wireframes/user-profile.png`

**Missing Wireframes:** If wireframe files don't exist, follow the text descriptions above and use standard UI patterns (navigation header, card layouts, responsive grids) based on the design system specifications.

---

## 11. Suggestions for Modernization & Usability
- Use more whitespace for a lighter, more modern feel.
- Add micro-interactions (e.g., button press, card hover lift).
- Consider a sticky header for navigation.
- Use a slightly lighter background for cards to increase contrast.
- Add a "dark mode" toggle for accessibility.
- Use clear, friendly error messages and form validation.

---

## 12. References
- [Bootstrap Grid System](https://getbootstrap.com/docs/5.0/layout/grid/)
- [WCAG Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Google Fonts: Poppins](https://fonts.google.com/specimen/Poppins)
- [Google Fonts: Inter](https://fonts.google.com/specimen/Inter)
- [Google Fonts: Montserrat](https://fonts.google.com/specimen/Montserrat)

---

**Update this document as the design evolves or new UI/UX decisions are made.** 