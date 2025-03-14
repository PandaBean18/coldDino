import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Cold Mailer",
  description: "Automate Personalization of your cold emails using AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full w-full">
      <body
        className="h-full w-full"
      >
        {children}
      </body>
    </html>
  );
}
