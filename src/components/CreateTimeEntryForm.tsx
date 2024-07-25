import { useGetTasksQuery } from "@/hooks/useGetTasksQuery";
import { ClockifyTimeEntry, Form } from "@/types";
import {
  Button,
  Divider,
  Flex,
  NumberInput,
  Stack,
  Textarea,
} from "@mantine/core";
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
import * as seline from "@seline-analytics/web";
import { useAuthentication } from "@/hooks/useAuthentication";

const START_HOUR = 9;
const RESTING_HOUR_START = 12;
const RESTING_HOUR_END = 13;
const DATE_FORMAT_LAYOUT = "YYYY-MM-DDTHH:mm:ssZ";

interface CreateTimeEntryFormProps {
  date: Date;
  timeEntries: ClockifyTimeEntry[];
}

const initialFormValues = {
  spaceId: null,
  tid: "",
  duration: 0,
  description: "",
  projectId: null,
  tagIds: [],
  start: new Date(),
};

export function CreateTimeEntryForm({
  date,
  timeEntries,
}: CreateTimeEntryFormProps) {
  const { user } = useAuthentication();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (body: CreateClockifyTimeEntryPayload) =>
      createClockifyTimeEntry(body),
  });
  const { clockifyTimeEntriesQuery } = useCalendarStore();
  const { refetch } = useGetClockifyTimeEntriesQuery(clockifyTimeEntriesQuery);
  const { data: settings } = useGetDefaultTimeEntrySettingsFormQuery();

  const form = useForm<Form>({
    initialValues: { ...initialFormValues },
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

    form.setFieldValue("tagIds", tagIds || initialFormValues.tagIds);
    form.setFieldValue("spaceId", spaceId || initialFormValues.spaceId);
    form.setFieldValue("projectId", projectId || initialFormValues.projectId);

    // For resetting
    form.setInitialValues({
      ...initialFormValues,
      tagIds: tagIds || initialFormValues.tagIds,
      spaceId: spaceId || initialFormValues.spaceId,
      projectId: projectId || initialFormValues.projectId,
    });
  }, [settings]);

  async function handleSubmit(values: any) {
    try {
      // Initial payload with start date and end date are null
      const payload: CreateClockifyTimeEntryPayload = {
        description: values.description,
        tagIds: values.tagIds,
        projectId: values.projectId,
        start: null,
        end: null,
      };

      const duration = Number(values.duration);
      const startOfTheDate = dayjs(date).format("YYYY-MM-DD"); // "2022-01-01T00:00:00.000Z"

      // The first time entry
      if (timeEntries.length === 0) {
        let start = dayjs(startOfTheDate).add(START_HOUR, "hour");

        if (duration <= RESTING_HOUR_START - START_HOUR) {
          // Normal case
          payload.start = start.format(DATE_FORMAT_LAYOUT);
          payload.end = dayjs(start)
            .add(duration, "hour")
            .format(DATE_FORMAT_LAYOUT);

          await mutateAsync(payload);
        } else {
          // If duration is greater than `RESTING_HOUR_START - START_HOUR`, we will make 2 time entries.
          // The one which start date is from `START_HOUR` to `RESTING_HOUR_START`
          // and the other which start date is from `RESTING_HOUR_END`.

          // 1st time entry
          payload.start = start.format(DATE_FORMAT_LAYOUT);
          payload.end = dayjs(payload.start)
            .add(RESTING_HOUR_START - START_HOUR, "hour")
            .format(DATE_FORMAT_LAYOUT);

          await mutateAsync(payload);

          // 2nd time entry
          payload.start = dayjs(startOfTheDate)
            .add(RESTING_HOUR_END, "hour")
            .format(DATE_FORMAT_LAYOUT);
          payload.end = dayjs(payload.start)
            .add(duration - (RESTING_HOUR_START - START_HOUR), "hour")
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

      seline.track("user:create-time-entry", {
        userId: user?.id,
      });
    } catch (error) {
      toast.success("Failed to create time entry");
    }
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap={8}>
        <Divider
          label="ClickUp"
          labelPosition="left"
          color="rgb(from #FD71AF r g b / .3)"
          styles={{ label: { color: "#FD71AF", fontWeight: 600 } }}
        />
        <SpaceSelect label="Space" {...form.getInputProps("spaceId")} />
        <TaskSelect
          spaceId={form.values.spaceId}
          {...form.getInputProps("tid")}
        />
        <Divider
          label="Clockify"
          labelPosition="left"
          color="rgb(from #03a9f4 r g b / .3)"
          styles={{ label: { color: "#03a9f4", fontWeight: 600 } }}
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
          placeholder="The description will be auto populated when you select ClickUp task."
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
