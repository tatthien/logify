import {
  ActionIcon,
  Button,
  Container,
  createTheme,
  MantineColorsTuple,
  Menu,
  Modal,
  MultiSelect,
  Paper,
  PasswordInput,
  rem,
  Select,
  Tabs,
  Tooltip,
} from '@mantine/core'

import tabClasses from './styles/tab.module.css'

export const theme = createTheme({
  primaryColor: 'dark',
  fontFamily: 'Inter, sans-serif',
  defaultRadius: 8,
  colors: {
    gray: [
      '#F9FAFB',
      '#F2F4F7',
      '#EAECF0',
      '#D0D5DD',
      '#98A2B3',
      '#667085',
      '#475467',
      '#344054',
      '#1D2939',
      '#101828',
    ] as MantineColorsTuple,
  },
  components: {
    Container: Container.extend({
      defaultProps: {
        size: 450,
      },
    }),
    Menu: Menu.extend({
      defaultProps: {
        shadow: 'md',
        position: 'bottom-end',
      },
      styles: () => ({
        divider: {
          marginLeft: rem(-4),
          marginRight: rem(-4),
        },
      }),
    }),
    Tooltip: Tooltip.extend({
      defaultProps: {
        withArrow: true,
        arrowSize: 6,
      },
    }),
    Paper: Paper.extend({
      defaultProps: {
        shadow: 'sm',
        withBorder: true,
      },
      styles(theme) {
        return {
          root: {
            borderColor: theme.colors.gray[2],
          },
        }
      },
    }),
    MultiSelect: MultiSelect.extend({
      defaultProps: {
        checkIconPosition: 'right',
        maxDropdownHeight: 300,
      },
      styles: (theme) => ({
        pill: {
          borderRadius: 4,
          background: theme.colors.gray[3],
          color: theme.colors.gray[9],
          fontWeight: 500,
        },
      }),
    }),
    Select: Select.extend({
      defaultProps: {
        maxDropdownHeight: 300,
      },
    }),
    Tabs: Tabs.extend({
      classNames: {
        list: tabClasses.list,
        tab: tabClasses.tab,
      },
    }),
    PasswordInput: PasswordInput.extend({
      defaultProps: {
        placeholder: '●●●●●●●●',
      },
    }),
    Modal: Modal.extend({
      styles: {
        title: {
          fontWeight: 600,
        },
      },
    }),
    Button: Button.extend({
      defaultProps: {
        radius: 6,
      },
    }),
    ActionIcon: ActionIcon.extend({
      defaultProps: {
        radius: 6,
      },
    }),
  },
})
