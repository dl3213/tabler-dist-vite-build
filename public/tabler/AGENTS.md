# TABLER PAGE TEMPLATES

**Generated:** 2026-05-16

## OVERVIEW

Admin page templates organized by feature category. Loaded into iframe (#index-main-iframe) via target-link menu clicks. Formerly at `public/templates/`, relocated here 2026-05.

## STRUCTURE

```
tabler/
├── index.html             # Admin entry shell (Tabler layout + theme includes)
├── tabler.css             # Tabler CSS theme override
├── tabler.js              # Tabler JS theme override
├── tabler-theme.js        # Theme builder (12 colors, 4 modes, 4 fonts)
├── tabler-theme-setting.js # Theme settings panel logic
├── tabler-theme.css       # Theme CSS
│
├── index/                 # Layout templates + home page
│   ├── home.html          # Admin home/dashboard (2961 lines)
│   ├── layout-*.html      # 11 layout variants (vertical, horizontal, fluid, rtl, etc.)
│   └── index.html         # Layout with nav (deprecated)
│
├── modal/                 # Modal/dialog templates
│   ├── alert-msg.html     # Alert message modal
│   ├── book.html          # Book management modal
│   ├── gallery.html       # Gallery modal
│   ├── video-play.html    # Video player modal (HLS.js)
│   ├── vtf-converter.html # VTF converter tool modal
│   ├── search.html        # Search modals
│   └── ... (13 total)
│
├── book/                  # Book management pages
│   ├── list-view.html     # Book list
│   ├── list-view1.html    # Book list (alt layout)
│   ├── detail-view.html   # Book detail
│   └── detail-view2.html  # Book detail (alt layout)
│
├── file/                  # File management
│   └── list-view.html     # File browser
│
├── music/                 # Music management
│   └── list-view.html     # Music list
│
├── photo/                 # Photo management
│   └── list-view.html     # Photo gallery
│
├── system/                # System settings
│   └── list-view.html     # System config
│
├── tool/                  # Tools
│   └── view.html          # Utility tool
│
├── box/                   # Box management
│   └── index-view.html    # Box overview
│
└── common/                # Shared partials
    └── msg.html           # Message/notification template
```

## WHERE TO LOOK

| Task | Location |
|------|----------|
| Admin dashboard home | index/home.html |
| Add new feature module page | {category}/list-view.html |
| Add new modal | modal/{name}.html |
| Edit layout | index/layout-*.html |
| Theme customization | tabler-theme.js |
| Admin entry point | index.html (root of tabler/) |

## CONVENTIONS

- All pages use Mustache-style `{variable}` syntax for dynamic data
- Pages reference Common.js utilities (`Common.formSetData`, etc.)
- Layout variants share the same nav/sidebar structure via index.html
- Modals are triggered by button click → loads template into modal container
- Video player uses HLS.js for streaming, custom control bar layout
- Fancybox used for gallery/lightbox (data-fancybox attribute)

## ANTI-PATTERNS

- ❌ Do not create pages outside tabler/ category directories
- ❌ Do not hardcode page content — always use template variables
- ❌ Do not duplicate layout boilerplate — extend from index/layout-*.html
- ❌ Do not add scripts directly in page templates — use common/ or biz/ JS files

## NOTES

- home.html (2961 lines) is the largest template — contains full dashboard
- index/layout-*.html files are the primary navigation shells
- modals can be reused across multiple pages
- Templates compiled at runtime by Common.createTemplate()
- Video player custom controls documented in /NOTES.md
