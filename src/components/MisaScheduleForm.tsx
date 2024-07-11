"use client";
import { useAuthentication } from "@/hooks/useAuthentication";
import {
  useCreateClockInScheduleMutation,
  useGetClockInSchedulesQuery,
} from "@/services/supabase";
import {
  Stack,
  PasswordInput,
  Button,
  LoadingOverlay,
  Text,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { MisaScheduleCalendar } from "./MisaScheduleCalendar/MisaScheduleCalendar";

const schema = z.object({
  sessionId: z.string(),
  schedule: z.string().array(),
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
      schedule: [],
    },
    validate: zodResolver(schema),
  });

  useEffect(() => {
    if (data && data.length) {
      form.setFieldValue("sessionId", data[0].session_id);
      form.setFieldValue("schedule", data[0].schedule ?? []);
      setScheduleId(data[0].id);
    }
  }, [data]);

  const handleSubmit = async (values: FormData) => {
    try {
      await mutateAsync({
        id: scheduleId,
        session_id: values.sessionId,
        schedule: values.schedule,
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
          description="This session is stored in local storage, use it at your own risk."
          {...form.getInputProps("sessionId")}
        />
        <Stack gap={0}>
          <Text fw={500} fz="sm">
            Setup your schedule
          </Text>
          <Text c="dimmed" fz="xs" mb={5}>
            The system will use your schedule to clock in automatically.
          </Text>
          <MisaScheduleCalendar
            value={form.values.schedule}
            onChange={(value) => form.setFieldValue("schedule", value)}
          />
        </Stack>
        <Button type="submit" loading={isPending} disabled={isPending}>
          Save
        </Button>
        <LoadingOverlay visible={isLoading} loaderProps={{ size: "sm" }} />
      </Stack>
    </form>
  );
}
