"use client";

import { supabase } from "@/utils/supabase/client";
import { Button, PasswordInput, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "mantine-form-zod-resolver";
import toast from "react-hot-toast";
import { z } from "zod";

const schema = z
  .object({
    newPassword: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export function ChangePasswordForm() {
  const form = useForm<FormData>({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validate: zodResolver(schema),
  });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["change-password"],
    mutationFn: async (password: string) => {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        throw new Error(error.message);
      }
    },
  });

  const handleSubmit = async (values: FormData) => {
    try {
      await mutateAsync(values.newPassword);
      form.reset();
      toast.success("Password changed successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <PasswordInput
          label="New password"
          {...form.getInputProps("newPassword")}
        />
        <PasswordInput
          label="Confirm new password"
          {...form.getInputProps("confirmPassword")}
        />
        <Button type="submit" loading={isPending} disabled={isPending}>
          Change password
        </Button>
      </Stack>
    </form>
  );
}
