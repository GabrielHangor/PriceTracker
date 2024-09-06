<template>
  <header><h1></h1></header>
  <RouterView />
</template>

<script setup lang="ts">
import client from "@/apiClient";
import { onMounted } from "vue";

async function fetchCategories() {
  const response = await client.categories.$get();
  console.log(response);

  return response;
}

onMounted(async () => {
  const categories = await fetchCategories();
  console.log(await categories.json());
});
</script>
