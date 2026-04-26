# SRC KNOWLEDGE BASE

**Generated:** 2026-04-25**

## OVERVIEW

Source entry point directory. Vite entry: src/main.js (160 lines). Handles CSS imports, JS dependencies, menu loading from API, and iframe navigation.

## STRUCTURE

```
src/
├── main.js              # Main entry (160 lines)
└── page/
    └── home.html        # Home page content (fetch via src/main.js)
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add global CSS/JS import | main.js | Top import section |
| Menu loading logic | main.js | load_menu, load_menu_base functions |
| Navigation click handlers | main.js | menu_build function |
| API endpoint config | main.js | env.VITE_API_URL |

## CODE MAP

| Symbol | Type | Role |
|--------|------|------|
| menu_build | function | Attach click handlers to [target-link] elements |
| load_menu | function | GET /api/rest/v1/menu/tree → render full nav |
| load_menu_base | function | GET /api/rest/v1/menu/tree/base → render base nav |
| #index-main-iframe | DOM ID | Main content iframe |
| #base-nav | DOM ID | Base navigation container |
| #user-profile-picture | DOM ID | User dropdown menu |
| #navbar-menu-btn | DOM ID | Mobile menu toggle |

## CONVENTIONS

- CSS imported at top of main.js (Tabler theme, fonts, custom)
- JS imported at top of main.js (Tabler, Axios, common.js)
- Menu API response structure: {data: [{name, icon, linkUrl, children, childrenLine}]}
- Menu chunks split by childrenLine for multi-column dropdowns
- Environment variables accessed via import.meta.env
- iframe src defaults to /templates/index/home.html

## API

```
GET /api/rest/v1/menu/tree      # Full menu tree with dropdowns
GET /api/rest/v1/menu/tree/base # Base navigation only
```

## ANTI-PATTERNS

- ❌ Do not add per-template JS in main.js (use template-specific scripts)
- ❌ Do not hardcode API paths (use env + relative paths)
- ❌ Do not modify iframe loading behavior without testing all menu links
