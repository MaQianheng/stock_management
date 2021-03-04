<template>
    <div class="card shadow">
        <div class="card-header bg-transparent">
            <base-button type="primary" icon="ni ni-bold-left" @click="handleClick">返回</base-button>
        </div>
        <div class="card-body">
            <b-list-group>
                <b-list-group-item>创建时间：{{
                        saleHistoryView.saleDetail.objData.createdTimeStamp | timeStampToDateTime
                    }}
                </b-list-group-item>
                <b-list-group-item variant="light">出/入库：{{
                        saleHistoryView.saleDetail.objData.action | actionText
                    }}
                </b-list-group-item>
                <b-list-group-item>总商品数目：{{ saleHistoryView.saleDetail.objData.totalCount }}</b-list-group-item>
                <b-list-group-item variant="light">总商品重量：{{
                        saleHistoryView.saleDetail.objData.totalWeight
                    }}
                </b-list-group-item>
                <b-list-group-item>总商品价格：{{ saleHistoryView.saleDetail.objData.totalPrice }}</b-list-group-item>
                <b-list-group-item variant="light">操作人：{{
                        saleHistoryView.saleDetail.objData.operatorName
                    }}
                </b-list-group-item>
                <b-list-group-item>{{ supplierOrCustomer }}</b-list-group-item>
                <b-list-group-item v-if="action === 2" variant="light">{{ driver }}</b-list-group-item>
                <b-list-group-item v-if="action === 2">运费：{{ saleHistoryView.saleDetail.objData.deliveryFee }}
                </b-list-group-item>
            </b-list-group>
        </div>
        <div class="card-footer table-responsive">
            <table class="table b-table tablesorter table align-items-center table-flush">
                <thead class="thead-light">
                <tr>
                    <th style="z-index: 999;" class="sticky-top" v-for="column in columns" :key="column">{{
                            column
                        }}
                    </th>
                </tr>
                </thead>
                <tbody class="list">
                <template v-for="(item) in this.saleHistoryView.saleDetail.objData.product">
                    <tr v-for="(subItem, subIndex) in item.order" :key="subItem.orderRef">
                        <td v-if="subIndex===0" :rowspan="item.order.length">{{ item.productCode }}</td>
                        <td v-if="subIndex===0" :rowspan="item.order.length">{{ item.productName }}</td>
                        <td v-if="subIndex===0" :rowspan="item.order.length">{{ item.color }}</td>
                        <td v-if="subIndex===0" :rowspan="item.order.length">
                            <div class="align-items-center">
                                <ImageZoomModal :image-src="imageSrc(item.imageURLs)" image-height="120px;"/>
                            </div>
                        </td>
                        <td>{{ warehouse(subItem.shelfRef._id) }}</td>
                        <td>{{ shelf(subItem.shelfRef._id) }}</td>
                        <td>{{ subItem.oriWeight }}</td>
                        <td>{{ subItem.operateWeight }}</td>
                        <td>{{ subItem.afterOperateWeight }}</td>
                        <td>{{ subItem.remainingWeight }}</td>
                        <td>{{ subItem.price }}</td>
                    </tr>
                </template>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import {mapActions, mapState} from "vuex";
import {baseUrl} from "@/api";
import ImageZoomModal from "@/components/MyComponents/ImageZoomModal";

export default {
    name: "SaleHistoryDetail",
    components: {ImageZoomModal},
    methods: {
        ...mapActions(['updateViewComponent']),
        handleClick() {
            const {saleDetail} = this.saleHistoryView
            saleDetail.isShow = false
            this.updateViewComponent({view: 'saleHistoryView', component: 'saleDetail', objKV: saleDetail})
        },
        warehouse(shelfId) {
            return this.commonView.cascadingWarehouseShelfSelect.data.objShelfWarehouseKV[shelfId].warehouseRef.text
        },
        shelf(shelfId) {
            return this.commonView.cascadingWarehouseShelfSelect.data.objShelfWarehouseKV[shelfId].shelfRef.text
        },
        imageSrc: function (imageURLs) {
            if (imageURLs[0]) {
                return `${baseUrl}/images/${imageURLs[0]}`
            }
            return `${baseUrl}/images/product_default.jpeg`
        }
    },
    computed: {
        ...mapState(['commonView', 'saleHistoryView']),
        action: function () {
            const {objData} = this.saleHistoryView.saleDetail
            return objData.action
        },
        columns: function () {
            const arr = ['货号', '商品名称', '颜色', '图片', '库房', '货架', '原剩余(kg)', '出库重量(kg)', '变更后(kg)', '现剩余(kg)', '价格']
            if (this.action === 1) arr[7] = '入库重量(kg)'
            return arr
        },
        supplierOrCustomer: function () {
            const {objData} = this.saleHistoryView.saleDetail
            return this.action === 1 ? `供应商：${objData.supplierName}` : `客户：${objData.customerName}`
        },
        driver: function () {
            const {objData} = this.saleHistoryView.saleDetail
            if (objData) if (this.action === 2) return `司机：${objData.driverRef.name}，车牌：${objData.driverRef.plate}`
            return ''
        }
    }
}
</script>

<style scoped>

</style>
