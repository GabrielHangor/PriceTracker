<template>
  <div>{{ JSON.stringify(changes) }}</div>
</template>

<script setup lang="ts">
import client from "@/apiClient";
import { onMounted, shallowRef } from "vue";
import { TimeRange } from "../../../server/src/types";

const changes = shallowRef([]);

onMounted(async () => {
  const localChanges = await client.api.changes.$get({ query: { range: TimeRange.TOTAL } });
  changes.value = await localChanges.json();

  console.log(localChanges);
});
</script>
