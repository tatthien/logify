import { useQuery } from "@tanstack/react-query";

const fetchMisaClockInRecords = async (params: {
  start: string;
  end: string;
  sessionId: string;
}) => {
  const res = await fetch("/api/misa-clock-in-records", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Misa-Session-ID": params.sessionId,
    },
    body: JSON.stringify({
      startDate: params.start,
      endDate: params.end,
    }),
  });
  if (res.ok) {
    return await res.json();
  } else {
    throw new Error("Unknown error");
  }
};

export function useGetMisaClockInRecordsQuery(params: {
  start: string;
  end: string;
  sessionId: string;
}) {
  return useQuery({
    queryKey: ["misa-clock-in-records", params],
    queryFn: () => fetchMisaClockInRecords(params),
    enabled: !!params && !!params.sessionId,
  });
}
