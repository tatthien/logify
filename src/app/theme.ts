import {
  Container,
  MantineColorsTuple,
  Menu,
  MultiSelect,
  Paper,
  Tabs,
  TabsList,
  Tooltip,
  createTheme,
  rem,
} from "@mantine/core";

import { Inter } from "next/font/google";
import tabClasses from "./styles/tab.module.css";

const inter = Inter({ subsets: ["latin"] });

const CONTAINER_SIZES: Record<string, string> = {
  xxs: rem(300),
  xs: rem(400),
  sm: rem(500),
  md: rem(600),
  lg: rem(700),
  xl: rem(800),
  xxl: rem(900),
};

export const theme = createTheme({
  primaryColor: "dark",
  fontFamily: inter.style.fontFamily,
  defaultRadius: 8,
  colors: {
    gray: [
      "#F9FAFB",
      "#F2F4F7",
      "#EAECF0",
      "#D0D5DD",
      "#98A2B3",
      "#667085",
      "#475467",
      "#344054",
      "#1D2939",
      "#101828",
    ] as MantineColorsTuple,
  },
  components: {
    Container: Container.extend({
      defaultProps: {
        size: "sm",
      },
      vars: (_, { size, fluid }) => ({
        root: {
          "--container-size": fluid
            ? "100%"
            : size !== undefined && size in CONTAINER_SIZES
              ? CONTAINER_SIZES[size]
              : rem(size),
        },
      }),
    }),
    Menu: Menu.extend({
      defaultProps: {
        radius: 12,
        shadow: "md",
        position: "bottom-end",
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
        shadow: "md",
        withBorder: true,
      },
      styles(theme) {
        return {
          root: {
            borderColor: theme.colors.gray[2],
          },
        };
      },
    }),
    MultiSelect: MultiSelect.extend({
      defaultProps: {
        checkIconPosition: "right",
      },
      styles: () => ({
        pill: {
          borderRadius: 4,
        },
      }),
    }),
    Tabs: Tabs.extend({
      classNames: {
        list: tabClasses.list,
        tab: tabClasses.tab,
      },
    }),
  },
});
