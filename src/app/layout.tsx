import type { Metadata } from "next";
import { AppProvider } from "./provider";
import "@mantine/core/styles.css";
import "./globals.css";
import { ColorSchemeScript } from "@mantine/core";

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
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
