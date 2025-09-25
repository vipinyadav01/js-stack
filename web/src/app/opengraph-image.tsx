import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const revalidate = false;

export const alt = "JS-Stack CLI - Modern Full-Stack Development Tool";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            maxWidth: "900px",
            padding: "40px",
          }}
        >
          {/* Logo/Icon */}
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "20px",
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "40px",
              fontSize: "60px",
              color: "white",
            }}
          >
            {"{ }"}
          </div>

          {/* Main Title */}
          <h1
            style={{
              fontSize: "72px",
              fontWeight: "bold",
              color: "white",
              margin: "0 0 20px 0",
              lineHeight: "1.1",
              textAlign: "center",
            }}
          >
            JS-Stack CLI
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: "28px",
              color: "#94a3b8",
              margin: "0 0 40px 0",
              lineHeight: "1.4",
              textAlign: "center",
              maxWidth: "800px",
            }}
          >
            A powerful, modern CLI tool for scaffolding production-ready
            JavaScript full-stack projects with extensive customization options
            and best practices built-in
          </p>

          {/* Tech Stack Badges */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {[
              "React",
              "Next.js",
              "Node.js",
              "TypeScript",
              "Express",
              "Prisma",
            ].map((tech) => (
              <div
                key={tech}
                style={{
                  background: "rgba(59, 130, 246, 0.1)",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  color: "#60a5fa",
                  fontSize: "18px",
                  fontWeight: "500",
                }}
              >
                {tech}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom branding */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: "40px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "#64748b",
            fontSize: "16px",
          }}
        >
          <span>js-stack.pages.dev</span>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
