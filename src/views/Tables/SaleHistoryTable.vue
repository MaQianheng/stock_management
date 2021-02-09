<template>
    <div class="card shadow"
         :class="type === 'dark' ? 'bg-default': ''">
        <div class="card-header border-0"
             :class="type === 'dark' ? 'bg-transparent': ''">
            <div class="row align-items-center">
                <div class="col">
                    <h3 class="mb-0" :class="type === 'dark' ? 'text-white': ''">
                        {{ title }}
                    </h3>
                </div>
            </div>
            <SaleHistoryFilter/>
        </div>

        <div class="table-responsive">
            <b-skeleton-table
                v-if="saleHistoryView.table.isLoading"
                :rows="10"
                :columns="columns.length"
                :table-props="{ bordered: true, striped: true }"
            ></b-skeleton-table>
            <table class="table b-table tablesorter table align-items-center table-flush" v-else>
                <thead class="thead-light">
                <tr>
                    <th style="z-index: 999;" class="sticky-top" v-for="column in columns" :key="column">{{ column }}
                    </th>
                </tr>
                </thead>
                <tbody class="list" style="max-height: 100vh;">
                <template v-for="(item, index) in saleHistoryView.table.arrData">
                    <tr :key="index">
                        <td>{{ timeStampToDateTime(item.createdTimeStamp) }}</td>
                        <td :style="fromActionNumberToActionStyle(item.action)">
                            {{ inOrOut(item.action) }}
                        </td>
                        <td>{{ item.totalCount }}</td>
                        <td>{{ item.totalWeight }}</td>
                        <td>{{ item.totalPrice }}</td>
                        <td>{{ item.operatorName }}</td>
                        <td>
                            <p>车牌：{{ item.driverRef ? item.driverRef.plate : '/'}}</p>
                            <p>司机：{{ item.driverRef ? item.driverRef.name : '/'}}</p>
                        </td>
                        <td>{{ item.deliveryFee ? item.deliveryFee : '/' }}</td>
                        <td>{{ item.supplierName ? item.supplierName : '/' }}</td>
                        <td>{{ item.customerName ? item.customerName : '/' }}</td>
                        <td>
                        <!-- index是index -->
                            <base-button type="info" :outline="true" size="sm"
                                         @click="handleShowDetailClick(index)">
                                详情
                            </base-button>
                        </td>
                    </tr>
                </template>
                </tbody>
            </table>
        </div>

        <div class="card-footer d-flex justify-content-end"
             :class="type === 'dark' ? 'bg-transparent': ''">
            <base-pagination :per-page="perPage" :total=tableDataCount :value=currentPage @input="changePage"/>
        </div>
    </div>
</template>

<script>

import SaleHistoryFilter from "@/components/MyComponents/SaleHistoryFilter";
import {mapActions, mapState} from "vuex";
import {handleChangePage} from "@/functions";
import {getDateTime} from "@/functions/utils";

export default {
    name: "HistoryTable",
    components: {
        SaleHistoryFilter,
        // SaleDetailModal,
    },
    data: () => (
        {
            columns: ['时间', '出/入库', '总商品数目', '总商品重量(KG)', '总商品价格', '操作人', '司机', '运费', '供应商', '客户', '操作']
        }
    ),
    props: {
        type: {
            type: String
        },
        title: String
    },
    methods: {
        ...mapActions(['increaseRequestingTasksCount', 'updateViewComponent']),
        inOrOut(num) {
            return num === 0 ? '入库' : '出库'
        },
        fromActionNumberToActionStyle(num) {
            return num === 0 ? 'color: #fb6340;' : 'color: #5e72e4;'
        },
        handleShowDetailClick(index) {
            const {saleDetail} = this.saleHistoryView
            saleDetail.isShow = true
            saleDetail.objData = this.saleHistoryView.table.arrData[index]
            this.updateViewComponent({view: 'saleHistoryView', component: 'saleDetail', objKV: saleDetail})
        },
        changePage(value) {
            handleChangePage(this, 'saleHistoryView', value)
        },
        timeStampToDateTime(timeStamp) {
            return getDateTime(timeStamp)
        }
    },
    computed: {
        ...mapState(['saleHistoryView']),
        rowsLength: function () {
            const {length} = Object.keys(this.saleHistoryView.table.objData)
            return length === 0 ? 10 : length
        },
        tableDataCount: function () {
            return this.saleHistoryView.table.dataCount
        },
        currentPage: function () {
            return this.saleHistoryView.table.queryCondition.currentPageCount
        },
        perPage: function () {
            return this.saleHistoryView.table.perPage
        },
        modalHeader: function () {
            return `正在删除一条颜色信息`
        }
        // modalContent: function () {
        //     const {dataSource} = this.modals
        //     return `颜色名称：${dataSource.color}。相关商品数量（不会删除相关商品信息）：${dataSource.relatedProductCount}`
        // }
    }
}
</script>

<style scoped>

</style>
