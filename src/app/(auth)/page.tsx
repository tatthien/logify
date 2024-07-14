"use client";
import { Calendar } from "@/components/Calendar/Calendar";
import { Box } from "@mantine/core";
import { SettingsForm } from "@/components/SettingsForm";
import { useEffect } from "react";
import { sendAnalytics } from "@/utils/sendAnalytics";
import { Misa } from "@/components/Misa";

export default function Home() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      sendAnalytics("page_view");
    }
  }, []);

  return (
    <Box component="main">
      <SettingsForm />
      <Misa />
      <Calendar />
    </Box>
  );
}
