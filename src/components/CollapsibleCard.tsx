"use client";
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
  icon?: React.ReactNode;
  variant?: "default" | "danger";
  collapsible?: boolean;
} & PropsWithChildren;

export function CollapsibleCard({
  id,
  title,
  icon,
  variant = "default",
  collapsible = true,
  children,
}: CollapsibleCardProps) {
  const localStorageKey = `_w3tech_tracking_${id}`;
  const [collapsed, setCollapsed] = useLocalStorage({
    key: localStorageKey,
    defaultValue: false,
  });

  const withIcon = !!icon;

  return (
    <Paper
      mb={24}
      styles={{
        root: {
          borderColor:
            variant === "danger"
              ? "var(--mantine-color-red-7)"
              : "var(--mantine-color-gray-2)",
        },
      }}
    >
      <Flex
        py={12}
        px={16}
        align="center"
        justify="space-between"
        tabIndex={0}
        onClick={() => setCollapsed(!collapsed)}
        style={{ cursor: "pointer" }}
      >
        <Group gap={6}>
          {withIcon && icon}
          <Text fw={500} c={variant === "danger" ? "red.7" : "gray.9"}>
            {title || ""}
          </Text>
        </Group>
        <ActionIcon variant="white" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <IconPlus size={20} /> : <IconMinus size={20} />}
        </ActionIcon>
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
