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
import { IconConfetti } from "@tabler/icons-react";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [signedUp, setSignedUp] = useState(false);

  const form = useForm<FormData>({
    initialValues: {
      email: "",
      password: "",
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
      setSignedUp(true);
    }
    setIsLoading(false);
  };

  if (signedUp) {
    return (
      <Stack align="center" justify="center" gap={8}>
        <Text span fz={0} c={"green.7"}>
          <IconConfetti size={48} stroke={1.5} />
        </Text>
        <Stack align="center" justify="center" gap={0}>
          <Text fw={600} fz={"lg"}>
            Thank you for signing up!
          </Text>
          <Text ta={"center"} c="dimmed">
            Please check your email to verify your account.
          </Text>
        </Stack>
        <Button component={Link} variant="default" href="/auth/sign-in">
          Back to sign in
        </Button>
      </Stack>
    );
  }

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
        <PasswordInput label="Password" {...form.getInputProps("password")} />
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
