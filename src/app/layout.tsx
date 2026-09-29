import type { Metadata } from "next";
import { StoreProvider } from "@/context/StoreContext";
import { CartDrawer, CurrencyModal } from "@/components/Modals";

export const metadata: Metadata = {
  title: "TheHoshi - Luxury Boutique",
  description: "Top-tier quality luxury collections, worldwide delivery, secure payment methods, and VIP after-sales service.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400&family=Lato:wght@300;400;700&family=Jost:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Material+Icons&family=Material+Icons+Outlined&display=swap"
          rel="stylesheet"
        />
        {/* FontAwesome & Swiper */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
        {/* Template Stylesheets */}
        <link rel="stylesheet" href="/css/tailwind-mobile.min.css" />
        <link rel="stylesheet" href="/css/stylesheet.css" />
        <link rel="stylesheet" href="/css/custom-template.css" />
        <link rel="stylesheet" href="/css/product-detail.css" />
        <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js" async></script>
      </head>
      <body>
        <StoreProvider>
          {children}
          <CartDrawer />
          <CurrencyModal />
        </StoreProvider>
      </body>
    </html>
  );
}
