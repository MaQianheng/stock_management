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
            :debounce-time="500"
            style="margin-bottom: 10px;"
        />
        <autocomplete
            class="col-lg-6 col-sm-1"
            :search="searchOperator"
            placeholder="搜索并选择管理员"
            aria-label="搜索并选择管理员"
            :get-result-value="getOperatorResultValue"
            @submit="handleOperatorSubmit"
            :debounce-time="500"
            style="margin-bottom: 10px;"
        />
        <autocomplete
            class="col-lg-6 col-sm-1"
            :search="searchDriver"
            placeholder="搜索并选择司机"
            aria-label="搜索并选择司机"
            :get-result-value="getDriverResultValue"
            @submit="handleDriverSubmit"
            :debounce-time="500"
            style="margin-bottom: 10px;"
        />
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
    requestFuzzyQueryDriverName,
    requestFuzzyQueryOperatorName,
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
                queryCondition.productCode = ''
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
            queryCondition.productCode = result.code
            this.updateViewComponent({view: 'saleHistoryView', component: 'table', objKV: queryCondition})
        },

        searchName(input) {
            if (input.length === 0) {
                let {queryCondition} = this.saleHistoryView.table
                queryCondition.productName = ''
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
            queryCondition.productName = result.name
            this.updateViewComponent({view: 'saleHistoryView', component: 'table', objKV: queryCondition})
        },

        searchOperator(input) {
            if (input.length === 0) {
                let {queryCondition} = this.saleHistoryView.table
                queryCondition.operatorRef = ''
                this.updateViewComponent({view: 'saleHistoryView', component: 'table', objKV: queryCondition})
                return []
            }
            return requestFuzzyQueryOperatorName({name: input}).then((data) => {
                return data.data.data
            }).catch(() => {
                return ['请求出错']
            })
        },
        getOperatorResultValue(result) {
            return result.name
        },
        handleOperatorSubmit(result) {
            let {queryCondition} = this.saleHistoryView.table
            queryCondition.operatorRef = result._id
            this.updateViewComponent({view: 'saleHistoryView', component: 'table', objKV: queryCondition})
        },

        searchDriver(input) {
            if (input.length === 0) {
                let {queryCondition} = this.saleHistoryView.table
                queryCondition.driverRef = ''
                this.updateViewComponent({view: 'saleHistoryView', component: 'table', objKV: queryCondition})
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
            let {queryCondition} = this.saleHistoryView.table
            queryCondition.driverRef = result._id
            this.updateViewComponent({view: 'saleHistoryView', component: 'table', objKV: queryCondition})
        },
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
        "saleHistoryView.table.actionSelect.selectedValue.value": {
            handler: function (newVal, oldVal) {
                if (newVal === oldVal) return
                let {queryCondition} = this.saleHistoryView.table
                queryCondition.action = newVal
                console.log(queryCondition.action, newVal)
                this.updateViewComponent(
                    {
                        view: 'saleHistoryView',
                        component: "table",
                        objKV: {
                            queryCondition
                        }
                    }
                )
            }
        },
        "saleHistoryView.table.colorSelect.selectedValue.value": {
            handler: function (newVal, oldVal) {
                if (newVal === oldVal) return
                let {queryCondition} = this.saleHistoryView.table
                queryCondition.colorRef = newVal
                this.updateViewComponent(
                    {
                        view: 'saleHistoryView',
                        component: "table",
                        objKV: {
                            queryCondition
                        }
                    }
                )
            }
        },
        "saleHistoryView.table.warehouseSelect.selectedValue.value": {
            handler: function (newVal) {
                let {queryCondition} = this.saleHistoryView.table
                queryCondition.warehouseRef = newVal
                queryCondition.shelfRef = "0"
                this.updateViewComponent(
                    {
                        view: 'saleHistoryView',
                        component: "table",
                        objKV: {
                            queryCondition
                        }
                    }
                )
                this.updateCascadingShelf({key: newVal, view: 'saleHistoryView'})
            }
        },
        "saleHistoryView.table.shelfSelect.selectedValue.value": {
            handler: function (newVal, oldVal) {
                if (newVal === oldVal) return
                let {queryCondition} = this.saleHistoryView.table
                queryCondition.shelfRef = newVal
                this.updateViewComponent(
                    {
                        view: 'saleHistoryView',
                        component: "table",
                        objKV: {
                            queryCondition
                        }
                    }
                )
            }
        }
    }
}
</script>

<style scoped>

</style>
