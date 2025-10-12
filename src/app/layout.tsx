import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "TIC Summit - Empowering Young Innovators",
  description: "Cameroon's premier tech innovation program for Secondary and High school students. Now in its 6th edition, TIC Summit connects young minds with industry experts.",
  keywords: "TIC Summit, Cameroon, tech challenge, innovation, students, technology, education",
  authors: [{ name: "TIC Summit Team" }],
  openGraph: {
    title: "TIC Summit - Empowering Young Innovators",
    description: "Cameroon's premier tech innovation program for Secondary and High school students.",
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
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
