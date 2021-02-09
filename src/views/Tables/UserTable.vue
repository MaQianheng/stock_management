<template>
    <div class="card shadow"
         :class="type === 'dark' ? 'bg-default': ''">
        <div class="table-responsive">
            <base-table
                class="table align-items-center table-flush"
                :class="type === 'dark' ? 'table-dark': ''"
                :thead-classes="type === 'dark' ? 'thead-dark': 'thead-light'"
                tbody-classes="list"
                :data="userView.table.data"
                :is-loading="userView.table.isLoading"
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
                        <base-input
                            alternative=""
                            style="margin-bottom: 0"
                            placeholder="用户名"
                            input-classes="form-control-alternative"
                            :name="row.row + '_username'"
                            v-model="row.username"
                            @input="getInput"
                            :disabled="row.status === 2"
                            @keyup.enter="handleEditClick('', row.row)"
                        />
                    </td>
                    <td>
                        <base-input
                            alternative=""
                            style="margin-bottom: 0"
                            placeholder="密码"
                            input-classes="form-control-alternative"
                            :name="row.row + '_password'"
                            v-model="row.password"
                            @input="getInput"
                            :disabled="row.status === 2"
                            @keyup.enter="handleEditClick('', row.row)"
                        />
                    </td>
                    <td>
                        <base-input
                            alternative=""
                            style="margin-bottom: 0"
                            placeholder="姓名"
                            input-classes="form-control-alternative"
                            :name="row.row + '_name'"
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
                            v-model="userView.table.data[row.row].level"
                            :labelSearchPlaceholder="commonView.labelSearchPlaceholder"
                            :disabled="userView.table.isLoading"
                            style="margin-bottom: 15px;"
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
import {mapActions, mapState} from "vuex";
import VSelect from '@alfsnd/vue-bootstrap-select'
import {
    handleChangePage,
    handleConfirmDeleteTableRow,
    handleDeleteTableRow,
    handleGetTableData,
    handleSubmitTableRow,
    handleUpdateTableRow
} from "@/functions";
import {validateInputAlphaBetAndNumber} from "@/functions/utils";

export default {
    name: "UserTable",
    components: {
        VSelect
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
            handleGetTableData(this, 'userView')
        },
        getInput(indexKey, value) {
            const [index, key] = indexKey.split('_')
            if (key === 'username' || key === 'password') value = validateInputAlphaBetAndNumber(value)
            handleUpdateTableRow(this, 'userView', index, key, value)
        },
        handleEditClick(e, index) {
            handleSubmitTableRow(this, 'userView', index, ['username', 'password', 'name', 'level'])
        },
        handleDeleteClick(e, index) {
            handleDeleteTableRow(this, 'userView', index)
        },
        handleConfirmClick() {
            handleConfirmDeleteTableRow(this, 'userView')
        },
        changePage(value) {
            handleChangePage(this, 'userView', value)
        },
    },
    computed: {
        ...mapState(["userView", "commonView"]),
        rowsLength: function () {
            return this.userView.table.data.length === 0 ? 10 : this.userView.table.data.length
        },
        tableDataCount: function () {
            return this.userView.table.dataCount
        },
        currentPage: function () {
            return this.userView.table.queryCondition.currentPageCount
        },
        perPage: function () {
            return this.userView.table.perPage
        },
        modalHeader: function () {
            return `正在删除一条管理员信息`
        }
    },
    // watch: {
    //     "userView.select.selectedValue.value": {
    //         handler: function (newVal, oldVal) {
    //             watchHandleSelectedValue(newVal, oldVal, this, 'userView')
    //         }
    //     }
    // }
}
</script>

<style scoped>

</style>
