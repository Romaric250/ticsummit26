import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TIC Summit 2025 - Empowering Young Innovators",
  description: "Cameroon's largest tech challenge for Secondary and High school students. Connect with industry experts, gain valuable mentorship, and win prizes for your innovative ideas.",
  keywords: "TIC Summit, Cameroon, tech challenge, innovation, students, technology, education",
  authors: [{ name: "TIC Summit Team" }],
  openGraph: {
    title: "TIC Summit 2025 - Empowering Young Innovators",
    description: "Cameroon's largest tech challenge for Secondary and High school students.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
