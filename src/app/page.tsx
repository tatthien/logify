"use client";
import { Calendar } from "@/components/Calendar/Calendar";
import {
  ActionIcon,
  Anchor,
  Container,
  Flex,
  Paper,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { TokenForm } from "@/components/TokenForm/TokenForm";
import { IconBrandGithub, IconCoffee } from "@tabler/icons-react";
import { useEffect } from "react";
import { sendAnalytics } from "@/utils/sendAnalytics";

export default function Home() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      sendAnalytics("page_view");
    }
  }, []);
  return (
    <main>
      <Container py={40}>
        <Title mb={24} fz={32}>
          🤔 Have you logged ClickUp hours yet?
        </Title>
        <Paper withBorder shadow="md" p={16} mb={24}>
          <TokenForm />
        </Paper>
        <Calendar />
      </Container>
      <footer>
        <Container>
          <Text ta="center">
            © 2024{" "}
            <Anchor href="https://thien.dev" c="pink.5">
              Thien Nguyen
            </Anchor>
          </Text>
          <Flex justify="center">
            <Tooltip label="Star on GitHub">
              <ActionIcon
                variant="subtle"
                component="a"
                href="https://github.com/tatthien/clickup-time-tracking"
                target="_blank"
              >
                <IconBrandGithub size={18} strokeWidth={2.2} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Buy me a coffee">
              <ActionIcon
                variant="subtle"
                component="a"
                href="https://www.buymeacoffee.com/tatthien"
                target="_blank"
              >
                <IconCoffee size={18} strokeWidth={2.2} />
              </ActionIcon>
            </Tooltip>
          </Flex>
        </Container>
      </footer>
    </main>
  );
}
