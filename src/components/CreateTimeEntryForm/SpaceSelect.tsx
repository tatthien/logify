import { useState } from "react";
import {
  Avatar,
  Combobox,
  Flex,
  Input,
  InputBase,
  Text,
  useCombobox,
} from "@mantine/core";
import { useGetSpacesQuery } from "@/hooks/useGetSpacesQuery";

export function SpaceSelect() {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const { data: spaces } = useGetSpacesQuery();

  const [value, setValue] = useState<string | null>(null);

  const options = (spaces?.spaces ?? []).map((item) => (
    <Combobox.Option value={item.id} key={item.id}>
      <Flex gap={8} align="center">
        <Avatar
          variant="light"
          src={item.avatar ?? null}
          radius="sm"
          size={28}
          color={item.color}
        >
          {item.name[0]}
        </Avatar>
        <Text span>{item.name}</Text>
      </Flex>
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val) => {
        setValue(val);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          component="button"
          type="button"
          pointer
          rightSection={<Combobox.Chevron />}
          onClick={() => combobox.toggleDropdown()}
          rightSectionPointerEvents="none"
        >
          {value || <Input.Placeholder>Pick value</Input.Placeholder>}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
