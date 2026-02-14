import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BuildIT - AI Guidance for Physical Work",
  description:
    "AI-powered real-time coaching for skilled trades. See, reason, and guide workers through any job with multimodal AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
