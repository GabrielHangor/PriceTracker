import client from "@/apiClient";
import { useQuery } from "@tanstack/vue-query";
import type { InferResponseType } from "hono";
import type { Ref } from "vue";
import type { TimeRange } from "server/types";

export default function useChangesFiltersQuery(timeRange: Ref<TimeRange>) {
  return useQuery({
    queryKey: ["changes-filters", timeRange],
    staleTime: Infinity,
    shallow: true,
    queryFn: async () => {
      // temp
      await new Promise((resolve) => setTimeout(resolve, 500));
      // temp

      const response = await client.api.changes.filters.$get({ query: { range: timeRange.value } });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Не удалось получить список фильтров");
      }

      return data;
    },
  });
}

export type AvailableChangesFilters = InferResponseType<typeof client.api.changes.filters.$get>;
