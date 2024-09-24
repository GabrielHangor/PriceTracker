<template>
  <Card>
    <template #title>
      <span class="text-2xl">{{ title }}</span>
    </template>
    <template #header>
      <Tabs class="px-2" v-model:value="modelValue">
        <TabList>
          <Tab v-for="tab in tabs" :key="tab.value" :value="tab.value">{{ tab.label }}</Tab>
        </TabList>
      </Tabs>
    </template>
    <template #content>Content</template>
  </Card>
</template>

<script setup lang="ts">
import Card from "primevue/card";
import { TimeRange } from "../../../server/src/types";
import Tabs from "primevue/tabs";
import TabList from "primevue/tablist";
import Tab from "primevue/tab";
import { computed } from "vue";
import type { Changes } from "@/views/MainPage.vue";

const props = defineProps<{ changes: Changes | null }>();
const modelValue = defineModel<TimeRange>("timeRange", { required: true });

const tabs = [
  { label: "1 день", value: TimeRange.DAILY },
  { label: "Неделя", value: TimeRange.WEEKLY },
  { label: "Месяц", value: TimeRange.MONTHLY },
  { label: "За все время", value: TimeRange.TOTAL },
];

const title = computed(() => {
  switch (modelValue.value) {
    case TimeRange.DAILY:
      return "За последний день";
    case TimeRange.WEEKLY:
      return "За последнюю неделю";
    case TimeRange.MONTHLY:
      return "За последний месяц";
    case TimeRange.TOTAL:
      return "За все время";
    default:
      return "";
  }
});
</script>
