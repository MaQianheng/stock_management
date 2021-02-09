<template>
    <card shadow type="secondary" style="margin-top: 30px;">
        <b-card-group columns>
            <div v-show="!supplierView.table.isLoading">
                <InfoCard v-for="(item, index) in supplierView.table.data" :key="index" :dataSource="item"
                          @fromInfoCard="handleFromInfoCard" parent="supplier"/>
            </div>
            <div v-show="supplierView.table.isLoading">
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
                <base-button type="danger" @click="handleConfirmClick">确定</base-button>
                <base-button type="secondary" @click="modals.danger.isShow = false">取消</base-button>
            </template>
        </modal>
        <modal :show.sync="modals.primary.isShow">
            <h6 slot="header" class="modal-title" id="modal-title-default">正在编辑一条供应商信息</h6>
            <div class="row">
                <base-input
                    type="text"
                    label="供应商名称"
                    placeholder="供应商名称"
                    input-classes="form-control-alternative"
                    class="col-12"
                    style="text-align: left;"
                    name="supplierName"
                    v-model="modals.dataSource.supplierName"
                    @input="getInput"
                />
                <base-input
                    type="text"
                    label="姓名"
                    placeholder="姓名"
                    input-classes="form-control-alternative"
                    class="col-6"
                    style="text-align: left;"
                    name="name"
                    v-model="modals.dataSource.name"
                    @input="getInput"
                />
                <base-input
                    type="text"
                    label="电话"
                    placeholder="电话"
                    input-classes="form-control-alternative"
                    class="col-6"
                    style="text-align: left;"
                    name="phone"
                    v-model="modals.dataSource.phone"
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
    handleConfirmDeleteTableRow,
    handleGetTableData,
    handleSubmitTableRow,
    handleUpdateTableRow,
} from "@/functions";

export default {
    name: "SupplierTable",
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
                    supplierName: '',
                    name: '',
                    phone: '',
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
            handleGetTableData(this, 'supplierView')
        },
        getInput(key, value) {
            if (key === 'phone') {
                let result = ""
                for (let i = 0; i < value.length; i++) {
                    let val = value[i]
                    if (isNaN(val)) continue
                    result += val
                }
                value = result
            }
            this.modals.dataSource[key] = value
        },
        getTextArea(index, e) {
            handleUpdateTableRow(this, 'supplierView', index, 'remark', e.target.value)
        },
        handleConfirmUpdateClick() {
            const {dataSource} = this.modals
            const arrKeys = []
            const objKV = {}
            if (dataSource.supplierName !== "") {
                arrKeys.push('supplierName')
                objKV.supplierName = dataSource.supplierName
            }
            if (dataSource.name !== "") {
                arrKeys.push('name')
                objKV.name = dataSource.name
            }
            if (dataSource.phone !== "") {
                arrKeys.push('phone')
                objKV.phone = dataSource.phone
            }
            if (dataSource.remark !== "") {
                arrKeys.push('remark')
                objKV.remark = dataSource.remark
            }
            objKV.status = 1
            const index = dataSource.row
            this.modals.primary.isShow = false
            this.updateTableRowData({view: 'supplierView', index, objKV})
            handleSubmitTableRow(this, 'supplierView', index, arrKeys)
        },
        handleConfirmClick() {
            this.modals.danger.isShow = false
            handleConfirmDeleteTableRow(this, 'supplierView')
        },
        changePage(value) {
            handleChangePage(this, 'supplierView', value)
        },
        handleFromInfoCard(directive, index) {
            this.modals.dataSource = {...this.supplierView.table.data[index]}
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
        ...mapState(["supplierView", "commonView"]),
        tableSize: function () {
            return this.supplierView.table.data.length === 0 ? 12 : this.supplierView.table.data.length
        },
        tableDataCount: function () {
            return this.supplierView.table.dataCount
        },
        currentPage: function () {
            return this.supplierView.table.queryCondition.currentPageCount
        },
        perPage: function () {
            return this.supplierView.table.perPage
        },
        modalRow: function () {
            return this.modals.dataSource.row
        },
        modalHeader: function () {
            return `正在删除一条供应商信息`
        },
        modalContent: function () {
            const {dataSource} = this.modals
            return `供应商名称：${dataSource.name}。与该供应商相关的入库记录会受影响。`
        }
    }
}
</script>

<style scoped>

</style>
