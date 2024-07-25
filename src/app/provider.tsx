"use client";

import { supabase } from "@/utils/supabase/client";
import { theme } from "./theme";
import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { ModalsProvider } from "@mantine/modals";
import * as seline from "@seline-analytics/web";

type AppProviderProps = {
  children: React.ReactNode;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
    },
  },
});

export function AppProvider({ children }: AppProviderProps) {
  useEffect(() => {
    seline.init();

    supabase.auth.onAuthStateChange((event) => {});
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme="light">
        <ModalsProvider>{children}</ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}
