<template>
    <div>
        <div class="card-columns" style="margin-top: 20px;" v-show="saleView.table.isLoading">
            <IsLoadingProductInfoCard v-for="(index) in tableSize" :key="'loadingCard' + index"/>
        </div>
        <div class="card-columns" style="margin-top: 20px;" v-show="!saleView.table.isLoading">
            <SaleProductInfoCard v-for="(item, index) in saleView.table.data" :item="item" :index="index"
                                 :key="index"/>
            <div style="clear: both; height: 0;"></div>
        </div>
        <div class="card-footer d-flex justify-content-end">
            <base-pagination :per-page="perPage" :total=tableDataCount :value=currentPage @input="changePage"/>
        </div>
        <SaleSummaryModal/>
    </div>
</template>

<script>

import {mapActions, mapState} from "vuex";
import {handleChangePage} from "@/functions";
import SaleProductInfoCard from "@/components/MyComponents/SaleProductInfoCard";
import IsLoadingProductInfoCard from "@/components/MyComponents/isLoadingProductInfoCard";
import SaleSummaryModal from "@/components/MyComponents/SaleSummaryModal";

export default {
    name: "SaleProductTable",
    components: {
        SaleSummaryModal,
        IsLoadingProductInfoCard,
        SaleProductInfoCard,
    },
    computed: {
        ...mapState(['commonView', 'saleView']),
        tableSize: function () {
            return this.saleView.table.data.length === 0 ? 18 : this.saleView.table.data.length
        },
        tableDataCount: function () {
            return this.saleView.table.dataCount
        },
        currentPage: function () {
            return this.saleView.table.queryCondition.currentPageCount
        },
        perPage: function () {
            return this.saleView.table.perPage
        },
    },
    methods: {
        ...mapActions(['increaseRequestingTasksCount', 'updateViewComponent']),
        changePage(value) {
            handleChangePage(this, 'saleView', value)
        },
    }
}
</script>
