import {
  FetchClockifyTimeEntryParams,
  fetchClockifyTimeEntries,
} from "@/services/clockify/time-entry";
import { ClockifyTimeEntry } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useGetClockifyTimeEntriesQuery(
  params: FetchClockifyTimeEntryParams,
) {
  return useQuery<ClockifyTimeEntry[]>({
    queryKey: ["clockify-time-entries", params],
    queryFn: () => fetchClockifyTimeEntries(params),
    enabled: !!params && !!params.userId,
  });
}
