// BuyPage.jsx
import React, { useState } from "react";
import SuccessPage from "./SuccessPage";

import gpayLogo from "./assets/gpay.png";
import phonepeLogo from "./assets/phonepe.png";
import paytmLogo from "./assets/paytm.png";

const appLogos = {
  gpay: gpayLogo,
  phonepe: phonepeLogo,
  paytm: paytmLogo,
};

function BuyPage({ item, setShowBuyPage }) {
  const [qty, setQty] = useState(1);
  const [selectedApp, setSelectedApp] = useState("");
  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!item) return <h2>No item selected</h2>;

  const totalPrice = item.price * qty;

  const validateUpi = (id) =>
    /^[\w.-]+@[\w]{3,}$/i.test(id.trim());

  const handlePay = () => {
    if (!selectedApp) return alert("Select payment app");
    if (!upiId.trim()) return alert("Enter UPI ID");
    if (!validateUpi(upiId)) return alert("Invalid UPI ID");

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  const handleQtyChange = (val) => {
    setQty((q) => Math.max(1, q + val));
  };

  if (success) {
    return (
      <SuccessPage
        total={totalPrice}
        app={selectedApp}
        onBack={() => setShowBuyPage(false)}
      />
    );
  }

  return (
    <div
      style={{
        minHeight: "700px",
        width: "1000px",
        background: "#f2f2f7",
        padding: "20px 10px",
        display: "flex",
        justifyContent: "center",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1100px",
          background: "#fff",
          borderRadius: 18,
          padding: 30,
          boxShadow: "0 12px 35px rgba(0,0,0,0.12)",
        }}
      >
        <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
          {/* LEFT */}
          <div style={{ flex: 1, minWidth: 280 }}>
            <img
              src={item.image}
              alt={item.title}
              style={{
                width: "180px",
                height: "200px",
                borderRadius: 16,
                objectFit: "cover",
                marginBottom: 20,
              }}
            />

            <h1>{item.title}</h1>
            <p style={{ color: "#777" }}>{item.category}</p>
            <h2>₹{item.price}</h2>

            <div style={{ display: "flex", gap: 14, margin: "16px 0" }}>
              <button
                onClick={() => handleQtyChange(-1)}
                style={qtyBtn}
              >
                −
              </button>
              <strong style={{ fontSize: 18 }}>{qty}</strong>
              <button
                onClick={() => handleQtyChange(1)}
                style={qtyBtn}
              >
                +
              </button>
            </div>

            <h2>Total: ₹{totalPrice.toFixed(2)}</h2>
          </div>

          {/* RIGHT */}
          <div style={{ flex: 1, minWidth: 280 }}>
            <h2>Payment Method</h2>

            <div style={{ display: "flex", gap: 16 }}>
              {["gpay", "phonepe", "paytm"].map((app) => (
                <button
                  key={app}
                  onClick={() => setSelectedApp(app)}
                  style={{
                    ...payAppBtn,
                    border:
                      selectedApp === app
                        ? "2px solid #4caf50"
                        : "1px solid #ddd",
                    background:
                      selectedApp === app ? "#e8f5e9" : "#fff",
                  }}
                >
                  <img
                    src={appLogos[app]}
                    alt={app}
                    style={{ width: 28, height: 20 }}
                  />
                  <div style={{ marginTop: 8, fontWeight: 700 }}>
                    {app.toUpperCase()}
                  </div>
                </button>
              ))}
            </div>

            {selectedApp && (
              <input
                type="text"
                placeholder={`Enter UPI ID for ${selectedApp.toUpperCase()}`}
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                style={upiInput}
              />
            )}

            {selectedApp && (
              <button
                onClick={handlePay}
                disabled={loading}
                style={payBtn}
              >
                {loading ? "Processing..." : `Pay ₹${totalPrice.toFixed(2)}`}
                {loading && <span style={spinnerStyle}></span>}
              </button>
            )}

            <button
              onClick={() => setShowBuyPage(false)}
              style={backBtn}
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */
const qtyBtn = {
  width: 38,
  height: 38,
  borderRadius: "50%",
  border: "1px solid #ccc",
  background: "#fff",
  cursor: "pointer",
  fontSize: 18,
  transition: "background 0.2s",
};


const payAppBtn = {
  flex: 1,
  padding: 20,
  borderRadius: 16,
  cursor: "pointer",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
};

const upiInput = {
  width: "100%",
  padding: 14,
  borderRadius: 12,
  border: "1px solid #ccc",
  fontSize: 16,
  marginTop: 20,
};

const payBtn = {
  width: "100%",
  padding: 16,
  marginTop: 20,
  borderRadius: 14,
  background: "linear-gradient(90deg,#00c853,#4caf50)",
  color: "#fff",
  fontSize: 18,
  fontWeight: 700,
  border: "none",
  cursor: "pointer",
  position: "relative",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
};

const backBtn = {
  width: "100%",
  padding: 14,
  marginTop: 14,
  borderRadius: 14,
  border: "1px solid #ccc",
  background: "#fff",
  fontWeight: 600,
  cursor: "pointer",
  transition: "background 0.2s ease",
};

const spinnerStyle = {
  position: "absolute",
  right: 18,
  top: "50%",
  width: 18,
  height: 18,
  border: "3px solid rgba(255,255,255,0.4)",
  borderTop: "3px solid #fff",
  borderRadius: "50%",
  transform: "translateY(-50%)",
  animation: "spin 1s linear infinite",
};

/* SPINNER */
const sheet = document.styleSheets[0];
const spinKeyframe =
  "@keyframes spin {0%{transform:translateY(-50%) rotate(0deg);}100%{transform:translateY(-50%) rotate(360deg);}}";

if (![...sheet.cssRules].some((r) => r.name === "spin")) {
  sheet.insertRule(spinKeyframe, sheet.cssRules.length);
}

export default BuyPage;
