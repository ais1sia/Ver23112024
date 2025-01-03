import React from "react";
import { Link } from "react-router-dom";

const Public = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #ebf8ff, #ffffff)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <header style={{ textAlign: "center", marginBottom: "32px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "#2563eb", marginBottom: "8px" }}>
          Welcome to ReadyAimFluent
        </h1>
        <p style={{ fontSize: "18px", color: "#4b5563" }}>
          Your journey to multilingual mastery starts here!
        </p>
      </header>

      <main
        style={{
          maxWidth: "400px",
          width: "100%",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          padding: "32px",
        }}
      >
        <p style={{ color: "#374151", marginBottom: "24px" }}>
          ReadyAimFluent offers an immersive and interactive way to learn new
          languages. With personalized lessons, real-time pronunciation feedback,
          and a supportive community, you'll be speaking fluently in no time!
        </p>

        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#2563eb" }}>
            Get Started Today
          </h2>
          <ul
            style={{
              listStyleType: "disc",
              paddingLeft: "20px",
              color: "#374151",
              marginBottom: "24px",
            }}
          >
            <li>Access to 30+ languages</li>
            <li>Personalized learning paths</li>
            <li>Interactive speaking exercises</li>
            <li>Progress tracking and achievements</li>
          </ul>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            justifyContent: "center",
          }}
        >
          <Link
            to="/signup"
            style={{
              display: "inline-block",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              padding: "10px 16px",
              textAlign: "center",
              borderRadius: "4px",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            style={{
              display: "inline-block",
              border: "1px solid #2563eb",
              color: "#2563eb",
              padding: "10px 16px",
              textAlign: "center",
              borderRadius: "4px",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Log In
          </Link>
        </div>
      </main>

      <footer style={{ marginTop: "32px", textAlign: "center", color: "#9ca3af" }}>
        <p>&copy; 2025 ReadyAimFluent. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Public;