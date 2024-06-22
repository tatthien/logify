import { fetchClockifyTags } from "@/services/clockify/tag";
import { ClockifyTag } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useGetClockifyTagsQuery() {
  return useQuery<ClockifyTag[]>({
    queryKey: ["clockify-tags"],
    queryFn: () => fetchClockifyTags(),
  });
}
