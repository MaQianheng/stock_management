<template>
    <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
        <side-bar
            :background-color="sidebarBackground"
            short-title="Argon"
            title="Argon"
        >
            <template slot="links">
                <sidebar-item :link="{name: '仪表盘', icon: 'ni ni-tv-2 text-primary', path: '/dashboard'}"/>
                <sidebar-item :link="{name: '图标', icon: 'ni ni-atom text-purple', path: '/icon'}"/>
                <sidebar-item :link="{name: '销售', icon: 'ni ni-money-coins sale-icon-gradient', path: '/sale'}"/>
                <sidebar-item :link="{name: '销售记录', icon: 'ni ni-books text-teal', path: '/sale_history'}"/>
                <sidebar-item :link="{name: '供应商信息', icon: 'ni ni-delivery-fast text-dark', path: '/supplier'}"/>
                <sidebar-item :link="{name: '客户信息', icon: 'ni ni-single-02 text-yellow', path: '/profile'}"/>
                <sidebar-item :link="{name: '商品信息', icon: 'ni ni-box-2 text-red', path: '/product'}"/>
                <sidebar-item :link="{name: '库房信息', icon: 'ni ni-building text-gray', path: '/warehouse'}"/>
                <sidebar-item :link="{name: '颜色信息', icon: 'ni ni-palette text-pink', path: '/color'}"/>
                <sidebar-item :link="{name: '登陆', icon: 'ni ni-key-25 text-info', path: '/login'}"/>
                <!--                <sidebar-item :link="{name: 'Register', icon: 'ni ni-circle-08 text-pink', path: '/register'}"/>-->

            </template>
        </side-bar>
        <div class="main-content" :data="sidebarBackground">
            <dashboard-navbar/>

            <div @click="toggleSidebar">
                <fade-transition :duration="200" origin="center top" mode="out-in">
                    <!-- your content here -->
                    <router-view></router-view>
                </fade-transition>
                <content-footer v-if="!$route.meta.hideFooter"></content-footer>
            </div>
        </div>
    </div>
</template>
<script>
import DashboardNavbar from './DashboardNavbar.vue';
import ContentFooter from './ContentFooter.vue';
import {FadeTransition} from 'vue2-transitions';
import {mapState, mapActions} from 'vuex'
import {funcComputeAlertLevel} from "@/functions";

