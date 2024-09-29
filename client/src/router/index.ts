import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/changes",
      name: "changes",
      component: () => import("@/views/ChangesPage.vue"),
    },
    {
      path: "/products",
      name: "products",
      component: () => import("@/views/ProductListPage.vue"),
    },
  ],
});

export default router;
