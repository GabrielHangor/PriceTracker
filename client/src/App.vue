<template>
  <header><h1></h1></header>
  <RouterView />
</template>

<script setup lang="ts">
import client from "@/apiClient";
import { onMounted } from "vue";
import { TimeRange } from "../../server/src/types";

onMounted(async () => {
  const changes = await client.api.changes.$get({ query: { range: TimeRange.TOTAL } });
  const productChanges = await client.api.changes[":productId"].$get({
    query: { range: TimeRange.TOTAL },
    param: { productId: "538" },
  });
});
</script>