export default {
    components: {
        DashboardNavbar,
        ContentFooter,
        FadeTransition
    },
    mounted() {
        this.$notify({
            type: 'info',
            title: '正在请求数据'
        })
        const {arrSelect, arrView} = this.commonView.publicVariable
        this.increaseRequestingTasksCount(arrSelect.length + arrView.length)
        for (let i = 0; i < arrSelect.length; i++) {
            this.updateViewComponent({view: 'commonView', component: arrSelect[i], objKV: {isLoading: true}})
        }
        for (let i = 0; i < arrView.length; i++) {
            this.updateViewComponent({view: arrView[i], component: 'table', objKV: {isLoading: true}})
        }
    },
    data() {
        return {
            //vue|blue|orange|green|red|primary
            sidebarBackground: 'blue'
        };
    },
    methods: {
        ...mapActions(["getSelect", "getTable", "updateCommonSelectSubValue", "updateViewComponent", "increaseRequestingTasksCount", "decreaseRequestingTasksCount"]),
        toggleSidebar() {
            if (this.$sidebar.showSidebar) {
                this.$sidebar.displaySidebar(false);
            }
        },
        getSelectCallBack(key) {
            this.decreaseRequestingTasksCount(1)
            this.updateCommonSelectSubValue({key, subKey: 'isLoading', value: false})
            const {err_code, prefix, message} = this.commonView[key]
            if (err_code !== 0) {
                this.$notify({
                    type: funcComputeAlertLevel(err_code),
                    title: `请求${prefix}多选时，发生错误：${message}`
                })
            }
        },
        getTableCallBack(view) {
            this.decreaseRequestingTasksCount(1)
            this.updateViewComponent({view, component: 'table', objKV: {isLoading: false}})
            const {err_code, message} = this[view].table
            if (err_code !== 0) {
                this.$notify({
                    type: funcComputeAlertLevel(err_code),
                    title: `请求${view}表单时，发生错误：${message}`
                })
            }
        }
    },
    computed: {
        ...mapState(["commonView", "colorView", "warehouseView", "shelfView", "customerView", "supplierView", "productView", "saleView", "saleHistoryView"])
    },
    watch: {
        "commonView.customerSelect.isLoading": {
            handler: function (newVal) {
                const component = 'customerSelect'
                // request customer option
                if (newVal === true) this.getSelect({component}).then(() => {
                    this.getSelectCallBack(component)
                })
            }
        },
        "commonView.supplierSelect.isLoading": {
            handler: function (newVal) {
                const component = 'supplierSelect'
                // request supplier option
                if (newVal === true) this.getSelect({component}).then(() => {
                    this.getSelectCallBack(component)
                })
            }
        },
        "commonView.codeSelect.isLoading": {
            handler: function (newVal) {
                const component = 'codeSelect'
                // request code option
                if (newVal === true) this.getSelect({component}).then(() => {
                    this.getSelectCallBack(component)
                })
            }
        },
        "commonView.productSelect.isLoading": {
            handler: function (newVal) {
                const component = 'productSelect'
                // request product option
                if (newVal === true) this.getSelect({component}).then(() => {
                    this.getSelectCallBack(component)
                })
            }
        },
        "commonView.colorSelect.isLoading": {
            handler: function (newVal) {
                const component = 'colorSelect'
                // request color option
                if (newVal === true) this.getSelect({component}).then(() => {
                    this.getSelectCallBack(component)
                })
            }
        },
        "commonView.warehouseSelect.isLoading": {
            handler: function (newVal) {
                const component = 'warehouseSelect'
                // request warehouse option
                if (newVal === true) this.getSelect({component}).then(() => {
                    this.getSelectCallBack(component)
                })
            }
        },
        "commonView.shelfSelect.isLoading": {
            handler: function (newVal) {
                const component = 'shelfSelect'
                // request shelf option
                if (newVal === true) this.getSelect({component}).then(() => {
                    this.getSelectCallBack(component)
                })
            }
        },
        "commonView.operatorSelect.isLoading": {
            handler: function (newVal) {
                const component = 'operatorSelect'
                // request operator option
                if (newVal === true) this.getSelect({component}).then(() => {
                    this.getSelectCallBack(component)
                })
            }
        },
        "commonView.cascadingWarehouseShelfSelect.isLoading": {
            handler: function (newVal) {
                // cascadingWarehouseShelfSelect
                const component = 'cascadingWarehouseShelfSelect'
                // request operator option
                if (newVal === true) this.getSelect({component}).then(() => {
                    this.getSelectCallBack(component)
                })
            }
        },
        "colorView.table.isLoading": {
            handler: function (newVal) {
                const view = 'colorView'
                if (newVal === true) this.getTable({view}).then(() => {
                    this.getTableCallBack(view)
                })
            }
        },
        "warehouseView.table.isLoading": {
            handler: function (newVal) {
                const view = 'warehouseView'
                if (newVal === true) this.getTable({view}).then(() => {
                    this.getTableCallBack(view)
                })
            }
        },
        "shelfView.table.isLoading": {
            handler: function (newVal) {
                const view = 'shelfView'
                if (newVal === true) this.getTable({view}).then(() => {
                    this.getTableCallBack(view)
                })
            }
        },
        "customerView.table.isLoading": {
            handler: function (newVal) {
                const view = 'customerView'
                if (newVal === true) this.getTable({view}).then(() => {
                    this.getTableCallBack(view)
                })
            }
        },
        "supplierView.table.isLoading": {
            handler: function (newVal) {
                const view = 'supplierView'
                if (newVal === true) this.getTable({view}).then(() => {
                    this.getTableCallBack(view)
                })
            }
        },
        "productView.table.isLoading": {
            handler: function (newVal) {
                const view = 'productView'
                if (newVal === true) this.getTable({view}).then(() => {
                    this.getTableCallBack(view)
                })
            }
        },
        "saleView.table.isLoading": {
            handler: function (newVal) {
                const view = 'saleView'
                if (newVal === true) this.getTable({view}).then(() => {
                    this.getTableCallBack(view)
                })
            }
        },
        "saleHistoryView.table.isLoading": {
            handler: function (newVal) {
                const view = 'saleHistoryView'
                if (newVal === true) this.getTable({view}).then(() => {
                    this.getTableCallBack(view)
                })
            }
        }
    }
};
</script>
<style lang="scss">
</style>
<style>
.sale-icon-gradient {
    background: linear-gradient(to right, rgb(94, 114, 228)-25%, rgb(251, 99, 64)) 90%;
    -webkit-background-clip: text;
    color: transparent;
}
</style>
