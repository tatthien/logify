import { useGetMembersQuery } from "@/hooks/useGetMembersQuery";
import {
  SelectProps,
  Group,
  Avatar,
  Text,
  Loader,
  Select,
} from "@mantine/core";
import { IconUser } from "@tabler/icons-react";
import { useMemo } from "react";

export function MemberSelect({ value, ...props }: SelectProps) {
  const { data: members, isLoading } = useGetMembersQuery();

  const selectedAssignee = useMemo(() => {
    const assignee = members?.find(
      (member) => member.user.id.toString() === value,
    );
    return assignee;
  }, [value, members]);

  const renderAssigneeSelectOption: SelectProps["renderOption"] = ({
    option,
    checked,
  }) => {
    const member = members?.find(
      ({ user }) => user.id.toString() === option.value,
    );

    return (
      <Group gap={6} justify="space-between" align="center">
        <Avatar
          size="sm"
          alt="Avatar"
          src={member?.user.profilePicture}
          color={member?.user.color}
        >
          {member?.user.initials}
        </Avatar>
        <Text size="xs" fw={checked ? 600 : 400}>
          {option.label}
        </Text>
      </Group>
    );
  };

  return (
    <Select
      {...props}
      data={members?.map((member) => ({
        value: member.user.id.toString(),
        label: member.user.username,
      }))}
      renderOption={renderAssigneeSelectOption}
      leftSection={
        selectedAssignee ? (
          <Avatar
            size={20}
            src={selectedAssignee.user.profilePicture}
            color={selectedAssignee.user.color}
          >
            {selectedAssignee.user.initials}
          </Avatar>
        ) : (
          <IconUser size={16} />
        )
      }
      rightSection={isLoading && <Loader size="xs" />}
      value={value}
    />
  );
}
