# Student Finance Tracker 🎓

A responsive, accessible, privacy-focused web application designed exclusively for managing student finances using entirely vanilla web technologies (HTML, CSS, JavaScript). No external libraries are required, ensuring zero dependencies and blazing-fast local performance.

## 🌟 Project Overview & Scope
**Goal**: Build a mobile-first, highly responsive UI for budgeting, categorizing transactions, and providing critical financial oversight to students without relying on cloud servers or heavy JavaScript frameworks.

This project was built to satisfy advanced requirements for the **Summative Assignment - Building Responsive UI**, emphasizing accessibility, semantic structure, robust data validation, and resilient state management.

## 🚀 Key Features

### 📊 Dynamic Dashboard
- **Real-time Analytics**: Instantly calculates and displays Total Balance, Total Number of Records, and identifies your Top Spending Category based on frequency.
- **7-Day Trend Tracking**: Visualizes recent spending habits to quickly glance at financial outflows over the past week.
- **Budget Monitoring**: Tracks spending against a user-defined monthly budget target, visually indicating remaining funds.

### 📝 Advanced Record Management
- **Transactions Table**: Allows for comprehensive sorting mechanisms (by Date, Amount, Description).
- **Inline Editing & Deletion**: Transactions can be modified or deleted directly from the table interface.
- **Regex-Powered Live Search**: Includes a highly optimized search bar utilizing dynamic regular expressions (`new RegExp(input, 'i')`) with safe `try/catch` fallbacks. Matches are visually brought to attention using semantic `<mark>` tags.
- **Data Healing Strategy**: Employs an intelligent assignment algorithm to automatically tag malformed or legacy records with unique `txn_healed_` IDs upon retrieval to prevent application crashes.

### ⚙️ Customizable Settings Engine
- **Theme Adjustment**: Complete support for both Dark and Light modes using CSS variables and local storage persistence.
- **Global Currency Engine**: Easily switch your base display currency (USD $, EUR €, GBP £, JPY ¥). The app dynamically applies mock exchange rates to represent your wealth geographically.
- **Solid Data Persistence**: All data is securely handled via `localStorage`.
- **JSON Import/Export**: Export your raw financial data via a secure `Blob` download standard (`financial_data.json`) or perform structural validation when importing backups. Includes a custom override modal for securely wiping data without relying on browser lockable alerts.

## 🛡️ Validation & Regex Catalog
Robust data integrity is enforced via strict, pre-compiled Regular Expressions before anything interacts with storage:
- **Description**: `/^\S(?:.*\S)?$/` (Rejects inputs with leading/trailing spaces, collapses doubles).
- **Amount**: `/^(0|[1-9]\d*)(\.\d{1,2})?$/` (Permits standard decimal tracking or integers).
- **Date Format**: `/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/` (Enforces strict YYYY-MM-DD input mapping).
- **Category Matrix**: `/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/` (Ensures clean alphabetical category indexing).
- **Advanced Duplicate Check**: `/\b(\w+)\s+\1\b/i` (An advanced back-referencing rule that alerts users if they accidentally mistype duplicate consecutive words in descriptions).

## ♿ Accessibility (A11y) Highlights
- **Semantic Structure**: Fully leverages HTML5 landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`).
- **Skip Links**: Implements standard "Skip to content" hidden links for screen reader fast-travel.
- **ARIA Live Regions**: Uses `aria-live="assertive"` for critical budget warnings and `role="status"` for form submission success toast notifications.
- **Keyboard Navigation**: Highly visible `:focus-visible` indicators. All core flows (Add, Edit, Modal Confirmations) are fully accessible via `Tab`, `Shift+Tab`, `Space`, and `Enter`.
- **Contrast**: UI palette verified for high-contrast visibility to target WCAG AA compliance.

## 📱 Responsive Architecture
Built meticulously on a **Mobile-First** CSS methodology:
- **Base (Mobile)**: Optimized vertical stacking down to ~360px viewport boundaries. Features off-canvas hamburger navigation.
- **Tablet (768px)**: Fluid typography and grid adjustments to better utilize horizontal space.
- **Desktop (1024px+)**: Maximized data-table widths, horizontally center-aligned constraints (`max-width: 1200px`), and standard top-bar navigation layouts.

## 🛠️ Setup & Testing
1. **Clone & Launch**: Clone this repository and simple double-click `dashboard.html` in any modern browser. No build pipelines or terminal servers required.
2. **Logic Assertions**: Open `tests.html` for a built-in suite of manual validation and module checks.
3. **Data Pre-population**: Navigate to Settings and import the provided `seed.json` to immediately generate 10+ diverse transactions for testing.

---

## Assets Catalog
The project contains pre-development sketches stored in the `./Assets` directory:

### Desktop Sketches
- `./Assets/Desktop_sketch(view)/IMG_6199.HEIC`
- `./Assets/Desktop_sketch(view)/IMG_6200.HEIC`
- `./Assets/Desktop_sketch(view)/IMG_6201.HEIC`
- `./Assets/Desktop_sketch(view)/IMG_6202.HEIC`
- `./Assets/Desktop_sketch(view)/IMG_6203.HEIC`

### Mobile Sketches
- `./Assets/Mobile_sketch(view)/IMG_6204.HEIC`
- `./Assets/Mobile_sketch(view)/IMG_6205.HEIC`
- `./Assets/Mobile_sketch(view)/IMG_6206.HEIC`
- `./Assets/Mobile_sketch(view)/IMG_6207.HEIC`
- `./Assets/Mobile_sketch(view)/IMG_6208.HEIC`
