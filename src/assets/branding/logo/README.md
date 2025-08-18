# Logo Assets

This folder contains all logo variations for the Pin-a-Tree application.

## Required Logo Files

Place the following logo variations in this folder:

- `logo.png` - Main logo (full color) - Primary brand mark
- `logo.png` - White version for dark backgrounds
- `logo-icon.png` - Icon-only version (without text) for small spaces
- `favicon.ico` - Browser favicon (16x16, 32x32, 48x48 sizes)
- `favicon.svg` - Scalable favicon for modern browsers

## Design Specifications

Based on the brand guidelines:
- **Style:** Green map pin with leaf motif
- **Colors:** Use Secondary Green (#388E3C) as the primary logo color
- **Format:** SVG preferred for scalability and web optimization
- **Background:** Logos should work on both light and dark backgrounds

## Usage Guidelines

- **Navigation:** Use main logo (`logo.svg`) in the top-left navigation
- **Dark Backgrounds:** Use white version (`logo.png`)
- **Small Spaces:** Use icon-only version (`logo-icon.svg`)
- **Browser Tab:** Favicon files for browser identification

## File Requirements

- **SVG Files:** Optimized for web (remove unnecessary metadata)
- **Favicon:** Multiple sizes embedded in ICO file (16px, 32px, 48px)
- **Accessibility:** Ensure logos have appropriate contrast ratios
- **Consistency:** All variations should maintain the same visual style

## Integration Notes

When implementing in the Vue application:
- Copy logo files to `/src/assets/images/logos/`
- Import using: `@/assets/images/logos/logo.svg`
- Use `alt` attributes for accessibility
- Consider lazy loading for non-critical logo instances 