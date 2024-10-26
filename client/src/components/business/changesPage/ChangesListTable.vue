<template>
  <DataTable
    v-model:filters="localFilters"
    :value="paginatedChanges.productPriceChanges.items"
    size="small"
    scrollable
    scroll-height="600px"
    paginator
    lazy
    removable-sort
    :loading="isLoading"
    :filter-display="hasItems ? 'menu' : undefined"
    :always-show-paginator="false"
    :rows-per-page-options="[5, 10, 25, 50]"
    :rows="modelValue.pageSize"
    :total-records="paginatedChanges.productPriceChanges.totalItems"
    :first="(modelValue.page - 1) * modelValue.pageSize"
    @page="onPageChange"
    @sort="onSortChange"
    @update:filters="debouncedOnFiltersChange"
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
        <h3 class="text-2xl font-semibold">Изменения по данным параметрам отсутствуют</h3>
        <p>Попробуйте изменить параметры поиска</p>
      </div>
    </template>

    <Column field="product.imageUrl" header="Изображение" class="w-1/12">
      <template #body="slotProps">
        <Image :src="slotProps.data.product.imageUrl" :alt="slotProps.data.product.name" width="50" preview />
      </template>
    </Column>
    <Column field="product.name" header="Название" class="w-3/12" />
    <Column
      field="product.category.name"
      class="w-2/12"
      header="Категория"
      filter-field="categoryId"
      :show-filter-match-modes="false"
    >
      <template #filter="{ filterModel }">
        <Select
          v-model="filterModel.value"
          type="text"
          option-label="name"
          option-value="id"
          class="w-full"
          :options="availableFilters.categories"
          placeholder="Выберите категорию"
        />
      </template>
    </Column>
    <Column
      field="product.seller.name"
      class="w-2/12"
      header="Магазин"
      filter-field="sellerId"
      :show-filter-match-modes="false"
    >
      <template #filter="{ filterModel }">
        <Select
          v-model="filterModel.value"
          type="text"
          option-label="name"
          option-value="id"
          :options="availableFilters.seller"
          class="w-full"
          placeholder="Выберите магазин"
        />
      </template>
    </Column>
    <Column
      field="previousPrice"
      header="Пред. цена"
      :sortable="hasItems"
      :show-filter-match-modes="false"
      :show-apply-button="false"
    >
      <template #body="slotProps">
        <span>{{ slotProps.data.previousPrice }} ₽</span>
      </template>
      <template #filter="{ filterModel, filterCallback }">
        <div class="flex flex-col gap-5 p-2 font-semibold">
          <span class="text-center">
            {{ filterModel.value || availableFilters.previousPrice.min }}
          </span>
          <Slider
            v-model="filterModel.value"
            :min="availableFilters.previousPrice.min"
            :max="availableFilters.previousPrice.max"
            @change="filterCallback"
          />
          <div class="flex justify-between">
            <span>{{ availableFilters.previousPrice.min }}</span>
            <span>{{ availableFilters.previousPrice.max }}</span>
          </div>
        </div>
      </template>
    </Column>
    <Column
      field="currentPrice"
      header="Тек. цена"
      :sortable="hasItems"
      :show-filter-match-modes="false"
      :show-apply-button="false"
    >
      <template #body="slotProps">
        <span>{{ slotProps.data.currentPrice }} ₽</span>
      </template>
      <template #filter="{ filterModel, filterCallback }">
        <div class="flex flex-col gap-5 p-2 font-semibold">
          <span class="text-center">
            {{ filterModel.value || availableFilters.currentPrice.min }}
          </span>
          <Slider
            v-model="filterModel.value"
            :min="availableFilters.currentPrice.min"
            :max="availableFilters.currentPrice.max"
            @change="filterCallback"
          />
          <div class="flex justify-between">
            <span>{{ availableFilters.currentPrice.min }}</span>
            <span>{{ availableFilters.currentPrice.max }}</span>
          </div>
        </div>
      </template>
    </Column>
    <Column
      field="deltaPercent"
      header="Изменение, %"
      :sortable="hasItems"
      :show-filter-match-modes="false"
      :show-apply-button="false"
    >
      <template #body="slotProps">
        <span :class="slotProps.data.deltaPercent < 0 ? 'text-green-500' : 'text-red-500'">
          {{ slotProps.data.deltaPercent }} %
        </span>
      </template>
      <template #filter="{ filterModel, filterCallback }">
        <div class="flex flex-col gap-5 p-2 font-semibold">
          <span class="text-center">
            {{ filterModel.value || availableFilters.deltaPercent.min }}
          </span>
          <Slider
            v-model="filterModel.value"
            range
            :min="availableFilters.deltaPercent.min"
            :max="availableFilters.deltaPercent.max"
            @change="filterCallback"
          />
          <div class="flex justify-between">
            <span>{{ availableFilters.deltaPercent.min }}</span>
            <span>{{ availableFilters.deltaPercent.max }}</span>
          </div>
        </div>
      </template>
    </Column>
  </DataTable>
