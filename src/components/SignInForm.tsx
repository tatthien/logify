"use client";

import { supabase } from "@/utils/supabase/client";
import {
  Box,
  Title,
  Stack,
  TextInput,
  PasswordInput,
  Button,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

export function SignInForm() {
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
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      router.replace("/");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Box mb={24}>
        <Title order={1} fw={500} fz={24}>
          Welcome back
        </Title>
        <Text fz="sm" c="gray.6">
          Sign in to your account
        </Text>
      </Box>
      <Stack gap={8} mb={16}>
        <TextInput
          type="email"
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
        type="submit"
        fullWidth
        mb={24}
        loading={isLoading}
        disabled={isLoading}
      >
        Sign in
      </Button>
      <Text c="gray.5" fz="sm" ta="center">
        <Text span fz="sm" c="dark">
          Don&apos;t have an account?&nbsp;
        </Text>
        <Link
          href="/auth/sign-up"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          Sign up
        </Link>
      </Text>
    </form>
  );
}
