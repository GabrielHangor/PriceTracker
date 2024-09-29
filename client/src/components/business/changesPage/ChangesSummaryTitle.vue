<template>
  <span class="text-3xl">{{ title }}</span>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { TimeRange } from "../../../../../server/src/types";

const props = defineProps<{ timeRange: TimeRange }>();

const title = computed(() => {
  switch (props.timeRange) {
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
