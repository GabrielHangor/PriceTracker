import { createApp } from "vue";
import App from "./App.vue";
import ToastService from "primevue/toastservice";
import router from "./router";
import PrimeVue, { type PrimeVueConfiguration } from "primevue/config";
import Aura from "@primevue/themes/aura";
import { VueQueryPlugin } from "@tanstack/vue-query";

import "./style.css";
import Tooltip from "primevue/tooltip";

const app = createApp(App);

app.use(PrimeVue, {
  locale: { clear: "Очистить", apply: "Применить" },
  theme: { preset: Aura, options: { darkModeSelector: ".theme-dark" } },
  pt: {
    datatable: {
      column: {
        pcColumnFilterButton: ({ context }) => ({
          style: context.active ? "background: var(--p-primary-100)" : "",
        }),
        filterOverlay: "!min-w-[250px]",
        filterButtonbar: "flex-col gap-2",
        pcFilterClearButton: { root: "!w-full" },
        pcFilterApplyButton: { root: "!w-full" },
      },
    },
  },
} as PrimeVueConfiguration);

app.directive("tooltip", Tooltip);

app.use(router);

app.use(VueQueryPlugin);

app.use(ToastService);

router.isReady().then(() => {
  app.mount("#app");
});
