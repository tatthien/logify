"use client";

import { supabase } from "@/utils/supabase/client";
import { Box, Title, Stack, TextInput, Button, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
});

type FormData = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<FormData>({
    initialValues: {
      email: "",
    },
    validate: zodResolver(schema),
  });

  const handleSubmit = async (values: FormData) => {
    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/profile`,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(
        "If you registered using your email and password, you will receive a password reset email.",
      );
      router.replace("/auth/sign-in");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Box mb={24}>
        <Title order={1} fw={500} fz={24}>
          Reset your password
        </Title>
        <Text fz="sm" c="gray.6">
          Type in your email and we will send you a link to reset your password
        </Text>
      </Box>
      <Stack gap={8} mb={16}>
        <TextInput
          inputMode="email"
          label="Email"
          placeholder="you@example.com"
          {...form.getInputProps("email")}
        />
      </Stack>
      <Button
        type="submit"
        fullWidth
        mb={24}
        loading={isLoading}
        disabled={isLoading}
      >
        Send reset password
      </Button>
      <Text c="gray.5" fz="sm" ta="center">
        <Text span fz="sm" c="dark">
          Have an account?&nbsp;
        </Text>
        <Link
          href="/auth/sign-in"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          Sign in
        </Link>
      </Text>
    </form>
  );
}
