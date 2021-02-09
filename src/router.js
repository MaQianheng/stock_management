import Vue from 'vue'
import Router from 'vue-router'
import DashboardLayout from '@/layout/DashboardLayout'
import AuthLayout from '@/layout/AuthLayout'
// import store from "vue-upload-component/docs/store";
import store from "./store/"

Vue.use(Router)

const router = new Router({
    linkExactActiveClass: 'active',
    routes: [
        {
            path: '/',
            redirect: 'dashboard',
            component: DashboardLayout,
            children: [
                {
                    path: '/dashboard',
                    name: '仪表盘',
                    // route level code-splitting
                    // this generates a separate chunk (about.[hash].js) for this route
                    // which is lazy-loaded when the route is visited.
                    component: () => import(/* webpackChunkName: "demo" */ './views/Dashboard.vue')
                },
                {
                    path: '/icon',
                    name: '图标',
                    component: () => import(/* webpackChunkName: "demo" */ './views/Icons.vue')
                },
                {
                    path: '/sale',
                    name: '销售',
                    component: () => import(/* webpackChunkName: "demo" */ './views/Sale.vue')
                },
                {
                    path: '/sale_history',
                    name: '出入库记录',
                    component: () => import(/* webpackChunkName: "demo" */ './views/SaleHistory.vue')
                },
                {
                    path: '/sale_history/detail/:id',
                    name: '销售记录详情',
                    component: () => import('./views/SaleHistoryDetail.vue')
                },
                {
                    path: '/supplier',
                    name: '供应商信息',
                    component: () => import(/* webpackChunkName: "demo" */ './views/SupplierInfo.vue')
                },
                {
                    path: '/customer',
                    name: '客户信息',
                    component: () => import(/* webpackChunkName: "demo" */ './views/CustomerInfo.vue')
                },
                {
                    path: '/product',
                    name: '商品信息',
                    component: () => import(/* webpackChunkName: "demo" */ './views/Product.vue')
                },
                {
                    path: '/warehouse',
                    name: '库房信息',
                    component: () => import(/* webpackChunkName: "demo" */ './views/Warehouse.vue')
                },
                {
                    path: '/color',
                    name: '颜色信息',
                    component: () => import(/* webpackChunkName: "demo" */ './views/Color.vue')
                },
                {
                    path: '/user',
                    name: '管理员信息',
                    component: () => import(/* webpackChunkName: "demo" */ './views/User.vue')
                },
                {
                    path: '/driver',
                    name: '司机信息',
                    component: () => import(/* webpackChunkName: "demo" */ './views/Driver.vue')
                }
            ]
        },
        {
            path: '/',
            redirect: 'login',
            component: AuthLayout,
            children: [
                {
                    path: '/login',
                    name: 'login',
                    component: () => import(/* webpackChunkName: "demo" */ './views/Login.vue')
                },
                {
                    path: '/register',
                    name: 'register',
                    component: () => import(/* webpackChunkName: "demo" */ './views/Register.vue')
                }
            ]
        }
    ]
})
router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        next();
    } else {
        const {token, level} = store.state.loginView
        if (!token || token === '') {
            next('/login');
        } else {
            if (level !== 0) {
                if (to.path === '/customer' || to.path === '/supplier' || to.path === '/user' || to.path === '/driver') return next(from.path)
            }
            next();
        }
    }
})

export default router;
