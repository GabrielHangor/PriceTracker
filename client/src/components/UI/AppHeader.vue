<template>
  <header class="px-4">
    <Menubar :model="items" class="!px-4">
      <template #item="{ item }">
        <RouterLink :to="{ name: item.name }" #default="{ isExactActive }">
          <div class="flex gap-4 items-center p-2">
            <span :class="[{ 'font-semibold': isExactActive }, item.icon]" />
            <span>{{ item.label }}</span>
          </div>
        </RouterLink>
      </template>
      <template #end>
        <Button :icon="PrimeIcons.SUN"  outlined text rounded @click="toggleDarkMode" />
      </template>
    </Menubar>
  </header>
</template>

<script setup lang="ts">
import { PrimeIcons } from "@primevue/core";

import type { MenuItem } from "primevue/menuitem";

const items: MenuItem[] = [
  { label: "Изменения", icon: PrimeIcons.CHART_LINE, name: "changes" },
  { label: "Продукты", icon: PrimeIcons.DATABASE, name: "products" },
];

function toggleDarkMode() {
  const element = document.querySelector("html");
  element?.classList.toggle("theme-dark");
}
</script>
