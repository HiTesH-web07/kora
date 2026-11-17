import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/store/cart";

export const metadata: Metadata = {
  title: "Kōra Bakehouse | Two friends, one little idea, a whole lot of sweetness",
  description: "Brownie waffles, cookies, donuts, chocolates and gift boxes from Kōra Bakehouse. Made with love, served with a little extra happiness.",
};
export const viewport: Viewport = { themeColor: "#FBF3EA", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" as="image" href="/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@400;500;600&display=swap"
        />
      </head>
      <body><CartProvider>{children}</CartProvider></body>
    </html>
  );
}
