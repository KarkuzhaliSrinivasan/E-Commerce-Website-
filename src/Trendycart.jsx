// Trendycart.jsx — FULL merged file with Add-to-Cart + Cart modal (RESULTS COUNT REMOVED)
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Trendycart.scss";
import "./data.scss";
import Addtocart from "./Addtocart";
import BuyPage from './BuyPage'; // correct path


// import { useNavigate } from "react-router-dom";


const urls = {
  mens: "http://localhost:7890/Mens wear",
  womens: "http://localhost:7890/Womens wear",
  kidsBoys: "http://localhost:7890/Kidsboys",
  kidsGirls: "http://localhost:7890/KidsGirls",
  laptop: "http://localhost:7890/Laptop",
  mobiles: "http://localhost:7890/Mobiles",
  tabs: "http://localhost:7890/Tabs",
  bluetooth: "http://localhost:7890/Bluetooth",
  earpods: "http://localhost:7890/Earpods",
};

// const [showAddtocart, setShowAddtocart] = useState(false);

const parsePrice = (p) => {
  if (!p && p !== 0) return 0;
  const cleaned = String(p).replace(/[^\d]/g, "");
  return Number(cleaned) || 0;
};

function levenshtein(a = "", b = "") {
  a = a.toLowerCase();
  b = b.toLowerCase();
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}
// Highlight matched substring in text (returns JSX)
const highlight = (text = "", query = "") => {
  if (!query) return text;
  const q = String(query).toLowerCase();
  const lower = text.toLowerCase();
  const idx = lower.indexOf(q);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="hl">{text.slice(idx, idx + q.length)}</span>
      {text.slice(idx + q.length)}
    </>
  );
};
// Very small "AI tag prediction": map some keywords to tags
const tagPredict = (q) => {
  const t = q.toLowerCase();
  const tags = new Set();
  if (t.includes("shirt") || t.includes("t-shirt") || t.includes("kurta")) tags.add("clothing");
  if (t.includes("lap") || t.includes("hp") || t.includes("dell") || t.includes("acer")) tags.add("laptop");
  if (t.includes("bluetooth") || t.includes("nb") || t.includes("rockerz")) tags.add("audio");
  if (t.includes("kids")) tags.add("kids");
  if (t.includes("women") || t.includes("women")) tags.add("women");
  return Array.from(tags);
};

function Trendycart({ onLogout }) {

  const [showBuyPage, setShowBuyPage] = useState(false);
const [buyItem, setBuyItem] = useState(null);


  const [showAddtocart, setShowAddtocart] = useState(false);

  // Voice Search
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  useEffect(() => {
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false;
      recog.interimResults = false;
      recog.lang = "en-US";
      recog.onstart = () => setListening(true);
      recog.onend = () => setListening(false);
      recog.onerror = () => setListening(false);
      recog.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setSearchTerm(text);
        pushRecent(text);
        setShowSuggest(true);
      };
      recognitionRef.current = recog;
    }
  }, []);

  // data per category
  const [mens, setMens] = useState([]);
  const [womens, setWomens] = useState([]);
  const [kidsBoys, setKidsBoys] = useState([]);
  const [kidsGirls, setKidsGirls] = useState([]);
  const [laptop, setLaptop] = useState([]);
  const [mobiles, setMobiles] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [bluetooth, setBluetooth] = useState([]);
  const [earpods, setEarpods] = useState([]);
  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggest, setShowSuggest] = useState(true);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem("trendycart_wish") || "[]"); } catch { return []; }
  });
  const [sortMode, setSortMode] = useState(""); // "" | "low" | "high"
  const inputRef = useRef(null);
  const suggestRef = useRef(null);
  const debounceRef = useRef(null);

  // --- NEW: cart state + cart modal open
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem("trendycart_cart") || "[]"); } catch { return []; }
  });
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("trendycart_cart", JSON.stringify(cart));
  }, [cart]);
