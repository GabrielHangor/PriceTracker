import type { DataTablePageEvent } from "primevue/datatable";
import { computed, ref, watch, type Ref } from "vue";

export default function useDataTableFiltersAndSorts<T extends any[]>(
  watchRefs?: [...{ [K in keyof T]: Ref<T[K]> }],
) {
  const initialState: DataTableFiltersAndSortsModel = {
    page: 1,
    pageSize: 10,
    filters: {},
    sortOrder: undefined,
    sortField: undefined,
  };

  const filtersAndSortsModel = ref<DataTableFiltersAndSortsModel>(initialState);

  const filtersAndSortsQuery = computed(() => {
    const queriesObj: Record<string, string> = {};

    for (const [key, value] of Object.entries(filtersAndSortsModel.value)) {
      if (value) queriesObj[key] = typeof value === "object" ? JSON.stringify(value) : value.toString();
    }

    return queriesObj;
  });

  watch(
    () => filtersAndSortsModel.value.pageSize,
    () => {
      filtersAndSortsModel.value.page = 1;
    },
  );

  if (watchRefs) {
    watchRefs.forEach((ref) => watch(ref, reset));
  }

  function reset() {
    filtersAndSortsModel.value = initialState;
  }

  return { filtersAndSortsModel, filtersAndSortsQuery, initialState };
}

export type DataTableFiltersAndSortsModel = Omit<
  DataTablePageEvent,
  "originalEvent" | "first" | "filterMatchModes" | "pageCount" | "multiSortMeta" | "rows"
> & { pageSize: number };
