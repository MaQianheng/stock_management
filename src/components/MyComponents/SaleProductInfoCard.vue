<template>
    <b-card
        :title="item.code + '-' + item.name"
        :img-src="item.imageURLs.length === 0 ? baseUrl + 'product_default.jpeg' : baseUrl + item.imageURLs[0]"
        img-alt="Image"
        img-top
    >
        <hr>
        <div style="margin: 1rem 0;">
            <p>价格：{{ item.price }}/KG</p>
            <p>颜色：{{ item.colorRef.color }}</p>
        </div>
        <hr style="margin: 1rem 0;">
        <div class="row" style="margin: 10px -20px;">
            <!--            <base-checkbox class="col-12" v-model="isOnlyShowAvailable" style="margin-bottom: 20px; left: 20px;">-->
            <!--                仅看有货-->
            <!--            </base-checkbox>-->
            <v-select
                :searchable=true
                class="col-6"
                :options="warehouseOptions"
                v-model="warehouseSelect.selectedValue"
                :labelSearchPlaceholder="commonView.labelSearchPlaceholder"
                :disabled="commonView.cascadingWarehouseShelfSelect.isLoading"
                :labelNotFound="commonView.labelNotFound"
            />
            <v-select
                :searchable=true
                class="col-6"
                :options="shelfSelect.options"
                v-model="shelfSelect.selectedValue"
                :labelSearchPlaceholder="commonView.labelSearchPlaceholder"
                :disabled="commonView.cascadingWarehouseShelfSelect.isLoading"
                :labelNotFound="commonView.labelNotFound"
            />
            <div class="row">
                <div class="col-4" style="text-align: center;">
                    <span>原剩余</span>
                </div>
                <div class="col-4" style="text-align: center;">
                    <span>{{ inOrOut }}数量</span>
                </div>
                <div class="col-4" style="text-align: center;">
                    <span>变更后</span>
                </div>
                <div class="col-4" style="text-align: center;">
                    <span style="line-height: 40px;">{{ animatedOriWeight }}KG</span>
                </div>
                <div class="col-4" style="text-align: center;">
                    <span style="line-height: 40px;">{{ animatedOperateWeight }}KG</span>
                </div>
                <div class="col-4" style="text-align: center;">
                    <span style="line-height: 40px;">{{ animatedAfterOperateWeight }}KG</span>
                </div>
            </div>
        </div>
        <b-card-text>
            <ZoomCenterTransition v-show="ifShowHint" :duration="500">
                <div class="small text-muted" style="text-align: right;">该货架之前未存放过该商品</div>
            </ZoomCenterTransition>
        </b-card-text>
        <div class="col-12" style="text-align: right; padding: 0;">
            <base-button type="dark" :outline="true" size="sm" @click="handleMutateClick(index)"
                         :disabled="buttonStatusText.status || this.shelfSelect.selectedValue.value === '-1' || (this.model.oriWeight === 0 && this.saleView.table.queryCondition.action === 1)">
                {{ buttonStatusText.text }}
            </base-button>
        </div>
    </b-card>
</template>

<script>
import VSelect from '@alfsnd/vue-bootstrap-select'
import {ZoomCenterTransition} from 'vue2-transitions';
import {mapActions, mapState} from "vuex";
import {gsap} from 'gsap'
import {deepClone} from "@/functions/utils";
import {baseUrl} from "@/api";

