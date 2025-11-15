import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "sonner";
import { generateMetadata as generateSEO } from "@/lib/seo";
import { generateOrganizationSchema, generateWebSiteSchema } from "@/lib/seo";
import { StructuredData } from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  ...generateSEO({
    title: "TIC Summit - Empowering Young Innovators",
    description: "Cameroon's premier tech innovation program for Secondary and High school students. Now in its 6th edition, TIC Summit connects young minds with industry experts and celebrates innovative ideas.",
    keywords: [
      "TIC Summit",
      "Cameroon",
      "tech challenge",
      "innovation",
      "students",
      "technology",
      "education",
      "technology conference",
      "innovation summit",
      "tech education",
      "student tech challenge",
      "secondary school tech",
      "high school innovation",
      "tech mentorship",
      "student projects",
    ],
  }),
  icons: {
    icon: '/tic.ico',
    shortcut: '/tic.ico',
    apple: '/tic.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebSiteSchema();

  return (
    <html lang="en">
      <head>
        <StructuredData data={organizationSchema} />
        <StructuredData data={websiteSchema} />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
