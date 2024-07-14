"use client";

import { supabase } from "@/utils/supabase/client";
import { theme } from "./theme";
import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";

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
    supabase.auth.onAuthStateChange((event) => {
      console.log(">>> event", event);
    });
  }, []);

  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MantineProvider>
  );
}
