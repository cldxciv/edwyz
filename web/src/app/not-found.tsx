import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, sans-serif",
          background: "#050505",
          color: "#f5f7fa",
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <p style={{ fontSize: "6rem", fontWeight: 800, color: "rgba(34,226,245,0.15)", lineHeight: 1, margin: 0 }}>
          404
        </p>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginTop: "1rem" }}>Page not found</h1>
        <p style={{ color: "#9aa3b2", marginTop: "0.75rem", maxWidth: "400px" }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
          <Link
            href="/"
            style={{
              padding: "0.625rem 1.5rem",
              borderRadius: "999px",
              background: "linear-gradient(90deg,#2563ff,#22e2f5)",
              color: "#000",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
            }}
          >
            Go home
          </Link>
          <Link
            href="/en/contact"
            style={{
              padding: "0.625rem 1.5rem",
              borderRadius: "999px",
              border: "1px solid #1f2430",
              color: "#f5f7fa",
              textDecoration: "none",
              fontSize: "0.875rem",
            }}
          >
            Contact us
          </Link>
        </div>
      </body>
    </html>
  );
}
