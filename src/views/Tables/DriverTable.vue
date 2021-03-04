<template>
    <div class="card shadow"
         :class="type === 'dark' ? 'bg-default': ''">
        <div class="table-responsive">
            <base-table
                class="table align-items-center table-flush"
                :class="type === 'dark' ? 'table-dark': ''"
                :thead-classes="type === 'dark' ? 'thead-dark': 'thead-light'"
                tbody-classes="list"
                :data="driverView.table.data"
                :is-loading="driverView.table.isLoading"
                :column-length="3"
                :rows-length="rowsLength">
                <template slot="columns">
                    <th>司机</th>
                    <th>电话</th>
                    <th>车牌</th>
                    <th style="width: 200px;">操作</th>
                </template>
                <template slot-scope="{row}">
                    <td>
                        <base-input
                            alternative=""
                            style="margin-bottom: 0"
                            placeholder="司机"
                            input-classes="form-control-alternative"
                            :name="row.row + '_driver'"
                            v-model="row.name"
                            @input="getInput"
                            :disabled="row.status === 2"
                            @keyup.enter="handleEditClick('', row.row)"
                        />
                    </td>
                    <td>
                        <base-input
                            alternative=""
                            style="margin-bottom: 0"
                            placeholder="电话"
                            input-classes="form-control-alternative"
                            :name="row.row + '_phone'"
                            v-model="row.phone"
                            @input="getInput"
                            :disabled="row.status === 2"
                            @keyup.enter="handleEditClick('', row.row)"
                        />
                    </td>
                    <td>
                        <base-input
                            alternative=""
                            style="margin-bottom: 0"
                            placeholder="车牌"
                            input-classes="form-control-alternative"
                            :name="row.row + '_plate'"
                            v-model="row.plate"
                            @input="getInput"
                            :disabled="row.status === 2"
                            @keyup.enter="handleEditClick('', row.row)"
                        />
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
                </div>

                <template slot="footer">
                    <base-button type="danger" @click="handleConfirmDeleteClick">确定</base-button>
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
import {mapActions, mapState} from "vuex";
import {
    handleChangePage,
    handleConfirmSoftDeleteTableRow,
    handleDeleteTableRow,
    handleGetTableData,
    handleSubmitTableRow,
    handleUpdateTableRow
} from "@/functions";

export default {
    name: "DriverTable",
    data: () => (
        {
            arrDeleteRow: [],
            modals: {
                dataSource: {},
                isShow: false
            }
        }
    ),
    mounted() {},
    props: {
        type: {
            type: String
        },
        title: String
    },
    methods: {
        ...mapActions(['getTable', 'updateViewComponent', 'updateTableRowData', 'submitUpdateData', 'submitDeleteId', "updateCommonSelectSubValue", "increaseRequestingTasksCount"]),
        requestTableData() {
            handleGetTableData(this, 'driverView')
        },
        getInput(indexKey, value) {
            const [index, key] = indexKey.split('_')
            handleUpdateTableRow(this, 'driverView', index, key, value)
        },
        handleEditClick(e, index) {
            handleSubmitTableRow(this, 'driverView', index, ['driver', 'phone', 'plate'])
        },
        handleDeleteClick(e, index) {
            handleDeleteTableRow(this, 'driverView', index)
        },
        handleConfirmDeleteClick() {
            handleConfirmSoftDeleteTableRow(this, 'driverView')
        },
        changePage(value) {
            handleChangePage(this, 'driverView', value)
        },
    },
    computed: {
        ...mapState(["driverView", "commonView"]),
        rowsLength: function () {
            return this.driverView.table.data.length === 0 ? 10 : this.driverView.table.data.length
        },
        tableDataCount: function () {
            return this.driverView.table.dataCount
        },
        currentPage: function () {
            return this.driverView.table.queryCondition.currentPageCount
        },
        perPage: function () {
            return this.driverView.table.perPage
        },
        modalHeader: function () {
            return `正在删除一条司机信息`
        }
    }
}
</script>

<style scoped>

</style>
