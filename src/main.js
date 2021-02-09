/*!

=========================================================
* Vue Argon Dashboard - v1.1.1
=========================================================

* Product Page: https://www.creative-tim.com/product/vue-argon-dashboard
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/vue-argon-dashboard/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import ArgonDashboard from './plugins/argon-dashboard'
import store from "./store/"

import {BootstrapVue, BootstrapVueIcons} from 'bootstrap-vue'
// import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@trevoreyre/autocomplete-vue/dist/style.css'

import axios from "axios"

// or all tools are exported from the "all" file (excluding bonus plugins):
// import { gsap, ScrollTrigger, Draggable, MotionPathPlugin } from "gsap/all";
//
// // don't forget to register plugins
// gsap.registerPlugin(ScrollTrigger, Draggable, MotionPathPlugin);

// import {mapMutations} from 'vuex'

// axios.defaults.baseURL = "http://127.0.0.1:3000"
axios.interceptors.request.use(config => {
    // 在发送请求之前做些什么
    const pathname = location.pathname;
    if (pathname !== '/login') {
        const {token} = store.state.loginView;
        token && (config.headers.Authorization = token);
        // config.headers.common['token'] = localStorage.getItem('token');
    }
    return config;
}, error => {
    console.log(error)
    // 对请求错误做些什么
    return Promise.reject(error);
});

// http response 响应拦截器
axios.interceptors.response.use(response => {
    // switch (response.status) {
    //     // status ~= 2xx
    //     case 200:
    //         console.log(response.data)
    //         break
    //     default:
    //         break
    // }
    // const callBack = this.$notify({
    //     type: "success",
    //     title: "请求成功"
    // })
    return response;
}, error => {
    // const {SET_COLOR_OPTION_DATA} = mapMutations(["SET_COLOR_OPTION_DATA"])
    // SET_COLOR_OPTION_DATA()
    console.log(error.response.status)

    // status !~= 2xx
    if (error.response) {
        const {status} = error.response
        switch (status) {
            case 400:
                console.log('response, 400', error.response)
                break
            // 返回401，清除token信息并跳转到登录页面
            case 401:
                if (location.pathname === '/login') break
                localStorage.removeItem('token')
                router.replace({
                    path: '/login'
                    //登录成功后跳入浏览的当前页面
                    // query: {redirect: router.currentRoute.fullPath}
                })
                break
            case 403:
                if (location.pathname === '/login') break
                localStorage.removeItem('token')
                router.replace({path: '/login'})
                // store.commit('UPDATE_LOGIN_STATUS', false)
                break
            case 404:
                return Promise.reject("address not found")
        }
        // 返回接口返回的错误信息
        return Promise.reject(error.response);
    }
});
// Vue.prototype.$axios = axios

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

Vue.filter('formatSize', function (size) {
    if (size > 1024 * 1024 * 1024 * 1024) {
        return (size / 1024 / 1024 / 1024 / 1024).toFixed(2) + ' TB'
    } else if (size > 1024 * 1024 * 1024) {
        return (size / 1024 / 1024 / 1024).toFixed(2) + ' GB'
    } else if (size > 1024 * 1024) {
        return (size / 1024 / 1024).toFixed(2) + ' MB'
    } else if (size > 1024) {
        return (size / 1024).toFixed(2) + ' KB'
    }
    return size.toString() + ' B'
})

Vue.config.productionTip = false

Vue.use(ArgonDashboard)
new Vue({
    render: h => h(App),
    router,
    store
}).$mount('#app')
