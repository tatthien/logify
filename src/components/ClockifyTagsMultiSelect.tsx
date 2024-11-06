import { MultiSelect, MultiSelectProps } from '@mantine/core'

import { useGetClockifyTagsQuery } from '@/hooks/useGetClockifyTagsQuery'

type ClockifyTagsMultiSelectProps = {
  onChange?: (value: string[]) => void
} & MultiSelectProps

export function ClockifyTagsMultiSelect({ onChange, ...props }: ClockifyTagsMultiSelectProps) {
  const { data } = useGetClockifyTagsQuery()

  return (
    <MultiSelect
      placeholder="Select tags"
      searchable
      data={(data ?? []).map((tag) => ({ value: tag.id, label: tag.name }))}
      label="Tags"
      onChange={(value) => {
        if (onChange) {
          onChange(value)
        }
      }}
      {...props}
    />
  )
}
