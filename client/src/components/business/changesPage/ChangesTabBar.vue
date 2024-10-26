<template>
  <Tabs v-model:value="modelValue" scrollable>
    <TabList>
      <Tab v-for="tab in tabs" :key="tab.value" :value="tab.value">{{ tab.label }}</Tab>
    </TabList>
  </Tabs>
</template>

<script setup lang="ts">
import Tabs from "primevue/tabs";
import TabList from "primevue/tablist";
import Tab from "primevue/tab";
import { TimeRange } from "server/types";

const modelValue = defineModel<TimeRange>("timeRange", { required: true });

const tabs = [
  { label: "1 день", value: TimeRange.DAILY },
  { label: "Неделя", value: TimeRange.WEEKLY },
  { label: "Месяц", value: TimeRange.MONTHLY },
  { label: "За все время", value: TimeRange.TOTAL },
];
</script>
