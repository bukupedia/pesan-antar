/* =========================================================
 * Pesan Antar — client-side food ordering app
 * Vanilla JS. Reads menu + config from window.MENU_ITEMS and
 * window.APP_CONFIG (see js/menu.js).
 * ========================================================= */
(function () {
  "use strict";

  const items = window.MENU_ITEMS || [];
  const cfg = window.APP_CONFIG || {};
  const CATEGORIES = ["All", "Main Dishes", "Snacks", "Beverages"];
  const STORAGE_KEY = "pesan-antar-cart-v1";

  // --- State ---
  /** cart: { [id]: { id, qty, note } } */
  let cart = loadCart();
  let activeCategory = "All";
  let searchQuery = "";

  // --- DOM refs ---
  const grid = document.getElementById("menu-grid");
  const tabsEl = document.getElementById("category-tabs");
  const searchInput = document.getElementById("search-input");
  const floatBar = document.getElementById("float-cart-bar");
  const floatCount = document.getElementById("float-count");
  const floatTotal = document.getElementById("float-total");
  const cartBtnCount = document.getElementById("cart-btn-count");
  const cartBody = document.getElementById("cart-body");
  const cartFooter = document.getElementById("cart-footer");
  const toastEl = document.getElementById("pa-toast");
  const yearEl = document.getElementById("year");
  const brandEls = document.querySelectorAll("[data-brand]");
  const taglineEl = document.getElementById("tagline");
  const statusEl = document.getElementById("store-status");

  // --- Utilities ---
  const formatIDR = (n) =>
    "Rp " + Math.round(n).toLocaleString("id-ID");

  const byId = (id) => items.find((it) => it.id === id);

  function loadCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }
  function saveCart() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch { /* storage unavailable: ignore */ }
  }

  function totalCount() {
    return Object.values(cart).reduce((s, c) => s + c.qty, 0);
  }
  function subtotal() {
    return Object.values(cart).reduce((s, c) => {
      const it = byId(c.id);
      return it ? s + it.price * c.qty : s;
    }, 0);
  }

  let toastTimer = null;
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 1500);
  }

  // --- Renderers ---
  function renderBrand() {
    brandEls.forEach((el) => (el.textContent = cfg.brandName || "Pesan Antar"));
    if (taglineEl) taglineEl.textContent = cfg.tagline || "";
    document.title = (cfg.brandName || "Pesan Antar") + " \u2014 Pesan Makanan Online";
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  // Store-open check: `openHour <= now < closeHour`. Supports overnight
  // windows too (e.g. 18 → 2) by comparing wrap-around.
  function isStoreOpen(date = new Date()) {
    const open = cfg.openHour ?? 8;
    const close = cfg.closeHour ?? 21;
    const h = date.getHours() + date.getMinutes() / 60;
    return open <= close ? h >= open && h < close : h >= open || h < close;
  }

  function renderStoreStatus() {
    if (!statusEl) return;
    const open = cfg.openHour ?? 8;
    const close = cfg.closeHour ?? 21;
    const fmt = (h) => String(h).padStart(2, "0") + ":00";
    const hours = `${fmt(open)}\u2013${fmt(close)}`;
    const isOpen = isStoreOpen();

    statusEl.classList.remove("pa-status-open", "pa-status-closed", "pa-status-unknown");
    statusEl.classList.add(isOpen ? "pa-status-open" : "pa-status-closed");
    statusEl.querySelector(".pa-status-label").textContent = isOpen ? "Buka" : "Tutup";
    statusEl.title = isOpen
      ? `Toko buka \u2022 ${hours}`
      : `Toko tutup \u2022 Jam buka ${hours}`;
  }

  function renderTabs() {
    tabsEl.innerHTML = "";
    CATEGORIES.forEach((cat) => {
      const btn = document.createElement("button");
      btn.className = "pa-tab" + (cat === activeCategory ? " active" : "");
      btn.type = "button";
      btn.textContent = cat;
      btn.addEventListener("click", () => {
        activeCategory = cat;
        renderTabs();
        renderMenu();
      });
      tabsEl.appendChild(btn);
    });
  }

  function filterItems() {
    const q = searchQuery.trim().toLowerCase();
    return items.filter((it) => {
      const catOk = activeCategory === "All" || it.category === activeCategory;
      if (!catOk) return false;
      if (!q) return true;
      return (
        it.name.toLowerCase().includes(q) ||
        it.description.toLowerCase().includes(q) ||
        it.category.toLowerCase().includes(q)
      );
    });
  }

  function renderMenu() {
    const list = filterItems();
    if (!list.length) {
      grid.innerHTML = `
        <div class="col-12">
          <div class="pa-empty">
            <i class="fa-regular fa-face-frown-open"></i>
            <h5>Menu tidak ditemukan</h5>
            <p class="mb-0">Coba kata kunci lain atau pilih kategori berbeda.</p>
          </div>
        </div>`;
      return;
    }

    grid.innerHTML = list.map(renderCard).join("");

    // attach handlers
    grid.querySelectorAll("[data-add]").forEach((btn) => {
      btn.addEventListener("click", () => addToCart(btn.dataset.add));
    });
    grid.querySelectorAll("[data-inc]").forEach((btn) => {
      btn.addEventListener("click", () => changeQty(btn.dataset.inc, +1));
    });
    grid.querySelectorAll("[data-dec]").forEach((btn) => {
      btn.addEventListener("click", () => changeQty(btn.dataset.dec, -1));
    });
    grid.querySelectorAll("[data-details]").forEach((btn) => {
      btn.addEventListener("click", () => openDetails(btn.dataset.details));
    });

    // After paint, hide the "Details" link on cards whose description fits
    // in the 2-line clamp (no truncation).
    requestAnimationFrame(() => {
      grid.querySelectorAll(".pa-desc").forEach((p) => {
        const truncated = p.scrollHeight - p.clientHeight > 1;
        const link = p.nextElementSibling;
        if (link && link.classList.contains("pa-details-link")) {
          link.hidden = !truncated;
        }
      });
    });
  }

  function renderCard(it) {
    const inCart = cart[it.id];
    const controls = inCart
      ? `<div class="pa-qty">
           <button type="button" data-dec="${it.id}" aria-label="Kurangi">−</button>
           <span class="pa-qty-val">${inCart.qty}</span>
           <button type="button" data-inc="${it.id}" aria-label="Tambah">+</button>
         </div>`
      : `<button type="button" class="pa-add-btn" data-add="${it.id}">
           <i class="fa-solid fa-plus"></i> Tambah
         </button>`;

    return `
      <div class="col-6 col-md-4 col-lg-3">
        <article class="pa-card">
          <div class="pa-card-img" style="background-image:url('${it.image}')">
            <span class="pa-card-cat">${it.category}</span>
          </div>
          <div class="pa-card-body">
            <h5>${it.name}</h5>
            <p class="pa-desc">${it.description}</p>
            <button type="button" class="pa-details-link" data-details="${it.id}" hidden>
              Detail <i class="fa-solid fa-chevron-right"></i>
            </button>
            <div class="pa-card-footer">
              <span class="pa-price">${formatIDR(it.price)}</span>
              ${controls}
            </div>
          </div>
        </article>
      </div>`;
  }

  // --- Details modal ---
  let detailModalInst = null;
  function openDetails(id) {
    const it = byId(id);
    if (!it) return;
    document.getElementById("detail-img").style.backgroundImage = `url('${it.image}')`;
    document.getElementById("detail-cat").textContent = it.category;
    document.getElementById("detailTitle").textContent = it.name;
    document.getElementById("detail-desc").textContent = it.description;
    document.getElementById("detail-price").textContent = formatIDR(it.price);
    const addBtn = document.getElementById("detail-add");
    addBtn.onclick = () => {
      addToCart(it.id);
      detailModalInst && detailModalInst.hide();
    };
    detailModalInst = bootstrap.Modal.getOrCreateInstance(document.getElementById("detail-modal"));
    detailModalInst.show();
  }

  // --- Cart actions ---
  function addToCart(id) {
    if (!byId(id)) return;
    if (!cart[id]) cart[id] = { id, qty: 0, note: "" };
    cart[id].qty += 1;
    const name = byId(id).name;
    afterCartChange();
    showToast(`${name} ditambahkan`);
  }

  function changeQty(id, delta) {
    if (!cart[id]) return;
    cart[id].qty += delta;
    if (cart[id].qty <= 0) delete cart[id];
    afterCartChange();
  }

  function removeFromCart(id) {
    delete cart[id];
    afterCartChange();
  }

  function clearCart() {
    cart = {};
    afterCartChange();
  }

  function setNote(id, note) {
    if (cart[id]) {
      cart[id].note = note;
      saveCart();
    }
  }

  function afterCartChange() {
    saveCart();
    renderMenu();      // refresh card qty controls
    renderCart();      // refresh cart panel if open
    renderFloatBar();
    renderCartBadge();
    refreshWaButton();
  }

  function renderCartBadge() {
    const c = totalCount();
    if (c > 0) {
      cartBtnCount.textContent = c;
      cartBtnCount.classList.remove("d-none");
    } else {
      cartBtnCount.classList.add("d-none");
    }
  }

  function renderFloatBar() {
    const c = totalCount();
    if (c === 0) {
      floatBar.classList.remove("visible");
      return;
    }
    floatCount.textContent = c === 1 ? "1 item" : `${c} items`;
    floatTotal.textContent = formatIDR(subtotal());
    floatBar.classList.add("visible");
  }

  function refreshWaButton() {
    const empty = totalCount() === 0;
    const waBtn = document.getElementById("wa-btn");
    const copyBtn = document.getElementById("copy-btn");
    if (waBtn) waBtn.disabled = empty;
    if (copyBtn) copyBtn.disabled = empty;
  }

  // --- Cart panel (offcanvas) ---
  function renderCart() {
    const ids = Object.keys(cart);
    if (!ids.length) {
      cartBody.innerHTML = `
        <div class="pa-empty">
          <i class="fa-solid fa-basket-shopping"></i>
          <h5>Keranjang masih kosong</h5>
          <p class="mb-0">Yuk pilih menu favoritmu dulu!</p>
        </div>`;
      cartFooter.classList.add("d-none");
      return;
    }

    cartFooter.classList.remove("d-none");

    const rows = ids.map((id) => {
      const entry = cart[id];
      const it = byId(id);
      if (!it) return "";
      const line = it.price * entry.qty;
      return `
        <div class="pa-cart-item" data-row="${id}">
          <img src="${it.image}" alt="${it.name}" loading="lazy">
          <div class="pa-cart-item-body">
            <h6>${it.name}</h6>
            <div class="pa-sub">${formatIDR(it.price)} • Subtotal <strong>${formatIDR(line)}</strong></div>
            <input type="text" class="pa-note" placeholder="Catatan (misal: pedas, tanpa bawang)"
                   value="${escapeAttr(entry.note || "")}" data-note="${id}" maxlength="120">
          </div>
          <div class="pa-cart-item-actions">
            <button type="button" class="pa-remove-btn" data-remove="${id}" aria-label="Hapus">
              <i class="fa-regular fa-trash-can"></i>
            </button>
            <div class="pa-qty pa-qty-dark">
              <button type="button" data-dec="${id}" aria-label="Kurangi">−</button>
              <span class="pa-qty-val">${entry.qty}</span>
              <button type="button" data-inc="${id}" aria-label="Tambah">+</button>
            </div>
          </div>
        </div>`;
    }).join("");

    const sub = subtotal();
    const fee = cfg.deliveryFee || 0;
    const total = sub + fee;

    cartBody.innerHTML = `
      <div class="pa-cart-list">${rows}</div>
      <div class="pa-totals">
        <div class="row-line"><span>Subtotal</span><span>${formatIDR(sub)}</span></div>
        <div class="row-line"><span>Ongkos kirim</span><span>${formatIDR(fee)}</span></div>
        <div class="row-line total"><span>Total</span><span>${formatIDR(total)}</span></div>
      </div>
    `;

    cartBody.querySelectorAll("[data-inc]").forEach((b) =>
      b.addEventListener("click", () => changeQty(b.dataset.inc, +1)));
    cartBody.querySelectorAll("[data-dec]").forEach((b) =>
      b.addEventListener("click", () => changeQty(b.dataset.dec, -1)));
    cartBody.querySelectorAll("[data-remove]").forEach((b) =>
      b.addEventListener("click", () => removeFromCart(b.dataset.remove)));
    cartBody.querySelectorAll("[data-note]").forEach((inp) =>
      inp.addEventListener("input", (e) => setNote(inp.dataset.note, e.target.value)));
  }

  function escapeAttr(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // --- Checkout / WhatsApp ---
  function buildWhatsAppMessage(form) {
    const { name, phone, address, payment } = form;
    const brand = cfg.brandName || "Pesan Antar";
    // Non-ASCII chars are written as \u escapes so the message is
    // identical regardless of how the server labels this file's charset.
    const EM_DASH = "\u2014";   // —
    const PRAY    = "\uD83D\uDE4F"; // 🙏
    const lines = [];
    lines.push(`*Pesanan Baru ${EM_DASH} ${brand}*`);
    lines.push("");
    lines.push(`*Nama:* ${name}`);
    lines.push(`*No. HP:* ${phone}`);
    lines.push(`*Alamat:* ${address}`);
    lines.push(`*Pembayaran:* ${payment}`);
    lines.push("");
    lines.push("*Rincian Pesanan:*");

    let idx = 1;
    const sub = subtotal();
    Object.values(cart).forEach((entry) => {
      const it = byId(entry.id);
      if (!it) return;
      const line = it.price * entry.qty;
      lines.push(`${idx}. ${it.name} x${entry.qty} ${EM_DASH} ${formatIDR(line)}`);
      if (entry.note && entry.note.trim()) {
        lines.push(`   _Catatan: ${entry.note.trim()}_`);
      }
      idx += 1;
    });

    const fee = cfg.deliveryFee || 0;
    lines.push("");
    lines.push(`Subtotal: ${formatIDR(sub)}`);
    lines.push(`Ongkos kirim: ${formatIDR(fee)}`);
    lines.push(`*Total: ${formatIDR(sub + fee)}*`);
    lines.push("");
    lines.push(`Terima kasih! ${PRAY}`);

    return lines.join("\n");
  }

  function readCheckoutForm() {
    return {
      name: document.getElementById("c-name").value.trim(),
      phone: document.getElementById("c-phone").value.trim(),
      address: document.getElementById("c-address").value.trim(),
      payment: document.getElementById("c-payment").value,
    };
  }

  // Try the async Clipboard API first; fall back to a hidden textarea +
  // `execCommand("copy")` for browsers that block it (e.g. non-HTTPS pages).
  async function copyTextToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch { /* fall through */ }
    }
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;top:-1000px;left:-1000px;opacity:0;";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  function initCheckoutForm() {
    const form = document.getElementById("checkout-form");
    const copyBtn = document.getElementById("copy-btn");
    const copyLabel = copyBtn.querySelector(".pa-copy-label");
    const originalCopyLabel = copyLabel.textContent;
    const cartCanvasEl = document.getElementById("cart-canvas");

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (totalCount() === 0) {
        showToast("Keranjang masih kosong");
        return;
      }

      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
      }

      const msg = buildWhatsAppMessage(readCheckoutForm());
      const url = `https://wa.me/${cfg.whatsappNumber}?text=${encodeURIComponent(msg)}`;
      window.open(url, "_blank", "noopener");

      // Order has been handed off to WhatsApp — reset cart + form so the
      // customer gets a clean state when they return to the browser tab.
      form.reset();
      form.classList.remove("was-validated");
      clearCart();
      bootstrap.Offcanvas.getOrCreateInstance(cartCanvasEl).hide();
      showToast("Pesanan terkirim! Keranjang dikosongkan.");
    });

    copyBtn.addEventListener("click", async () => {
      if (totalCount() === 0) {
        showToast("Keranjang masih kosong");
        return;
      }
      // Form filled is optional for copying — if valid, include it in the
      // message so the seller still gets the customer info.
      const msg = buildWhatsAppMessage(readCheckoutForm());
      const ok = await copyTextToClipboard(msg);
      if (ok) {
        copyBtn.classList.add("pa-copy-done");
        copyLabel.textContent = "Tersalin \u2713";
        showToast("Detail pesanan disalin");
        setTimeout(() => {
          copyBtn.classList.remove("pa-copy-done");
          copyLabel.textContent = originalCopyLabel;
        }, 2500);
      } else {
        showToast("Gagal menyalin, coba lagi");
      }
    });

    // Enable action buttons only when the cart has items.
    cartCanvasEl.addEventListener("shown.bs.offcanvas", refreshWaButton);
    refreshWaButton();
  }

  // --- Events ---
  function initEvents() {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      renderMenu();
    });

    floatBar.addEventListener("click", () => {
      const canvas = bootstrap.Offcanvas.getOrCreateInstance(
        document.getElementById("cart-canvas")
      );
      canvas.show();
    });
  }

  // --- Boot ---
  document.addEventListener("DOMContentLoaded", () => {
    renderBrand();
    renderStoreStatus();
    renderTabs();
    renderMenu();
    renderCart();
    renderFloatBar();
    renderCartBadge();
    initEvents();
    initCheckoutForm();

    // Re-check the open/closed status every minute so it flips exactly
    // on the opening/closing hour without needing a reload.
    setInterval(renderStoreStatus, 60 * 1000);
  });
})();
