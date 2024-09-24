<template>
  <AppHeader />
  <main class="container mx-auto p-5">
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import AppHeader from "@/components/AppHeader.vue";
</script>
