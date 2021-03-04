<template>
    <div class="row" style="margin-top: 10px;">
        <p class="col-6">开始日期</p>
        <p class="col-6">结束日期</p>
        <MyDatePicker
            queryConditionKey="startedTimeStamp"
            defaultDate="2021-01-01"
            minDate="2021-01-01"
            :maxDate="startedTimeMaxDate"
            class="col-6"/>
        <MyDatePicker
            queryConditionKey="endedTimeStamp"
            :defaultDate="endedTimeMaxDate"
            minDate="2021-01-02"
            :maxDate="endedTimeMaxDate"
            class="col-6"/>
        <autocomplete
            class="col-lg-6 col-sm-1"
            :search="searchCode"
            placeholder="搜索并选择商品货号"
            aria-label="搜索并选择商品货号"
            :get-result-value="getCodeResultValue"
            @submit="handleCodeSubmit"
            :default-value="this.saleHistoryView.table.queryCondition.code"
            :debounce-time="500"
            style="margin-bottom: 10px;"
        />
        <autocomplete
            class="col-lg-6 col-sm-1"
            :search="searchName"
            placeholder="搜索并选择商品名称"
            aria-label="搜索并选择商品名称"
            :get-result-value="getNameResultValue"
            @submit="handleNameSubmit"
            :default-value="this.saleHistoryView.table.queryCondition.name"
            :debounce-time="500"
            style="margin-bottom: 10px;"
        />
        <v-select :searchable=true
                  class="col-6"
                  :options="commonView.driverSelectAll.data"
                  v-model="saleHistoryView.table.driverSelect.selectedValue"
                  :labelSearchPlaceholder="commonView.labelNotFound"/>
        <v-select :searchable=true
                  class="col-6"
                  :options="commonView.operatorSelectAll.data"
                  v-model="saleHistoryView.table.operatorSelect.selectedValue"
                  :labelSearchPlaceholder="commonView.labelNotFound"/>
        <v-select :searchable=true
                  class="col-6"
                  :options="commonView.customerSelectAll.data"
                  v-model="saleHistoryView.table.customerSelect.selectedValue"
                  :labelSearchPlaceholder="commonView.labelNotFound"/>
        <v-select :searchable=true
                  class="col-6"
                  :options="commonView.supplierSelectAll.data"
                  v-model="saleHistoryView.table.supplierSelect.selectedValue"
                  :labelSearchPlaceholder="commonView.labelNotFound"/>
        <v-select :searchable=true
                  class="col-6"
                  :options="commonView.colorSelectAll.data"
                  v-model="saleHistoryView.table.colorSelect.selectedValue"
                  :labelSearchPlaceholder="commonView.labelNotFound"/>
        <v-select :searchable=true
                  class="col-6"
                  :options="saleHistoryView.table.actionSelect.data"
                  v-model="saleHistoryView.table.actionSelect.selectedValue"
                  :labelSearchPlaceholder="commonView.labelNotFound"/>
        <v-select :searchable=true
                  class="col-6"
                  :options="commonView.warehouseSelectAll.data"
                  v-model="saleHistoryView.table.warehouseSelect.selectedValue"
                  :labelSearchPlaceholder="commonView.labelNotFound"/>
        <v-select :searchable=true
                  class="col-6"
                  :options="saleHistoryView.table.shelfSelect.data"
                  v-model="saleHistoryView.table.shelfSelect.selectedValue"
                  :labelSearchPlaceholder="commonView.labelNotFound"/>
        <div class="col-12 text-right">
            <base-button type="info" :outline="true" size="sm" @click="handleClick">
                搜索
            </base-button>
        </div>
    </div>
</template>

<script>
import VSelect from '@alfsnd/vue-bootstrap-select'
import MyDatePicker from "@/components/MyComponents/MyDatePicker";
import {
    requestFuzzyQueryProductCode,
    requestFuzzyQueryProductName
} from "@/api";
import Autocomplete from '@trevoreyre/autocomplete-vue'
import {mapActions, mapState} from "vuex";
import {getDate} from "@/functions/utils";

