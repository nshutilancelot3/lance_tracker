# Student Finance Tracker

A responsive, accessible, privacy-focused application for managing student finances using vanilla web technologies.

## Theme & Scope
**Theme**: Student Finance Tracker  
**Goal**: Build a mobile-first UI for budgeting, transactions, and financial oversight.

## Key Features
- **Dashboard**: Real-time stats (Total Balance, Top Category) and 7-day spend trend chart.
- **Records Table**: Sorting (Date, Amount, Description), Regex-powered search, and inline editing.
- **Settings**: Theme adjustment (Dark/Light), base currency selection, and manual budget targets.
- **Data Management**: Persistence via LocalStorage and JSON Import/Export with structural validation.

## Regex Catalog
- **Description Validation**: `/^\S(?:.*\S)?$/` (No leading/trailing spaces, collapses doubles).
- **Amount Validation**: `/^(0|[1-9]\d*)(\.\d{1,2})?$/` (Decimal or integer student currency).
- **Date Validation**: `/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/` (YYYY-MM-DD).
- **Category Validation**: `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/` (Letters and spaces/hyphens only).
- **Advanced (Duplicate Word Detection)**: `/\b(\w+)\s+\1\b/i` (Detects repeated words in descriptions).
- **Search Logic**: Compiles user input via `new RegExp(input, 'i')` with safe `try/catch` wrapper.

## Accessibility (a11y) Notes
- **Semantic Structure**: Uses `<header>`, `<nav>`, `<main>`, `<section>`, and `<footer>` landmarks.
- **Skip Links**: "Skip to content" link available at the top of every page.
- **ARIA Live Regions**: 
    - Budget status updates announce overages via `aria-live="assertive"`.
    - Form submission results announced via `role="status"`.
- **Keyboard Navigation**: Fully navigable via Tab/Shift+Tab and Enter/Space. Visible focus indicators verified.
- **Contrast**: High-contrast theme ensuring readability (WCAG level AA compliance targeted).

## Responsive Design
- **Mobile First**: Default layout optimized for small screens (~360px).
- **Tablet**: Media query breakpoints at 768px for balanced layout.
- **Desktop**: Grid-based layouts and centered containers at 1024px and above.

## Setup & Testing
1. Clone the repository.
2. Open `dashboard.html` in any modern browser.
3. To run validation logic assertions, open `tests.html`.
4. Import `seed.json` on the Settings page to pre-populate transactions.

## Development Progress
- M1-M7 milestones followed during iterative development.
- Commits reflect incremental feature implementation and rubric compliance.

---
*Built as a Summative Assignment for Responsive UI Development.*
