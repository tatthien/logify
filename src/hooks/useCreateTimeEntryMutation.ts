import { createTimeEntry } from "@/services/time-entry";
import { CreateTimeEntry,  } from "@/types";
import { useMutation } from "@tanstack/react-query";

export function useCreateTimeEntryMutation() {
    return useMutation({
      mutationFn: (body: CreateTimeEntry) =>  createTimeEntry(body)
  })
}
