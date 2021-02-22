<template>
    <div class="card">
        <div class="card-header border-0">
            <div class="row align-items-center">
                <div class="col">
                    <h3 class="mb-0">本年度收货总重前五客户</h3>
                </div>
<!--                <div class="col text-right">-->
<!--                    <a href="#!" class="btn btn-sm btn-primary">See all</a>-->
<!--                </div>-->
            </div>
        </div>

        <div class="table-responsive">
            <base-table
                class="table align-items-center table-flush"
                thead-classes="thead-light"
                tbody-classes="list"
                :is-loading="dashboardView.table.isLoading"
                :data="dashboardView.table.data.objCustomerInWeight"
                :column-length="2"
                :rows-length="5"
                :columns="['客户姓名', '收货总重(KG)']"
            >
                <template slot-scope="{row}">
                    <th scope="row">
                        {{ row.name }}
                    </th>
                    <td>
                        {{ row.totalWeight }}
                    </td>
<!--                    <td>-->
<!--                        {{ row.unique }}-->
<!--                    </td>-->
<!--                    <td>-->
<!--                        <i class="fas fa-arrow-up text-success mr-3"-->
<!--                           :class="row.bounceRateDirection === 'up' ? 'text-success': 'text-danger'">-->
<!--                        </i>-->
<!--                        {{ row.bounceRate }}-->
<!--                    </td>-->
                </template>

            </base-table>
        </div>

    </div>
</template>
<script>
import {mapState} from "vuex";

export default {
    name: 'page-visits-table',
    computed: {
        ...mapState(['dashboardView'])
    }
}
</script>
<style>
</style>
