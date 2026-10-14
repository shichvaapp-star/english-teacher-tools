import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import { Analytics } from "@vercel/analytics/next";
import { SuggestEditButton } from "@/components/suggestions/suggest-edit-button";

const clarityCity = localFont({
  src: [
    {
      path: "../../public/fonts/clarity-city/ClarityCity-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/clarity-city/ClarityCity-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/clarity-city/ClarityCity-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/clarity-city/ClarityCity-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/clarity-city/ClarityCity-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/clarity-city/ClarityCity-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/clarity-city/ClarityCity-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});

const alef = localFont({
  src: [
    {
      path: "../../public/fonts/alef/Alef-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/alef/Alef-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-hebrew",
  display: "swap",
});

export const metadata: Metadata = {
  title: "English Practice | Ben Gurion Middle School",
  description: "English learning and practice suite for Ben Gurion Middle School: Unseen Detective, Personal Word Bank, and Writing Practice.",
  other: {
    google: "notranslate",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      translate="no"
      suppressHydrationWarning
      className={`notranslate ${clarityCity.variable} ${alef.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <TooltipProvider>
              {children}
              <SuggestEditButton />
            </TooltipProvider>
          </AuthProvider>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
