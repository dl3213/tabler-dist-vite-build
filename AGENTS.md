# PROJECT KNOWLEDGE BASE

**Generated:** 2026-04-25**
**Branch:** main

## OVERVIEW

Vite-based admin dashboard project using Tabler UI framework. iframe-based SPA architecture with dynamic menu loading from backend API, theming support, and common utility library.

Core stack: Vite 6, Tabler CSS/JS, Axios, Mustache-style templating.

## STRUCTURE

```
tabler-dist-vite-build/
├── src/                 # Source code (main entry)
├── public/               # Static assets served as served as served
│   ├── templates/       # HTML page templates (83 files, 16 categories)
│   ├── tabler/           # Tabler UI framework (CSS/JS)
│   ├── js/common/         # Utility library
│   ├── libs/           # 3rd party libs (apexcharts, tinymce, plyr)
│   ├── css/              # Custom styles
│   └── static/           # Static assets
├── dist/                 # Build output
├── index.html           # Main entry point
├── vite.config.js       # Vite configuration
└── package.json
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add new page | public/templates/ | Create HTML, add menu API |
| Edit global styles | src/main.js | Tabler CSS imports |
| Add utility function | public/js/common/common.js | Common global functions |
| Menu system | src/main.js | menu_build, load_menu, load_menu_base |
| Theme configuration | index.html | Theme builder offcanvas |
| Vite build config | vite.config.js | Output, aliases |
| API endpoint | .env | VITE_API_URL |

## CODE MAP

| Symbol | Type | Location | Role |
|--------|------|----------|------|
| menu_build | function | src/main.js | Attach click handlers for target-link |
| load_menu | function | src/main.js | Load full menu tree from API |
| load_menu_base | function | src/main.js | Load base navigation |
| Common | object | public/js/common/common.js | Global utility library |
| Common.formSetData | function | public/js/common/common.js | Populate form with data |
| Common.getFormData | function | public/js/common/common.js | Extract form data |
| Common.createTemplate | function | public/js/common/common.js | Template engine |
| Common.alertSuccess | function | public/js/common/common.js | Success modal |
| Common.alertDanger | function | public/js/common/common.js | Danger modal |

## CONVENTIONS

- Use `target-link` attribute for menu items → loads page into iframe
- Use `layout-link` attribute for layout switches
- API endpoints: `/api/rest/v1/menu/tree` and `/api/rest/v1/menu/tree/base`
- Form elements accessed by ID, checkboxes return "1"/"0"
- Template syntax: `{variable}` for Mustache-style
- Number of decimal places: 2 (configurable via Common.NumberOfDecimal

## ANTI-PATTERNS

- ❌ Do not hardcode API_URL in multiple files → use .env VITE_API_URL
- ❌ Do not modify files in dist/ → built output
- ❌ Do not modify public/libs/ vendor files
- ❌ Do not use absolute URLs in production console.log statements → debug code
- ❌ Do not use jQuery → use template-id for templates/index/ pages

## UNIQUE STYLES

- iframe-based SPA (no router, no client-side routing library
- Dynamic menu chunks splitting into dropdown columns
- Theme builder with 12 colors, 4 modes, 4 fonts
- Tabler inline SVG icons directly in HTML
- Offcanvas settings panel

## COMMANDS

```bash
npm run dev      # Start dev server (port 4000)
npm run build    # Production build to dist/
npm run preview  # Preview production build
```

## NOTES

- Default API endpoint: http://192.168.10.62:8080
- Dev server port: 4000
- Main iframe ID: index-main-iframe
- Base nav container: base-nav
- Modal templates use modal-success-context, modal-danger-context
