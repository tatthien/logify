import { fetchSpaces } from "@/services/space";
import { Space } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useGetSpacesQuery() {
  return useQuery<{ spaces: Space[] }>({
    queryKey: ["spaces"],
    queryFn: () => fetchSpaces(),
  });
}
