import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { Toaster } from "@/components/ui/toaster";
import { MsalProvider } from "@/components/auth/msal-provider";

const inter = localFont({
  src: "../public/fonts/Inter.ttf",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Motorcycle Club Hub",
  description: "Manage members, dues, and rides for your motorcycle club",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* {<MsalProvider> */}
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <div className="flex-1">{children}</div>
            </div>
            <Toaster />
          </ThemeProvider>
        {/* </MsalProvider>} */}
      </body>
    </html>
  );
}