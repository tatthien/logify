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
