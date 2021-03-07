<template>
    <div class="card shadow"
         :class="type === 'dark' ? 'bg-default': ''">
        <div class="table-responsive">
            <base-table
                class="table align-items-center table-flush"
                :class="type === 'dark' ? 'table-dark': ''"
                :thead-classes="type === 'dark' ? 'thead-dark': 'thead-light'"
                tbody-classes="list"
                :data="operatorView.table.data"
                :is-loading="operatorView.table.isLoading"
                :column-length="3"
                :rows-length="rowsLength"
            >
                <template slot="columns">
                    <th>用户名</th>
                    <th>密码</th>
                    <th>姓名</th>
                    <th>等级</th>
                    <th style="width: 200px;">操作</th>
                </template>
                <template slot-scope="{row}">
                    <td>
                        <del v-if="row.isDeleted">{{ row.username }}</del>
                        <base-input
                            v-else
                            style="margin-bottom: 0"
                            placeholder="用户名"
                            input-classes="form-control-alternative"
                            :name="'username-' + row.row"
                            v-model="row.username"
                            @input="getInput"
                            :disabled="row.status === 2"
                            @keyup.enter="handleEditClick('', row.row)"
                        />
                    </td>
                    <td>
                        <del v-if="row.isDeleted">{{ row.password }}</del>
                        <base-input
                            v-else
                            style="margin-bottom: 0"
                            placeholder="密码"
                            input-classes="form-control-alternative"
                            :name="'password-' + row.row"
                            v-model="row.password"
                            @input="getInput"
                            :disabled="row.status === 2"
                            @keyup.enter="handleEditClick('', row.row)"
                        />
                    </td>
                    <td>
                        <del v-if="row.isDeleted">{{ row.name }}</del>
                        <base-input
                            v-else
                            style="margin-bottom: 0"
                            placeholder="姓名"
                            input-classes="form-control-alternative"
                            :name="'name-' + row.row"
                            v-model="row.name"
                            @input="getInput"
                            :disabled="row.status === 2"
                            @keyup.enter="handleEditClick('', row.row)"
                        />
                    </td>
                    <td>
                        <v-select
                            :searchable=true
                            :options="commonView.levelSelect.data"
                            v-model="operatorView.table.data[row.row].level"
                            :labelSearchPlaceholder="commonView.labelSearchPlaceholder"
                            :disabled="row.status === 2 || row.isDeleted"
                            style="margin-bottom: 15px;"
                        />
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
import {mapActions, mapState} from "vuex";
import VSelect from '@alfsnd/vue-bootstrap-select'
import {
    handleChangePage,
    handleGetTableData, handleModalConfirmClick, handleShowConfirmModal,
    handleSubmitTableRow,
    handleUpdateTableRow
} from "@/functions";
import {validateInputAlphaBetAndNumber} from "@/functions/utils";

export default {
    name: "OperatorTable",
    components: {
        VSelect
    },
    data: () => (
        {
            view: 'operatorView',
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
        ...mapActions(['getTable', 'updateViewComponent', 'updateTableRowData', 'submitUpdateData', 'submitDeleteId', "updateCommonSelectSubValue", "increaseRequestingTasksCount", "submitUpdateDeleteMarker", "decreaseRequestingTasksCount"]),
        showModalSingle(mode, index) {
            this.arrOperatingRows = [index]
            const objTmp = {
                restore: {
                    header: '确定是否恢复该条信息？',
                    heading: '正在恢复一条管理员信息',
                },
                softDelete: {
                    header: '确定是否删除该条信息？',
                    heading: '正在删除一条管理员信息'
                }
            }
            const {data} = this.operatorView.table
            objTmp.body = `管理员名称：${data[index].name}。`
            handleShowConfirmModal(this, mode, objTmp)
        },
        requestTableData() {
            handleGetTableData(this)
        },
        getInput(keyIndex, value) {
            const [key, index] = keyIndex.split('-')
            if (key === 'username' || key === 'password') value = validateInputAlphaBetAndNumber(value)
            handleUpdateTableRow(this, index, key, value)
        },
        handleEditClick(e, index) {
            handleSubmitTableRow(this, index, ['username', 'password', 'name', 'level'])
        },
        handleModalConfirmClick() {
            handleModalConfirmClick(this)
        },
        changePage(value) {
            handleChangePage(this, value)
        },
    },
    computed: {
        ...mapState(["operatorView", "commonView"]),
        rowsLength: function () {
            return this.operatorView.table.data.length === 0 ? 10 : this.operatorView.table.data.length
        },
        tableDataCount: function () {
            return this.operatorView.table.dataCount
        },
        currentPage: function () {
            return this.operatorView.table.queryCondition.currentPageCount
        },
        perPage: function () {
            return this.operatorView.table.perPage
        }
    }
}
</script>

<style scoped>

</style>
