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
                    component: () => import(/* webpackChunkName: "main" */ './views/Dashboard.vue')
                },
                {
                    path: '/icon',
                    name: '图标',
                    component: () => import(/* webpackChunkName: "secondary" */ './views/Icons.vue')
                },
                {
                    path: '/sale',
                    name: '出入库操作',
                    component: () => import(/* webpackChunkName: "secondary" */ './views/Sale.vue')
                },
                {
                    path: '/sale_history',
                    name: '出入库记录',
                    component: () => import(/* webpackChunkName: "secondary" */ './views/SaleHistory.vue')
                },
                {
                    path: '/supplier',
                    name: '供应商信息',
                    component: () => import(/* webpackChunkName: "secondary" */ './views/SupplierInfo.vue')
                },
                {
                    path: '/customer',
                    name: '客户信息',
                    component: () => import(/* webpackChunkName: "secondary" */ './views/CustomerInfo.vue')
                },
                {
                    path: '/product',
                    name: '商品信息',
                    component: () => import(/* webpackChunkName: "secondary" */ './views/Product.vue')
                },
                {
                    path: '/warehouse',
                    name: '库房信息',
                    component: () => import(/* webpackChunkName: "secondary" */ './views/Warehouse.vue')
                },
                {
                    path: '/color',
                    name: '颜色信息',
                    component: () => import(/* webpackChunkName: "secondary" */ './views/Color.vue')
                },
                {
                    path: '/user',
                    name: '管理员信息',
                    component: () => import(/* webpackChunkName: "secondary" */ './views/User.vue')
                },
                {
                    path: '/driver',
                    name: '司机信息',
                    component: () => import(/* webpackChunkName: "secondary" */ './views/Driver.vue')
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
                    component: () => import(/* webpackChunkName: "main" */ './views/Login.vue')
                },
                // {
                //     path: '/register',
                //     name: 'register',
                //     component: () => import(/* webpackChunkName: "secondary" */ './views/Register.vue')
                // }
            ]
        }
    ]
})
router.beforeEach((to, from, next) => {
    const {token, level} = store.state.loginView
    if (to.path === '/login') {
        if (token) return next(from.path)
        next()
    } else {
        if (!token || token === '') {
            next('/login')
        } else {
            if (level !== 0) {
                if (to.path === '/customer' || to.path === '/supplier' || to.path === '/user' || to.path === '/driver' || to.path === '/product') return next(from.path)
            }
            next()
        }
    }
})

export default router;
