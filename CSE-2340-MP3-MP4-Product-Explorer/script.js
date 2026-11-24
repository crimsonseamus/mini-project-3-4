// =========================================================
// ShopLens — Interactive API-Driven Product Explorer
// Course: Software Development I (CSE-2340) | MP3-MP4
// =========================================================

const API_URL = "https://dummyjson.com/products?limit=24";
const STORAGE_KEYS = {
  SAVED_IDS: "shoplens_saved_product_ids",
  ACTIVE_CATEGORY: "shoplens_active_category"
};

// Application State
const state = {
  products: [],
  searchQuery: "",
  activeCategory: loadSavedCategory(),
  sortBy: "default",
  savedIds: loadSavedIds()
};

// DOM Selectors
const dom = {
  searchInput: document.getElementById("search-input"),
  sortSelect: document.getElementById("sort-select"),
  categoryFilters: document.getElementById("category-filters"),
  resultsCount: document.getElementById("results-count"),
  productGrid: document.getElementById("product-grid"),
  loadingState: document.getElementById("loading-state"),
  errorState: document.getElementById("error-state"),
  errorMessage: document.getElementById("error-message"),
  emptyState: document.getElementById("empty-state"),
  emptyMessage: document.getElementById("empty-message"),
  retryBtn: document.getElementById("retry-btn"),
  resetFiltersBtn: document.getElementById("reset-filters-btn"),
  viewSavedBtn: document.getElementById("view-saved-btn"),
  clearSavedBtn: document.getElementById("clear-saved-btn"),
  savedCount: document.getElementById("saved-count"),
  productModal: document.getElementById("product-modal"),
  modalBody: document.getElementById("modal-body"),
  closeModalBtn: document.getElementById("close-modal-btn")
};

// ---------------------------------------------------------
// Local Storage Helpers (MP4)
// ---------------------------------------------------------
function loadSavedIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_IDS);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to read saved items from localStorage:", err);
    return [];
  }
}

function persistSavedIds() {
  localStorage.setItem(STORAGE_KEYS.SAVED_IDS, JSON.stringify(state.savedIds));
  updateSavedBadge();
}

function loadSavedCategory() {
  return localStorage.getItem(STORAGE_KEYS.ACTIVE_CATEGORY) || "all";
}

function persistActiveCategory(category) {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_CATEGORY, category);
}

function updateSavedBadge() {
  dom.savedCount.textContent = state.savedIds.length;
  dom.viewSavedBtn.classList.toggle("active", state.activeCategory === "saved");
}

// ---------------------------------------------------------
// API Integration & Async Operations (MP4)
// ---------------------------------------------------------
async function fetchProducts() {
  showState("loading");

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const data = await response.json();

    // Transform API data using Array.prototype.map()
    state.products = (data.products || []).map((item) => ({
      id: item.id,
      title: item.title,
      brand: item.brand || "Generic",
      category: item.category,
      description: item.description,
      price: Number(item.price),
      rating: Number(item.rating),
      stock: item.stock,
      discountPercentage: item.discountPercentage || 0,
      thumbnail: item.thumbnail
    }));

    renderCategoryFilters();
    applyFiltersAndRender();
  } catch (error) {
    dom.errorMessage.textContent =
      error.message || "Network error. Please check your internet connection and try again.";
    showState("error");
  }
}

function showState(view) {
  dom.loadingState.classList.toggle("hidden", view !== "loading");
  dom.errorState.classList.toggle("hidden", view !== "error");
  dom.emptyState.classList.toggle("hidden", view !== "empty");
  dom.productGrid.classList.toggle("hidden", view !== "grid");
}

// ---------------------------------------------------------
// Dynamic Rendering & DOM Manipulation (MP3)
// ---------------------------------------------------------
function renderCategoryFilters() {
  const uniqueCategories = ["all", "saved", ...new Set(state.products.map((p) => p.category))];

  // Validate persisted category against loaded categories
  if (!uniqueCategories.includes(state.activeCategory)) {
    state.activeCategory = "all";
    persistActiveCategory("all");
  }

  dom.categoryFilters.innerHTML = "";

  uniqueCategories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "pill-btn";
    if (category === state.activeCategory) {
      button.classList.add("active");
    }
    button.dataset.category = category;
    button.textContent = category === "saved" ? "Saved Wishlist" : category;

    button.addEventListener("click", () => {
      state.activeCategory = category;
      persistActiveCategory(category);
      updateActiveCategoryPill();
      updateSavedBadge();
      applyFiltersAndRender();
    });

    dom.categoryFilters.appendChild(button);
  });
}

function updateActiveCategoryPill() {
  const pills = dom.categoryFilters.querySelectorAll(".pill-btn");
  pills.forEach((pill) => {
    pill.classList.toggle("active", pill.dataset.category === state.activeCategory);
  });
}

