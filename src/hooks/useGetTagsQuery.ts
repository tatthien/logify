import { fetchTags } from "@/services/tags";
import { Tag } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useGetTagsQuery(spaceId: string) {
  return useQuery<{ tags: Tag[] }>({
    queryKey: ["tags", spaceId],
    queryFn: () => fetchTags(spaceId),
    enabled: !!spaceId,
  });
}
