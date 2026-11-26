import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SEO } from "@/lib/site.config";
import { LocaleProvider } from "@/lib/locale-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: SEO.titleDefault,
    template: SEO.titleTemplate,
  },
  description: SEO.description,
  keywords: SEO.keywords,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LocaleProvider>
          <Header />
          <main className="w-full flex-1 px-4 sm:px-6 lg:px-10 py-6">
            {children}
          </main>
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  );
}
