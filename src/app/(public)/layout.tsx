"use client";
import { supabase } from "@/utils/supabase/client";
import { Box } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        router.push("/");
      }
    });
  }, []);

  return <Box py={40}>{children}</Box>;
}
