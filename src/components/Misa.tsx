import { LOCAL_STORAGE_KEYS } from "@/constants";
import { Button, Paper, PasswordInput } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import toast from "react-hot-toast";

export function Misa() {
  const [id, setId] = useLocalStorage({
    key: LOCAL_STORAGE_KEYS.MISA_SESSION_ID,
    defaultValue: "",
  });
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["timekeeping"],
    mutationFn: async () => {
      const res = await fetch("/api/misa", {
        method: "POST",
        headers: { "X-Misa-Session-ID": id },
      });
      if (res.ok) {
        return await res.json();
      } else {
        throw new Error("Unknown error");
      }
    },
  });

  const buttonDisabled = useMemo(() => {
    return isPending || !id;
  }, [isPending, id]);

  const handleClick = async () => {
    try {
      await mutateAsync();
      toast.success("Clocked in successfully");
    } catch (error) {
      toast.error(
        "Clocking in failed. Maybe the session ID is invalid or expired. Please check your session ID and try again.",
      );
    }
  };
  return (
    <Paper mb={24} p={16}>
      <PasswordInput
        label="Misa session ID"
        placeholder="0xxx"
        description="This session is stored in local storage. Use it at your own risk."
        mb={12}
        value={id}
        onChange={(event) => setId(event.currentTarget.value)}
      />
      <Button
        color={"orange.8"}
        fullWidth
        size="lg"
        onClick={handleClick}
        loading={isPending}
        disabled={buttonDisabled}
      >
        Clock in now
      </Button>
    </Paper>
  );
}
