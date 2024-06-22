import {
  ActionIcon,
  Anchor,
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  FocusTrap,
  Group,
  Paper,
  Text,
  TextInput,
} from "@mantine/core";
import { useEffect, useState } from "react";
import { useLocalStorage } from "@mantine/hooks";
import { IconEye, IconEyeOff, IconMinus, IconPlus } from "@tabler/icons-react";
import toast, { LoaderIcon } from "react-hot-toast";
import { useForm } from "@mantine/form";
import { DEFAULT_APP_SETTINGS, LOCAL_STORAGE_KEYS } from "@/constants";
import { AppSettings, ClockifyUser } from "@/types";

const fetchCurrentUser = async (apiKey: string): Promise<ClockifyUser> => {
  const res = await fetch("https://api.clockify.me/api/v1/user", {
    headers: {
      "X-API-Key": apiKey,
    },
  });
  const data = await res.json();
  if (res.ok) return data;
  throw data;
};

export function SettingsForm() {
  const [isFetchingUser, setIsFetchingUser] = useState(false);
  const [showToken, setShowToken] = useState({
    clickup: false,
    clockify: false,
  });

  const [collapsed, setCollapsed] = useLocalStorage({
    key: LOCAL_STORAGE_KEYS.TOKEN_FORM_COLLAPSED,
    defaultValue: false,
  });

  const [settings, setSettings] = useLocalStorage<AppSettings>({
    key: LOCAL_STORAGE_KEYS.APP_SETTINGS,
    defaultValue: DEFAULT_APP_SETTINGS,
  });

  const form = useForm({
    initialValues: {
      clickup: settings.clickup,
      clockify: settings.clockify,
    },
  });

  useEffect(() => {
    form.setValues({
      clickup: settings.clickup,
      clockify: settings.clockify,
    });
  }, [settings]);

  const handleToggleShowToken = (key: "clickup" | "clockify") => {
    setShowToken({
      ...showToken,
      [key]: !showToken[key],
    });
  };

  const handleSubmit = async (values: any) => {
    try {
      setIsFetchingUser(true);

      // Fetching current Clockify user
      const user = await fetchCurrentUser(values.clockify);

      setSettings({
        clickup: values.clickup,
        clockify: values.clockify,
        user: {
          id: user.id,
          name: user.name,
          profilePicture: user.profilePicture,
          activeWorkspace: user.activeWorkspace,
          defaultWorkspace: user.defaultWorkspace,
        },
        workspaceId: user.activeWorkspace,
      });

      toast.success("Settings saved");
    } catch (err: any) {
      if (err.code && err.code === 4003) {
        toast.error("Clockify API key is invalid");
      } else {
        toast.error("Failed to save settings");
      }
    } finally {
      setIsFetchingUser(false);
    }
  };

  return (
    <Paper mb={24}>
      <Flex py={12} px={16} align="center" justify="space-between">
        <Text fw={500}>Settings</Text>
        <Group gap={8}>
          {isFetchingUser && (
            <Flex align="center" gap={8}>
              <LoaderIcon />
              <Text fz={12} c="dimmed">
                Fetching user information
              </Text>
            </Flex>
          )}
          {!isFetchingUser && settings.user && (
            <Flex align="center" gap={8}>
              <Avatar src={settings.user.profilePicture} size={24} />
              <Text fz={12}>
                Hello{" "}
                <Text fw={600} span fz={12}>
                  {settings.user.name}
                </Text>
              </Text>
            </Flex>
          )}
          <ActionIcon variant="white" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <IconPlus size={20} /> : <IconMinus size={20} />}
          </ActionIcon>
        </Group>
      </Flex>
      {!collapsed && (
        <>
          <Divider />
          <Box p={16}>
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Flex direction={"column"} gap={8} w="100%" mb={8}>
                <FocusTrap active={true}>
                  <TextInput
                    label="ClickUp token"
                    type={showToken.clickup ? "text" : "password"}
                    data-autofocus
                    style={{ flex: 1 }}
                    rightSection={
                      <ActionIcon
                        variant="light"
                        radius={4}
                        onClick={() => handleToggleShowToken("clickup")}
                      >
                        {showToken.clickup ? (
                          <IconEye size={20} />
                        ) : (
                          <IconEyeOff size={20} />
                        )}
                      </ActionIcon>
                    }
                    placeholder="Enter your ClickUp personal token here"
                    {...form.getInputProps("clickup")}
                  />
                </FocusTrap>
                <TextInput
                  label="Clockify API key"
                  type={showToken.clockify ? "text" : "password"}
                  style={{ flex: 1 }}
                  rightSection={
                    <ActionIcon
                      variant="light"
                      radius={4}
                      onClick={() => handleToggleShowToken("clockify")}
                    >
                      {showToken.clockify ? (
                        <IconEye size={20} />
                      ) : (
                        <IconEyeOff size={20} />
                      )}
                    </ActionIcon>
                  }
                  placeholder="Enter your Clockify API key here"
                  {...form.getInputProps("clockify")}
                />
              </Flex>

              <Flex justify="flex-end" mb={24}>
                <Button type="submit" w={"100%"} disabled={isFetchingUser}>
                  Save
                </Button>
              </Flex>

              <Anchor fz={12} href="/how-to-get-token.webp" target="_blank">
                How to retrieve your ClickUp personal token and Clockify API
                key?
              </Anchor>
            </form>
          </Box>
        </>
      )}
    </Paper>
  );
}
