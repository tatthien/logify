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
  Switch,
  Divider,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { MisaScheduleCalendar } from "./MisaScheduleCalendar/MisaScheduleCalendar";
import { ClockInButton } from "./ClockInButton";

const schema = z.object({
  sessionId: z.string(),
  schedule: z.string().array(),
  active: z.boolean(),
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
      active: true,
    },
    validate: zodResolver(schema),
  });

  useEffect(() => {
    if (data && data.length) {
      form.setFieldValue("sessionId", data[0].session_id);
      form.setFieldValue("schedule", data[0].schedule ?? []);
      form.setFieldValue("active", data[0].active);
      setScheduleId(data[0].id);
    }
  }, [data]);

  const handleSubmit = async (values: FormData) => {
    try {
      await mutateAsync({
        id: scheduleId,
        session_id: values.sessionId,
        schedule: values.schedule,
        active: values.active,
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
          <Text c="dimmed" fz="xs" mb={8}>
            The system will use your schedule to clock in automatically at 9:00
            AM and 9:30 AM every day (GMT+7).
          </Text>

          <Switch
            mb={8}
            label="Enable auto clock in"
            checked={form.values.active}
            {...form.getInputProps("active")}
          />

          <MisaScheduleCalendar
            value={form.values.schedule}
            disabled={!form.values.active}
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
