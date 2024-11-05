import { Template } from "@/types";
import { supabase } from "@/utils/supabase/client";
import { useMutation, useQuery } from "@tanstack/react-query";

// QUERIES
export function useGetClockInSchedulesQuery() {
  return useQuery({
    queryKey: ["clock-in-schedules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clock_in_schedules")
        .select("*");
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
}

export function useGetDefaultTimeEntrySettingsFormQuery() {
  return useQuery<{
    id: string;
    key: string;
    value: {
      spaceId: string;
      assigneeId: string;
      projectId: string;
      tagIds: string[];
    };
  }>({
    queryKey: ["default-time-entry-settings-form"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("key", "default_time_entry_form_values")
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
}

export function useGetTemplates() {
  return useQuery<Template[]>({
    queryKey: ["templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("templates")
        .select("*");
      if (error) {
        return []
      }
      return data;
    },
  });
}

// MUTATIONS
export function useCreateClockInScheduleMutation() {
  return useMutation({
    mutationKey: ["create-clock-in-schedules"],
    mutationFn: async (params: any) => {
      const { data, error } = await supabase
        .from("clock_in_schedules")
        .upsert(params)
        .select();

      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
}
