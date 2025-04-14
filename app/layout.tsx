import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";


export const metadata: Metadata = {
  title: "ColdDino",
  description: "Automate Personalization of your cold emails using AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full w-full">
      <link rel="preconnect" href="https://fonts.googleapis.com" precedence="default" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" precedence="default"/>
      <link precedence="default" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Jost:ital,wght@0,100..900;1,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"></link>
      <body
        className="h-full w-full"
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
