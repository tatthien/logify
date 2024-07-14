"use client";

import { useAuthentication } from "@/hooks/useAuthentication";
import { Paper, Text, Button, TextInput, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import toast from "react-hot-toast";
import { CollapsibleCard } from "./CollapsibleCard";
import { IconTrash } from "@tabler/icons-react";

export function DeleteAccountCard() {
  const router = useRouter();
  const { user } = useAuthentication();
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["delete-account"],
    mutationFn: async () => {
      const res = await fetch("/api/account", { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        return data;
      } else {
        throw new Error("Failed to delete account");
      }
    },
  });
  const form = useForm({
    initialValues: {
      email: "",
      confirm: "",
    },
  });

  const isEnabled = useMemo(() => {
    return (
      form.values.email === user?.email &&
      form.values.confirm === "delete my account"
    );
  }, [form.values, user]);

  const handleDeleteAccount = async () => {
    try {
      await mutateAsync();
      router.replace("/auth/sign-in");
    } catch (error) {
      toast.error("Failed to delete account");
    }
  };

  return (
    <CollapsibleCard
      variant="danger"
      title="Delete Account"
      icon={
        <Text span fz={0} c="red.7">
          <IconTrash stroke={1.5} color="currentColor" />
        </Text>
      }
      id="delete_account_card"
    >
      <Text mb={16}>Permanently delete your account and all of its data.</Text>
      <Stack gap={8} mb={16}>
        <TextInput
          label={
            <Text fz="sm" c="dimmed">
              Enter your email{" "}
              <Text span fz="sm" fw={600}>
                {user?.email}
              </Text>{" "}
              to continue
            </Text>
          }
          {...form.getInputProps("email")}
        />
        <TextInput
          label={
            <Text fz="sm" c="dimmed">
              To verify, type{" "}
              <Text span fz="sm" fw={600}>
                delete my account
              </Text>{" "}
              below:
            </Text>
          }
          {...form.getInputProps("confirm")}
        />
      </Stack>
      <Button
        color="red.7"
        disabled={!isEnabled || isPending}
        loading={isPending}
        onClick={handleDeleteAccount}
      >
        Delete account
      </Button>
    </CollapsibleCard>
  );
}
