import { useGetClockifyProjectsQuery } from "@/hooks/useGetClockifyProjectsQuery";
import { Select, SelectProps } from "@mantine/core";

type ClockifyProjectSelectProps = {
  onChange?: (value: string | null) => void;
} & SelectProps;

export function ClockifyProjectSelect({
  onChange,
  ...props
}: ClockifyProjectSelectProps) {
  const { data } = useGetClockifyProjectsQuery();
  return (
    <Select
      data={(data ?? []).map((project) => ({
        value: project.id,
        label: project.name,
      }))}
      searchable
      label="Project"
      placeholder="Select project"
      onChange={(value) => {
        if (onChange) {
          onChange(value);
        }
      }}
      {...props}
    />
  );
}
