<template>
    <div>
        <base-button class="icon-summary" :style="this.saleView.form.action | actionColor"
                     type="secondary" icon="ni ni-archive-2"
                     @click="isShow = true">{{ this.saleView.form.action | actionText }}确认(已选择{{ badgeNum }}件)
        </base-button>
        <!--        <span class="badge badge-info" id="my-badge" style="z-index: 9999"></span>-->
        <modal :show.sync="isShow">
            <h6 slot="header" class="modal-title" id="modal-title-default">本次{{ this.saleView.form.action | actionText }}确认</h6>
            <div class="table-responsive">
                <table class="table b-table tablesorter table align-items-center table-flush">
                    <thead class="thead-light">
                    <tr>
                        <th style="z-index: 999;" class="sticky-top" v-for="column in columns" :key="column">{{ column }}</th>
                    </tr>
                    </thead>
                    <tbody class="list">
                    <template v-for="(item, productId) in saleView.saleSummary">
                        <tr v-for="(sub, shelfRef, i) in item.sub" :key="shelfRef" :rowspan="3">
                            <td v-if="i===0" :rowspan="Object.keys(item.sub).length">
                                {{ item.code }}
                            </td>
                            <td v-if="i===0" :rowspan="Object.keys(item.sub).length">
                                {{ item.colorRef.color }}
                            </td>
                            <td v-if="i===0" :rowspan="Object.keys(item.sub).length">
                                <div class="align-items-center">
                                    <img alt="Image placeholder"
                                         :src="item.imageURLs[0] ? baseImageUrl + item.imageURLs[0] : baseImageUrl + '/product_default.jpeg'"
                                         style="height: 120px">
                                </div>
                            </td>
                            <td v-if="i===0" :rowspan="Object.keys(item.sub).length">
                                {{ item.name }}
                            </td>
                            <td v-if="i===0" :rowspan="Object.keys(item.sub).length">
                                <base-input
                                    style="margin-bottom: 0; width: 100px;"
                                    alternative=""
                                    placeholder="重量"
                                    input-classes="form-control-alternative"
                                    :name="productId + '-' + shelfRef + '-price'"
                                    v-model="item.price"
                                    @input="getInput"
                                    :disabled="saleView.form.isLoading"
                                />
                            </td>
                            <!--                        <td>{{ sub.warehouse }}</td>-->
                            <td>{{ sub.warehouseRef.text }}</td>
                            <td>{{ sub.shelfRef.text }}</td>
                            <td>{{ sub.oriWeight }}</td>
                            <td>
                                <base-input
                                    style="margin-bottom: 0; width: 100px;"
                                    alternative=""
                                    placeholder="重量"
                                    input-classes="form-control-alternative"
                                    :name="productId + '-' + shelfRef + '-operateWeight'"
                                    v-model="sub.operateWeight"
                                    @input="getInput"
                                    :disabled="saleView.form.isLoading"
                                />
                            </td>
                            <td>{{ sub.totalPrice ? sub.totalPrice : 0 }}</td>
                            <td>{{ sub.afterOperateWeight }}</td>
                            <td>
                                <base-button type="warning" :outline="true" size="sm"
                                             :disabled="saleView.form.isLoading"
                                             @click="handleDeleteClick(productId, shelfRef)">
                                    删除
                                </base-button>
                            </td>
                        </tr>
                    </template>
                    </tbody>
                </table>
            </div>
            <hr>
            <div>
                <b-list-group-item variant="light" v-if="this.saleView.form.action === 2">
                    <p>司机：{{ driver }}</p>
                </b-list-group-item>
                <b-list-group-item variant="light" v-if="this.saleView.form.action === 2">
                    <p style="display: inline-block">运费：</p>
                    <base-input
                        style="display: inline-block; margin-bottom: 0;"
                        alternative=""
                        placeholder="运费"
                        input-classes="form-control-alternative"
                        name="deliveryFee"
                        v-model="saleView.form.deliveryFee"
                        @input="getDeliveryFeeInput"
                        :disabled="saleView.form.isLoading"
                    />
                </b-list-group-item>
                <b-list-group-item variant="light">
                    <p>{{ supplierNameOrCustomer }}</p>
                </b-list-group-item>
                <b-list-group-item variant="light">
                    <p>总件数：{{ badgeNum }}</p>
                </b-list-group-item>
                <b-list-group-item variant="light">
                    <p>总价格：{{ totalPrice }}</p>
                </b-list-group-item>
            </div>
            <template slot="footer">
                <base-button type="primary" @click="handleSubmitClick"
                             :disabled="badgeNum === 0 || saleView.form.isLoading">
                    <b-spinner small type="grow" v-if="saleView.form.isLoading"/>
                    提交
                </base-button>
                <base-button type="secondary" @click="isShow = false" :disabled="saleView.form.isLoading">取消
                </base-button>
            </template>
        </modal>
    </div>
