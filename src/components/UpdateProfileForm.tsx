"use client";

import { useAuthentication } from "@/hooks/useAuthentication";
import { supabase } from "@/utils/supabase/client";
import { Button, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "mantine-form-zod-resolver";
import toast from "react-hot-toast";
import { z } from "zod";

const schema = z.object({
  name: z.string().max(100),
});

type FormData = z.infer<typeof schema>;

export function UpdateProfileForm() {
  const { user, setUser } = useAuthentication();
  const form = useForm<FormData>({
    initialValues: {
      name: user?.user_metadata.name || "",
    },
    validate: zodResolver(schema),
  });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["update-profile"],
    mutationFn: async (payload: { name: string }) => {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          name: payload.name,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });

  const handleSubmit = async (values: FormData) => {
    try {
      const data = await mutateAsync({ name: values.name });
      setUser(data.user);
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput label="Email" value={user?.email} disabled />
        <TextInput
          label="Your name"
          placeholder="John"
          {...form.getInputProps("name")}
        />
        <Button type="submit" loading={isPending} disabled={isPending}>
          Save
        </Button>
      </Stack>
    </form>
  );
}
