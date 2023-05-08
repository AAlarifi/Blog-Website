import { createRouter, createWebHistory } from 'vue-router';
import { ifAuthenticated } from '../views/components/ifAuthenticated.js';


import Home from "../views/pages/Home.vue"
import Login from "../views/pages/Login.vue"
import NotFound from "../NotFound.vue"
import Article from "../views/pages/Article.vue"
import Dashboard from "../views/pages/Dashboard.vue"

const routes = [
    { path: "/", component: Home },
    { path: "/login", component: Login},
    { path: "/articles/:id", component: Article },
    { path: "/dashboard", component: Dashboard, beforeEnter: ifAuthenticated.call},
    { path: "/:pathMatch(.*)*", component: NotFound}
]
//the error route should be the last in the array..

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;