</template>

<script setup lang="ts">
import ChangesSummary from "@/components/business/changesPage/ChangesSummary.vue";
import ChangesSummaryTitle from "@/components/business/changesPage/ChangesSummaryTitle.vue";
import type { Changes } from "@/queries/useChangesQuery";
import DataTable, {
  type DataTableFilterMetaData,
  type DataTablePageEvent,
  type DataTableSortEvent,
} from "primevue/datatable";
import type { DataTableFiltersAndSortsModel } from "@/composables/useDataTableFiltersAndSorts";
import { computed, shallowRef, watch } from "vue";
import type { AvailableChangesFilters } from "@/queries/useChangesFiltersQuery";
import debounce from "@/utils/debounce";
import type { TimeRange } from "server/types";

const props = defineProps<{
  paginatedChanges: Changes;
  availableFilters: AvailableChangesFilters;
  timeRange: TimeRange;
  isLoading?: boolean;
}>();

const modelValue = defineModel<DataTableFiltersAndSortsModel>("filtersAndSorts", { required: true });

const localFiltersInitialState = {
  categoryId: { value: null },
  sellerId: { value: null },
  previousPrice: { value: null },
  currentPrice: { value: null },
  deltaPercent: { value: null },
};

const localFilters = shallowRef<Record<string, { value: any }>>(localFiltersInitialState);

watch(
  () => props.timeRange,
  () => (localFilters.value = localFiltersInitialState),
);

function onPageChange(event: DataTablePageEvent) {
  modelValue.value = {
    pageSize: event.rows,
    filters: stripEmptyFilters(event.filters as Record<string, DataTableFilterMetaData>),
    sortField: event.sortField,
    sortOrder: event.sortOrder,
    page: event.page + 1,
  };
}

function onSortChange(event: DataTableSortEvent) {
  modelValue.value = {
    pageSize: event.rows,
    filters: stripEmptyFilters(event.filters as Record<string, DataTableFilterMetaData>),
    sortField: event.sortField,
    sortOrder: event.sortOrder,
    page: 1,
  };
}

const debouncedOnFiltersChange = debounce((event: Record<string, DataTableFilterMetaData>) => {
  const nonEmptyFilters = stripEmptyFilters(event);
  modelValue.value = { ...modelValue.value, filters: nonEmptyFilters, page: 1 };
}, 300);

function stripEmptyFilters(filters: Record<string, DataTableFilterMetaData>) {
  return Object.entries(filters).reduce(
    (acc, [key, filterValue]) => {
      if (filterValue.value) acc[key] = filterValue.value;

      return acc;
    },
    {} as Record<string, any>,
  );
}

const hasItems = computed(() => !!props.paginatedChanges.productPriceChanges.totalItems);
</script>
