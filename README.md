# 🍽️ Pesan Antar

A modern, mobile-first **online food delivery** web app. 100% client-side (HTML + CSS + Vanilla JS) — no backend, no build step. Deploys for free on **GitHub Pages**.

Orders are sent directly to the seller's WhatsApp as a nicely formatted message.

## ✨ Features

- 📱 Mobile-first responsive UI (Bootstrap 5)
- 🍜 Menu catalog with cards, category tabs, and real-time search
- 🛒 Shopping cart with quantity steppers, per-item notes, subtotal & flat delivery fee
- 💾 Cart persists in `localStorage` across reloads
- 🧾 Checkout form: name, phone, address, payment method (COD / Bank Transfer)
- 💬 One-click **Order via WhatsApp** — formatted order message, URL-encoded, opens in new tab
- 🎨 Font Awesome icons + Google Fonts (Poppins / Inter)
- 🚀 Zero build — just static files

## 📂 Project Structure

```
pesan-antar/
├── index.html         # Main page
├── css/style.css      # Custom styles
├── js/
│   ├── menu.js        # Menu items + app config (edit this!)
│   └── app.js         # App logic (cart, filters, WhatsApp)
├── .nojekyll          # Tells GitHub Pages to skip Jekyll
└── README.md
```

## ⚙️ Configuration

Open **`js/menu.js`** to customize:

```js
window.APP_CONFIG = {
  whatsappNumber: "62895332782122", // seller's WA number, no "+"
  deliveryFee: 10000,               // flat delivery fee in IDR
  brandName: "Pesan Antar",
  tagline:   "Makan enak, diantar cepat ke pintu rumah."
};
```

### Adding menu items

Each item needs:

| field         | type   | notes                                          |
| ------------- | ------ | ---------------------------------------------- |
| `id`          | string | unique slug                                    |
| `name`        | string | item name                                      |
| `category`    | enum   | `"Main Dishes"`, `"Snacks"`, or `"Beverages"`  |
| `price`       | number | in IDR (e.g. `25000`)                          |
| `description` | string | 1–2 lines                                      |
| `image`       | string | public image URL                               |

## 🖥️ Run locally

Any static file server works:

```bash
# Python 3
python -m http.server 8000
# then open http://localhost:8000
```

Or just double-click `index.html`.

## 🚀 Deploy to GitHub Pages

1. Push this repo to GitHub (branch `main`).
2. Go to **Settings → Pages**.
3. Under *Build and deployment*, choose **Deploy from a branch** → Branch: `main`, Folder: `/ (root)` → Save.
4. Your site will be live at `https://<username>.github.io/<repo>/` in ~1 minute.

No base-path configuration is required — all asset paths are relative.

## 📝 License

MIT — use it for your warung, catering, or weekend bake-sale. 🧡
