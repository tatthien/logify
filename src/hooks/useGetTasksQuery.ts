import { FetchTasksParams, fetchTasks } from "@/services/task";
import { Task } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useGetTasksQuery(params: FetchTasksParams) {
  return useQuery<{ tasks: Task[] }>({
    queryKey: ["tasks", params],
    queryFn: () => fetchTasks(params),
    enabled: !!params.space_id,
  });
}
