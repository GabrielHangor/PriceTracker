import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "main",
      component: () => import("@/views/MainPage.vue"),
    },
    {
      path: "/products",
      name: "products",
      component: () => import("@/views/ProductListPage.vue"),
    },
  ],
});

export default router;
