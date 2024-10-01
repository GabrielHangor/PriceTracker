<template>
  <DataTable
    :value="paginatedChanges.productPriceChanges.items"
    size="small"
    scrollable
    scroll-height="600px"
    paginator
    lazy
    removable-sort
    :loading="isLoading"
    :always-show-paginator="false"
    :rows-per-page-options="[5, 10, 25, 50]"
    :rows="modelValue.pageSize"
    :total-records="paginatedChanges.productPriceChanges.totalItems"
    :first="(modelValue.page - 1) * modelValue.pageSize"
    @page="onPageChange"
    @sort="onSortChange"
  >
    <template #header>
      <section class="flex flex-col gap-3 pb-4">
        <ChangesSummaryTitle :time-range="timeRange" />
        <ChangesSummary :changes="paginatedChanges" />
      </section>
    </template>

    <template #empty>
      <div class="flex flex-col items-center justify-center p-6 gap-4">
        <i class="pi pi-shopping-cart" style="font-size: 2rem" />
        <h3 class="text-2xl font-semibold">Продукты по данным параметрам отсутствуют</h3>
        <p>Попробуйте изменить параметры поиска</p>
      </div>
    </template>

    <Column field="product.imageUrl" header="Изображение">
      <template #body="slotProps">
        <Image :src="slotProps.data.product.imageUrl" :alt="slotProps.data.product.name" width="50" preview />
      </template>
    </Column>
    <Column field="product.name" header="Название" />
    <Column field="product.category.name" header="Категория" />
    <Column field="product.seller.name" header="Магазин" />
    <Column field="minPrice" header="Мин. цена" sortable>
      <template #body="slotProps">
        <span>{{ slotProps.data.minPrice }} ₽</span>
      </template>
    </Column>
    <Column field="maxPrice" header="Макс. цена" sortable>
      <template #body="slotProps">
        <span>{{ slotProps.data.maxPrice }} ₽</span>
      </template>
    </Column>
    <Column field="deltaPercent" header="Изменение, %" sortable>
      <template #body="slotProps">
        <span :class="slotProps.data.deltaPercent < 0 ? 'text-green-500' : 'text-red-500'">
          {{ slotProps.data.deltaPercent }} %
        </span>
      </template>
    </Column>
  </DataTable>
</template>

<script setup lang="ts">
import ChangesSummary from "@/components/business/changesPage/ChangesSummary.vue";
import ChangesSummaryTitle from "@/components/business/changesPage/ChangesSummaryTitle.vue";
import type { Changes } from "@/queries/useChangesQuery";
import Column from "primevue/column";
import DataTable, { type DataTablePageEvent, type DataTableSortEvent } from "primevue/datatable";
import Image from "primevue/image";
import type { TimeRange } from "../../../../../server/src/types";
import type { DataTableFiltersAndSortsModel } from "@/composables/useDataTableFiltersAndSorts";

const props = defineProps<{ paginatedChanges: Changes; timeRange: TimeRange; isLoading?: boolean }>();
const modelValue = defineModel<DataTableFiltersAndSortsModel>("filtersAndSorts", { required: true });

function onPageChange(event: DataTablePageEvent) {
  modelValue.value = {
    pageSize: event.rows,
    filters: event.filters,
    sortField: event.sortField,
    sortOrder: event.sortOrder,
    page: event.page + 1,
  };
}

function onSortChange(event: DataTableSortEvent) {
  modelValue.value = {
    pageSize: event.rows,
    filters: event.filters,
    sortField: event.sortField,
    sortOrder: event.sortOrder,
    page: 1,
  };
}
</script>
