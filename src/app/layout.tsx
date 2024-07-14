import type { Metadata } from "next";
import { AppProvider } from "./provider";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "./globals.css";
import { ColorSchemeScript, Container } from "@mantine/core";
import { Toaster } from "react-hot-toast";
import { AppFooter } from "@/components/AppFooter";
import { AppHeader } from "@/components/AppHeader";

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
      </head>
      <body>
        <Toaster />
        <AppProvider>
          <Container py={40}>
            <AppHeader />
            {children}
            <AppFooter />
          </Container>
        </AppProvider>
      </body>
    </html>
  );
}
