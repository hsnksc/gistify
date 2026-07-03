// client/src/components/NewsletterSignup.tsx
// Usage: Import into Landing.tsx (or any marketing page) and place in hero section or footer area.
// API endpoint: POST /api/newsletter/subscribe (already live in production)

import React, { useState } from "react";
import { type AppLanguage, t } from "@/lib/i18n";

interface NewsletterSignupProps {
  language?: AppLanguage;
}

export default function NewsletterSignup({ language = "tr" }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage(t("common:pleaseEnterAValidEmail"));
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(
          t("common:youReInSundayPrep")
        );
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || t("common:somethingWentWrongTryAgain"));
      }
    } catch {
      setStatus("error");
      setMessage(t("common:networkErrorPleaseTryAgain"));
    }
  };

  return (
    <div
      className="gistify-newsletter"
      style={{
        background: "#0f172a",
        padding: "2rem",
        borderRadius: "12px",
        border: "1px solid #1e293b",
        maxWidth: "480px",
        margin: "2rem auto",
      }}
    >
      <h3
        style={{
          color: "#10b981",
          fontSize: "1.25rem",
          marginBottom: "0.5rem",
          fontWeight: 600,
        }}
      >
        {t("common:freeEarningsPlaybook")}
      </h3>
      <p
        style={{
          color: "#94a3b8",
          fontSize: "0.875rem",
          marginBottom: "1.5rem",
          lineHeight: 1.5,
        }}
      >
        {t("common:getTheSundayPrepNewsletter")}
      </p>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("scanner:ivNeutral")}
          disabled={status === "loading"}
          required
          style={{
            flex: 1,
            minWidth: "200px",
            background: "#1e293b",
            border: "1px solid #334155",
            color: "#e2e8f0",
            padding: "0.75rem 1rem",
            borderRadius: "6px",
            fontSize: "0.875rem",
            outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          style={{
            background: "#10b981",
            color: "#fff",
            border: "none",
            padding: "0.75rem 1.5rem",
            borderRadius: "6px",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "0.875rem",
            whiteSpace: "nowrap",
          }}
        >
          {status === "loading"
            ? t("common:joining")
            : t("common:getItFree")}
        </button>
      </form>
      {status === "success" && (
        <p style={{ color: "#10b981", fontSize: "0.75rem", marginTop: "0.75rem" }}>
          {message}
        </p>
      )}
      {status === "error" && (
        <p style={{ color: "#f87171", fontSize: "0.75rem", marginTop: "0.75rem" }}>
          {message}
        </p>
      )}
    </div>
  );
}
