<template>
  <section class="flex flex-col gap-5">
    <ChangesTabBar v-model:time-range="timeRange" />

    <Card :pt="{ body: '!pt-1' }">
      <template #content>
        <ChangesListTableSkeleton v-if="isChangesLoading" />
        <ChangesListTable
          v-else-if="paginatedChanges"
          v-model:filters-and-sorts="filtersAndSortsModel"
          :is-loading="isChangesFetching"
          :paginatedChanges="paginatedChanges"
          :time-range="timeRange"
        />
      </template>
    </Card>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { TimeRange } from "../../../server/src/types";
import useChangesQuery from "@/queries/useChangesQuery";
import Card from "primevue/card";
import ChangesListTableSkeleton from "@/components/business/changesPage/ChangesListTableSkeleton.vue";
import ChangesListTable from "@/components/business/changesPage/ChangesListTable.vue";
import ChangesTabBar from "@/components/business/changesPage/ChangesTabBar.vue";
import useDataTableFiltersAndSorts from "@/composables/useDataTableFiltersAndSorts";

const timeRange = ref(TimeRange.DAILY);

const { filtersAndSortsModel } = useDataTableFiltersAndSorts([timeRange]);

const filtersAndSortsRequestQuery = computed(() => {
  return {
    page: filtersAndSortsModel.value.page,
    pageSize: filtersAndSortsModel.value.rows,
  };
});

const {
  data: paginatedChanges,
  isLoading: isChangesLoading,
  isFetching: isChangesFetching,
  error,
} = useChangesQuery(timeRange, filtersAndSortsRequestQuery);
</script>
