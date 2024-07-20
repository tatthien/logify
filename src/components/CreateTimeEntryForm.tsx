import { useGetTasksQuery } from "@/hooks/useGetTasksQuery";
import { ClockifyTimeEntry, Form } from "@/types";
import { Button, Flex, NumberInput, Stack, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { ClockifyTagsMultiSelect } from "./ClockifyTagsMultiSelect";
import { ClockifyProjectSelect } from "./ClockifyProjectSelect";
import { useMutation } from "@tanstack/react-query";
import {
  CreateClockifyTimeEntryPayload,
  createClockifyTimeEntry,
} from "@/services/clockify/time-entry";
import dayjs from "dayjs";
import { SpaceSelect } from "./SpaceSelect";
import { TaskSelect } from "./TaskSelect";
import toast from "react-hot-toast";
import { modals } from "@mantine/modals";
import { useCalendarStore } from "@/stores/useCalendarStore";
import { useGetClockifyTimeEntriesQuery } from "@/hooks/useGetClockifyTimeEntriesQuery";
import { useGetDefaultTimeEntrySettingsFormQuery } from "@/services/supabase";

const START_HOUR = 9;
const RESTING_HOUR_START = 12;
const RESTING_HOUR_END = 13;
const DATE_FORMAT_LAYOUT = "YYYY-MM-DDTHH:mm:ssZ";

interface CreateTimeEntryFormProps {
  date: Date;
  timeEntries: ClockifyTimeEntry[];
}

export function CreateTimeEntryForm({
  date,
  timeEntries,
}: CreateTimeEntryFormProps) {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (body: CreateClockifyTimeEntryPayload) =>
      createClockifyTimeEntry(body),
  });
  const { clockifyTimeEntriesQuery } = useCalendarStore();
  const { refetch } = useGetClockifyTimeEntriesQuery(clockifyTimeEntriesQuery);
  const { data: settings } = useGetDefaultTimeEntrySettingsFormQuery();

  const form = useForm<Form>({
    initialValues: {
      spaceId: "",
      tid: "",
      duration: 0,
      description: "",
      projectId: "",
      tagIds: [],
      start: new Date(),
    },
    validate: {
      projectId: (value) => (value === "" ? "Please select a project" : null),
      tagIds: (value) =>
        !value || value.length === 0 ? "Please select tags" : null,
      duration: (value) =>
        value <= 0 ? "Duration must be greater than 0" : null,
    },
  });

  const { data: tasks } = useGetTasksQuery({
    space_id: form.values.spaceId,
    include_closed: false,
  });

  useEffect(() => {
    if (form.values.tid === "") return;
    if (!tasks || !tasks.tasks.length) return;

    const selectedTask = tasks.tasks.find(({ id }) => id === form.values.tid);
    if (!selectedTask) return;

    form.setFieldValue(
      "description",
      `${selectedTask.name}: ${selectedTask.url}`,
    );
  }, [form.values.tid, tasks]);

  useEffect(() => {
    if (!settings) return;

    const { spaceId, tagIds, projectId } = settings.value;

    form.setFieldValue("tagIds", tagIds || []);
    form.setFieldValue("spaceId", spaceId || "");
    form.setFieldValue("projectId", projectId || "");

    // For resetting
    form.setInitialValues({
      spaceId: spaceId || "",
      tagIds: tagIds || [],
      projectId: projectId || "",
      tid: "",
      duration: 0,
      description: "",
      start: new Date(),
    });
  }, [settings]);

  async function handleSubmit(values: any) {
    try {
      const payload: CreateClockifyTimeEntryPayload = {
        description: values.description,
        tagIds: values.tagIds,
        projectId: values.projectId,
        start: "",
        end: "",
      };

      const duration = Number(values.duration);

      // The first time entry
      if (timeEntries.length === 0) {
        let start = dayjs(date).add(START_HOUR, "hour");

        if (duration > RESTING_HOUR_START - START_HOUR) {
          // If duration is greater than `RESTING_HOUR_START - START_HOUR`, we will make 2 time entries.
          // One is from `START_HOUR` to `RESTING_HOUR_START` and the other is from `RESTING_HOUR_END`

          // 1st time entry
          let end = dayjs(start).add(3, "hour");

          payload.start = start.format(DATE_FORMAT_LAYOUT);
          payload.end = end.format(DATE_FORMAT_LAYOUT);

          await mutateAsync(payload);

          // 2nd time entry
          start = dayjs(date).add(RESTING_HOUR_END, "hour");
          end = dayjs(start).add(duration - 3, "hour");

          payload.start = start.format(DATE_FORMAT_LAYOUT);
          payload.end = end.format(DATE_FORMAT_LAYOUT);

          await mutateAsync(payload);
        } else {
          payload.start = start.format(DATE_FORMAT_LAYOUT);
          payload.end = dayjs(start)
            .add(duration, "hour")
            .format(DATE_FORMAT_LAYOUT);
          await mutateAsync(payload);
        }
      }

      // From the second time entry
      if (timeEntries.length > 0) {
        // Start date is the end date of the last time entry
        const lastTimeEntry = timeEntries[timeEntries.length - 1];
        let start = dayjs(lastTimeEntry.timeInterval.end);

        const startHour = dayjs(start).hour() + dayjs(start).minute() / 60;

        if (
          startHour > RESTING_HOUR_START ||
          duration <= RESTING_HOUR_START - startHour
        ) {
          payload.start = start.format(DATE_FORMAT_LAYOUT);
          payload.end = dayjs(start)
            .add(duration, "hour")
            .format(DATE_FORMAT_LAYOUT);

          await mutateAsync(payload);
        } else {
          let end = dayjs(start).add(RESTING_HOUR_START - startHour, "hour");

          payload.start = start.format(DATE_FORMAT_LAYOUT);
          payload.end = end.format(DATE_FORMAT_LAYOUT);

          if (RESTING_HOUR_START - startHour > 0) {
            await mutateAsync(payload);
          }

          start = dayjs(date).add(RESTING_HOUR_END, "hour");
          end = dayjs(start).add(
            duration - (RESTING_HOUR_START - startHour),
            "hour",
          );

          payload.start = start.format(DATE_FORMAT_LAYOUT);
          payload.end = end.format(DATE_FORMAT_LAYOUT);

          await mutateAsync(payload);
        }
      }

      toast.success("Time entry created");
      refetch();
      form.reset();
    } catch (error) {
      toast.success("Failed to create time entry");
    }
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap={8}>
        <SpaceSelect label="Space" {...form.getInputProps("spaceId")} />
        <TaskSelect
          spaceId={form.values.spaceId}
          {...form.getInputProps("tid")}
        />
        <ClockifyProjectSelect
          withAsterisk
          {...form.getInputProps("projectId")}
        />
        <ClockifyTagsMultiSelect
          withAsterisk
          {...form.getInputProps("tagIds")}
        />
        <NumberInput
          min={0}
          step={0.5}
          label="Duration (hour)"
          placeholder="E.g: 1.5"
          withAsterisk
          {...form.getInputProps("duration")}
        />
        <Textarea
          label="Description"
          placeholder=""
          rows={3}
          {...form.getInputProps("description")}
        />
      </Stack>
      <Flex justify="flex-end" align="center" mt={16} gap={8}>
        <Button variant="default" onClick={() => modals.closeAll()}>
          Cancel
        </Button>
        <Button type="submit" loading={isPending}>
          Create
        </Button>
      </Flex>
    </form>
  );
}