export default {
    name: "SaleHistoryFilter",
    components: {
        MyDatePicker,
        VSelect,
        Autocomplete
    },
    methods: {
        ...mapActions(['updateViewComponent', 'updateCascadingShelf', 'increaseRequestingTasksCount']),
        handleClick() {
            if (this.saleHistoryView.table.isLoading) return
            const {queryCondition} = this.saleHistoryView.table
            const {warehouseRef, shelfRef} = queryCondition
            if (warehouseRef !== "0" && shelfRef === "0") {
                let value = ""
                let {sub} = this.commonView.cascadingWarehouseShelfSelect.data.objCascading[warehouseRef]
                for (let i = 0; i < sub.length; i++) {
                    value += `${sub[i].value}`
                    if (i !== sub.length - 1) value += ','
                }
                queryCondition.shelfRef = value
            }
            queryCondition.currentPageCount = 1
            this.increaseRequestingTasksCount(1)
            this.updateViewComponent({
                view: 'saleHistoryView',
                component: "table",
                objKV: {
                    queryCondition,
                    isLoading: true
                }
            })
        },
        searchCode(input) {
            if (input.length === 0) {
                let {queryCondition} = this.saleHistoryView.table
                queryCondition.code = ''
                this.updateViewComponent({view: 'saleHistoryView', component: 'table', objKV: queryCondition})
                return []
            }
            input = input.toUpperCase()
            return requestFuzzyQueryProductCode({code: input}).then((data) => {
                return data.data.data
            }).catch(() => {
                return ['请求出错']
            })
        },
        getCodeResultValue(result) {
            return result.code
        },
        handleCodeSubmit(result) {
            let {queryCondition} = this.saleHistoryView.table
            queryCondition.code = result.code
            this.updateViewComponent({view: 'saleHistoryView', component: 'table', objKV: queryCondition})
        },

        searchName(input) {
            if (input.length === 0) {
                let {queryCondition} = this.saleHistoryView.table
                queryCondition.name = ''
                this.updateViewComponent({view: 'saleHistoryView', component: 'table', objKV: queryCondition})
                return []
            }
            return requestFuzzyQueryProductName({name: input}).then((data) => {
                return data.data.data
            }).catch(() => {
                return ['请求出错']
            })
        },
        getNameResultValue(result) {
            return result.name
        },
        handleNameSubmit(result) {
            let {queryCondition} = this.saleHistoryView.table
            queryCondition.name = result.name
            this.updateViewComponent({view: 'saleHistoryView', component: 'table', objKV: queryCondition})
        },

        handleUpdateSelectedValue(newVal, oldVal, strKey) {
            if (newVal === oldVal) return
            let {queryCondition} = this.saleHistoryView.table
            queryCondition[strKey] = newVal
            this.updateViewComponent({
                view: 'saleHistoryView',
                component: "table",
                objKV: {
                    queryCondition
                }
            })
        }
    },
    computed: {
        ...mapState(['saleHistoryView', 'commonView']),
        startedTimeMaxDate: function () {
            return getDate(Date.now(), false)
        },
        endedTimeMaxDate: function () {
            return getDate()
        }
    },
    watch: {
        "saleHistoryView.table.driverSelect.selectedValue.value": {
            handler: function (newVal, oldVal) {
                this.handleUpdateSelectedValue(newVal, oldVal, 'driverRef')
            }
        },
        "saleHistoryView.table.operatorSelect.selectedValue.value": {
            handler: function (newVal, oldVal) {
                this.handleUpdateSelectedValue(newVal, oldVal, 'operatorRef')
            }
        },
        "saleHistoryView.table.customerSelect.selectedValue.value": {
            handler: function (newVal, oldVal) {
                this.handleUpdateSelectedValue(newVal, oldVal, 'customerRef')
            }
        },
        "saleHistoryView.table.supplierSelect.selectedValue.value": {
            handler: function (newVal, oldVal) {
                this.handleUpdateSelectedValue(newVal, oldVal, 'supplierRef')
            }
        },
        "saleHistoryView.table.actionSelect.selectedValue.value": {
            handler: function (newVal, oldVal) {
                this.handleUpdateSelectedValue(newVal, oldVal, 'action')
            }
        },
        "saleHistoryView.table.colorSelect.selectedValue.value": {
            handler: function (newVal, oldVal) {
                this.handleUpdateSelectedValue(newVal, oldVal, 'colorRef')
            }
        },
        "saleHistoryView.table.warehouseSelect.selectedValue.value": {
            handler: function (newVal) {
                let {queryCondition} = this.saleHistoryView.table
                queryCondition.warehouseRef = newVal
                queryCondition.shelfRef = "0"
                this.updateViewComponent({
                    view: 'saleHistoryView',
                    component: "table",
                    objKV: {
                        queryCondition
                    }
                })
                this.updateCascadingShelf({key: newVal, view: 'saleHistoryView'})
            }
        },
        "saleHistoryView.table.shelfSelect.selectedValue.value": {
            handler: function (newVal, oldVal) {
                this.handleUpdateSelectedValue(newVal, oldVal, 'shelfRef')
            }
        }
    }
}
</script>

<style scoped>

</style>
