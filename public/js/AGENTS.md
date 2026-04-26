# JS KNOWLEDGE BASE

**Generated:** 2026-04-25**

## OVERVIEW

JavaScript utilities and third-party libraries. Common.js is the central utility library for all form handling, template rendering, and general utilities.

## STRUCTURE

```
js/
├── common/
│   └── common.js         # Global utility library (412 lines)
├── tabler.js             # Tabler UI framework
├── tabler.esm.js         # ESM version of Tabler
└── ...
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Add global utility | common/common.js | Common object namespace |
| Form handling | common/common.js | formSetData, getFormData |
| Template rendering | common/common.js | createTemplate, templateId |
| Number formatting | common/common.js | divideAndRound, NumberOfDecimal |
| Alert modals | common/common.js | alertSuccess, alertDanger |

## CODE MAP

| Symbol | Type | Role |
|--------|------|------|
| Common | object | Global namespace for all utilities |
| Common.NumberOfDecimal | const | Default decimal places (2) |
| Common.server.API_URL | const | Backend endpoint |
| Common.showLoading | function | Display loading spinner in target element |
| Common.formSetData | function | Populate form fields from object |
| Common.getFormData | function | Extract form data to object (checkbox → "1"/"0") |
| Common.createTemplate | function | Compile Mustache-style {var} templates to render function |
| Common.templateId | function | Get template HTML by template-id attribute |
| Common.element | function | Alias for getElementById |
| Common.elementId | function | Query elements by element-id attribute |
| Common.alertSuccess | function | Trigger success modal with message |
| Common.alertDanger | function | Trigger danger modal with message |
| Common.checkBreakpoint | function | Get current responsive breakpoint (xs/sm/md/lg/xl/xxl) |
| Common.decodeTemplateHtml | function | Decode HTML entities from template |

## CONVENTIONS

- Always use Common namespace for new utility functions
- Checkbox values returned as "1" (checked) / "0" (unchecked) strings
- Template variable syntax: `{variableName}` (Mustache-style, no {{}})
- Use element-id attribute for component targeting (not id)
- Use template-id attribute for reusable template elements

## ANTI-PATTERNS

- ❌ Do not duplicate utility functions (use Common instead)
- ❌ Do not hardcode API_URL → use Common.server.API_URL or env
- ❌ Do not modify tabler.js directly (vendor file)
- ❌ Do not use jQuery (vanilla JS only)
