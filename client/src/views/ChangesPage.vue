<template>
  <section class="flex flex-col gap-5">
    <ChangesTabBar v-model:time-range="timeRange" />

    <Card :pt="{ body: '!pt-1' }">
      <template #content>
        <ChangesListTableSkeleton v-if="isChangesLoading || isFiltersLoading" />
        <ChangesListTable
          v-else-if="paginatedChanges && availableFilters"
          v-model:filters-and-sorts="filtersAndSortsModel"
          :is-loading="isChangesFetching"
          :paginatedChanges="paginatedChanges"
          :time-range="timeRange"
          :available-filters="availableFilters"
        />
      </template>
    </Card>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import useChangesQuery from "@/queries/useChangesQuery";
import ChangesListTableSkeleton from "@/components/business/changesPage/ChangesListTableSkeleton.vue";
import ChangesListTable from "@/components/business/changesPage/ChangesListTable.vue";
import ChangesTabBar from "@/components/business/changesPage/ChangesTabBar.vue";
import useDataTableFiltersAndSorts from "@/composables/useDataTableFiltersAndSorts";
import useChangesFiltersQuery from "@/queries/useChangesFiltersQuery";
import { TimeRange } from "server/types";

const timeRange = ref(TimeRange.DAILY);

const { filtersAndSortsModel, filtersAndSortsQuery } = useDataTableFiltersAndSorts([timeRange]);

const {
  data: paginatedChanges,
  isLoading: isChangesLoading,
  isFetching: isChangesFetching,
  error,
} = useChangesQuery(timeRange, filtersAndSortsQuery);

const { data: availableFilters, isLoading: isFiltersLoading } = useChangesFiltersQuery(timeRange);
</script>
