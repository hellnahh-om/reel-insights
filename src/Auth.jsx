import React, { useState } from "react";
import { supabase } from "./supabaseClient.js";

export default function Auth() {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Account created! You can log in now.");
        setMode("login");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setMessage(error.message);
      }
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
        color: "#fff",
        fontFamily: "system-ui, sans-serif",
        padding: "24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "360px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "8px" }}>
          Reel Insights
        </h1>
        <p style={{ color: "#999", fontSize: "14px", marginBottom: "24px" }}>
          {mode === "login" ? "Log in to your account" : "Create an account"}
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={inputStyle}
          />

          {message && (
            <p style={{ color: "#ff6b6b", fontSize: "13px", marginBottom: "12px" }}>
              {message}
            </p>
          )}

          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Log In"
              : "Sign Up"}
          </button>
        </form>

        <p style={{ marginTop: "16px", fontSize: "13px", color: "#999" }}>
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <span
                onClick={() => {
                  setMode("signup");
                  setMessage("");
                }}
                style={{ color: "#fff", textDecoration: "underline", cursor: "pointer" }}
              >
                Sign up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                onClick={() => {
                  setMode("login");
                  setMessage("");
                }}
                style={{ color: "#fff", textDecoration: "underline", cursor: "pointer" }}
              >
                Log in
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  marginBottom: "12px",
  borderRadius: "8px",
  border: "1px solid #333",
  backgroundColor: "#111",
  color: "#fff",
  fontSize: "15px",
  boxSizing: "border-box",
};

const buttonStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#fff",
  color: "#000",
  fontSize: "15px",
  fontWeight: 600,
  cursor: "pointer",
};
