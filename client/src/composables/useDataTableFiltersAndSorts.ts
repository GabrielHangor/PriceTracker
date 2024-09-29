import type { DataTablePageEvent } from "primevue/datatable";
import { ref, watch, type Ref } from "vue";

export default function useDataTableFiltersAndSorts<T extends any[]>(
  watchRefs?: [...{ [K in keyof T]: Ref<T[K]> }],
) {
  const initialState: DataTableFiltersAndSortsModel = {
    page: 1,
    rows: 10,
    filters: {},
    sortOrder: null,
    sortField: undefined,
  };

  const filtersAndSortsModel = ref<DataTableFiltersAndSortsModel>({ ...initialState });

  watch(
    () => filtersAndSortsModel.value.rows,
    () => {
      filtersAndSortsModel.value.page = 1;
    },
  );

  if (watchRefs) {
    watchRefs.forEach((ref) => watch(ref, reset));
  }

  function reset() {
    filtersAndSortsModel.value = { ...initialState };
  }

  return { filtersAndSortsModel };
}

export type DataTableFiltersAndSortsModel = Omit<
  DataTablePageEvent,
  "originalEvent" | "first" | "filterMatchModes" | "pageCount" | "multiSortMeta"
>;
