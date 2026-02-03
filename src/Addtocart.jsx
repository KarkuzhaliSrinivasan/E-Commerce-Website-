import React from "react";

function CartPage({ setShowAddtocart }) {
  const cart = JSON.parse(localStorage.getItem("trendycart_cart")) || [];

  const total = cart.reduce((sum, i) => sum + Number(i.price) * (i.qty || 1), 0);

  return (
    <div
      style={{
        padding: 30,
        maxWidth: 1000,
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ marginBottom: 30, textAlign: "center", color: "#333" }}>🛒 My Cart</h1>

      {cart.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: 60,
            border: "1px dashed #ccc",
            borderRadius: 12,
            color: "#666",
            background: "#fff",
          }}
        >
          <h3 style={{ marginBottom: 10 }}>Your cart is empty</h3>
          <p>Add some products to continue shopping</p>
        </div>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                gap: 20,
                padding: 20,
                marginBottom: 20,
                borderRadius: 12,
                background: "#fff",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                alignItems: "center",
                transition: "transform 0.2s",
              }}
            >
              <img
                src={item.image}
                alt={item.title}
                style={{
                  width: 140,
                  height: 140,
                  objectFit: "contain",
                  borderRadius: 12,
                  background: "#f9f9f9",
                }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>{item.title}</h3>
                <p style={{ margin: "0 0 8px 0", fontWeight: "bold", color: "#2e7d32" }}>₹{item.price}</p>
                <p style={{ margin: "0 0 8px 0", color: "#555" }}>Qty: {item.qty}</p>
                <div style={{ marginTop: 10 }}>
                  <button
                    style={{
                      padding: "6px 12px",
                      marginRight: 10,
                      background: "#e0e0e0",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                    }}
                  >
                    -
                  </button>
                  <button
                    style={{
                      padding: "6px 12px",
                      background: "#e0e0e0",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                    }}
                  >
                    +
                  </button>
                  <button
                    style={{
                      padding: "6px 12px",
                      marginLeft: 15,
                      background: "#ff4d4f",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* TOTAL */}
          <div
            style={{
              marginTop: 30,
              paddingTop: 20,
              borderTop: "2px solid #eee",
              display: "flex",
              justifyContent: "space-between",
              fontSize: 20,
              fontWeight: "bold",
              color: "#333",
            }}
          >
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </>
      )}

      {/* BACK BUTTON */}
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <button
          onClick={() => setShowAddtocart(false)}
          style={{
            padding: "12px 24px",
            background: "#ff9800",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 16,
            fontWeight: "600",
            transition: "background 0.2s",
          }}
          onMouseOver={(e) => (e.target.style.background = "#e68900")}
          onMouseOut={(e) => (e.target.style.background = "#ff9800")}
        >
          ⬅ Back to products
        </button>
      </div>
    </div>
  );
}

export default CartPage;
