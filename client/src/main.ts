import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import { VueQueryPlugin } from "@tanstack/vue-query";

import "./style.css";

const app = createApp(App);

app.use(PrimeVue, { theme: { preset: Aura, options: { darkModeSelector: ".theme-dark" } } });

app.use(router);

app.use(VueQueryPlugin);

router.isReady().then(() => {
  app.mount("#app");
});
