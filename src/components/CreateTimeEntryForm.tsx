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
import { useEffect, useMemo } from "react";
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
import { parseDuration } from "@/helpers/parseDuration";
import { areTwoDatesEqual } from "@/utils/areTwoDatesEqual";

const START_HOUR = 9;
const DATE_FORMAT_LAYOUT = "YYYY-MM-DDTHH:mm:ssZ";

interface CreateTimeEntryFormProps {
  date: Date;
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
}: CreateTimeEntryFormProps) {
  const { user } = useAuthentication();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (body: CreateClockifyTimeEntryPayload) =>
      createClockifyTimeEntry(body),
    onSuccess: (body) => {
      seline.track("user:create-time-entry", {
        userId: user?.id,
        ...body
      });
    }
  });
  const { clockifyTimeEntriesQuery } = useCalendarStore();
  const { data: clockifyTimeEntries, refetch } = useGetClockifyTimeEntriesQuery(clockifyTimeEntriesQuery);
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

  const timeEntries = useMemo(() => {
    if (!clockifyTimeEntries) return [];

    const data = clockifyTimeEntries.filter((timeEntry) => {
      return areTwoDatesEqual(timeEntry.timeInterval.start, date);
    });

    const sortedData = data.sort((a, b) => {
      return dayjs(a.timeInterval.start).diff(dayjs(b.timeInterval.start), 'hour') > 0 ? 1 : -1
    })

    return sortedData
  }, [clockifyTimeEntries, date])

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
      const dayStart = dayjs(date).startOf('day')

      const start = timeEntries.length === 0
        ? dayStart.add(START_HOUR, "hour")
        : dayjs(timeEntries[timeEntries.length - 1].timeInterval.end)

      const startHour = start.hour() + start.minute() / 60

      const ranges = parseDuration(startHour, Number(values.duration))

      const payloads: CreateClockifyTimeEntryPayload[] = ranges.map(range => ({
        projectId: values.projectId,
        description: values.description,
        tagIds: values.tagIds,
        start: dayStart.add(range[0], "hour").format(DATE_FORMAT_LAYOUT),
        end: dayStart.add(range[1], "hour").format(DATE_FORMAT_LAYOUT),
      }))


      await Promise.all(payloads.map(payload => mutateAsync(payload)))
      toast.success("Time entry created");
      refetch();
      form.reset()
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
