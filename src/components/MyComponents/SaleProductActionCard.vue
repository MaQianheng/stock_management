<template>
    <div class="card shadow" style="padding: 20px 30px">
        <div class="row">
            <v-select
                class="col-12"
                :searchable=true
                :options="saleView.table.actionCard.actionSelect.data"
                v-model="saleView.table.actionCard.actionSelect.selectedValue"
                :labelSearchPlaceholder="commonView.labelSearchPlaceholder"
                :disabled="saleView.table.isLoading"
                :labelNotFound="commonView.labelNotFound"
            />
        </div>
        <div class="row" v-show="saleView.table.actionCard.actionSelect.selectedValue.value === 0">
            <v-select
                class="col-12"
                :searchable=true
                :options="commonView.supplierSelect.data"
                v-model="saleView.form.supplierSelectedValue"
                :labelSearchPlaceholder="commonView.labelSearchPlaceholder"
                :disabled="commonView.supplierSelect.isLoading"
                :labelNotFound="commonView.labelNotFound"
            />
<!--            <autocomplete-->
<!--                class="col-12"-->
<!--                :search="searchSupplier"-->
<!--                placeholder="搜索并选择供应商"-->
<!--                aria-label="搜索并选择供应商"-->
<!--                :get-result-value="getSupplierResultValue"-->
<!--                @submit="handleSupplierSubmit"-->
<!--                :debounce-time="500"-->
<!--            />-->
        </div>
        <div class="row" v-show="saleView.table.actionCard.actionSelect.selectedValue.value === 1">
<!--            <autocomplete-->
<!--                class="col-6"-->
<!--                :search="searchDriver"-->
<!--                placeholder="搜索并选择司机"-->
<!--                aria-label="搜索并选择司机"-->
<!--                :get-result-value="getDriverResultValue"-->
<!--                @submit="handleDriverSubmit"-->
<!--                :debounce-time="500"-->
<!--            />-->
<!--            <autocomplete-->
<!--                class="col-6"-->
<!--                :search="searchCustomer"-->
<!--                placeholder="搜索并选择客户"-->
<!--                aria-label="搜索并选择客户"-->
<!--                :get-result-value="getCustomerResultValue"-->
<!--                @submit="handleCustomerSubmit"-->
<!--                :debounce-time="500"-->
<!--            />-->
            <v-select
                class="col-6"
                :searchable=true
                :options="commonView.driverSelect.data"
                v-model="saleView.form.driverSelectedValue"
                :labelSearchPlaceholder="commonView.labelSearchPlaceholder"
                :disabled="commonView.driverSelect.isLoading"
                :labelNotFound="commonView.labelNotFound"
            />
            <v-select
                class="col-6"
                :searchable=true
                :options="commonView.customerSelect.data"
                v-model="saleView.form.customerSelectedValue"
                :labelSearchPlaceholder="commonView.labelSearchPlaceholder"
                :disabled="commonView.customerSelect.isLoading"
                :labelNotFound="commonView.labelNotFound"
            />
        </div>
    </div>
</template>

<script>
import VSelect from '@alfsnd/vue-bootstrap-select'
// import Autocomplete from '@trevoreyre/autocomplete-vue'
import {mapActions, mapState} from "vuex";
import {requestFuzzyQueryCustomerName, requestFuzzyQueryDriverName, requestFuzzyQuerySupplierName} from "@/api";

export default {
    name: "SaleProductActionCard",
    components: {
        // Autocomplete,
        VSelect
    },
    computed: {
        ...mapState(["colorView", "commonView", "saleView"])
    },
    methods: {
        ...mapActions(['updateFormSingleData', 'increaseRequestingTasksCount', 'updateViewComponent']),
        searchDriver(input) {
            if (input.length === 0) {
                this.updateFormSingleData({view: 'saleView', key: 'driverRef', value: ''})
                return []
            }
            return requestFuzzyQueryDriverName({name: input}).then((data) => {
                return data.data.data
            }).catch(() => {
                return ['请求出错']
            })
        },
        getDriverResultValue(result) {
            return result.name
        },
        handleDriverSubmit(result) {
            this.updateFormSingleData({view: 'saleView', key: 'driverRef', value: result})
        },

        searchSupplier(input) {
            if (input.length === 0) {
                this.updateFormSingleData({view: 'saleView', key: 'supplierRef', value: ''})
                return []
            }
            return requestFuzzyQuerySupplierName({supplierName: input}).then((data) => {
                return data.data.data
            }).catch(() => {
                return ['请求出错']
            })
        },
        getSupplierResultValue(result) {
            return result.supplierName
        },
        handleSupplierSubmit(result) {
            this.updateFormSingleData({view: 'saleView', key: 'supplierRef', value: result})
        },

        searchCustomer(input) {
            if (input.length === 0) {
                this.updateFormSingleData({view: 'saleView', key: 'customerRef', value: ''})
                return []
            }
            return requestFuzzyQueryCustomerName({name: input}).then((data) => {
                return data.data.data
            }).catch(() => {
                return ['请求出错']
            })
        },
        getCustomerResultValue(result) {
            return result.name
        },
        handleCustomerSubmit(result) {
            this.updateFormSingleData({view: 'saleView', key: 'customerRef', value: result})
        },
    },
    watch: {
        "saleView.table.actionCard.actionSelect.selectedValue.value": {
            handler: function (newVal) {
                let {form} = this.saleView
                form = {
                    ...form,
                    action: newVal,
                    supplierRef: {},
                    customerRef: {},
                    driverRef: {},
                    deliveryFee: 0,
                    product: {}
                }
                this.saleView.saleSummary = {}
                this.updateViewComponent({view: 'saleView', component: 'saleSummary', objKV: {}})
                this.updateViewComponent({view: 'saleView', component: 'form', objKV: form})
                let {queryCondition} = this.saleView.table
                queryCondition.currentPageCount = 1
                queryCondition.action = newVal
                this.increaseRequestingTasksCount(1)
                this.updateViewComponent({
                    view: 'saleView', component: 'table', objKV: {
                        isLoading: true,
                        queryCondition
                    }
                })
            }
        },
        "saleView.form.supplierSelectedValue": {
            handler: function (newVal) {
                this.updateFormSingleData({view: 'saleView', key: 'supplierRef', value: newVal})
            }
        },
        "saleView.form.customerSelectedValue": {
            handler: function (newVal) {
                this.updateFormSingleData({view: 'saleView', key: 'customerRef', value: newVal})
            }
        },
        "saleView.form.driverSelectedValue": {
            handler: function (newVal) {
                this.updateFormSingleData({view: 'saleView', key: 'driverRef', value: newVal})
            }
        }
    }
}
</script>

<style scoped>

</style>
