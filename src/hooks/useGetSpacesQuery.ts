import { fetchSpaces } from "@/services/spaces";
import { fetchTags } from "@/services/tags";
import { Space, Tag, TimeEntry } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useGetSpacesQuery() {
  return useQuery<{spaces: Space[]}>({
    queryKey: ["spaces"],
    queryFn: () => fetchSpaces(),
  });
}
