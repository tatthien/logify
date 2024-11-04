import { Container, Text, Anchor, Box } from "@mantine/core";

export function AppFooter() {
  return (
    <Box component="footer" mt={32}>
      <Container>
        <Text ta="center" fz={14} c="gray.5">
          © 2024{" "}
          <Anchor href="https://thien.dev" c="gray.5" fz={14} target="_blank">
            Thien Nguyen
          </Anchor>
          <Text span px={6} c="gray.4">
            /
          </Text>
          <Anchor
            href="https://github.com/tatthien/clickup-time-tracking"
            target="_blank"
            c="gray.5"
            fz={14}
          >
            GitHub
          </Anchor>
          <Text span px={6} c="gray.4">
            /
          </Text>
          <Anchor
            href="https://www.buymeacoffee.com/tatthien"
            target="_blank"
            c="gray.5"
            fz={14}
          >
            Coffee
          </Anchor>
          <Text span px={6} c="gray.4">
            /
          </Text>
          <Anchor
            href="https://app.seline.so/share/clickup.thien.dev"
            target="_blank"
            c="gray.5"
            fz={14}
          >
            Public Analytics
          </Anchor>
        </Text>
      </Container>
    </Box>
  );
}
