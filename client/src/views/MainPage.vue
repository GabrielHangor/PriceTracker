<template>
  <MainPageChangesCard v-model:time-range="timeRange" :changes="changes" />
</template>

<script setup lang="ts">
import { ref, shallowRef } from "vue";
import { TimeRange } from "../../../server/src/types";
import MainPageChangesCard from "@/components/MainPageChangesCard.vue";
import type { InferResponseType } from "hono";
import type client from "@/apiClient";

export type Changes = InferResponseType<typeof client.api.changes.$get>;

const timeRange = ref(TimeRange.DAILY);
const changes = shallowRef<Changes | null>(null);
</script>
