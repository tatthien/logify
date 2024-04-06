import { Box, Flex } from "@mantine/core";
import Image from "next/image";

export function AppHeader() {
  return (
    <Box component="header" mb={32}>
      <Flex justify="center">
        <Image src="/logo.png" alt="logo" width={150} height={33} />
      </Flex>
    </Box>
  );
}
