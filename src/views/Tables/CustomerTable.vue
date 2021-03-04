<template>
    <card shadow type="secondary" style="margin-top: 30px;">
        <b-card-group columns>
            <div v-show="!customerView.table.isLoading">
                <InfoCard v-for="(item, index) in customerView.table.data" :key="index" :dataSource="item"
                          @fromInfoCard="handleFromInfoCard"/>
            </div>
            <div v-show="customerView.table.isLoading">
                <IsLoadingCard v-for="(index) in tableSize" :key="index"/>
            </div>
        </b-card-group>

        <modal :show.sync="modals.danger.isShow"
               gradient="danger"
               modal-classes="modal-danger modal-dialog-centered">
            <h6 slot="header" class="modal-title" id="modal-title-notification">{{ modalHeader }}</h6>

            <div class="py-3 text-center">
                <i class="ni ni-bell-55 ni-3x"></i>
                <h4 class="heading mt-4">确定是否删除该条信息？</h4>
                <p>{{ modalContent }}</p>
            </div>

            <template slot="footer">
                <base-button type="danger" @click="handleConfirmDeleteClick">确定</base-button>
                <base-button type="secondary" @click="modals.danger.isShow = false">取消</base-button>
            </template>
        </modal>
        <modal :show.sync="modals.primary.isShow">
            <h6 slot="header" class="modal-title" id="modal-title-default">正在编辑一条客户信息</h6>
            <div class="row">
                <base-input
                    type="text"
                    label="姓名"
                    placeholder="姓名"
                    input-classes="form-control-alternative"
                    class="col-12"
                    style="text-align: left;"
                    name="name"
                    v-model="modals.dataSource.name"
                    @input="getInput"
                />
            </div>
            <hr>
            <div class="row">
                <base-input
                    label="备注"
                    class="col-12"
                    style="text-align: left;"
                >
                    <textarea rows="4" class="form-control form-control-alternative"
                              placeholder="备注..."
                              name="remark"
                              v-model="modals.dataSource.remark"
                    />
                </base-input>
            </div>
            <template slot="footer">
                <base-button type="primary" @click="handleConfirmUpdateClick">保存</base-button>
                <base-button type="secondary" @click="modals.primary.isShow = false">取消</base-button>
            </template>
        </modal>
        <div class="card-footer d-flex justify-content-end"
             :class="type === 'dark' ? 'bg-transparent': ''">
            <base-pagination :per-page="perPage" :total=tableDataCount :value=currentPage @input="changePage"/>
        </div>
    </card>
</template>

<script>
import InfoCard from "@/components/MyComponents/InfoCard";
import IsLoadingCard from "@/components/MyComponents/IsLoadingPersonInfoCard";
import {mapActions, mapState} from "vuex";
import {
    handleChangePage,
    handleConfirmSoftDeleteTableRow,
    handleGetTableData,
    handleSubmitTableRow,
    handleUpdateTableRow,
} from "@/functions";

export default {
    name: "CustomerTable",
    components: {
        InfoCard,
        IsLoadingCard
    },
    data: () => (
        {
            type: '',
            arrDeleteRow: [],
            modals: {
                dataSource: {
                    row: 0,
                    name: '',
                    remark: ''
                },
                primary: {
                    isShow: false
                },
                danger: {
                    isShow: false
                }
            }
        }
    ),
    mounted() {
    },
    methods: {
        ...mapActions(['getTable', 'updateViewComponent', 'updateTableRowData', 'submitUpdateData', 'submitDeleteId', "updateCommonSelectSubValue", "increaseRequestingTasksCount"]),
        requestTableData() {
            handleGetTableData(this, 'customerView')
        },
        getInput(key, value) {
            this.modals.dataSource[key] = value
        },
        getTextArea(index, e) {
            handleUpdateTableRow(this, 'customerView', index, 'remark', e.target.value)
        },
        handleConfirmUpdateClick() {
            const {dataSource} = this.modals
            const arrKeys = []
            const objKV = {}
            // {view, index, objKV}
            if (dataSource.name !== "") {
                arrKeys.push('name')
                objKV.name = dataSource.name
            }
            if (dataSource.remark !== "") {
                arrKeys.push('remark')
                objKV.remark = dataSource.remark
            }
            objKV.status = 1
            const index = dataSource.row
            this.modals.primary.isShow = false
            this.updateTableRowData({view: 'customerView', index, objKV})
            handleSubmitTableRow(this, 'customerView', index, arrKeys)
        },
        handleConfirmDeleteClick() {
            this.modals.danger.isShow = false
            handleConfirmSoftDeleteTableRow(this, 'customerView')
        },
        changePage(value) {
            handleChangePage(this, 'customerView', value)
        },
        handleFromInfoCard(directive, index) {
            this.modals.dataSource = {...this.customerView.table.data[index]}
            switch (directive) {
                case 'edit':
                    this.modals.primary.isShow = true
                    break
                case 'delete':
                    this.arrDeleteRow[0] = index
                    this.modals.danger.isShow = true
                    break
            }
        }
    },
    computed: {
        ...mapState(["customerView", "commonView"]),
        tableSize: function () {
            return this.customerView.table.data.length === 0 ? 12 : this.customerView.table.data.length
        },
        tableDataCount: function () {
            return this.customerView.table.dataCount
        },
        currentPage: function () {
            return this.customerView.table.queryCondition.currentPageCount
        },
        perPage: function () {
            return this.customerView.table.perPage
        },
        modalRow: function () {
            return this.modals.dataSource.row
        },
        modalHeader: function () {
            return `正在删除一条客户信息`
        },
        modalContent: function () {
            const {dataSource} = this.modals
            return `客户名称：${dataSource.name}。与该客户相关的出库记录会受影响。`
        }
    }
}
</script>

<style scoped>

</style>
