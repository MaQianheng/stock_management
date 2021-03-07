<template>
    <div class="card shadow"
         :class="type === 'dark' ? 'bg-default': ''">
        <div class="table-responsive">
            <base-table class="table align-items-center table-flush"
                        :class="type === 'dark' ? 'table-dark': ''"
                        :thead-classes="type === 'dark' ? 'thead-dark': 'thead-light'"
                        tbody-classes="list"
                        :data="colorView.table.data"
                        :is-loading="colorView.table.isLoading"
                        :column-length="3"
                        :rows-length="rowsLength"
            >
                <template slot="columns">
                    <th>
                        <v-select :searchable=true
                                  :options="commonView.colorSelectAll.data"
                                  v-model="colorView.select.selectedValue"
                                  :labelSearchPlaceholder="commonView.labelSearchPlaceholder"
                                  :disabled="colorView.table.isLoading || commonView.colorSelect.isLoading"
                        />
                    </th>
                    <th>对应商品数量</th>
                    <th style="width: 200px;">操作</th>
                </template>
                <template slot-scope="{row}">
                    <td>
                        <del v-if="row.isDeleted">{{ row.color }}</del>
                        <base-input
                            v-else
                            alternative=""
                            style="margin-bottom: 0"
                            placeholder="颜色"
                            input-classes="form-control-alternative"
                            :name="row.row"
                            v-model="row.color"
                            @input="getInput"
                            :disabled="row.status === 2"
                            @keyup.enter="handleEditClick('', row.row)"
                        />
                    </td>
                    <td>
                        <del v-if="row.isDeleted">{{ row.relatedProductCount }}</del>
                        <p v-else>{{ row.relatedProductCount }}</p>
                    </td>
                    <td class="text-center">
                        <div v-if="row.isDeleted">
                            <base-button type="success" :outline="true"
                                         :row-id="row.row" size="sm"
                                         :disabled="row.status === 2"
                                         @click="showModalSingle('restore', row.row)">
                                <b-spinner small type="grow" v-if="row.status === 2"/>
                                恢复
                            </base-button>
                        </div>
                        <div v-else>
                            <base-button type="primary" :outline="true"
                                         :row-id="row.row" size="sm"
                                         :disabled="row.status !== 1"
                                         @click="handleEditClick">
                                <b-spinner small type="grow" v-if="row.status === 2"/>
                                更新
                            </base-button>
                            <base-button type="warning" :outline="true"
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
import {mapState, mapActions} from 'vuex'
import {
    handleChangePage,
    handleGetTableData,
    handleUpdateTableRow,
    handleSubmitTableRow, handleSelectedValueChange, handleShowConfirmModal, handleModalConfirmClick,
} from "@/functions"

export default {
    name: "ColorTable",
    components: {
        VSelect
    },
    data: () => (
        {
            view: 'colorView',
            arrOperatingRows: [],
            modals: {
                objConfig: {},
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
        ...mapActions(['getTable', 'updateViewComponent', 'updateTableRowData', 'submitUpdateData', 'submitDeleteId', 'submitUpdateDeleteMarker', "updateCommonSelectSubValue", "increaseRequestingTasksCount", "decreaseRequestingTasksCount"]),
        showModalSingle(mode, index) {
            this.arrOperatingRows = [index]
            const objTmp = {
                restore: {
                    header: '确定是否恢复该条信息？',
                    heading: '正在恢复一条颜色信息',
                },
                softDelete: {
                    header: '确定是否删除该条信息？',
                    heading: '正在删除一条颜色信息'
                }
            }
            const {data} = this.colorView.table
            objTmp.body = `颜色名称：${data[index].color}。相关商品数量：${data[index].relatedProductCount}`
            handleShowConfirmModal(this, mode, objTmp)
        },
        requestTableData() {
            handleGetTableData(this)
        },
        getInput(index, value) {
            handleUpdateTableRow(this, index, 'color', value)
        },
        handleEditClick(e, index) {
            handleSubmitTableRow(this, index, ['color'])
        },
        handleModalConfirmClick() {
            handleModalConfirmClick(this)
        },
        changePage(value) {
            handleChangePage(this, value)
        },
    },
    computed: {
        ...mapState(["colorView", "commonView"]),
        rowsLength: function () {
            return this.colorView.table.data.length === 0 ? 10 : this.colorView.table.data.length
        },
        tableDataCount: function () {
            return this.colorView.table.dataCount
        },
        currentPage: function () {
            return this.colorView.table.queryCondition.currentPageCount
        },
        perPage: function () {
            return this.colorView.table.perPage
        }
    },
    watch: {
        "colorView.select.selectedValue.value": {
            handler: function (newVal, oldVal) {
                handleSelectedValueChange(newVal, oldVal, this, 'colorView')
            }
        }
    }
}
</script>

<style scoped>
.modal-header {
    background: linear-gradient(87deg, #f5365c 0, #f56036 100%) !important;
}
</style>
