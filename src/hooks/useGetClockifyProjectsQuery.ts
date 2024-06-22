import { fetchClockifyProjects } from "@/services/clockify/project";
import { ClockifyProject } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useGetClockifyProjectsQuery() {
  return useQuery<ClockifyProject[]>({
    queryKey: ["clockify-projects"],
    queryFn: () => fetchClockifyProjects(),
  });
}
