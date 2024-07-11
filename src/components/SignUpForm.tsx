"use client";

import {
  Box,
  Button,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";
import { useForm } from "@mantine/form";
import { z } from "zod";
import { zodResolver } from "mantine-form-zod-resolver";
import toast from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<FormData>({
    initialValues: {
      email: "tatthien.contact@gmail.com",
      password: "123123123",
    },
    validate: zodResolver(schema),
  });

  const handleSubmit = async (values: FormData) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_BASE_URL,
      },
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(
        "Sign up successfully! Please check your email to verify your account.",
      );
      router.push("/auth/sign-in");
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Box mb={24}>
        <Title order={1} fw={500} fz={24}>
          Get started
        </Title>
        <Text fz="sm" c="gray.6">
          Create a new account
        </Text>
      </Box>
      <Stack gap={8} mb={16}>
        <TextInput
          inputMode="email"
          label="Email"
          placeholder="you@example.com"
          {...form.getInputProps("email")}
        />
        <PasswordInput
          label="Password"
          placeholder="••••••••"
          {...form.getInputProps("password")}
        />
      </Stack>
      <Button
        fullWidth
        mb={24}
        type="submit"
        loading={isLoading}
        disabled={isLoading}
      >
        Sign up
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
