import client from "@/apiClient";
import { useQuery } from "@tanstack/vue-query";
import { TimeRange } from "../../../server/src/types";
import { computed, type Ref } from "vue";
import type { InferResponseType } from "hono";
import type { DataTableFiltersAndSortsModel } from "@/composables/useDataTableFiltersAndSorts";

export default function useChangesQuery(
  timeRange: Ref<TimeRange>,
  filtersAndSortsQuery: Ref<Record<string, string>>,
) {
  return useQuery({
    queryKey: ["changes", timeRange, filtersAndSortsQuery],
    staleTime: Infinity,
    shallow: true,
    placeholderData: (data) => data,
    queryFn: async () => {
      // temp
      await new Promise((resolve) => setTimeout(resolve, 500));
      // temp

      const response = await client.api.changes.$get({
        query: { range: timeRange.value, ...filtersAndSortsQuery.value },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Не удалось получить список изменений");
      }

      return data;
    },
  });
}

export type Changes = InferResponseType<typeof client.api.changes.$get>;
