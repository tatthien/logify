"use client";
import { Calendar } from "@/components/Calendar/Calendar";
import { Box, Container, Paper } from "@mantine/core";
import { TokenForm } from "@/components/TokenForm/TokenForm";
import { useEffect } from "react";
import { sendAnalytics } from "@/utils/sendAnalytics";
import { AppFooter } from "@/components/AppFooter";
import { AppHeader } from "@/components/AppHeader";

export default function Home() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      sendAnalytics("page_view");
    }
  }, []);

  return (
    <Container py={40}>
      <AppHeader />
      <Box component="main">
        <Paper p={16} mb={24}>
          <TokenForm />
        </Paper>
        <Calendar />
      </Box>
      <AppFooter />
    </Container>
  );
}
