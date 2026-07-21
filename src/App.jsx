import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient.js";
import Auth from "./Auth.jsx";
import ReelInsightsEditor from "./ReelInsightsEditor.jsx";

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000",
          color: "#fff",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!session) {
    return <Auth />;
  }

  return (
    <div>
      <button
        onClick={handleLogout}
        style={{
          position: "fixed",
          top: "12px",
          right: "12px",
          zIndex: 1000,
          padding: "8px 14px",
          borderRadius: "8px",
          border: "1px solid #333",
          backgroundColor: "#111",
          color: "#fff",
          fontSize: "13px",
          cursor: "pointer",
        }}
      >
        Log out
      </button>
      <ReelInsightsEditor />
    </div>
  );
}
