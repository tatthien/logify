import {
  Container,
  MantineColorsTuple,
  Menu,
  Tooltip,
  createTheme,
  rem,
} from "@mantine/core";

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

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
        size: "xs",
      },
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
  },
});
