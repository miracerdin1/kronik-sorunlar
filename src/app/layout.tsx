import type { Metadata } from "next";
import Link from "next/link";
import { Geist } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import { SITE_ADI } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Kronik Sorunlar: Türkiye'de satılan araçların kronik arızaları",
    template: "%s | Kronik Sorunlar",
  },
  description:
    "Marka, model, yıl ve yakıt tipini seçin; o araca özgü kronik sorunları belirtileri, görüldüğü km ve kaynaklarıyla görün.",
  alternates: { canonical: "/" },
  verification: { google: "fA3u2wMTqAB-3PEIpYnofXHvhlXVei3S1y_j_ulyKP4" },
  openGraph: { siteName: SITE_ADI, locale: "tr_TR", type: "website", url: "/" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={`${geistSans.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        <header className="border-b border-zinc-200 dark:border-zinc-800">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-lg font-bold">
              Kronik<span className="text-red-600">Sorunlar</span>
            </Link>
            <nav className="text-sm font-medium">
              {/* Ayrı bir uygulama; kendi adresinde açılır. */}
              <a href="https://yol-haritasi.netlify.app/" className="rounded-lg px-3 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                Yol Haritası
              </a>
            </nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">{children}</main>
        <footer className="border-t border-zinc-200 py-6 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          Bilgiler kamuya açık kaynaklardan derlenmiştir ve her araçta görülmeyebilir. Alım kararı öncesi ekspertiz yaptırın.
        </footer>
      </body>
    </html>
  );
}
