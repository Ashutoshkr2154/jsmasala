# JSM Masala - E-commerce Website 
### JSM Masala - E-commerce Frontend

This is a production-ready, responsive React + TypeScript frontend for JSM Masala, an Indian spice e-commerce store. It is built with Vite, Tailwind CSS, React Query, and Zustand, and includes a complete mock API setup using Mock Service Worker (MSW).

## ✨ Features

* **Modern Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS.
* **State Management:** React Query for server state (caching, re-fetching) and Zustand for global client state (cart, auth).
* **Full E-commerce Flow:** Home, Shop (PLP), Product Details (PDP), Cart, and Checkout.
* **Mock API Included:** Powered by **Mock Service Worker (MSW)**, simulating a real backend.
* **Authentication:** Mock JWT-based auth flow (Login, Register, Profile) with state persistence.
* **Admin UI:** Frontend-only UI for managing products and viewing orders.
* **Performance:**
    * Route-level code splitting with `React.lazy`.
    * Image lazy loading and placeholder skeletons.
    * Progressive Web App (PWA) enabled with offline caching.
* **Accessibility (a11y):** Semantic HTML, ARIA attributes, keyboard navigation, and focus management.
* **SEO:** `react-helmet-async` for page titles/meta, and `sitemap.xml`/`robots.txt` scaffolds.
* **Internationalization (i18n):** Scaffolding for English (en) and Hindi (hi).
* **Testing:** Unit tests (Jest + RTL) and E2E tests (Playwright) included.

## Prerequisites

* [Node.js](https://nodejs.org/) (v18.x or higher)
* [npm](https://www.npmjs.com/) (or pnpm/yarn)

## 🚀 Quick Start

1.  **Clone the repository (or copy files):**
    ```bash
    git clone [https://github.com/your-username/jsm-masala-frontend.git](https://github.com/your-username/jsm-masala-frontend.git)
    cd jsm-masala-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    This command starts Vite and enables the MSW mock API in the browser.
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## 📦 Build for Production

This command bundles the app for production, optimized and minified. It also generates the PWA service worker.

```bash
npm run build