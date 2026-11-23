/**
 * Menu data for Pesan Antar.
 * Edit this file to add, remove, or change menu items.
 * Categories must be one of: "Main Dishes", "Snacks", "Beverages".
 */
window.MENU_ITEMS = [
  // ---------- Main Dishes ----------
  {
    id: "nasi-goreng-spesial",
    name: "Nasi Goreng Spesial",
    category: "Main Dishes",
    price: 25000,
    description: "Nasi goreng khas rumahan dengan telur mata sapi, ayam suwir, dan kerupuk.",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "mie-ayam-bakso",
    name: "Mie Ayam Bakso",
    category: "Main Dishes",
    price: 22000,
    description: "Mie kenyal dengan topping ayam cincang bumbu, bakso sapi, dan sawi hijau.",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "ayam-geprek-sambal-matah",
    name: "Ayam Geprek Sambal Matah",
    category: "Main Dishes",
    price: 28000,
    description: "Ayam crispy digeprek dengan sambal matah segar, nasi putih hangat, dan lalapan.",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "sate-ayam-madura",
    name: "Sate Ayam Madura (10 Tusuk)",
    category: "Main Dishes",
    price: 32000,
    description: "Sate ayam bakar arang disiram bumbu kacang kental, dengan lontong dan acar.",
    image: "https://images.unsplash.com/photo-1529563021893-cc83c992d75d?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "soto-ayam-kuning",
    name: "Soto Ayam Kuning",
    category: "Main Dishes",
    price: 23000,
    description: "Kuah kuning bening berempah dengan suwiran ayam, bihun, telur, dan taburan bawang goreng.",
    image: "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "nasi-rendang",
    name: "Nasi Rendang Daging",
    category: "Main Dishes",
    price: 35000,
    description: "Rendang daging sapi empuk dimasak lama dengan rempah khas Padang, disajikan dengan nasi.",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&auto=format&fit=crop&q=60"
  },

  // ---------- Snacks ----------
  {
    id: "pisang-goreng-madu",
    name: "Pisang Goreng Madu (5 pcs)",
    category: "Snacks",
    price: 15000,
    description: "Pisang kepok matang dibalut adonan renyah disajikan dengan drizzle madu.",
    image: "https://images.unsplash.com/photo-1623855244183-52fd8d3ce2f7?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "tahu-crispy",
    name: "Tahu Crispy Cabai Garam",
    category: "Snacks",
    price: 13000,
    description: "Tahu goreng kriuk dengan taburan bumbu cabai garam gurih pedas.",
    image: "https://images.unsplash.com/photo-1625938145312-c0a7a6050b73?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "kentang-goreng",
    name: "Kentang Goreng",
    category: "Snacks",
    price: 18000,
    description: "French fries hangat dengan saus mayo dan saus tomat sebagai pelengkap.",
    image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "dimsum-ayam",
    name: "Dimsum Ayam (6 pcs)",
    category: "Snacks",
    price: 20000,
    description: "Siomay ayam kukus lembut dengan saus asam manis dan minyak cabai.",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "roti-bakar-coklat",
    name: "Roti Bakar Coklat Keju",
    category: "Snacks",
    price: 17000,
    description: "Roti panggang mentega dengan topping coklat meses dan keju parut melimpah.",
    image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600&auto=format&fit=crop&q=60"
  },

  // ---------- Beverages ----------
  {
    id: "es-teh-manis",
    name: "Es Teh Manis",
    category: "Beverages",
    price: 6000,
    description: "Teh seduh segar dengan es batu dan pemanis pas, pelepas dahaga klasik.",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "es-jeruk-peras",
    name: "Es Jeruk Peras",
    category: "Beverages",
    price: 10000,
    description: "Perasan jeruk segar asli tanpa pemanis buatan, disajikan dingin.",
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "kopi-susu-gula-aren",
    name: "Kopi Susu Gula Aren",
    category: "Beverages",
    price: 18000,
    description: "Espresso dicampur susu segar dan gula aren cair khas kedai kopi kekinian.",
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "jus-alpukat",
    name: "Jus Alpukat Coklat",
    category: "Beverages",
    price: 20000,
    description: "Jus alpukat creamy dengan susu kental manis coklat, kaya dan mengenyangkan.",
    image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=600&auto=format&fit=crop&q=60"
  },
  {
    id: "air-mineral",
    name: "Air Mineral 600ml",
    category: "Beverages",
    price: 5000,
    description: "Air mineral dalam kemasan botol dingin untuk menemani makan Anda.",
    image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&auto=format&fit=crop&q=60"
  }
];

window.APP_CONFIG = {
  // WhatsApp destination number in international format without + sign.
  whatsappNumber: "62895332782122",
  // Flat delivery fee in IDR.
  deliveryFee: 10000,
  // Business/brand name used across the UI.
  brandName: "Pesan Antar",
  // Short tagline shown under the brand.
  tagline: "Makan enak, diantar cepat ke pintu rumah.",
  // Opening hours (24h, user's local time). Store is open when
  // openHour <= currentHour < closeHour.
  openHour: 8,
  closeHour: 21
};
