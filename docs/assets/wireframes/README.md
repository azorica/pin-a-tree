# Wireframes & User Flow Designs

This folder contains wireframes and user flow designs for the Pin-a-Tree application.

## Expected Files

Place your wireframe files here with descriptive names:

- `landing-page.png` - Main landing page layout and components
- `user-signup-flow.png` - User registration and onboarding process
- `add-tree-flow.png` - Tree addition workflow and form design
- `map-view.png` - Interactive map interface and pin interactions
- `user-profile.png` - User profile page layout

## File Guidelines

- **Format:** PNG or JPG for static wireframes, PDF for multi-page flows
- **Resolution:** Minimum 1920px width for desktop wireframes
- **Mobile:** Include mobile wireframes with `-mobile` suffix (e.g., `landing-page-mobile.png`)
- **Naming:** Use descriptive kebab-case names that match the feature/page

## Notes for AI Agents

When implementing the application:
1. Start by reviewing wireframes to understand the overall layout structure
2. Pay attention to component placement and user flow sequences
3. Use wireframes as the primary reference for responsive design breakpoints
4. Ensure all wireframed features are implemented according to the designs

### If Wireframes Are Missing
**Don't stop development!** Use these fallback approaches:

1. **Follow the text descriptions** in `UI_UX_doc.md` for layout requirements
2. **Use standard web patterns:**
   - Header: Logo left, navigation/signup right, sticky on scroll
   - Hero section: Large heading, subtitle, prominent CTA button
   - Feature cards: 3-column grid on desktop, 1-column on mobile
   - Map section: Full-width interactive area with pins
   - Footer: Links and additional information

3. **Apply documented design system:**
   - Spacing: 0.5rem, 1rem, 2rem, 4rem scale
   - Colors: Brand green palette from UI_UX_doc.md
   - Typography: Bold headings, readable body text
   - Components: Rounded corners, shadows, green accents

4. **Responsive breakpoints:**
   - Mobile-first approach
   - Max content width: 120rem
   - Cards: 1-column on mobile, 3-column on desktop

## Updating Wireframes

When wireframes are updated:
1. Replace the existing file with the same name
2. Update the UI_UX_doc.md if new flows or pages are added
3. Commit changes with descriptive messages about what was updated 