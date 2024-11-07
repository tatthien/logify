'use client'
import { Box, NavLink } from '@mantine/core'
import { IconClockPlus, IconFile, IconKey } from '@tabler/icons-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function SettingsNav() {
  const pathname = usePathname()

  const navItems = [
    {
      href: '/settings/api-keys',
      label: 'API keys',
      icon: IconKey,
    },
    {
      href: '/settings/form',
      label: 'Form',
      icon: IconClockPlus,
    },
    {
      href: '/settings/templates',
      label: 'Templates',
      icon: IconFile
    },
  ]

  return (
    <Box
      style={{
        position: 'absolute',
        width: '180px',
        left: '-180px',
        top: 0,
        padding: '0.75rem 1rem',
      }}
    >
      {navItems.map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          component={Link}
          label={item.label}
          leftSection={<item.icon stroke={pathname === item.href ? 2 : 1.5} size={20} />}
          styles={{
            root: {
              paddingTop: '0.375rem',
              paddingBottom: '0.375rem',
              borderRadius: 'var(--mantine-radius-default)',
              backgroundColor: pathname === item.href ? 'var(--mantine-color-gray-2)' : 'transparent',
              fontWeight: pathname === item.href ? '600' : '400',
            },
          }}
        />
      ))}
    </Box>
  )
}
