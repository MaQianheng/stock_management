<template>
    <div class="card">
        <div class="card-header border-0">
            <div class="row align-items-center">
                <div class="col">
                    <h3 class="mb-0">本年度出库入库占比前五</h3>
                </div>
<!--                <div class="col text-right">-->
<!--                    <base-button size="sm" type="primary">See all</base-button>-->
<!--                </div>-->
            </div>
        </div>

        <div class="table-responsive">
            <base-table
                class="table align-items-center table-flush"
                thead-classes="thead-light"
                tbody-classes="list"
                :is-loading="dashboardView.table.isLoading"
                :data="dashboardView.table.data.objProductInOutWeight"
                :column-length="3"
                :rows-length="5"
                :columns="['货号', '名称', '出库总重(KG)', '入库总重(KG)', '出入库占比']"
            >
                <template slot-scope="{row}">
                    <th scope="row">
                        {{ row.code }}
                    </th>
                    <td>
                        {{ row.name }}
                    </td>
                    <td>
                        {{ row.out }}
                    </td>
                    <td>
                        {{ row.in }}
                    </td>
                    <td>
                        <div class="d-flex align-items-center">
                            <span class="mr-2">{{ row.inOutPercentage}}%</span>
                            <base-progress :type="funcComputeProgressType(row.inOutPercentage)"
                                           class="pt-0"
                                           :show-percentage="false"
                                           :value="Number(row.inOutPercentage)"
                            />
                        </div>
                    </td>
                </template>

            </base-table>
        </div>

    </div>
</template>
<script>
import {mapState} from "vuex";

export default {
    name: 'social-traffic-table',
    methods: {
        funcComputeProgressType(percentage) {
            if (percentage > 80) return 'success'
            if (percentage > 60) return 'primary'
            if (percentage > 40) return 'info'
            if (percentage > 20) return 'warning'
            return 'danger'
        }
    },
    computed: {
        ...mapState(['dashboardView']),
    }
}
</script>
<style>
</style>
