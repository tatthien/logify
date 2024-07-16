import { LOCAL_STORAGE_KEYS } from "@/constants";
import { Button, ButtonProps } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { IconFingerprint } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import toast from "react-hot-toast";

type ClockInButtonProps = {
  onClockIn?: () => void;
} & ButtonProps;

export function ClockInButton({ onClockIn }: ClockInButtonProps) {
  const [id] = useLocalStorage({
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

      const data = await res.json();

      if (res.ok) {
        return data;
      } else {
        throw new Error(data.message);
      }
    },
  });

  const handleClockIn = async () => {
    try {
      await mutateAsync();
      toast.success("Clocked in successfully");
      if (onClockIn) {
        onClockIn();
      }
    } catch (error: any) {
      let msg =
        "Clocking in failed. Maybe the session ID is invalid or expired. Please check your session ID and try again.";

      if (error.message) {
        msg = error.message;
      }

      toast.error(msg);
    }
  };

  return (
    <Button
      variant="gradient"
      gradient={{ from: "orange.7", to: "red.7" }}
      h={40}
      color={"orange.8"}
      onClick={handleClockIn}
      loading={isPending}
      disabled={isPending}
      leftSection={<IconFingerprint size={20} stroke={1.5} />}
    >
      Clock in now
    </Button>
  );
}
