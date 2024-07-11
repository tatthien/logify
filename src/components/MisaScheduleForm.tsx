"use client";
import { useAuthentication } from "@/hooks/useAuthentication";
import {
  useCreateClockInScheduleMutation,
  useGetClockInSchedulesQuery,
} from "@/services/supabase";
import { Stack, PasswordInput, Button, LoadingOverlay } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";

const schema = z.object({
  sessionId: z.string(),
});

type FormData = z.infer<typeof schema>;

type MisaScheduleFormProps = {
  onSubmit?: (data: FormData) => void;
};

export function MisaScheduleForm({ onSubmit }: MisaScheduleFormProps) {
  const [scheduleId, setScheduleId] = useState();
  const { user } = useAuthentication();
  const { data, isLoading, refetch } = useGetClockInSchedulesQuery();
  const { mutateAsync, isPending } = useCreateClockInScheduleMutation();

  const form = useForm<FormData>({
    initialValues: {
      sessionId: "",
    },
    validate: zodResolver(schema),
  });

  useEffect(() => {
    if (data && data.length) {
      form.setFieldValue("sessionId", data[0].session_id);
      setScheduleId(data[0].id);
    }
  }, [data]);

  const handleSubmit = async (values: FormData) => {
    try {
      await mutateAsync({
        id: scheduleId,
        session_id: values.sessionId,
        user_id: user?.id,
      });

      refetch();

      toast.success("Saved successfully");

      if (onSubmit) {
        onSubmit(values);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack pos="relative">
        <PasswordInput
          label="Misa session ID"
          placeholder="0xxx"
          description="This session is stored in local storage. Use it at your own risk."
          {...form.getInputProps("sessionId")}
        />
        <Button type="submit" loading={isPending} disabled={isPending}>
          Save
        </Button>
        <LoadingOverlay visible={isLoading} loaderProps={{ size: "sm" }} />
      </Stack>
    </form>
  );
}
