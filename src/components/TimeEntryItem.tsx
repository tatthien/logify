import { ClockifyTimeEntry } from "@/types";
import { ActionIcon, Badge, Box, Button, Flex, Text } from "@mantine/core";
import { IconArrowUpRight, IconTrash } from "@tabler/icons-react";
import { MouseEvent, useMemo, useState } from "react";
import dayjs from "dayjs";
import { formatClockifyDuration } from "@/helpers/formatClockifyDuration";
import { useMutation } from "@tanstack/react-query";
import { deleteClockifyTimeEntry } from "@/services/clockify/time-entry";
import { useGetClockifyProjectsQuery } from "@/hooks/useGetClockifyProjectsQuery";
import toast from "react-hot-toast";
import { useGetClockifyTagsQuery } from "@/hooks/useGetClockifyTagsQuery";

type TimeEntryItemProps = {
  data?: ClockifyTimeEntry;
  onDelete?: () => void;
};
export function TimeEntryItem({ data, onDelete }: TimeEntryItemProps) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const { data: projects } = useGetClockifyProjectsQuery();
  const { data: tags } = useGetClockifyTagsQuery();

  const { mutateAsync } = useMutation({
    mutationFn: (id: string) => deleteClockifyTimeEntry(id),
  });

  const [isLoading, setIsLoading] = useState(false);

  const project = useMemo(() => {
    if (!data || !projects) return;

    return projects.find((p) => p.id === data.projectId);
  }, [data, projects]);

  const itemTags = useMemo(() => {
    if (!data || !tags) return [];

    return tags.filter((t) => data.tagIds.includes(t.id));
  }, [data, tags]);

  const clickUpTaskURL = useMemo(() => {
    if (!data) return null;
    // Attempt to extract the clickup task url from the description
    const regex = /(https:\/\/app.clickup.com\/t\/[a-z0-9]+)/;
    const matches = data.description.match(regex);
    if (matches && matches.length) {
      return matches[0];
    }
    return null;
  }, [data]);

  async function handleDelete(event: MouseEvent<HTMLButtonElement>) {
    setShowDeleteConfirmation(false);
    if (!data) return;
    setIsLoading(true);
    await mutateAsync(data.id);
    if (onDelete) {
      onDelete();
    }
    toast.success("Time entry deleted");
    setIsLoading(false);
  }

  if (!data) {
    return;
  }

  return (
    <Box
      style={{
        backgroundColor: `rgb(from ${project?.color} r g b / .05)`,
        padding: 6,
        borderRadius: 6,
        border: `1px solid ${project?.color}`,
        position: "relative",
      }}
    >
      <Text fz={14} mb={4}>
        {data.description}
      </Text>
      {project && (
        <Text fz={12} fw={500} c={project?.color}>
          {project?.name}
        </Text>
      )}
      {itemTags.length > 0 && (
        <Text c="gray.6" fz={12} fw={500}>
          {itemTags.map((t) => `#${t.name}`).join(", ")}
        </Text>
      )}
      <Flex align="center" justify="space-between" gap={8}>
        <Flex align="center" justify="space-between" gap={8}>
          <Text
            ta="right"
            fz="12"
            fw={500}
            c="gray.7"
          >{`${dayjs(data.timeInterval.start).format("HH:mm")} - ${dayjs(data.timeInterval.end).format("HH:mm")}`}</Text>
          <Badge fz="12" tt={"lowercase"} fw="500" variant="default">
            {formatClockifyDuration(data.timeInterval.duration)}
          </Badge>
          {clickUpTaskURL && (
            <Button
              rightSection={<IconArrowUpRight size={16} />}
              component="a"
              href={clickUpTaskURL}
              target="_blank"
              size="compact-xs"
              variant="subtle"
              radius="xl"
              fw={500}
            >
              ClickUp
            </Button>
          )}
        </Flex>
        {!showDeleteConfirmation && (
          <ActionIcon
            variant="subtle"
            size="sm"
            color="red"
            loading={isLoading}
            onClick={() => setShowDeleteConfirmation(true)}
          >
            <IconTrash size={16} />
          </ActionIcon>
        )}
        {showDeleteConfirmation && (
          <Flex gap={6} align="center" pos="absolute" bottom={0} right={6}>
            <Button
              variant="transparent"
              p={0}
              fz={12}
              fw={400}
              color="gray.7"
              onClick={() => setShowDeleteConfirmation(false)}
            >
              No
            </Button>
            <Button
              variant="transparent"
              p={0}
              fz={12}
              fw={400}
              color="red.5"
              onClick={handleDelete}
            >
              Yes
            </Button>
          </Flex>
        )}
      </Flex>
    </Box>
  );
}
