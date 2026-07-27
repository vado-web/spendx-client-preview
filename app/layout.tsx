import type { Metadata } from "next";
import { Wix_Madefor_Text } from "next/font/google";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import "./globals.css";

const wix = Wix_Madefor_Text({
  variable: "--font-wix",
  subsets: ["latin", "cyrillic"],
});

export async function generateMetadata(): Promise<Metadata> {
  const headerStore = await headers();
  const host =
    headerStore.get("x-forwarded-host") ??
    headerStore.get("host") ??
    "localhost:3000";
  const protocol =
    headerStore.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);
  const preview = new URL("/og.png", base).toString();

  return {
    metadataBase: base,
    title: "SpendX — Mobile Experience Concept",
    description:
      "Interactive SpendX mobile concept for verification, card ordering and card management.",
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      title: "SpendX — One card. One tap. Worldwide.",
      description:
        "A focused mobile journey from verification to your first SpendX card.",
      images: [{ url: preview, width: 1738, height: 905 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "SpendX Mobile Experience",
      description:
        "A focused mobile journey from verification to your first SpendX card.",
      images: [preview],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={wix.variable}>{children}</body>
    </html>
  );
}