const addToCart = (item) => {
  if (!item || !item.id) return;

  const cart = JSON.parse(localStorage.getItem("trendycart_cart")) || [];
  const found = cart.find(p => p.id === item.id);

  const updatedCart = found
    ? cart.map(p =>
        p.id === item.id ? { ...p, qty: (p.qty || 1) + 1 } : p
      )
    : [...cart, { ...item, qty: 1 }];

  localStorage.setItem("trendycart_cart", JSON.stringify(updatedCart));

  setShowAddtocart(true);
  // 🔥 THIS is your "next page"
};

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(p => p.id !== id));
  };

  const changeQty = (id, delta) => {
    setCart(prev => prev.map(p => p.id === id ? { ...p, qty: Math.max(1, (p.qty || 1) + delta) } : p));
  };

  const cartTotal = cart.reduce((acc, it) => acc + (parsePrice(it.price) * (it.qty || 1)), 0);

  // load data
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const [
          resMens, resWomens, resKidsBoys, resKidsGirls, resLap, resMob, resTabs, resBlue, resEar
        ] = await Promise.allSettled([
          axios.get(urls.mens),
          axios.get(urls.womens),
          axios.get(urls.kidsBoys),
          axios.get(urls.kidsGirls),
          axios.get(urls.laptop),
          axios.get(urls.mobiles),
          axios.get(urls.tabs),
          axios.get(urls.bluetooth),
          axios.get(urls.earpods),
        ]);
        if (!mounted) return;

        if (resMens.status === "fulfilled") setMens(resMens.value.data || []);
        if (resWomens.status === "fulfilled") setWomens(resWomens.value.data || []);
        if (resKidsBoys.status === "fulfilled") setKidsBoys(resKidsBoys.value.data || []);
        if (resKidsGirls.status === "fulfilled") setKidsGirls(resKidsGirls.value.data || []);
        if (resLap.status === "fulfilled") setLaptop(resLap.value.data || []);
        if (resMob.status === "fulfilled") setMobiles(resMob.value.data || []);
        if (resTabs.status === "fulfilled") setTabs(resTabs.value.data || []);
        if (resBlue.status === "fulfilled") setBluetooth(resBlue.value.data || []);
        if (resEar.status === "fulfilled") setEarpods(resEar.value.data || []);
      } catch (err) {
        console.log("fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    // load recents
    try {
      const r = JSON.parse(localStorage.getItem("trendycart_recents") || "[]");
      setRecent(Array.isArray(r) ? r : []);
    } catch { setRecent([]); }
    load();

    // click outside suggestions to close
    const docClick = (e) => {
      if (suggestRef.current && !suggestRef.current.contains(e.target) && inputRef.current && e.target !== inputRef.current) {
        setShowSuggest(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("click", docClick);
    return () => {
      mounted = false;
      document.removeEventListener("click", docClick);
    };
  }, []);

  // store wishlist changes
  useEffect(() => {
    localStorage.setItem("trendycart_wish", JSON.stringify(wishlist));
  }, [wishlist]);

  // Utility normalizer: multi-keyword matching
  const normalize = (str) => (str ? String(str).toLowerCase().trim() : "");

  // Combined arrays
  const sections = [
    { title: "Mens Wear", key: "mens wear", data: mens },
    { title: "Womens Wear", key: "womens wear", data: womens },
    { title: "Kids Boys Wear", key: "kids boys wear", data: kidsBoys },
    { title: "Kids Girls Wear", key: "kids girls wear", data: kidsGirls },
    { title: "Laptops", key: "laptop", data: laptop },
    { title: "Mobiles", key: "mobile", data: mobiles },
    { title: "Tabs", key: "tabs", data: tabs },
    { title: "Bluetooth", key: "bluetooth", data: bluetooth },
    { title: "Earpods", key: "earpods", data: earpods },
  ];
  const allProducts = sections.flatMap(s => s.data || []);

  // Debounced input handler (300ms)
  const setTermDebounced = (val) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchTerm(val);
    }, 300);
  };

  // Suggestion base/trending list
  const baseSuggestions = ["mens wear","womens wear","kids boys wear",
  "kids girls wear","laptop","mobile","tabs",
  "bluetooth","earpods","shirt","kurta","jeans","t-shirt","charger","airbuds","redmi","hp","dell",];
  // combined suggestions: recent first then base unique
  const combinedSuggestions = Array.from(new Set([...recent, ...baseSuggestions.map(s => s.toLowerCase())]));
  // Suggestion filter: startsWith (per-letter)
  const suggestions = combinedSuggestions.filter(s => {
    if (!searchTerm) return true; // show recents when empty
    return s.toLowerCase().startsWith(searchTerm.toLowerCase());
  });
  // Advanced suggestion groups: categories + titles that match startsWith
  const suggestionGroups = sections.map(sec => {
    const items = (sec.data || []).filter(it => normalize(it.title).startsWith(normalize(searchTerm)));
    return { title: sec.title, key: sec.key, items };
  }).filter(g => g.items && g.items.length > 0);

  // Search filter for products (multi-keyword & partial matching)
  const filterProducts = (list) => {
    const q = normalize(searchTerm);
    if (!q) return list;
    // split multi-keywords
    const terms = q.split(/\s+/).filter(Boolean);
    return list.filter(item => {
      const hay = normalize(item.title + " " + item.category + " " + (item.description || ""));
      // all terms must match somewhere (AND)
      return terms.every(t => hay.includes(t));
    });
  };

  // If a category prefix typed, restrict visible sections
  const cleanedTerm = normalize(searchTerm).replace(/\s/g, "");
  const visibleSections = sections.filter(sec => {
    if (!cleanedTerm) return true;
    return sec.key.replace(/\s/g, "").startsWith(cleanedTerm);
  });

  // Search count
  const searchCount = visibleSections.reduce((acc, sec) => acc + filterProducts(sec.data || []).length, 0);

  // "Did you mean?" - find nearest product title if none matches
  const didYouMean = (() => {
    if (searchTerm && searchCount === 0) {
      // consider top 8 product titles and compute distance
      const candidates = allProducts.slice(0, 100).map(p => p.title).filter(Boolean);
      let best = null;
      let bestDist = Infinity;
      for (const c of candidates) {
        const d = levenshtein(normalize(searchTerm), normalize(c));
        if (d < bestDist && d <= Math.max(2, Math.floor(c.length / 4))) {
          best = c;
          bestDist = d;
        }
      }
      return best;
    }
    return null;
  })();

  // Sorting helper
  const sortProducts = (list) => {
    if (!sortMode) return list;
    const copy = [...list];
    copy.sort((a, b) => {
      const pa = parsePrice(a.price);
      const pb = parsePrice(b.price);
      return sortMode === "low" ? pa - pb : pb - pa;
    });
    return copy;
  };

  // Toggle wishlist
  const toggleWish = (id, title) => {
    const exists = wishlist.includes(id);
    const next = exists ? wishlist.filter(i => i !== id) : [...wishlist, id];
    setWishlist(next);
    localStorage.setItem("trendycart_wish", JSON.stringify(next));
  };

  // push to recent (top-first)
  const pushRecent = (q) => {
    if (!q) return;
    const lower = q.toLowerCase();
    const updated = [lower, ...recent.filter(r => r !== lower)].slice(0, 8);
    setRecent(updated);
    localStorage.setItem("trendycart_recents", JSON.stringify(updated));
  };

  // handlers
  const onSuggestionPick = (s) => {
    setSearchTerm(s);
    pushRecent(s);
    setShowSuggest(false);
    inputRef.current?.focus();
  };

  const onInputChange = (e) => {
    const v = e.target.value;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setSearchTerm(v);
    setShowSuggest(true);
    setActiveIndex(-1);
    debounceRef.current = setTimeout(() => {}, 300);
  };

  const startVoiceSearch = () => {
    if (!recognitionRef.current) {
      alert("Voice search not supported in your browser");
      return;
    }
    recognitionRef.current.start();
  };

  const handleKeyDown = (e) => {
    if (!showSuggest) return;
    const list = suggestions;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, list.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const pick = (activeIndex >= 0 && suggestions[activeIndex]) || suggestions[0];
      if (pick) {
        onSuggestionPick(pick);
      } else {
        pushRecent(searchTerm);
        setShowSuggest(false);
      }
    } else if (e.key === "Escape") {
      setShowSuggest(false);
      setActiveIndex(-1);
    }
  };

  // Quick preview modal
  const openPreview = (item) => {
    setPreviewItem(item);
  };
  const closePreview = () => setPreviewItem(null);

  // small helper to render matched product list per section
  const renderProductsForSection = (sec) => {
    let list = filterProducts(sec.data || []);
    list = sortProducts(list);
    if (list.length === 0) return null;
    return list.map(item => (
      <div className="card" key={`${sec.key}-${item.id}`} style={{ position: "relative" }}>
        <img src={item.image} alt={item.title} className="product-image" onClick={() => openPreview(item)} style={{ cursor: "pointer" }} />
        <div className="productInfo">
          <h3>{highlight(item.title, normalize(searchTerm))}</h3>
          <p className="price">₹{item.price}</p>
          <p className="category">{item.category}</p>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, alignItems: "center", gap: 8 }}>
            <button
              className="wish-btn"
              onClick={() => toggleWish(item.id, item.title)}
              aria-label="toggle wishlist"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: 18,
                color: wishlist.includes(item.id) ? "crimson" : "#888"
              }}
            >
              {wishlist.includes(item.id) ? "♥" : "♡"}
            </button>

            {/* NEW: Add to Cart button inside product card */}
            <button
              onClick={(e) => { e.stopPropagation(); addToCart(item); }}
              style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #00b300", background: "#e6ffe6", cursor: "pointer" }}
            >
              Add to Cart
            </button>

            <button
              onClick={() => openPreview(item)}
              style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #ddd", background: "#fff", cursor: "pointer" }}
            >
              Quick View
            </button>
          </div>
        </div>
      </div>
    ));
  };

 return (
  <>
       {showBuyPage ? (
      <BuyPage item={buyItem} setShowBuyPage={setShowBuyPage} />
    ) : showAddtocart ? (
      <Addtocart setShowAddtocart={setShowAddtocart} />
    ) : (
      <div id="trendycart">
        {/* Header */}
        <header id="topBar">
          <h1 className="logo">Welcome to Trendycart 🛒</h1>

          <div
            className="searchWrap"
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: 8
            }}
          >
            <input
              ref={inputRef}
              id="searchBar"
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={onInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggest(true)}
              autoComplete="off"
            />

            <button
              onClick={startVoiceSearch}
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                border: "1px solid #ddd",
                background: listening ? "#ffcccc" : "#fff",
                cursor: "pointer"
              }}
              title="Voice Search"
            >
              🎤
            </button>

            {/* HEADER CART BUTTON → NEXT PAGE */}
            <button
              id="addToCartMain"
              onClick={() => setShowAddtocart(true)}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                background: "#ff9800",
                border: "none",
                color: "white",
                cursor: "pointer",
                fontWeight: "600",
                marginLeft: 4
              }}
              title="Open Cart"
            >
              🛒 Cart{" "}
              {cart.length > 0
                ? `(${cart.reduce((a, b) => a + (b.qty || 1), 0)})`
                : ""}
            </button>

            <select
              className="sortSelect"
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value)}
              style={{
                marginLeft: 8,
                borderRadius: 8,
                padding: "6px 8px",
                border: "1px solid #ddd"
              }}
            >
              <option value="">Sort</option>
              <option value="low">Price: Low → High</option>
              <option value="high">Price: High → Low</option>
            </select>

            <button
              id="clearInput"
              onClick={() => {
                setSearchTerm("");
                setShowSuggest(false);
                inputRef.current?.focus();
              }}
              style={{
                marginLeft: 6,
                borderRadius: 8,
                padding: "6px 8px",
                border: "1px solid #ddd",
                background: "#fff",
                cursor: "pointer"
              }}
              title="Clear search"
            >
              ✖
            </button>

            <div
              style={{
                marginLeft: 10,
                fontSize: 14,
                color: "#fff",
                display: "flex",
                gap: 8,
                alignItems: "center"
              }}
            >
              {searchTerm ? (
                <span style={{ opacity: 0.9 }}>
                  Tags: {tagPredict(searchTerm).join(", ") || "—"}
                </span>
              ) : null}
            </div>

            <button
              id="logoutBtn"
              onClick={onLogout}
              style={{ marginLeft: 12 }}
            >
              Logout
            </button>

            {showSuggest && (
              <div
                ref={suggestRef}
                className="suggestionsBox"
                style={{
                  position: "absolute",
                  top: 56,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 700,
                  zIndex: 9999
                }}
              >
                {/* Suggestions content same as your previous code */}
              </div>
            )}
          </div>
        </header>

        {/* Loading spinner */}
        {loading && (
          <div
            className="spinner"
            style={{
              position: "fixed",
              left: 10,
              top: 90,
              zIndex: 9999,
              background: "#fff",
              padding: 8,
              borderRadius: 8,
              boxShadow: "0 2px 10px rgba(0,0,0,0.12)"
            }}
          >
            Loading...
          </div>
        )}

        {/* Main Grid */}
        <main className="productGrid">
          {searchTerm && searchCount === 0 && (
            <h2 style={{ gridColumn: "1 / -1", textAlign: "center" }}>
              No Results Found
            </h2>
          )}

          {visibleSections.map((sec) => (
            <React.Fragment key={sec.key}>
              <h1 className="categoryTitle">{sec.title}</h1>
              {renderProductsForSection(sec)}
            </React.Fragment>
          ))}
        </main>

        {/* Quick preview modal */}
        {previewItem && (
          <div
            className="previewModal"
            onClick={closePreview}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 99999
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: 760,
                maxWidth: "92%",
                background: "#fff",
                borderRadius: 12,
                padding: 20
              }}
            >
              <div style={{ display: "flex", gap: 20 }}>
                <img
                  src={previewItem.image}
                  alt={previewItem.title}
                  style={{
                    width: 320,
                    height: 320,
                    objectFit: "contain",
                    borderRadius: 8,
                    background: "#fff"
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h2>{previewItem.title}</h2>
                  <p style={{ fontSize: 18, fontWeight: 700 }}>
                    ₹{previewItem.price}
                  </p>
                  <p style={{ color: "#666" }}>{previewItem.category}</p>
                  <div style={{ marginTop: 12 }}>
                    <strong>Tags:</strong>{" "}
                    {tagPredict(previewItem.title).join(", ") || "—"}
                  </div>
                  <div
                    style={{
                      marginTop: 18,
                      display: "flex",
                      gap: 10
                    }}
                  >
                    <button
                      onClick={() => {
                        toggleWish(previewItem.id);
                      }}
                      style={{ padding: "8px 12px" }}
                    >
                      {wishlist.includes(previewItem.id)
                        ? "Remove ♥"
                        : "Add to Wishlist ♡"}
                    </button>
                    <button
  onClick={(e) => {
    e.stopPropagation();

    console.log("BUY CLICKED", previewItem);

    setPreviewItem(null);     // 🔥 CLOSE preview modal
    setCartOpen(false);       // 🔥 CLOSE cart modal
    setShowAddtocart(false);  // 🔥 ENSURE cart page closed

    setBuyItem(previewItem);  // ✅ set product
    setShowBuyPage(true);     // ✅ go to buy page
  }}
>
  Buy
                    </button>
                    <button
                      onClick={closePreview}
                      style={{ padding: "8px 12px" }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CART MODAL */}
        {cartOpen && (
          <div
            className="cartModal"
            style={{
              position: "fixed",
              right: 12,
              top: 70,
              width: 360,
              maxHeight: "70vh",
              overflow: "auto",
              background: "#fff",
              padding: 16,
              boxShadow: "0 6px 24px rgba(0,0,0,0.2)",
              zIndex: 100000
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12
              }}
            >
              <h3>Cart</h3>
              <div>
                <button
                  onClick={() => setCartOpen(false)}
                  style={{ marginRight: 8 }}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setCart([]);
                    localStorage.removeItem("trendycart_cart");
                  }}
                >
                  Clear
                </button>
              </div>
            </div>

            {cart.length === 0 ? (
              <div style={{ padding: 12 }}>Your cart is empty.</div>
            ) : (
              <>
                {cart.map((it) => (
                  <div
                    key={it.id}
                    style={{
                      display: "flex",
                      gap: 12,
                      padding: 8,
                      borderBottom: "1px solid #eee",
                      alignItems: "center"
                    }}
                  >
                    <img
                      src={it.image}
                      alt={it.title}
                      style={{ width: 56, height: 56, objectFit: "contain" }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700 }}>{it.title}</div>
                      <div style={{ color: "#666", fontSize: 13 }}>
                        ₹{it.price}
                      </div>
                      <div
                        style={{
                          marginTop: 6,
                          display: "flex",
                          gap: 8,
                          alignItems: "center"
                        }}
                      >
                        <button onClick={() => changeQty(it.id, -1)}>-</button>
                        <div>{it.qty || 1}</div>
                        <button onClick={() => changeQty(it.id, 1)}>+</button>
                        <button
                          onClick={() => removeFromCart(it.id)}
                          style={{ marginLeft: 8 }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <div
                  style={{
                    marginTop: 12,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <strong>Total:</strong>
                  <strong>₹{cartTotal.toFixed(2)}</strong>
                </div>

                <div style={{ marginTop: 12 }}>
                  <button
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      background: "#28a745",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer"
                    }}
                    onClick={() =>
                      alert("Checkout not implemented in demo.")
                    }
                  >
                    Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    )}
  </>
);
}
export default Trendycart;
