# TEMPLATES KNOWLEDGE BASE

**Generated:** 2026-04-25**

## OVERVIEW

HTML template directory with 83 files across 16 categories. Contains page layouts, modal templates, and feature-specific templates. All templates loaded via iframe.

## STRUCTURE

```
templates/
├── index/          # 16 files - Home, layout variants, main pages
├── modal/          # 12 files - Modal templates (success, danger, etc.)
├── book/           # 5 files - Book-related templates
├── ai/             # 4 files - AI feature templates
├── database/       # 4 files - Database management templates
├── file_backup/    # 5 files - File backup templates
├── test/           # 2 files - Test templates
└── ...             # 8+ other categories (music, photo, pixiv, tool, etc.)
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Layout variations | templates/index/ | layout-vertical, layout-horizontal, layout-boxed, etc. |
| Modal templates | templates/modal/ | Reusable modal HTML templates |
| Home page content | templates/index/home.html | Main iframe default content |

## CONVENTIONS

- Use `target-link` attribute for navigation → loads into #index-main-iframe
- Use `template-id` attribute for reusable template components
- Use `element-id` attribute for target DOM elements
- Modal templates need corresponding trigger buttons
- Tabler CSS classes available globally (no per-template imports needed)

## ANTI-PATTERNS

- ❌ Do not add duplicate CSS imports per template (loaded globally)
- ❌ Do not add script tag references for common.js (loaded globally)
