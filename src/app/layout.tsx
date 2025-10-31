import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "TIC Summit - Empowering Young Innovators",
  description: "Cameroon's premier tech innovation program for Secondary and High school students. Now in its 6th edition, TIC Summit connects young minds with industry experts.",
  keywords: "TIC Summit, Cameroon, tech challenge, innovation, students, technology, education",
  authors: [{ name: "TIC Summit Team" }],
  icons: {
    icon: [
      {
        url: "https://2d4r8xyx2f.ufs.sh/f/NBqaoz7VhueJfNgKY3syseo1qmkclSJ8WhTOv7rNj6uD5A3i",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    shortcut: [
      {
        url: "https://2d4r8xyx2f.ufs.sh/f/NBqaoz7VhueJfNgKY3syseo1qmkclSJ8WhTOv7rNj6uD5A3i",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "https://2d4r8xyx2f.ufs.sh/f/NBqaoz7VhueJfNgKY3syseo1qmkclSJ8WhTOv7rNj6uD5A3i",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
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