export default {
    name: "SaleProductInfoCard",
    components: {
        VSelect,
        ZoomCenterTransition
    },
    data: () => (
        {
            warehouseSelect: {
                selectedValue: {value: '-1', text: '未选择库房'},
                options: []
            },
            shelfSelect: {
                selectedValue: {value: '-1', text: '未选择货架'},
                options: []
            },
            isOnlyShowAvailable: false,
            model: {
                oriWeight: 0,
                operateWeight: 0,
                afterOperateWeight: 0
            },
            tweendNumber: {
                oriWeight: 0,
                operateWeight: 0,
                afterOperateWeight: 0
            }
        }
    ),
    props: {
        item: {
            type: Object
        },
        index: {
            type: Number
        }
    },
    methods: {
        ...mapActions(['updateFormSingleData', 'updateViewComponent', 'updateSaleSummarySub', 'updateTableRowData']),
        handleMutateClick(index) {
            let shelfRef = this.shelfSelect.selectedValue.value
            if (shelfRef === "-1") return
            shelfRef = `${this.item._id}_${shelfRef}`
            const {saleSummary} = this.saleView
            const {_id} = this.item
            if (!(_id in saleSummary)) {
                // saleSummary独一份
                saleSummary[_id] = deepClone(this.item)
                saleSummary[_id].sub = {}
            } else {
                if (shelfRef in saleSummary[_id].sub) return
            }
            const {sub} = saleSummary[_id]
            if (shelfRef in this.item.sub) {
                saleSummary[_id].sub[shelfRef] = {...this.item.sub[shelfRef]}
            } else {
                // first time add
                const objSubNewAdd = {
                    afterOperateWeight: 0,
                    operateWeight: 0,
                    oriWeight: 0
                }
                this.item.sub[shelfRef] = {...objSubNewAdd}
                sub[shelfRef] = {...objSubNewAdd}
            }
            sub[shelfRef].warehouseRef = {...this.warehouseSelect.selectedValue}
            sub[shelfRef].shelfRef = {...this.shelfSelect.selectedValue}
            this.updateViewComponent({view: 'saleView', component: 'saleSummary', objKV: saleSummary})
            this.updateTableRowData({view: 'saleView', index, objKV: this.item})
            this.$notify({
                type: 'success',
                title: `${this.item.name}已添加`
            })
        },
    },
    computed: {
        ...mapState(['commonView', 'productView', 'saleView']),
        warehouseOptions: function () {
            switch (this.saleView.table.queryCondition.action) {
                case 0:
                    return this.commonView.warehouseSelect.data
                case 1: {
                    const arrProductIdShelfId = Object.keys(this.item.sub)
                    const result = []
                    const objAddedWarehouse = {}
                    for (let i = 0; i < arrProductIdShelfId.length; i++) {
                        const shelfId = arrProductIdShelfId[i].split('_')[1]
                        const {warehouseRef} = this.commonView.cascadingWarehouseShelfSelect.data.objShelfWarehouseKV[shelfId]
                        if (!(warehouseRef.value in objAddedWarehouse)) {
                            objAddedWarehouse[warehouseRef.value] = 1
                            result.push(warehouseRef)
                        }
                    }
                    return result
                }
            }
            return []
        },
        inOrOut: function () {
            return this.saleView.table.queryCondition.action === 0 ? '入' : '出'
        },
        animatedOriWeight: function () {
            return this.tweendNumber.oriWeight.toFixed(0);
        },
        animatedOperateWeight: function () {
            return this.tweendNumber.operateWeight.toFixed(0);
        },
        animatedAfterOperateWeight: function () {
            return this.tweendNumber.afterOperateWeight.toFixed(0);
        },
        ifShowHint: function () {
            if (this.saleView.table.queryCondition.action === 1) return false
            if (this.shelfSelect.selectedValue.value === '-1') return false
            if (this.item.sub[`${this.item._id}_${this.shelfSelect.selectedValue.value}`]) {
                return !("isAlreadyExisted" in this.item.sub[`${this.item._id}_${this.shelfSelect.selectedValue.value}`]);
            }
            return true
        },
        buttonStatusText: function () {
            const shelfRef = `${this.item._id}_${this.shelfSelect.selectedValue.value}`
            if (this.saleView.saleSummary[this.item._id]) {
                const objTmp = this.saleView.saleSummary[this.item._id].sub
                if (objTmp) {
                    if (shelfRef in objTmp) return {status: true, text: '已添加至订单'}
                }
            }
            return {status: false, text: `添加至本次${this.inOrOut}库记录`}
        },
        baseUrl: function () {
            return baseUrl + '/images/'
        }
    },
    watch: {
        "saleView.table.isLoading": {
            handler: function (newVal) {
                if (newVal === true) {
                    this.warehouseSelect.selectedValue = {value: '-1', text: '未选择库房'}
                    this.shelfSelect.selectedValue = {value: '-1', text: '未选择货架'}
                }
            }
        },
        "warehouseSelect.selectedValue.value": {
            handler: function (newVal) {
                if (newVal === '-1') return
                switch (this.saleView.table.queryCondition.action) {
                    case 0:
                        this.shelfSelect.options = this.commonView.cascadingWarehouseShelfSelect.data.objCascading[newVal].sub
                        break
                    case 1: {
                        const arrProductIdShelfId = Object.keys(this.item.sub)
                        this.shelfSelect.options = []
                        for (let i = 0; i < arrProductIdShelfId.length; i++) {
                            const shelfId = arrProductIdShelfId[i].split('_')[1]
                            const warehouseRefValue = this.commonView.cascadingWarehouseShelfSelect.data.objShelfWarehouseKV[shelfId].warehouseRef.value
                            if (warehouseRefValue === newVal) this.shelfSelect.options.push(this.commonView.cascadingWarehouseShelfSelect.data.objShelfWarehouseKV[shelfId].shelfRef)
                        }
                    }
                }
                this.shelfSelect.selectedValue = this.shelfSelect.options[0]
            }
        },
        "shelfSelect.selectedValue.value": {
            handler: function (newVal) {
                if (newVal === '-1') {
                    this.model.oriWeight = 0
                    this.model.afterOperateWeight = 0
                    this.model.operateWeight = 0
                    this.shelfSelect.options = []
                }
                const {_id} = this.item
                newVal = `${_id}_${newVal}`
                if (_id in this.saleView.saleSummary) {
                    if (newVal in this.saleView.saleSummary[_id].sub) {
                        this.model.oriWeight = this.saleView.saleSummary[_id].sub[newVal].oriWeight
                        this.model.afterOperateWeight = this.saleView.saleSummary[_id].sub[newVal].afterOperateWeight
                        this.model.operateWeight = this.saleView.saleSummary[_id].sub[newVal].operateWeight
                        return
                    }
                }
                this.model.oriWeight = this.item.sub[newVal] ? this.item.sub[newVal].oriWeight : 0
                this.model.afterOperateWeight = this.item.sub[newVal] ? this.item.sub[newVal].afterOperateWeight : 0
                this.model.operateWeight = this.item.sub[newVal] ? this.item.sub[newVal].operateWeight : 0
            }
        },
        "item.sub": {
            handler: function () {
                const {_id} = this.item
                if (_id in this.saleView.saleSummary) {
                    const shelfRef = `${this.item._id}_${this.shelfSelect.selectedValue.value}`
                    // 只需要更新现在所选的
                    if (shelfRef in this.saleView.saleSummary[_id].sub) {
                        const {oriWeight, operateWeight, afterOperateWeight} = this.saleView.saleSummary[_id].sub[shelfRef]
                        this.model = {oriWeight, operateWeight, afterOperateWeight}
                    }
                    if (!(shelfRef in this.item.sub)) {
                        this.model = {oriWeight: 0, operateWeight: 0, afterOperateWeight: 0}
                    }
                } else {
                    const shelfRef = `${this.item._id}_${this.shelfSelect.selectedValue.value}`
                    if (shelfRef in this.item.sub) {
                        const {oriWeight, operateWeight, afterOperateWeight} = this.item.sub[shelfRef]
                        this.model = {oriWeight, operateWeight, afterOperateWeight}
                    } else {
                        this.model = {oriWeight: 0, operateWeight: 0, afterOperateWeight: 0}
                    }
                }
            }
        },
        "model.oriWeight": {
            handler: function () {
                gsap.to(this.$data.tweendNumber, {duration: 0.5, oriWeight: this.model.oriWeight})
            }
        },
        "model.operateWeight": {
            handler: function () {
                gsap.to(this.$data.tweendNumber, {duration: 0.5, operateWeight: this.model.operateWeight})
            }
        },
        "model.afterOperateWeight": {
            handler: function () {
                gsap.to(this.$data.tweendNumber, {duration: 0.5, afterOperateWeight: this.model.afterOperateWeight})
            }
        }
    }
}
</script>

<style scoped>
.custom-checkbox .custom-control-input:checked ~ .custom-control-label::after {
    background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><path fill="%23fff" d="M6.564.75l-3.59 3.612-1.538-1.55L0 4.26l2.974 2.99L8 2.193z"/></svg>');
}
</style>
