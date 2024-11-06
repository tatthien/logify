import toast from 'react-hot-toast'
import { Button, ButtonProps } from '@mantine/core'
import { IconFingerprint } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'

import { useGetClockInSchedulesQuery } from '@/services/supabase'

type ClockInButtonProps = {
  onClockIn?: () => void
} & ButtonProps

export function ClockInButton({ onClockIn }: ClockInButtonProps) {
  const { data, isLoading } = useGetClockInSchedulesQuery()

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['timekeeping'],
    mutationFn: async (sessionId: string) => {
      const res = await fetch('/api/misa', {
        method: 'POST',
        headers: { 'X-Misa-Session-ID': sessionId },
      })

      const data = await res.json()

      if (res.ok) {
        return data
      }

      throw new Error(data.message)
    },
  })

  const handleClockIn = async () => {
    try {
      await mutateAsync(data?.session_id as string)
      toast.success('Clocked in successfully')
      if (onClockIn) {
        onClockIn()
      }
    } catch (error: any) {
      let msg =
        'Clocking in failed. Maybe the session ID is invalid or expired. Please check your session ID and try again.'

      if (error.message) {
        msg = error.message
      }

      toast.error(msg)
    }
  }

  return (
    <Button
      variant="gradient"
      gradient={{ from: 'orange.7', to: 'red.7' }}
      h={44}
      fz={18}
      color={'orange.8'}
      onClick={handleClockIn}
      loading={isPending}
      disabled={isPending || isLoading}
      leftSection={<IconFingerprint size={24} stroke={1.5} />}
    >
      Clock in now
    </Button>
  )
}
