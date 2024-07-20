import { ClockifyTimeEntry, UpdateTimeEntryForm } from "@/types";
import { Button, Flex, NumberInput, Stack, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { ClockifyTagsMultiSelect } from "./ClockifyTagsMultiSelect";
import { ClockifyProjectSelect } from "./ClockifyProjectSelect";
import { useMutation } from "@tanstack/react-query";
import {
  CreateClockifyTimeEntryPayload,
  UpdateClockifyTimeEntryPayload,
  updateClockifyTimeEntry,
} from "@/services/clockify/time-entry";
import dayjs from "dayjs";
import { modals } from "@mantine/modals";
import toast from "react-hot-toast";
import { useGetClockifyTimeEntriesQuery } from "@/hooks/useGetClockifyTimeEntriesQuery";
import { useCalendarStore } from "@/stores/useCalendarStore";

const DATE_FORMAT_LAYOUT = "YYYY-MM-DDTHH:mm:ssZ";

interface UpdateTimeEntryFormProps {
  data: ClockifyTimeEntry;
}

export function UpdateTimeEntryForm({ data }: UpdateTimeEntryFormProps) {
  const { clockifyTimeEntriesQuery } = useCalendarStore();
  const { refetch } = useGetClockifyTimeEntriesQuery(clockifyTimeEntriesQuery);
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (body: CreateClockifyTimeEntryPayload) =>
      updateClockifyTimeEntry({ id: data.id, ...body }),
  });

  const form = useForm<UpdateTimeEntryForm>({
    initialValues: {
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

  useEffect(() => {
    form.setValues({
      tagIds: data.tagIds,
      projectId: data.projectId,
      description: data.description,
      duration:
        dayjs(data.timeInterval.end).diff(
          dayjs(data.timeInterval.start),
          "minute",
        ) / 60,
    });
  }, [data]);

  async function handleSubmit(values: any) {
    try {
      const payload: UpdateClockifyTimeEntryPayload = {
        id: data.id,
        description: values.description,
        tagIds: values.tagIds,
        projectId: values.projectId,
        start: data.timeInterval.start,
        end: dayjs(data.timeInterval.start)
          .add(values.duration, "hour")
          .format(DATE_FORMAT_LAYOUT),
      };

      await mutateAsync(payload);
      toast.success("Time entry updated");
      refetch();
    } catch (error: any) {
      toast.error(error.message || "Failed to update time entry");
    }
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap={8}>
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
          Update
        </Button>
      </Flex>
    </form>
  );
}
