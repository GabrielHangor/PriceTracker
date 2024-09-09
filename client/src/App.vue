<template>
  <header><h1></h1></header>
  <RouterView />
</template>

<script setup lang="ts">
import client from "@/apiClient";
import { onMounted } from "vue";

async function fetchProducts() {
  const response = await client.products.$get({ query: {} });

  return response;
}

onMounted(async () => {
  const response = await fetchProducts();
  const products = await response.json();
});
</script>
