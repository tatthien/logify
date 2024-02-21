import {
  Anchor,
  Button,
  Flex,
  FocusTrap,
  Text,
  TextInput,
} from "@mantine/core";
import { FormEvent, useEffect, useState } from "react";
import { useLocalStorage } from "@mantine/hooks";
import { IconCircleKey, IconKey } from "@tabler/icons-react";

export function TokenForm() {
  const [value, setValue] = useLocalStorage({
    key: "clickup_pk",
    defaultValue: "",
  });

  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValue(inputValue.trim());
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex gap={8} w="100%" mb={8} align="center">
        <FocusTrap active={true}>
          <TextInput
            data-autofocus
            style={{ flex: 1 }}
            value={inputValue}
            leftSection={<IconCircleKey size={20} />}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder="Enter your ClickUp personal token here"
          />
        </FocusTrap>
        <Flex gap={6} align="center">
          <Button variant="default" type="submit">
            Save
          </Button>
        </Flex>
      </Flex>

      <Text size="sm">
        <Anchor href="/how-to-get-token.webp" target="_blank">
          How to retrieve your ClickUp personal token?
        </Anchor>
      </Text>
    </form>
  );
}
