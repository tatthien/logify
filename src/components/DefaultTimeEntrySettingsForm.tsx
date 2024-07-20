"use client";

import { Button, Flex, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { SpaceSelect } from "./SpaceSelect";
import { ClockifyProjectSelect } from "./ClockifyProjectSelect";
import { ClockifyTagsMultiSelect } from "./ClockifyTagsMultiSelect";
import { MemberSelect } from "./MemberSelect";
import { supabase } from "@/utils/supabase/client";
import { useAuthentication } from "@/hooks/useAuthentication";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useGetDefaultTimeEntrySettingsFormQuery } from "@/services/supabase";
import { useEffect } from "react";

export function DefaultTimeEntrySettingsForm() {
  const { user } = useAuthentication();
  const form = useForm<{
    spaceId: string;
    assigneeId: string;
    projectId: string;
    tagIds: string[];
  }>({
    initialValues: {
      spaceId: "",
      assigneeId: "",
      projectId: "",
      tagIds: [],
    },
  });

  const { data, refetch } = useGetDefaultTimeEntrySettingsFormQuery();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: any) => {
      const { error } = await supabase.from("settings").upsert({
        id: data ? data.id : undefined,
        user_id: user?.id,
        key: "default_time_entry_form_values", // @TODO: constant
        value: payload,
      });

      if (error) throw error;
    },
  });

  useEffect(() => {
    if (!data) return;
    form.setValues(data.value);
  }, [data]);

  const handleSubmit = async (values: any) => {
    try {
      await mutateAsync(values);
      refetch();
      toast.success("Settings saved successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to save settings");
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Text fz="sm" c="dimmed">
        Set up default value for Project, Assignee or Tags when creating a new
        time entry.
      </Text>
      <Stack gap={8}>
        <SpaceSelect
          label="Space"
          clearable
          searchable
          {...form.getInputProps("spaceId")}
        />
        <MemberSelect
          label="Assignee"
          placeholder="Select assignee"
          clearable
          searchable
          {...form.getInputProps("assigneeId")}
        />
        <ClockifyProjectSelect clearable {...form.getInputProps("projectId")} />
        <ClockifyTagsMultiSelect {...form.getInputProps("tagIds")} />
      </Stack>
      <Flex justify="flex-start" align="center" mt={16} gap={8}>
        <Button type="submit" loading={isPending}>
          Save
        </Button>
      </Flex>
    </form>
  );
}
