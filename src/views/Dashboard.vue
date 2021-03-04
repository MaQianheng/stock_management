<template>
    <div>
        <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
            <!-- Card stats -->
            <div class="row">
                <div class="col-xl-6 col-lg-6">
                    <stats-card
                        title="本月入库总重"
                        type="gradient-orange"
                        :sub-title="inInfo.weight"
                        icon="ni ni-bold-right"
                        class="mb-4 mb-xl-0">

                        <template slot="footer">
                            <span :class="inInfo.percentageTagClass + ' mr-2'"><i
                                class="fa fa-arrow-up"></i>{{ inInfo.percentage }}%</span>
                            <span class="text-nowrap">同比上月{{ inInfo.status }}</span>
                        </template>
                    </stats-card>
                </div>
                <div class="col-xl-6 col-lg-6">
                    <stats-card
                        title="本月出库总重"
                        type="gradient-red"
                        :sub-title="outInfo.weight"
                        icon="ni ni-bold-left"
                        class="mb-4 mb-xl-0">

                        <template slot="footer">
                            <span :class="outInfo.percentageTagClass +  ' mr-2'"><i
                                class="fa fa-arrow-up"></i>{{ outInfo.percentage }}%</span>
                            <span class="text-nowrap">同比上月{{ outInfo.status }}</span>
                        </template>
                    </stats-card>
                </div>
                <!--                <div class="col-xl-3 col-lg-6">-->
                <!--                    <stats-card-->
                <!--                        title="Sales"-->
                <!--                        type="gradient-green"-->
                <!--                        sub-title="924"-->
                <!--                        icon="ni ni-money-coins"-->
                <!--                        class="mb-4 mb-xl-0">-->

                <!--                        <template slot="footer">-->
                <!--                            <span class="text-danger mr-2"><i class="fa fa-arrow-down"></i> 5.72%</span>-->
                <!--                            <span class="text-nowrap">同比上月</span>-->
                <!--                        </template>-->
                <!--                    </stats-card>-->

                <!--                </div>-->
                <!--                <div class="col-xl-3 col-lg-6">-->
                <!--                    <stats-card-->
                <!--                        title="Performance"-->
                <!--                        type="gradient-info"-->
                <!--                        sub-title="49,65%"-->
                <!--                        icon="ni ni-chart-bar-32"-->
                <!--                        class="mb-4 mb-xl-0">-->

                <!--                        <template slot="footer">-->
                <!--                            <span class="text-success mr-2"><i class="fa fa-arrow-up"></i> 54.8%</span>-->
                <!--                            <span class="text-nowrap">同比上月</span>-->
                <!--                        </template>-->
                <!--                    </stats-card>-->
                <!--                </div>-->
            </div>
        </base-header>

        <!--Charts-->
        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col-xl-8 mb-5 mb-xl-0">
                    <card type="default" header-classes="bg-transparent" style="height: 100%;">
                        <div slot="header" class="row align-items-center">
                            <div class="col">
                                <h6 class="text-light text-uppercase ls-1 mb-1">概览</h6>
                                <h5 class="h3 text-white mb-0">货物重量</h5>
                            </div>
                            <div class="col">
                                <ul class="nav nav-pills justify-content-end">
                                    <li class="nav-item mr-2 mr-md-0">
                                        <a class="nav-link py-2 px-3"
                                           href="#"
                                           :class="{active: bigLineChart.activeIndex === 1}"
                                           @click.prevent="initLineChart(1)">
                                            <span class="d-none d-md-block">入库</span>
                                            <span class="d-md-none">M</span>
                                        </a>
                                    </li>
                                    <li class="nav-item">
                                        <a class="nav-link py-2 px-3"
                                           href="#"
                                           :class="{active: bigLineChart.activeIndex === 2}"
                                           @click.prevent="initLineChart(2)">
                                            <span class="d-none d-md-block">出库</span>
                                            <span class="d-md-none">M</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <line-chart
                            :height="350"
                            ref="bigChart"
                            :chart-data="bigLineChart.chartData"
                            :extra-options="bigLineChart.extraOptions"
                        >
                        </line-chart>
                    </card>
                </div>

                <div class="col-xl-4">
                    <card header-classes="bg-transparent">
                        <div slot="header" class="row align-items-center">
                            <div class="col">
                                <h6 class="text-uppercase text-muted ls-1 mb-1">概览</h6>
                                <h5 class="h3 mb-0">库房/货架总商品重量</h5>
                            </div>
                            <div class="col">
                                <v-select
                                    :searchable=true
                                    :options="commonView.warehouseSelectAll.data"
                                    v-model="dashboardView.table.warehouseSelectedValue"
                                    :labelSearchPlaceholder="commonView.labelSearchPlaceholder"
                                    :disabled="commonView.warehouseSelect.isLoading"
                                />
                            </div>
                        </div>

                        <bar-chart
                            :height="350"
                            ref="barChart"
                            :chart-data="redBarChart.chartData"
                        >
                        </bar-chart>
                    </card>
                </div>
            </div>
            <!-- End charts-->

            <!--Tables-->
            <div class="row mt-5">
                <div class="col-xl-4">
                    <CustomerPurchaseProductTopFiveTable/>

                </div>
                <div class="col-xl-8 mb-5 mb-xl-0">
                    <ProductInOutWeightPercentageTopFiveTable/>
                </div>
            </div>
            <!--End tables-->
        </div>

    </div>
