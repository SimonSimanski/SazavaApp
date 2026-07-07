import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Be_Vietnam_Pro, Space_Mono } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import InstallPrompt from "@/components/InstallPrompt";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["400", "500", "700"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const APP_NAME = "Prdomet";
const APP_DEFAULT_TITLE = "Prdomet - Fart Scout HQ";
const APP_TITLE_TEMPLATE = "%s - Prdomet";
const APP_DESCRIPTION = "Skautská aplikace pro záznam a statistiky tvých tělesných plynů a akcí.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  icons: {
    apple: "/apple-touch-icon.png",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#fff9ed",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="cs"
      className={`${bricolage.style.fontFamily} ${beVietnamPro.style.fontFamily} ${spaceMono.style.fontFamily} antialiased`}
    >
      <body className="text-on-surface pb-32" suppressHydrationWarning>
        <Header />
        <main className="p-edge-margin flex flex-col gap-8 max-w-md mx-auto">
          {children}
        </main>
        <BottomNav />
        <InstallPrompt />
      </body>
    </html>
  );
}
