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
            <base-table
                class="table align-items-center table-flush"
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
                        <v-select
                            :searchable=true
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
                        <del v-if="row.isDeleted">{{ row.warehouse }}</del>
                        <base-input
                            v-else
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
                        <del v-if="row.isDeleted">{{ row.relatedShelfCount }}</del>
                        <p v-else>{{ row.relatedShelfCount }}</p>
                    </td>
                    <td class="text-center">
                        <div v-if="row.isDeleted">
                            <base-button
                                type="success" :outline="true"
                                :row-id="row.row" size="sm"
                                :disabled="row.status === 2"
                                @click="showModalSingle('restore', row.row)">
                                <b-spinner small type="grow" v-if="row.status === 2"/>
                                恢复
                            </base-button>
                        </div>
                        <div v-else>
                            <base-button
                                type="primary" :outline="true"
                                :row-id="row.row" size="sm"
                                :disabled="row.status !== 1"
                                @click="handleEditClick">
                                <b-spinner small type="grow" v-if="row.status === 2"/>
                                更新
                            </base-button>
                            <base-button
                                type="warning" :outline="true"
                                :row-id="row.row" size="sm"
                                :disabled="row.status === 2"
                                @click="showModalSingle('softDelete', row.row)">
                                <b-spinner small type="grow" v-if="row.status === 2"/>
                                删除
                            </base-button>
                        </div>
                    </td>
                </template>
            </base-table>
            <common-modal :modals="modals" :handle-modal-confirm-click="handleModalConfirmClick"/>
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
    handleGetTableData,
    handleUpdateTableRow,
    handleSubmitTableRow,
    handleSelectedValueChange, handleShowConfirmModal, handleModalConfirmClick
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
            view: 'warehouseView',
            arrOperatingRows: [],
            modals: {
                objConfig: {},
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
        ...mapActions(['getTable', 'updateViewComponent', 'updateTableRowData', 'submitUpdateData', 'submitDeleteId', 'submitUpdateDeleteMarker', "updateCommonSelectSubValue", "increaseRequestingTasksCount", "decreaseRequestingTasksCount"]),
        showModalSingle(mode, index) {
            this.arrOperatingRows = [index]
            const objTmp = {
                restore: {
                    header: '确定是否恢复该条信息？',
                    heading: '正在恢复一条库房信息',
                },
                softDelete: {
                    header: '确定是否删除该条信息？',
                    heading: '正在删除一条库房信息'
                }
            }
            const {data} = this.warehouseView.table
            objTmp.body = `库房名称：${data[index].warehouse}。相关货架数量：${data[index].relatedShelfCount}`
            handleShowConfirmModal(this, mode, objTmp)
        },
        requestTableData() {
            handleGetTableData(this)
        },
        getInput(index, value) {
            handleUpdateTableRow(this, index, 'warehouse', value)
        },
        handleEditClick(e, index) {
            handleSubmitTableRow(this, index, ['warehouse'])
        },
        handleModalConfirmClick() {
            handleModalConfirmClick(this)
        },
        changePage(value) {
            handleChangePage(this, value)
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
        }
    },
    watch: {
        'warehouseView.table.select.selectedValue.value': {
            handler: function (newVal, oldVal) {
                handleSelectedValueChange(newVal, oldVal, this, 'warehouseView')
            }
        }
    }
}
</script>

<style scoped>
</style>
