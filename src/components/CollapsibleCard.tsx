"use client";
import {
  Paper,
  Flex,
  Text,
  Group,
  Divider,
  Box,
  BoxProps,
} from "@mantine/core";
import { PropsWithChildren } from "react";

type CollapsibleCardProps = {
  id?: string;
  title?: string;
  icon?: React.ReactNode;
  variant?: "default" | "danger";
  collapsible?: boolean;
} & PropsWithChildren &
  BoxProps;

export function CollapsibleCard({
  id,
  title,
  icon,
  variant = "default",
  collapsible = false,
  children,
  ...rest
}: CollapsibleCardProps) {
  const withIcon = !!icon;

  return (
    <Paper
      styles={{
        root: {
          borderColor:
            variant === "danger"
              ? "var(--mantine-color-red-7)"
              : "var(--mantine-color-gray-2)",
        },
      }}
      {...rest}
    >
      <Flex
        py={8}
        px={12}
        align="center"
        justify="space-between"
        tabIndex={0}
        style={{ cursor: collapsible ? "pointer" : "default" }}
      >
        <Group gap={10}>
          {withIcon && icon}
          <Text fw={500} c={variant === "danger" ? "red.7" : "gray.9"}>
            {title || ""}
          </Text>
        </Group>
      </Flex>
      <Divider color="gray.2" />
      <Box p={16}>{children}</Box>
    </Paper>
  );
}
