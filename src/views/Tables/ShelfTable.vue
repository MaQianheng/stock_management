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
        </div>

        <div class="table-responsive" style="max-height: 1000px;">
            <b-skeleton-table
                v-if="shelfView.table.isLoading"
                :rows="rowsLength"
                :columns="6"
                :table-props="{ bordered: true, striped: true }"
            ></b-skeleton-table>
            <table class="table b-table tablesorter table align-items-center table-flush" v-else>
                <thead class="thead-light">
                <tr>
                    <th>
                        <v-select :searchable=true
                                  :options="commonView.warehouseSelectAll.data"
                                  v-model="shelfView.table.select.selectedValue"
                                  :labelSearchPlaceholder="commonView.labelSearchPlaceholder"
                                  :disabled="commonView.warehouseSelect.isLoading"
                        />
                    </th>
                    <th>相关货架数量</th>
                    <th>货架</th>
                    <th>相关商品数量</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody class="list">
                <template v-for="(item, index) in shelfView.table.data">
                    <tr v-for="(sub, i) in item.sub" :key="index + '_' + i">
                        <td v-if="i===0" :rowspan="item.sub.length">
                            {{ item.warehouseName }}
                        </td>
                        <td v-if="i===0" :rowspan="item.sub.length">
                            {{ item.relatedShelfCount }}
                        </td>
                        <td>
                            <base-input
                                alternative=""
                                style="margin-bottom: 0"
                                placeholder="货架"
                                input-classes="form-control-alternative"
                                :name="index + '_' + i"
                                v-model="sub.shelfName"
                                @input="getInput"
                                :disabled="item.status === 2"
                                @keyup.enter="handleEditClick('', index + '_' + i)"
                            />
                        </td>
                        <td>{{ sub.relatedProductCount }}</td>
                        <td>
                            <base-button :type="sub.status === 0 ? 'primary' : 'warning'" :outline="true"
                                         :row-id="index + '_' + i" size="sm"
                                         :disabled="sub.status !== 1"
                                         @click="handleEditClick">
                                <b-spinner small type="grow" v-if="sub.status === 2"/>
                                更新
                            </base-button>
                            <base-button type="danger" :outline="true"
                                         :row-id="index + '_' + i" size="sm"
                                         :disabled="sub.status === 2"
                                         @click="handleDeleteClick">
                                <b-spinner small type="grow" v-if="sub.status === 2"/>
                                删除
                            </base-button>
                        </td>
                    </tr>
                </template>
                </tbody>
            </table>
            <modal :show.sync="modals.isShow"
                   gradient="danger"
                   modal-classes="modal-danger modal-dialog-centered">
                <h6 slot="header" class="modal-title" id="modal-title-notification">{{ modalHeader }}</h6>

                <div class="py-3 text-center">
                    <i class="ni ni-bell-55 ni-3x"></i>
                    <h4 class="heading mt-4">确定是否删除该条信息？</h4>
                    <p>{{ modalContent }}</p>
                </div>

                <template slot="footer">
                    <base-button type="danger" @click="handleConfirmClick">确定</base-button>
                    <base-button type="secondary" @click="modals.isShow = false">取消</base-button>
                </template>
            </modal>
        </div>
        <div class="card-footer d-flex justify-content-end"
             :class="type === 'dark' ? 'bg-transparent': ''">
            <base-pagination :per-page="perPage" :total=tableDataCount :value=currentPage @input="changePage"/>
        </div>
    </div>
</template>

<script>
import VSelect from '@alfsnd/vue-bootstrap-select'
import {
    handleChangePage,
    handleConfirmDeleteTableSubRow,
    handleDeleteTableSubRow,
    handleGetTableData,
    handleSubmitTableSubRow,
    handleUpdateTableSubRow,
    watchHandleSelectedValue,
} from "@/functions"
import {mapState, mapActions} from 'vuex'
import {BSkeletonTable} from 'bootstrap-vue'

export default {
    name: "ShelfTable",
    components: {
        VSelect,
        BSkeletonTable
    },
    data: () => (
        {
            arrDeleteRow: [],
            modals: {
                dataSource: {},
                isShow: false
            }
        }
    ),
    mounted() {
        // this.requestTableData()
    },
    props: {
        type: {
            type: String
        },
        title: String
    },
    methods: {
        ...mapActions(['getTable', 'updateViewComponent', 'updateTableSubRowData', 'submitUpdateData', 'submitDeleteId', "updateCommonSelectSubValue", "increaseRequestingTasksCount"]),
        requestTableData() {
            handleGetTableData(this, 'shelfView')
        },
        getInput(index, value) {
            handleUpdateTableSubRow(this, 'shelfView', index, 'shelfName', value)
        },
        handleEditClick(e, index) {
            handleSubmitTableSubRow(this, 'shelfView', index, ['shelfName'])
        },
        handleDeleteClick(e, index) {
            handleDeleteTableSubRow(this, 'shelfView', index)
        },
        handleConfirmClick() {
            handleConfirmDeleteTableSubRow(this, 'shelfView')
        },
        changePage(value) {
            handleChangePage(this, 'shelfView', value)
        },
    },
    computed: {
        ...mapState(["warehouseView", "shelfView", "commonView"]),
        rowsLength: function () {
            return this.shelfView.table.data.length === 0 ? 10 : this.shelfView.table.data.length
        },
        tableDataCount: function () {
            return this.shelfView.table.dataCount
        },
        currentPage: function () {
            return this.shelfView.table.queryCondition.currentPageCount
        },
        perPage: function () {
            return this.shelfView.table.perPage
        },
        modalHeader: function () {
            return `正在删除一条货架信息`
        },
        modalContent: function () {
            const {dataSource} = this.modals
            return `货架名称：${dataSource.shelfName}。相关商品数量：${dataSource.relatedProductCount}`
        }
    },
    watch: {
        'shelfView.table.select.selectedValue.value': {
            handler: function (newVal, oldVal) {
                watchHandleSelectedValue(newVal, oldVal, this, 'shelfView')
            }
        }
    }
}
</script>

<style scoped>

</style>