</template>
<script>
// Charts
import * as chartConfigs from '@/components/Charts/config';
import LineChart from '@/components/Charts/LineChart';
import BarChart from '@/components/Charts/BarChart';

// Tables
import ProductInOutWeightPercentageTopFiveTable from './Dashboard/ProductInOutWeightPercentageTopFiveTable';
import CustomerPurchaseProductTopFiveTable from './Dashboard/CustomerPurchaseProductTopFiveTable';
import {mapState} from "vuex";

import VSelect from '@alfsnd/vue-bootstrap-select'
import {sortChinese} from "@/functions/utils";

export default {
    components: {
        LineChart,
        BarChart,
        ProductInOutWeightPercentageTopFiveTable,
        CustomerPurchaseProductTopFiveTable,
        VSelect
    },
    data() {
        return {
            thisMonthIndex: new Date().getMonth(),
            monthLabels: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
            bigLineChart: {
                activeIndex: 1,
                chartData: {
                    datasets: [],
                    label: '重量',
                },
                extraOptions: chartConfigs.blueChartOptions,
            },

            redBarChart: {
                activeIndex: 0,
                chartData: {
                    labels: [],
                    datasets: []
                }
            }
        };
    },
    methods: {
        initLineChart(index) {
            this.bigLineChart.activeIndex = index;
            // 0: in, 1: out
            let data
            switch (index) {
                case 1:
                    data = this.dashboardView.table.data.arrMonthlyInTotalWeight
                    break
                case 2:
                    data = this.dashboardView.table.data.arrMonthlyOutTotalWeight
                    break
                default:
                    data = []
            }
            this.bigLineChart.chartData = {
                datasets: [
                    {
                        label: '重量',
                        data
                    }
                ],
                labels: this.monthLabels
            }
        },
        initBarChart(id) {
            // if id === 0 show all warehouse
            const {objWarehouseShelfProductWeight} = this.dashboardView.table.data
            const arrData = []
            const arrLabels = []
            if (id in objWarehouseShelfProductWeight) {
                const objWarehouseInfo = objWarehouseShelfProductWeight[id]
                const arrKeys = Object.keys(objWarehouseInfo).filter((item) => (item !== 'warehouseProductWeight' && item !== 'warehouseName'))
                arrKeys.sort((item1, item2) => (objWarehouseShelfProductWeight[id][item1].shelfName.localeCompare(objWarehouseShelfProductWeight[id][item2].shelfName, 'zh-CN'))).forEach((key) => {
                    arrData.push(objWarehouseShelfProductWeight[id][key].shelfProductWeight)
                    arrLabels.push(objWarehouseShelfProductWeight[id][key].shelfName)
                })
            } else {
                sortChinese(Object.keys(objWarehouseShelfProductWeight)).forEach((key) => {
                    arrData.push(objWarehouseShelfProductWeight[key].warehouseProductWeight)
                    arrLabels.push(objWarehouseShelfProductWeight[key].warehouseName)
                })
            }
            this.redBarChart.activeIndex = id;
            this.redBarChart.chartData = {
                datasets: [
                    {
                        label: '商品总重量',
                        data: arrData
                    }
                ],
                labels: arrLabels
            }
        },
        funcComputeSaleDiff(arr) {
            const obj = {
                'status': '持平',
                'percentageTagClass': 'text-primary',
                'percentage': '0'
            }
            if (this.prevMonthIndex === -1) return obj
            const thisMonthInWeight = arr[this.thisMonthIndex]
            const prevMonthInWeight = arr[this.prevMonthIndex]
            obj.weight = thisMonthInWeight + 'KG'
            if (thisMonthInWeight === prevMonthInWeight) return obj
            if (thisMonthInWeight > prevMonthInWeight) {
                obj.status = '增长'
                obj.percentageTagClass = 'text-success'
            } else {
                obj.status = '下降'
                obj.percentageTagClass = 'text-danger'
            }
            obj.percentage = (thisMonthInWeight - prevMonthInWeight) / (prevMonthInWeight === 0 ? 1 : prevMonthInWeight) * 100
            return obj
        }
    },
    computed: {
        ...mapState(["dashboardView", "commonView"]),
        prevMonthIndex() {
            if (this.thisMonthIndex === 0) return -1
            return this.thisMonthIndex - 1
        },
        inInfo() {
            return this.funcComputeSaleDiff(this.dashboardView.table.data.arrMonthlyInTotalWeight)
        },
        outInfo() {
            return this.funcComputeSaleDiff(this.dashboardView.table.data.arrMonthlyOutTotalWeight)
        }
    },
    watch: {
        "dashboardView.table.isLoading": {
            handler: function (newVal) {
                if (newVal === false) {
                    this.initLineChart(1)
                    this.initBarChart("0")
                }
            }
        },
        "dashboardView.table.warehouseSelectedValue.value": {
            handler: function (newVal) {
                this.initBarChart(newVal)
            }
        }
    },
    mounted() {
        this.bigLineChart.chartData.labels = this.monthLabels
        this.initLineChart(1)
        this.initBarChart("0")
    }
};
</script>
<style></style>
