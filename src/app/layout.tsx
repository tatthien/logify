import type { Metadata } from "next";
import { AppProvider } from "./provider";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "./globals.css";
import { ColorSchemeScript, Container } from "@mantine/core";
import { Toaster } from "react-hot-toast";
import { AxiomWebVitals } from 'next-axiom'
import { AppFooter } from "@/components/AppFooter";

export const metadata: Metadata = {
  title: "Have you logged ClickUp hours yet?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body>
        <Toaster />
        <AxiomWebVitals />
        <AppProvider>
          <Container px={12}>{children}</Container>
          <AppFooter />
        </AppProvider>
      </body>
    </html>
  );
}
