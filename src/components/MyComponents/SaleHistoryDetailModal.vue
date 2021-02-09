<template>
    <div>
        <b-button v-b-modal="modalId" variant="info">详情</b-button>
        <b-modal :id="modalId" hide-footer centered :title="orderId + '订单详情'" @ok="handleOk">
            <b-list-group style="margin-bottom: 20px;">
                <b-list-group-item>
                    订单创建时间：{{ time }}
                </b-list-group-item>
                <b-list-group-item :style="fromActionNumberToActionStyle(action)">
                    本次操作：{{ fromActionNumberToActionString(action) }}
                </b-list-group-item>
                <b-list-group-item>
                    操作人：{{ operator }}
                </b-list-group-item>
            </b-list-group>
            <div class="table-responsive">
                <base-table class="table align-items-center table-flush"
                            :class="type === 'dark' ? 'table-dark': ''"
                            :thead-classes="type === 'dark' ? 'thead-dark': 'thead-light'"
                            tbody-classes="list"
                            :data="data">
                    <!--productName: '商品1',-->
                    <!--color: '红色',-->
                    <!--amount: 20,-->
                    <!--remainingAmount: 120,-->
                    <!--warehouse: 2,-->
                    <!--shelf: 6-->
                    <template slot="columns">
                        <th>货号</th>
                        <th>图片</th>
                        <th>名称</th>
                        <th>颜色</th>
                        <th>库房</th>
                        <th>货架</th>
                        <th>重量(KG)</th>
                        <th>剩余重量(KG)</th>
                    </template>
                    <template slot-scope="{row}">
                        <td>{{ row.productCode }}</td>
                        <td>
                            <div class="align-items-center">
                                <img alt="Image placeholder" :src="row.img" style="height: 120px">
                            </div>
                        </td>
                        <td>{{ row.productName }}</td>
                        <td>{{ row.color }}</td>
                        <td>{{ row.warehouse }}</td>
                        <td>{{ row.shelf }}</td>
                        <td>{{ row.weight }}</td>
                        <td>{{ row.remainingWeight }}</td>
                    </template>
                </base-table>
            </div>
        </b-modal>
    </div>
</template>

<script>
export default {
    name: "OrderDetailModal",
    props: {
        type: {
            type: String
        },
        time: {
            type: String
        },
        modalId: {
            type: String
        },
        orderId: {
            type: String
        },
        data: {
            type: Array
        },
        action: {
            type: Number
        },
        operator: {
            type: String
        }
    },
    methods: {
        handleOk() {
        },
        fromActionNumberToActionString(num) {
            return num === 0 ? '出库' : '入库'
        },
        fromActionNumberToActionStyle(num) {
            return num === 0 ? 'color: #5e72e4;' : 'color: #fb6340;'
        }
    }
}
</script>

<style scoped>
.modal-header {
    background: linear-gradient(87deg, #2dce89 0, #2dcecc 100%) !important;
}
</style>
