import {
  ActionIcon,
  Anchor,
  Flex,
  FocusTrap,
  Text,
  TextInput,
} from "@mantine/core";
import { FormEvent, useEffect, useState } from "react";
import { useLocalStorage } from "@mantine/hooks";
import { IconEye, IconEyeOff, IconKey } from "@tabler/icons-react";
import toast from "react-hot-toast";
import { debounce } from "@/utils/debounce";

export function TokenForm() {
  const [value, setValue] = useLocalStorage({
    key: "clickup_pk",
    defaultValue: "",
  });

  const [inputValue, setInputValue] = useState("");
  const [showToken, setShowToken] = useLocalStorage({
    key: "clickup_time_tracking_show_token",
    defaultValue: true,
  });

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValue(inputValue.trim());
    toast.success("Saved");
  };

  const debouncedSaveToken = debounce((value: string) => {
    setValue(value);
    toast.success("Saved");
  }, 500);

  return (
    <form onSubmit={handleSubmit}>
      <Flex gap={8} w="100%" mb={8} align="center">
        <FocusTrap active={true}>
          <TextInput
            type={showToken ? "text" : "password"}
            data-autofocus
            style={{ flex: 1 }}
            value={inputValue}
            leftSection={<IconKey size={24} stroke={1.5} />}
            rightSection={
              <ActionIcon
                variant="light"
                radius={4}
                onClick={() => setShowToken(!showToken)}
              >
                {showToken ? <IconEye size={20} /> : <IconEyeOff size={20} />}
              </ActionIcon>
            }
            onChange={(event) => {
              setInputValue(event.target.value);
              debouncedSaveToken(event.target.value);
            }}
            placeholder="Enter your ClickUp personal token here"
          />
        </FocusTrap>
      </Flex>

      <Text size="sm">
        <Anchor href="/how-to-get-token.webp" target="_blank">
          How to retrieve your ClickUp personal token?
        </Anchor>
      </Text>
    </form>
  );
}
