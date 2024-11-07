'use client'
import { PropsWithChildren } from 'react'
import { Box, BoxProps, Flex, Group, Paper, Text } from '@mantine/core'
import { TablerIconsProps } from '@tabler/icons-react'

type CollapsibleCardProps = {
  id?: string
  title?: string
  icon?: (props: TablerIconsProps) => JSX.Element
  variant?: 'default' | 'danger'
  collapsible?: boolean
} & PropsWithChildren &
  BoxProps

export function CollapsibleCard({
  id,
  title,
  icon,
  variant = 'default',
  collapsible = false,
  children,
  ...rest
}: CollapsibleCardProps) {
  const Icon = icon
  const withIcon = !!Icon

  return (
    <Paper
      id={id}
      shadow="xs"
      styles={{
        root: {
          borderColor: variant === 'danger' ? 'var(--mantine-color-red-2)' : 'var(--mantine-color-gray-2)',
          overflow: 'hidden',
        },
      }}
      {...rest}
    >
      <Flex
        pt={6}
        pb={2}
        px={12}
        align="center"
        justify="space-between"
        tabIndex={0}
        bg={variant === 'danger' ? 'red.1' : 'gray.1'}
        style={{ cursor: collapsible ? 'pointer' : 'default' }}
      >
        <Group gap={6}>
          {withIcon && (
            <Text c={variant === 'danger' ? 'red.7' : 'gray.9'} span fz={0}>
              <Icon size={18} color="currentColor" />
            </Text>
          )}
          <Text fw={600} fz="sm" c={variant === 'danger' ? 'red.7' : 'gray.9'} span>
            {title || ''}
          </Text>
        </Group>
      </Flex>
      <Box p={4} bg={variant === 'danger' ? 'red.1' : 'gray.1'}>
        <Box
          bg="white"
          p={12}
          style={{
            borderRadius: '0.25rem',
            border: `1px solid ${variant === 'danger' ? 'var(--mantine-color-red-2)' : 'var(--mantine-color-gray-2)'}`,
          }}
        >
          {children}
        </Box>
      </Box>
    </Paper>
  )
}
