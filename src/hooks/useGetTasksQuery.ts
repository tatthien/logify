import { fetchTasks } from "@/services/tasks";
import { Task } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useGetTasksQuery(spaceId: string) {
  return useQuery<{ tasks: Task[] }>({
    queryKey: ["tasks", spaceId],
    queryFn: () => fetchTasks(spaceId),
    enabled: !!spaceId,
  });
}
