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
                        <base-input
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
                        {{ row.relatedProductCount }}
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
import {BSpinner} from 'bootstrap-vue'
import {mapState, mapActions} from 'vuex'
import {
    handleChangePage,
    handleConfirmDeleteTableRow,
    handleDeleteTableRow, handleGetTableData,
    handleUpdateTableRow,
    handleSubmitTableRow, watchHandleSelectedValue,
} from "@/functions"

// import {FadeTransition} from 'vue2-transitions'

export default {
    name: "ColorTable",
    components: {
        VSelect,
        BSpinner
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
        ...mapActions(['getTable', 'updateViewComponent', 'updateTableRowData', 'submitUpdateData', 'submitDeleteId', "updateCommonSelectSubValue", "increaseRequestingTasksCount"]),
        requestTableData() {
            handleGetTableData(this, 'colorView')
        },
        getInput(index, value) {
            handleUpdateTableRow(this, 'colorView', index, 'color', value)
        },
        handleEditClick(e, index) {
            handleSubmitTableRow(this, 'colorView', index, ['color'])
        },
        handleDeleteClick(e, index) {
            handleDeleteTableRow(this, 'colorView', index)
        },
        handleConfirmClick() {
            handleConfirmDeleteTableRow(this, 'colorView')
        },
        changePage(value) {
            handleChangePage(this, 'colorView', value)
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
        },
        modalHeader: function () {
            return `正在删除一条颜色信息`
        },
        modalContent: function () {
            const {dataSource} = this.modals
            return `颜色名称：${dataSource.color}。相关商品数量（不会删除相关商品信息）：${dataSource.relatedProductCount}`
        }
        // pokerHistory() {
        //     return this.bet.pokerHistory
        // }
        // watch: {
        //      pokerHistory: function() {}
        // }
    },
    watch: {
        "colorView.select.selectedValue.value": {
            handler: function (newVal, oldVal) {
                watchHandleSelectedValue(newVal, oldVal, this, 'colorView')
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
