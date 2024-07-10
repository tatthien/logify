import {
  Paper,
  Flex,
  Text,
  Group,
  ActionIcon,
  Divider,
  Box,
} from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { PropsWithChildren } from "react";

type CollapsibleCardProps = {
  id: string;
  title?: string;
} & PropsWithChildren;

export function CollapsibleCard({ id, title, children }: CollapsibleCardProps) {
  const localStorageKey = `_w3tech_tracking_${id}`;
  const [collapsed, setCollapsed] = useLocalStorage({
    key: localStorageKey,
    defaultValue: false,
  });

  return (
    <Paper mb={24}>
      <Flex py={12} px={16} align="center" justify="space-between">
        <Text fw={500}>{title || ""}</Text>
        <Group gap={8}>
          <ActionIcon variant="white" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <IconPlus size={20} /> : <IconMinus size={20} />}
          </ActionIcon>
        </Group>
      </Flex>
      {!collapsed && (
        <>
          <Divider color="gray.3" />
          <Box p={16}>{children}</Box>
        </>
      )}
    </Paper>
  );
}
