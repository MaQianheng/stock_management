<template>
    <base-nav class="navbar-top navbar-dark"
              id="navbar-main"
              :show-toggle-button="false"
              expand>
        <ul class="navbar-nav align-items-center d-none d-md-flex" style="right: 20px; position: absolute;">
            <base-button type="secondary" icon="ni ni-air-baloon" @click="handleReloadThisPageDataClick"
                         :disabled="isDataLoading">
                <b-spinner small type="grow" v-if="isDataLoading"/>
                {{ reloadPageText }}
            </base-button>
            <base-button type="secondary" icon="ni ni-bulb-61" @click="handleReloadAllPageDataClick"
                         :disabled="isDataLoading">
                <b-spinner small type="grow" v-if="isDataLoading"/>
                {{ reloadAllText }}
            </base-button>
            <li class="nav-item dropdown">
                <base-dropdown class="nav-link pr-0">
                    <div class="media align-items-center" slot="title" style="cursor: pointer;">
                        <span class="avatar avatar-sm rounded-circle">
                            <img alt="Image placeholder" src="img/theme/user-icon.jpg">
                        </span>
                        <div class="media-body ml-2 d-none d-lg-block">
                            <span class="mb-0 text-sm  font-weight-bold">管理员</span>
                        </div>
                    </div>

                    <template>
                        <div class=" dropdown-header noti-title">
                            <h6 class="text-overflow m-0">欢迎!</h6>
                        </div>
                        <div class="dropdown-divider"></div>
                        <router-link to="/profile" class="dropdown-item">
                            <i class="ni ni-user-run"></i>
                            <span>退出登录</span>
                        </router-link>
                    </template>
                </base-dropdown>
            </li>
        </ul>
    </base-nav>
</template>
<script>
import {mapActions, mapState} from "vuex";
// import {funcGetLikeIdKey} from "@/functions";

export default {
    data() {
        return {
            activeNotifications: false,
            showMenu: false,
            searchQuery: ''
        };
    },
    methods: {
        ...mapActions(["updateViewComponent", "increaseRequestingTasksCount"]),
        toggleSidebar() {
            this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
        },
        hideSidebar() {
            this.$sidebar.displaySidebar(false);
        },
        toggleMenu() {
            this.showMenu = !this.showMenu;
        },
        handleReloadThisPageDataClick() {
            if (this.isDataLoading) return
            this.increaseRequestingTasksCount(this.arrSelect.length + this.arrView.length)
            for (let i = 0; i < this.arrSelect.length; i++) {
                this.updateViewComponent({view: 'commonView', component: this.arrSelect[i], objKV: {isLoading: true}})
            }
            for (let i = 0; i < this.arrView.length; i++) {
                this.updateViewComponent({view: this.arrView[i], component: 'table', objKV: {isLoading: true}})
            }
        },
        handleReloadAllPageDataClick() {
            if (this.isDataLoading) return
            const {arrSelect, arrView} = this.commonView.publicVariable
            this.increaseRequestingTasksCount(arrSelect.length + arrView.length)
            for (let i = 0; i < arrSelect.length; i++) {
                this.updateViewComponent({view: 'commonView', component: arrSelect[i], objKV: {isLoading: true}})
            }
            for (let i = 0; i < arrView.length; i++) {
                this.updateViewComponent({view: arrView[i], component: 'table', objKV: {isLoading: true}})
            }
        }
    },
    computed: {
        ...mapState(["commonView", "colorView", "warehouseView", "shelfView", "productView", "customerView", "supplierView"]),
        arrSelect: function () {
            switch (this.$route.path) {
                case '/color':
                    return ['colorSelect']
                case '/warehouse':
                    return ['warehouseSelect', 'shelfSelect']
                case '/product':
                    return ['warehouseSelect', 'shelfSelect', 'colorSelect', 'cascadingWarehouseShelfSelect']
                case '/sale':
                    return ['colorSelect']
                case '/sale_history':
                    return ['colorSelect', 'cascadingWarehouseShelfSelect', 'warehouseSelect', 'shelfSelect']
                default:
                    return []
            }
        },
        arrView: function () {
            // 当给select重新赋值时会触发watch来reload table
            switch (this.$route.path) {
                case '/color':
                    // if (String(this.colorView.table._id) === "0") arr.push('colorView')
                    // break
                    return ['colorView']
                case '/warehouse':
                    // if (String(this.warehouseView.table._id) === "0") arr.push('warehouseView')
                    // if (String(this.shelfView.table.warehouseRef) === "0") arr.push('shelfView')
                    // break
                    return ['warehouseView', 'shelfView']
                case '/product':
                    return ['productView']
                case '/customer':
                    return ['customerView']
                case '/supplier':
                    return ['supplierView']
                case '/sale':
                    return ['saleView']
                case '/sale_history':
                    return ['saleHistoryView']
                default:
                    return []
            }
        },
        isDataLoading: function () {
            return this.commonView.publicVariable.requestingTasksCount !== 0
        },
        reloadPageText: function () {
            const {requestingTasksCount} = this.commonView.publicVariable
            return requestingTasksCount === 0 ? '重载当前页面数据' : `正在加载数据。剩余：${requestingTasksCount}条数据`
        },
        reloadAllText: function () {
            const {requestingTasksCount} = this.commonView.publicVariable
            return requestingTasksCount === 0 ? '重载全部页面数据' : `正在加载数据。剩余：${requestingTasksCount}条数据`
        }
    }
};
</script>
