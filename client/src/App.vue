<template>
  <AppHeader />
  <main class="container mx-auto ">
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import AppHeader from "@/components/UI/AppHeader.vue";
</script>
