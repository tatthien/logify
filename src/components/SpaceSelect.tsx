import { useGetSpacesQuery } from "@/hooks/useGetSpacesQuery";
import { Select, SelectProps } from "@mantine/core";

type SpaceSelectProps = SelectProps;

export function SpaceSelect(props: SpaceSelectProps) {
  const { data: spaces } = useGetSpacesQuery();

  return (
    <Select
      label="Space"
      placeholder="Select space"
      data={spaces?.spaces?.map((space) => ({
        label: space.name,
        value: space.id,
      }))}
      searchable
      {...props}
    />
  );
}
