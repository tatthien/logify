import {
  Container,
  Flex,
  Text,
  Anchor,
  ActionIcon,
  Tooltip,
  Box,
} from "@mantine/core";
import { IconBrandGithub, IconCoffee } from "@tabler/icons-react";

export function AppFooter() {
  return (
    <Box component="footer" mt={32}>
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
    </Box>
  );
}
