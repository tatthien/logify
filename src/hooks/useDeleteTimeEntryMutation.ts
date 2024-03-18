import { deleteTimeEntry } from "@/services/time-entry";
import { useMutation } from "@tanstack/react-query";

export function useDeleteTimeEntryMutation() {
  return useMutation({
    mutationFn: (timeId: number) => deleteTimeEntry(timeId),
  });
}
