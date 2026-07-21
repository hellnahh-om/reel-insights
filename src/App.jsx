import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabaseClient.js";
import Auth from "./Auth.jsx";
import ReelInsightsEditor from "./ReelInsightsEditor.jsx";

const CHECKOUT_URL =
  "https://reelinsightsknox.lemonsqueezy.com/checkout/buy/876b1784-80f9-40c9-becd-fee669ec95f9";

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const loadProfile = useCallback(async (userId) => {
    let { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      alert("Error loading profile: " + error.message);
      return;
    }

    if (!data) {
      const { data: created, error: insertError } = await supabase
        .from("profiles")
        .insert({ user_id: userId, is_subscribed: false })
        .select()
        .single();

      if (insertError) {
        alert("Error creating profile: " + insertError.message);
        return;
      }
      data = created;
    }

    setProfile(data);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session) await loadProfile(session.user.id);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) {
        await loadProfile(session.user.id);
        setShowAuthModal(false);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [loadProfile]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const requireAuth = () => {
    if (!session) {
      setShowAuthModal(true);
      return false;
    }
    if (!profile?.is_subscribed) {
      const url = `${CHECKOUT_URL}?checkout[custom][user_id]=${session.user.id}`;
      window.open(url, "_blank");
      return false;
    }
    return true;
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

  return (
    <>
      <ReelInsightsEditor
        session={session}
        isSubscribed={!!profile?.is_subscribed}
        onLogout={handleLogout}
        requireAuth={requireAuth}
      />

      {showAuthModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.75)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            padding: "16px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAuthModal(false);
          }}
        >
          <div
            style={{
              backgroundColor: "#000",
              borderRadius: "16px",
              border: "1px solid #333",
              width: "100%",
              maxWidth: "380px",
              position: "relative",
            }}
          >
            <button
              onClick={() => setShowAuthModal(false)}
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                background: "none",
                border: "none",
                color: "#999",
                fontSize: "20px",
                cursor: "pointer",
                lineHeight: 1,
              }}
              aria-label="Close"
            >
              ×
            </button>
            <Auth embedded />
          </div>
        </div>
      )}
    </>
  );
      }
