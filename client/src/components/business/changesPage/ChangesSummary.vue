<template>
    <section class="grid grid-cols-3 gap-3">
      <Message severity="error">
        <template #icon>
          <span class="pi pi-arrow-up-right" style="font-size: 2rem" />
        </template>
        <span class="text-2xl">
          {{ changes.increases }}
          {{ plural(changes.increases, ["увеличение", "увеличения", "увеличений"]) }} цен
        </span>
      </Message>

      <Message severity="success">
        <template #icon>
          <span class="pi pi-arrow-down-right" style="font-size: 2rem" />
        </template>
        <span class="text-2xl">
          {{ changes.reductions }}
          {{ plural(changes.reductions, ["уменьшение", "уменьшения", "уменьшений"]) }} цен
        </span>
      </Message>

      <Message severity="secondary">
        <span class="text-2xl">
          {{ changes.increases + changes.reductions }}
          {{ plural(changes.increases + changes.reductions, ["изменение", "изменения", "изменений"]) }} цен
          всего
        </span>
      </Message>
    </section>
</template>

<script setup lang="ts">
import type { Changes } from "@/queries/useChangesQuery";
import { plural } from "@/utils/plural";
import Message from "primevue/message";

const props = defineProps<{ changes: Changes }>();
</script>
