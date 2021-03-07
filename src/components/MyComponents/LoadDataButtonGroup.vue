<template>
    <li>
        <base-button type="secondary" icon="ni ni-air-baloon" @click="handleReloadThisPageDataClick"
                     :disabled="isLoadingData" :style="isMobile ? 'border-radius: 0; box-shadow: 0 0 0; width: 100%; background-color: transparent; border: 0px;' : ''" :class="isMobile ? 'dropdown-item' : ''">
            <b-spinner small type="grow" v-if="isLoadingData"/>
            {{ reloadPageText }}
        </base-button>
        <base-button type="secondary" icon="ni ni-bulb-61" @click="handleReloadAllPageDataClick"
                     :disabled="isLoadingData" :style="isMobile ? 'border-radius: 0; box-shadow: 0 0 0; width: 100%; background-color: transparent; border: 0px;' : ''" :class="isMobile ? 'dropdown-item' : ''">
            <b-spinner small type="grow" v-if="isLoadingData"/>
            {{ reloadAllText }}
        </base-button>
    </li>
</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";

export default {
    name: "LoadDataButtonGroup",
    props: {
        isMobile: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        ...mapActions(["updateViewComponent", "increaseRequestingTasksCount"]),
        ...mapMutations(['UPDATE_VIEW']),
        handleReloadThisPageDataClick() {
            if (this.isLoadingData) return
            this.increaseRequestingTasksCount(this.arrSelect.length + this.arrView.length)
            for (let i = 0; i < this.arrSelect.length; i++) {
                this.updateViewComponent({view: 'commonView', component: this.arrSelect[i], objKV: {isLoading: true}})
            }
            for (let i = 0; i < this.arrView.length; i++) {
                this.updateViewComponent({view: this.arrView[i], component: 'table', objKV: {isLoading: true}})
            }
        },
        handleReloadAllPageDataClick() {
            if (this.isLoadingData) return
            const {arrSelect, arrView} = this.commonView.publicVariable
            this.increaseRequestingTasksCount(arrSelect.length + arrView.length)
            for (let i = 0; i < arrSelect.length; i++) {
                this.updateViewComponent({view: 'commonView', component: arrSelect[i], objKV: {isLoading: true}})
            }
            for (let i = 0; i < arrView.length; i++) {
                this.updateViewComponent({view: arrView[i], component: 'table', objKV: {isLoading: true}})
            }
        },
    },
    computed: {
        ...mapState(["commonView", "colorView", "warehouseView", "shelfView", "productView", "customerView", "supplierView", 'loginView']),
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
                    return ['colorSelect', 'cascadingWarehouseShelfSelect', 'warehouseSelect', 'shelfSelect', 'operatorSelect', 'driverSelect']
                case '/operator':
                    return ['operatorSelect']
                default:
                    return []
            }
        },
        arrView: function () {
            // 当给select重新赋值时会触发watch来reload table
            switch (this.$route.path) {
                case '/color':
                    return ['colorView']
                case '/warehouse':
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
                case '/driver':
                    return ['driverView']
                case '/operator':
                    return ['operatorView']
                case '/dashboard':
                    return ['dashboardView']
                default:
                    return []
            }
        },
        isLoadingData: function () {
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
}
</script>

<style scoped>

</style>
