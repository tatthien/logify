"use client";
import { Calendar } from "@/components/Calendar/Calendar";
import { Container, Paper, Title } from "@mantine/core";
import { TokenForm } from "@/components/TokenForm/TokenForm";

export default function Home() {
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
    </main>
  );
}
