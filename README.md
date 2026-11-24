# ShopLens — Interactive API-Driven Product Explorer

**Live Demo:** [https://shop-lens.netlify.app](https://shop-lens.netlify.app)

> **Course:** Software Development I (CSE-2340)  
> **Assessment:** Mini Project 3-4 (MP3-MP4)  
> **Institution:** Department of Computer Science and Engineering, International Islamic University Chittagong (IIUC)

---

## Overview

**ShopLens** is a responsive, interactive web application built with vanilla **HTML5**, **CSS3**, and **JavaScript (ES6+)**. It retrieves live product catalog data from an external REST API ([DummyJSON Products API](https://dummyjson.com/products)), supports real-time searching, dynamic category filtering, multi-criteria sorting, detailed product inspection via an interactive modal, and persistent bookmarking using the browser's `localStorage` API.

---

## Live Deployment

Explore the live application hosted on Netlify:  
🔗 **[https://shop-lens.netlify.app](https://shop-lens.netlify.app)**

---

## Features & Assignment Rubric Mapping

### 1. DOM Manipulation & Dynamic Rendering *(MP3 — 4 Marks)*
- Uses `document.getElementById()`, `querySelector()`, and `querySelectorAll()` to dynamically render category filter pills, product cards, live result counters, and a detailed item inspection modal.
- Updates UI states dynamically without page reloads.

### 2. Event Handling & JavaScript Logic *(MP3 — 3 Marks)*
- Uses `addEventListener()` across interactive controls: real-time search bar (`input`), sorting selector (`change`), category filter pills (`click`), wishlist bookmark buttons, modal controls, and keyboard accessibility (`Escape` key to close modal).
- Manages structured product data using objects, arrays, and higher-order array methods:
  - `Array.prototype.map()` — transforms raw API payloads into normalized product objects and extracts category lists.
  - `Array.prototype.filter()` — filters products by search query, active category, or saved wishlist status, and removes unbookmarked items.
  - `Array.prototype.forEach()` — renders product cards and category filter buttons into the DOM.
  - `Array.prototype.find()` — locates the selected product by ID when opening the detail modal.

### 3. API Integration & Asynchronous Operations *(MP4 — 4 Marks)*
- Fetches external catalog data asynchronously from `https://dummyjson.com/products?limit=24` using `fetch()` and `async/await` with `try/catch` error handling.
- Implements dedicated UI states for asynchronous workflows:
  - **Loading State:** Animated spinner displayed while awaiting the API response.
  - **Error State:** Clear error feedback with a one-click **Retry Request** button if the network or server fails.
  - **Empty State:** Contextual message with a **Reset Filters** action when no products match the active search or filter criteria.

### 4. Local Storage Persistence *(MP4 — 3 Marks)*
- Persists user-bookmarked product IDs (`shoplens_saved_product_ids`) and the active category selection (`shoplens_active_category`) in `localStorage`.
- Saved wishlist items, badge counts, and active filter states remain intact across browser refreshes and sessions.

---

## Tech Stack

- **Markup:** Semantic HTML5
- **Styling:** CSS3 (Custom Properties, Flexbox, CSS Grid, Responsive Media Queries)
- **Logic & State:** Vanilla JavaScript (ES6+, Async/Await, Fetch API, Web Storage API)
- **External API:** [DummyJSON REST API](https://dummyjson.com/)
- **Hosting:** Netlify

---

## Project Structure

    CSE-2340-MP3-MP4-Product-Explorer/
    ├── index.html      # Semantic layout, controls, state containers, and detail modal
    ├── style.css       # Responsive styling, CSS variables, grid layout, and animations
    ├── script.js       # API fetching, DOM rendering, event listeners, and localStorage logic
    └── README.md       # Project documentation

---

## Running Locally

1. **Clone the repository:**

       git clone https://github.com/<your-username>/<your-repo-name>.git
       cd <your-repo-name>

2. **Open in browser:**
   - Open `index.html` directly in any modern web browser, **or**
   - Serve locally using VS Code **Live Server** or Python's built-in HTTP server:

         python3 -m http.server 8000

   - Then visit `http://localhost:8000` in your browser.