function applyFiltersAndRender() {
  const query = state.searchQuery.trim().toLowerCase();

  // Filter items using Array.prototype.filter()
  let filtered = state.products.filter((product) => {
    const matchesCategory =
      state.activeCategory === "all"
        ? true
        : state.activeCategory === "saved"
        ? state.savedIds.includes(product.id)
        : product.category === state.activeCategory;

    const matchesSearch =
      !query ||
      product.title.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  // Sort copy of filtered list
  if (state.sortBy === "price-asc") {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (state.sortBy === "price-desc") {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  } else if (state.sortBy === "rating-desc") {
    filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  }

  dom.resultsCount.textContent = `Showing ${filtered.length} of ${state.products.length} products`;

  if (filtered.length === 0) {
    dom.emptyMessage.textContent =
      state.activeCategory === "saved" && state.savedIds.length === 0
        ? "You haven't saved any products yet. Click 'Save' on any item to store it in Local Storage."
        : "No products match your current search or filter criteria.";
    showState("empty");
    return;
  }

  renderProductCards(filtered);
  showState("grid");
}

function renderProductCards(items) {
  dom.productGrid.innerHTML = "";

  items.forEach((product) => {
    const isSaved = state.savedIds.includes(product.id);

    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="card-image-wrap">
        <span class="card-category">${escapeHtml(product.category)}</span>
        <img src="${escapeHtml(product.thumbnail)}" alt="${escapeHtml(product.title)}" loading="lazy" />
      </div>
      <div class="card-body">
        <span class="card-brand">${escapeHtml(product.brand)}</span>
        <h3 class="card-title">${escapeHtml(product.title)}</h3>
        <p class="card-desc">${escapeHtml(product.description)}</p>
        <div class="card-meta">
          <span class="card-price">$${product.price.toFixed(2)}</span>
          <span class="card-rating">&#9733; ${product.rating.toFixed(1)}</span>
        </div>
        <div class="card-actions">
          <button type="button" class="btn btn-outline details-btn" data-id="${product.id}">
            View Details
          </button>
          <button type="button" class="btn btn-outline btn-save ${isSaved ? "saved" : ""}" data-id="${product.id}">
            ${isSaved ? "Saved &#10003;" : "Save"}
          </button>
        </div>
      </div>
    `;

    // Attach event listeners to card buttons
    const detailsBtn = card.querySelector(".details-btn");
    const saveBtn = card.querySelector(".btn-save");

    detailsBtn.addEventListener("click", () => openProductModal(product.id));
    saveBtn.addEventListener("click", () => toggleSaveProduct(product.id));

    dom.productGrid.appendChild(card);
  });
}

// ---------------------------------------------------------
// User Interactions & Item Selection (MP3 + MP4)
// ---------------------------------------------------------
function toggleSaveProduct(productId) {
  if (state.savedIds.includes(productId)) {
    state.savedIds = state.savedIds.filter((id) => id !== productId);
  } else {
    state.savedIds.push(productId);
  }

  persistSavedIds();
  applyFiltersAndRender();

  // If modal is currently open for this product, refresh its button state
  if (!dom.productModal.classList.contains("hidden")) {
    openProductModal(productId);
  }
}

function openProductModal(productId) {
  // Locate selected product using Array.prototype.find()
  const product = state.products.find((item) => item.id === productId);
  if (!product) return;

  const isSaved = state.savedIds.includes(product.id);

  dom.modalBody.innerHTML = `
    <div class="modal-grid">
      <div class="modal-image">
        <img src="${escapeHtml(product.thumbnail)}" alt="${escapeHtml(product.title)}" />
      </div>
      <div class="modal-details">
        <span class="card-brand">${escapeHtml(product.brand)} &bull; ${escapeHtml(product.category)}</span>
        <h2 id="modal-title">${escapeHtml(product.title)}</h2>
        <p>${escapeHtml(product.description)}</p>
        <ul class="modal-specs">
          <li><strong>Price:</strong> <span>$${product.price.toFixed(2)}</span></li>
          <li><strong>Discount:</strong> <span>${product.discountPercentage}% off</span></li>
          <li><strong>Rating:</strong> <span>&#9733; ${product.rating.toFixed(2)} / 5.0</span></li>
          <li><strong>Availability:</strong> <span>${product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</span></li>
        </ul>
        <button id="modal-save-btn" type="button" class="btn ${isSaved ? "btn-outline btn-save saved" : "btn-primary"}">
          ${isSaved ? "Saved in Wishlist &#10003;" : "Save to Wishlist"}
        </button>
      </div>
    </div>
  `;

  const modalSaveBtn = document.getElementById("modal-save-btn");
  modalSaveBtn.addEventListener("click", () => toggleSaveProduct(product.id));

  dom.productModal.classList.remove("hidden");
}

function closeProductModal() {
  dom.productModal.classList.add("hidden");
}

function resetAllFilters() {
  state.searchQuery = "";
  state.activeCategory = "all";
  state.sortBy = "default";

  dom.searchInput.value = "";
  dom.sortSelect.value = "default";
  persistActiveCategory("all");
  updateActiveCategoryPill();
  updateSavedBadge();
  applyFiltersAndRender();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ---------------------------------------------------------
// Global Event Listeners (MP3)
// ---------------------------------------------------------
function initEventListeners() {
  dom.searchInput.addEventListener("input", (event) => {
    state.searchQuery = event.target.value;
    applyFiltersAndRender();
  });

  dom.sortSelect.addEventListener("change", (event) => {
    state.sortBy = event.target.value;
    applyFiltersAndRender();
  });

  dom.retryBtn.addEventListener("click", fetchProducts);
  dom.resetFiltersBtn.addEventListener("click", resetAllFilters);

  dom.viewSavedBtn.addEventListener("click", () => {
    state.activeCategory = state.activeCategory === "saved" ? "all" : "saved";
    persistActiveCategory(state.activeCategory);
    updateActiveCategoryPill();
    updateSavedBadge();
    applyFiltersAndRender();
  });

  dom.clearSavedBtn.addEventListener("click", () => {
    state.savedIds = [];
    persistSavedIds();
    applyFiltersAndRender();
  });

  dom.closeModalBtn.addEventListener("click", closeProductModal);

  dom.productModal.addEventListener("click", (event) => {
    if (event.target === dom.productModal) {
      closeProductModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !dom.productModal.classList.contains("hidden")) {
      closeProductModal();
    }
  });
}

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  updateSavedBadge();
  initEventListeners();
  fetchProducts();
});
