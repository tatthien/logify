import type { Metadata } from "next";
import { AppProvider } from "./provider";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "./globals.css";
import { ColorSchemeScript, Container } from "@mantine/core";
import { Toaster } from "react-hot-toast";

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
        {process.env.ENV === "production" && (
          <script async src="https://cdn.seline.so/seline.js"></script>
        )}
      </head>
      <body>
        <Toaster />
        <AppProvider>
          <Container px={12}>{children}</Container>
        </AppProvider>
      </body>
    </html>
  );
}
