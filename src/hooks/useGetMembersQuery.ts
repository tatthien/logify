import { fetctMembers } from "@/services/member";
import { useQuery } from "@tanstack/react-query";

export const useGetMembersQuery = () => {
  return useQuery({
    queryKey: ["members"],
    queryFn: fetctMembers,
  });
};
