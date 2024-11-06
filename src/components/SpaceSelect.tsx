import { Loader, Select, SelectProps } from '@mantine/core'

import { useGetSpacesQuery } from '@/hooks/useGetSpacesQuery'

type SpaceSelectProps = SelectProps

export function SpaceSelect(props: SpaceSelectProps) {
  const { data: spaces, isLoading } = useGetSpacesQuery()

  return (
    <Select
      label="Space"
      placeholder="Select space"
      data={spaces?.spaces?.map((space) => ({
        label: space.name,
        value: space.id,
      }))}
      searchable
      rightSection={isLoading && <Loader size="xs" />}
      {...props}
    />
  )
}
