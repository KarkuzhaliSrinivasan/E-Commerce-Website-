import React, { useEffect } from "react";

function SuccessPage({ total, app, onBack }) {

  // Add confetti particles on mount
  useEffect(() => {
    const confettiContainer = document.createElement("div");
    confettiContainer.style.position = "absolute";
    confettiContainer.style.top = "0";
    confettiContainer.style.left = "0";
    confettiContainer.style.width = "100%";
    confettiContainer.style.height = "100%";
    confettiContainer.style.pointerEvents = "none";
    confettiContainer.style.overflow = "hidden";
    document.body.appendChild(confettiContainer);

    const colors = ["#4caf50","#ff9800","#f44336","#2196f3","#e91e63"];

    for (let i = 0; i < 30; i++) {
      const confetti = document.createElement("div");
      confetti.style.position = "absolute";
      confetti.style.width = "10px";
      confetti.style.height = "10px";
      confetti.style.backgroundColor = colors[Math.floor(Math.random()*colors.length)];
      confetti.style.top = "0px";
      confetti.style.left = `${Math.random()*100}%`;
      confetti.style.opacity = 0.8;
      confetti.style.borderRadius = "50%";
      confetti.style.animation = `fall ${2 + Math.random()*2}s ease-in forwards`;
      confettiContainer.appendChild(confetti);
    }

    return () => document.body.removeChild(confettiContainer);
  }, []);

  return (
    <div
      style={{
        minHeight: "600px",
        width: "1000px",
        background: "linear-gradient(135deg, #f2f2f7, #d9e4f5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "5vw",
        fontFamily: "'Segoe UI', sans-serif",
        position: "relative",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "25px",
          padding: "5vw",
          textAlign: "center",
          width: "clamp(320px, 60%, 750px)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          position: "relative",
          transform: "scale(0.95)",
          animation: "cardPop 0.5s forwards",
          transition: "transform 0.3s ease, box-shadow 0.3s ease, border-radius 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.02)";
          e.currentTarget.style.boxShadow = "0 15px 40px rgba(0,0,0,0.25)";
          e.currentTarget.style.borderRadius = "30px";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.15)";
          e.currentTarget.style.borderRadius = "25px";
        }}
      >
        {/* Tick animation */}
        <div
          style={{
            width: "clamp(80px, 15%, 150px)",
            height: "clamp(80px, 15%, 150px)",
            margin: "0 auto",
            borderRadius: "50%",
            border: "5px solid #4caf50",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            animation: "tickScale 0.8s ease forwards, tickGlow 2s infinite alternate",
          }}
        >
          <span style={{ fontSize: "clamp(40px, 8vw, 70px)", color: "#4caf50" }}>✔️</span>
        </div>

        <h2
          style={{
            marginTop: "3vw",
            fontSize: "clamp(22px, 5vw, 30px)",
            color: "#333",
            fontWeight: 700,
            opacity: 0,
            animation: "fadeIn 1s forwards 0.5s"
          }}
        >
          Payment Successful!
        </h2>
        <p
          style={{
            marginTop: "1.5vw",
            color: "#666",
            fontSize: "clamp(16px, 3.5vw, 20px)",
            opacity: 0,
            animation: "fadeIn 1s forwards 0.8s"
          }}
        >
          Thank you for your payment.
        </p>
        <p
          style={{
            marginTop: "0.5vw",
            color: "#888",
            fontSize: "clamp(14px, 3vw, 18px)",
            opacity: 0,
            animation: "fadeIn 1s forwards 1.0s"
          }}
        >
          ₹{total.toFixed(2)} paid via {app.toUpperCase()}
        </p>

        <button
          onClick={onBack}
          style={{
            marginTop: "4vw",
            padding: "1.5vw 3vw",
            borderRadius: "15px",
            border: "none",
            background: "linear-gradient(90deg, #4caf50, #66bb6a)",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "clamp(14px, 3vw, 18px)",
            transition: "0.3s",
            boxShadow: "0 5px 15px rgba(76,175,80,0.4)",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.05)";
            e.target.style.boxShadow = "0 8px 20px rgba(76,175,80,0.6)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "0 5px 15px rgba(76,175,80,0.4)";
          }}
          onMouseDown={(e) => { e.target.style.transform = "scale(0.98)"; }}
          onMouseUp={(e) => { e.target.style.transform = "scale(1.05)"; }}
        >
          Back to Home
        </button>
      </div>

      <style>
        {`
          @keyframes tickScale {
            0% { transform: scale(0); opacity: 0; }
            50% { transform: scale(1.4); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }

          @keyframes tickGlow {
            0% { box-shadow: 0 0 15px rgba(76,175,80,0.4); }
            100% { box-shadow: 0 0 30px rgba(76,175,80,0.7); }
          }

          @keyframes cardPop {
            0% { transform: scale(0.95); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }

          @keyframes fadeIn {
            to { opacity: 1; }
          }

          @keyframes fall {
            to { transform: translateY(600px) rotate(360deg); opacity: 0; }
          }
        `}
      </style>
    </div>
  );
}

export default SuccessPage;