</template>

<script>
import {mapActions, mapState} from "vuex";
import {handleSubmitForm} from "@/functions";
import {baseUrl} from "@/api";

export default {
    name: "SaleSummaryModal",
    data: () => (
        {
            isShow: false
        }
    ),
    methods: {
        ...mapActions(['updateViewComponent', 'updateTableRowSubData', 'updateFormSingleData', 'increaseRequestingTasksCount', 'updateViewComponent', 'submitForm']),
        getDeliveryFeeInput(key, value) {
            value = parseInt(value)
            if (isNaN(value)) value = 0
            if (value < 0) {
                value = 0
            }
            this.updateFormSingleData({view: 'saleView', key, value})
        },
        getInput(collectionKey, value) {
            if (this.saleView.form.isLoading) return
            const [productId, shelfRef, key] = collectionKey.split('-')
            const {saleSummary} = this.saleView
            const index = saleSummary[productId].row
            // const {sub} = this.saleView.table.data[index]
            const {sub} = this.saleView.saleSummary[productId]
            value = parseInt(value)
            if (isNaN(value)) value = 0
            // 重量价格都不可以小于0
            if (value < 0) {
                value = 0
                if (key === 'operateWeight') {
                    saleSummary[productId].sub[shelfRef][key] = value
                    sub[shelfRef][key] = value
                }
                if (key === 'price') saleSummary[productId][key] = value
                if (index < this.saleView.table.data.length) {
                    if (this.saleView.table.data[index]._id === productId) {
                        this.updateTableRowSubData({view: 'saleView', index, objKV: sub})
                    }
                }
                this.updateViewComponent({view: 'saleView', component: 'saleSummary', objKV: saleSummary})
                return
            }
            switch (key) {
                case 'operateWeight': {
                    if (this.saleView.table.queryCondition.action === 1) {
                        sub[shelfRef].afterOperateWeight = sub[shelfRef].oriWeight + value
                    } else {
                        if (sub[shelfRef].oriWeight - value < 0) {
                            value = sub[shelfRef].oriWeight
                        }
                        sub[shelfRef].afterOperateWeight = sub[shelfRef].oriWeight - value
                    }
                    // sub[shelfRef][key] = value
                    sub[shelfRef].operateWeight = value
                    sub[shelfRef].totalPrice = saleSummary[productId].price * value
                    break
                }
                case 'price': {
                    saleSummary[productId].price = value
                    for (const productIdShelfRef in sub) {
                        sub[productIdShelfRef].totalPrice = sub[productIdShelfRef].operateWeight * value
                    }
                    break
                }
                default:
                    break
            }
            if (index < this.saleView.table.data.length) {
                if (this.saleView.table.data[index]._id === productId) {
                    this.updateTableRowSubData({view: 'saleView', index, objKV: sub})
                }
            }
            this.updateViewComponent({view: 'saleView', component: 'saleSummary', objKV: saleSummary})
        },
        handleDeleteClick(productId, shelfRef) {
            // remove from saleSummary
            if (this.saleView.form.isLoading) return
            const {saleSummary} = this.saleView
            const index = saleSummary[productId].row
            delete saleSummary[productId].sub[shelfRef]
            if (Object.keys(saleSummary[productId].sub).length === 0) delete saleSummary[productId]
            this.updateViewComponent({view: 'saleView', component: 'saleSummary', objKV: saleSummary})
            // this.updateResetFlag(shelfRef)
            if (index < this.saleView.table.data.length) {
                if (this.saleView.table.data[index]._id === productId) {
                    // remove from table.data
                    const {sub} = this.saleView.table.data[index]
                    if ('isAlreadyExisted' in sub[shelfRef]) {
                        // reset
                        sub[shelfRef].operateWeight = 0
                        sub[shelfRef].afterOperateWeight = sub[shelfRef].oriWeight
                    } else {
                        // remove
                        delete sub[shelfRef]
                    }
                    // this.updateViewComponent({view: 'saleView', component: 'saleSummary', objKV: saleSummary})
                    this.updateTableRowSubData({view: 'saleView', index, objKV: sub})
                }
            }
        },
        handleSubmitClick() {
            if (this.badgeNum === 0 || this.saleView.form.isLoading) return
            let saleFormKeys = {
                action: {
                    isRequired: true,
                    str: '操作类型'
                },
                product: {
                    isRequired: true,
                    str: '商品信息'
                }
            }
            const {action} = this.saleView.form
            if (action === 1) {
                saleFormKeys.supplierRef = {isRequired: true, str: '供应商信息'}
            } else {
                saleFormKeys.customerRef = {isRequired: true, str: '客户信息'}
                saleFormKeys.driverRef = {isRequired: false, str: '司机信息'}
                saleFormKeys.deliveryFee = {isRequired: false, str: '运费'}
            }
            const {saleSummary} = this.saleView
            let product = {}
            for (const productId in saleSummary) {
                const {sub} = saleSummary[productId]
                for (const productShelfKey in sub) {
                    const {operateWeight, totalPrice} = sub[productShelfKey]
                    product[productShelfKey] = {operateWeight, totalPrice}
                }
            }
            this.saleView.form.product = product
            handleSubmitForm(this, 'saleView', saleFormKeys)
        }
    },
    computed: {
        ...mapState(['saleView', 'productView', 'shelfView', 'saleHistoryView', 'dashboardView']),
        badgeNum: function () {
            return Object.keys(this.saleView.saleSummary).length
        },
        columns: function () {
            const arr = ['货号', '颜色', '图片', '名称', '价格', '库房', '货架', '原剩余(kg)', '出数量(kg)', '总价格', '变更后(kg)', '操作']
            if (this.saleView.form.action === 1) arr[8] = '入数量(kg)'
            return arr
        },
        driver: function () {
            if (this.saleView.form.action === 2) return this.saleView.form.driverSelectedValue.text ? `${this.saleView.form.driverSelectedValue.text}` : '未选择'
            return ''
        },
        supplierNameOrCustomer: function () {
            if (this.saleView.form.action === 1) {
                return this.saleView.form.supplierSelectedValue.text ? `供应商：${this.saleView.form.supplierSelectedValue.text}` : '供应商：未选择'
            } else {
                return this.saleView.form.customerSelectedValue.text ? `客户：${this.saleView.form.customerSelectedValue.text}` : '客户：未选择'
            }
        },
        totalPrice: function () {
            let totalPrice = 0
            for (const key in this.saleView.saleSummary) {
                const productSub = this.saleView.saleSummary[key]
                for (const subKey in productSub.sub) {
                    totalPrice += productSub.sub[subKey].totalPrice
                }
            }
            return isNaN(totalPrice) ? 0 : totalPrice
        },
        baseImageUrl: function () {
            return baseUrl + '/images/'
        }
    }
}
</script>

<style scoped>
.icon-summary {
    font-size: 1.5rem;
    position: fixed;
    bottom: 5%;
    box-shadow: 5px 5px 15px;
    border-radius: 50px;
    opacity: 0.5;
    transition: .5s all;
    cursor: pointer;
    left: 50%;
    width: 450px;
    z-index: 1000;
}

@media (min-width: 768px) {
    .icon-summary {
        margin-left: -100px;
    }
}

@media (max-width: 767.98px) {
    .icon-summary {
        margin-left: 0;
        left: 0;
        width: 100%;
    }
}

.icon-summary:hover {
    opacity: 1;
}

.icon-summary:hover + #my-badge {
    transform: translateY(-1px);
    opacity: 1;
}

#my-badge {
    position: fixed;
    right: 1%;
    bottom: 11%;
    font-size: 40px;
    border-radius: 25px;
    width: 50px;
    -webkit-transition: .5s all;
    transition: .5s all;
    opacity: .5;
}

.list-group-item p {
    margin-bottom: 0;
    font-weight: bold;
}

</style>
