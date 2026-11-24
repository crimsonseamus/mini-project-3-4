# ShopLens — Interactive API-Driven Product Explorer

**Course:** Software Development I (CSE-2340)  
**Assessment:** Mini Project 3-4 (MP3-MP4)  
**Department:** Computer Science and Engineering, International Islamic University Chittagong

## Overview
ShopLens is a responsive, interactive web application built with vanilla **HTML5**, **CSS3**, and **JavaScript (ES6+)** that fetches live product data from an external REST API (`https://dummyjson.com/products`), supports real-time searching, category filtering, sorting, item detail inspection, and persists user-bookmarked items and active filters using `localStorage`.

## Features & Rubric Mapping
1. **DOM Manipulation & Dynamic Rendering (MP3):**
   - Uses `document.getElementById()` and `document.querySelector()` / `querySelectorAll()` to dynamically generate category filter buttons, product cards, result counters, and a product detail modal.
2. **Event Handling & JavaScript Logic (MP3):**
   - Uses `addEventListener()` for live search input, sorting dropdown, category pills, bookmark buttons, modal controls, and keyboard (`Escape`) navigation.
   - Uses arrays, objects, and array methods (`map()`, `filter()`, `forEach()`, and `find()`) to transform, filter, iterate over, and look up product records.
3. **API Integration & Asynchronous Operations (MP4):**
   - Fetches external API data asynchronously using `fetch()` and `async/await` with `try/catch` error handling.
   - Implements explicit **Loading**, **Error** (with Retry action), and **Empty** states.
4. **Local Storage Persistence (MP4):**
   - Saves bookmarked product IDs (`shoplens_saved_product_ids`) and selected category state (`shoplens_active_category`) in `localStorage` so selections persist across page reloads.

## How to Run
1. Extract the ZIP archive or clone the repository.
2. Open `index.html` directly in any modern web browser (or serve via VS Code Live Server / `python3 -m http.server`).
