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

        <div class="table-responsive">
            <base-table class="table align-items-center table-flush"
                        :class="type === 'dark' ? 'table-dark': ''"
                        :thead-classes="type === 'dark' ? 'thead-dark': 'thead-light'"
                        tbody-classes="list"
                        :data="warehouseView.table.data"
                        :is-loading="warehouseView.table.isLoading"
                        :column-length="3"
                        :rows-length="rowsLength"
            >
                <template slot="columns">
                    <th>
                        <v-select :searchable=true
                                  :options="commonView.warehouseSelectAll.data"
                                  v-model="warehouseView.table.select.selectedValue"
                                  :labelSearchPlaceholder="commonView.labelSearchPlaceholder"
                                  :disabled="commonView.warehouseSelect.isLoading"
                        />
                    </th>
                    <th>相关货架数量</th>
                    <th>操作</th>
                </template>
                <template slot-scope="{row}">
                    <td class="budget">
                        <base-input
                            alternative=""
                            style="margin-bottom: 0"
                            placeholder="库房"
                            input-classes="form-control-alternative"
                            :name="row.row"
                            v-model="row.warehouse"
                            @input="getInput"
                            :disabled="row.status === 2"
                            @keyup.enter="handleEditClick('', row.row)"
                        />
                    </td>
                    <td>
                        {{ row.relatedShelfCount }}
                    </td>
                    <td class="text-center">
                        <base-button :type="row.status === 0 ? 'primary' : 'warning'" :outline="true"
                                     :row-id="row.row" size="sm"
                                     :disabled="row.status !== 1"
                                     @click="handleEditClick">
                            <b-spinner small type="grow" v-if="row.status === 2"/>
                            更新
                        </base-button>
                        <base-button type="danger" :outline="true"
                                     :row-id="row.row" size="sm"
                                     :disabled="row.status === 2"
                                     @click="handleDeleteClick">
                            <b-spinner small type="grow" v-if="row.status === 2"/>
                            删除
                        </base-button>
                    </td>
                </template>
            </base-table>
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
import {mapActions, mapState} from 'vuex'
import {
    handleChangePage,
    handleDeleteTableRow, handleGetTableData,
    handleUpdateTableRow,
    handleSubmitTableRow,
    handleConfirmDeleteTableRow, watchHandleSelectedValue
} from "@/functions";

export default {
    name: "WarehouseTable",
    components: {
        VSelect
    },
    mounted() {
        // this.requestTableData()
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
    props: {
        type: {
            type: String
        },
        title: String
    },
    methods: {
        ...mapActions(['getTable', 'updateViewComponent', 'updateTableRowData', 'submitUpdateData', 'submitDeleteId', "updateCommonSelectSubValue", "increaseRequestingTasksCount"]),
        requestTableData() {
            handleGetTableData(this, 'warehouseView')
        },
        getInput(index, value) {
            handleUpdateTableRow(this, 'warehouseView', index, 'warehouse', value)
        },
        handleEditClick(e, index) {
            handleSubmitTableRow(this, 'warehouseView', index, ['warehouse'])
        },
        handleDeleteClick(e, index) {
            handleDeleteTableRow(this, 'warehouseView', index)
        },
        handleConfirmClick() {
            handleConfirmDeleteTableRow(this, 'warehouseView')
        },
        changePage(value) {
            handleChangePage(this, 'warehouseView', value)
        }
    },
    computed: {
        ...mapState(["warehouseView", 'shelfView', "commonView"]),
        rowsLength: function () {
            return this.warehouseView.table.data.length === 0 ? 5 : this.warehouseView.table.data.length
        },
        tableDataCount: function () {
            return this.warehouseView.table.dataCount
        },
        currentPage: function () {
            return this.warehouseView.table.queryCondition.currentPageCount
        },
        perPage: function () {
            return this.warehouseView.table.perPage
        },
        modalHeader: function () {
            return `正在删除一条库房信息`
        },
        modalContent: function () {
            const {dataSource} = this.modals
            return `库房名称：${dataSource.warehouse}。相关货架数量：${dataSource.relatedShelfCount}`
        }
    },
    watch: {
        'warehouseView.table.select.selectedValue.value': {
            handler: function (newVal, oldVal) {
                watchHandleSelectedValue(newVal, oldVal, this, 'warehouseView')
            }
        }
    }
}
</script>

<style scoped>
</style>
