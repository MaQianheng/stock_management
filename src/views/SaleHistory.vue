<template>
    <div>
        <SaleHistoryHeader/>
        <slide-x-left-transition :duration="50">
            <div v-show="!saleHistoryView.saleDetail.isShow">
                <div class="container-fluid mt--7">
                    <HistoryTable title="出入库记录"/>
                </div>
            </div>
        </slide-x-left-transition>
        <slide-x-right-transition :duration="500">
            <div v-show="saleHistoryView.saleDetail.isShow">
<!--                <SaleHistoryHeader/>-->
                <div class="container-fluid mt--7">
                    <SaleHistoryDetail/>
                </div>
            </div>
        </slide-x-right-transition>
    </div>
</template>

<script>
import HistoryTable from "@/views/Tables/SaleHistoryTable";
import {SlideXLeftTransition, SlideXRightTransition} from 'vue2-transitions'
import {mapState} from "vuex";
import SaleHistoryHeader from "@/components/MyComponents/SaleHistoryHeader";
import SaleHistoryDetail from "@/components/MyComponents/SaleHistoryDetail";

export default {
    name: "History",
    components: {
        SaleHistoryDetail,
        SaleHistoryHeader,
        HistoryTable,
        SlideXLeftTransition,
        SlideXRightTransition
    },
    computed: {
        ...mapState(['saleHistoryView'])
    }
}
</script>

<style scoped>

</style>
