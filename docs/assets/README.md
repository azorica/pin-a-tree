# Design Assets — Pin-a-Tree

This folder contains all design assets, wireframes, and branding materials for the Pin-a-Tree project. These assets serve as references for AI agents and developers when building the application.

## Folder Structure

```
docs/assets/
├── wireframes/              # UI wireframes and user flow designs
│   ├── landing-page.png     # Main landing page layout
│   ├── user-signup-flow.png # User registration process
│   ├── add-tree-flow.png    # Tree addition workflow
│   ├── map-view.png         # Interactive map interface
│   └── user-profile.png     # User profile page
├── branding/                # Brand identity assets
│   ├── logo/                # Logo variations
│   │   ├── logo.svg         # Main logo (full color)
│   │   ├── logo-white.svg   # White variant for dark backgrounds
│   │   ├── logo-icon.svg    # Icon-only version
│   │   └── favicon.ico      # Browser favicon
├── imagery/                 # Visual assets
│   ├── illustrations/       # Custom illustrations
│   ├── map-pins/           # Map pin designs and variations
│   ├── backgrounds/        # Background images and patterns
│   └── ui-elements/        # Button styles, card examples
├── design-system/          # Design system documentation
│   ├── components.pdf      # Component library examples
│   └── style-guide.pdf     # Visual style guide
└── references/             # Inspiration and style references
    ├── inspiration/        # Design inspiration images
    └── competitors/        # Competitive analysis screenshots
```

## Usage Instructions

### For AI Agents
When building the Pin-a-Tree application:
1. **Start with wireframes** in `/wireframes/` to understand layout and user flows
2. **Reference branding assets** in `/branding/` for logos
3. **Use imagery assets** in `/imagery/` for visual elements and custom graphics
4. **Copy relevant assets** to `/src/assets/` following the project structure guidelines
5. **Maintain asset organization** when moving files to the application source

**🚨 Important - Handle Missing Assets Gracefully:**
- **If folders are empty or files don't exist:** Continue with implementation using fallbacks
- **Don't fail the build** due to missing asset files
- **Use the documented specifications** (colors, typography, layout descriptions) to create the UI
- **Implement placeholder content** where specific assets are referenced but missing

### For Developers
- Place wireframes and design references here for team collaboration
- Export final assets to `/src/assets/` when implementing features
- Keep source design files (Figma, Sketch) links in commit messages
- Update this README when adding new asset categories

## Asset Requirements

### Logo Assets
- **Format:** SVG preferred for scalability
- **Variants:** Full color, white, icon-only, favicon
- **Naming:** Use descriptive names (logo-white.svg, not logo2.svg)

### Wireframes
- **Format:** PNG or JPG for static wireframes, PDF for multi-page flows
- **Resolution:** High enough for detail review (minimum 1920px width)
- **Naming:** Descriptive of the page/flow (landing-page.png, not wireframe1.png)

### Color Assets
- **SCSS Variables:** For direct import into Vue components
- **Design Tool Exports:** Figma tokens, Adobe swatches for design consistency
- **Documentation:** Include usage notes for each color

## Integration with Application

When the application is generated, assets should be copied to:
```
src/assets/
├── images/
│   ├── logos/              # From docs/assets/branding/logo/
│   ├── ui/                 # From docs/assets/imagery/ui-elements/
│   └── backgrounds/        # From docs/assets/imagery/backgrounds/
├── icons/                  # Custom icons (mainly using lucide-vue-next)
└── styles/                 # SCSS files including color variables
```

## Fallback Strategies for Missing Assets

When asset files don't exist, use these fallback approaches:

### Missing Logo Files
- **Create a text-based logo** using the app name "Pin-a-Tree" with:
  - Secondary Green color (#388E3C)
  - Bold typography from the style guide
  - Optional: Simple CSS-based tree/pin icon using Unicode or CSS shapes
- **Favicon fallback:** Generate a simple letter "P" favicon with brand colors

### Missing Wireframes
- **Follow text descriptions** in UI_UX_doc.md for layout structure
- **Use standard patterns:**
  - Navigation header with logo left, signup button right
  - Hero section with call-to-action
  - Three-column card layout on desktop, single column on mobile
  - Interactive map section
  - Footer with links
- **Apply responsive grid** using documented spacing and sizing rules

### Missing Brand Assets (Colors/Typography)
- **Colors:** Use the hex values documented in UI_UX_doc.md
- **Typography:** Use web-safe fonts as fallbacks:
  - Primary: system-ui, -apple-system, sans-serif
  - Backup Google Fonts: "Inter", "Poppins", "Montserrat"
- **Create SCSS variables** in `/src/assets/styles/` with documented color values

### Missing Imagery
- **Backgrounds:** Use CSS gradients with brand colors
- **Illustrations:** Use Lucide icons or simple CSS-based graphics
- **Map pins:** Create CSS-based pins using brand colors
- **Placeholder images:** Use solid color rectangles with brand colors
- **Hero images:** Use CSS gradients or solid backgrounds

### Missing Design System Files
- **Follow documented specifications** for:
  - Button styles (rounded corners, brand colors, uppercase text)
  - Card layouts (off-white background, shadows, rounded corners)
  - Input fields (rounded, green focus states)
  - Spacing scale (0.5rem, 1rem, 2rem, 4rem)

## Implementation Priority

1. **Core functionality first** - Don't block development for missing visuals
2. **Use documented specs** - Colors, typography, spacing from UI_UX_doc.md
3. **Semantic HTML structure** - Proper accessibility and responsive layout
4. **Progressive enhancement** - Add visual assets when they become available

## Notes
- **Version Control:** All assets should be committed to git for team access
- **File Sizes:** Optimize images for web use before moving to `/src/assets/`
- **Licensing:** Ensure all assets are properly licensed for commercial use
- **Updates:** Keep this README updated when folder structure changes 