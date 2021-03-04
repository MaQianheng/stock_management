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
                            <del v-if="item.isDeleted">{{ item.warehouse }}</del>
                            <p v-else>{{ item.warehouse }}</p>
                        </td>
                        <td v-if="i===0" :rowspan="item.sub.length">
                            <del v-if="item.isDeleted">{{ item.relatedShelfCount }}</del>
                            <p v-else>{{ item.relatedShelfCount }}</p>
                        </td>
                        <td>
                            <del v-if="sub.isDeleted">{{ sub.shelf }}</del>
                            <base-input
                                v-else
                                style="margin-bottom: 0"
                                placeholder="货架"
                                input-classes="form-control-alternative"
                                :name="index + '_' + i"
                                v-model="sub.shelf"
                                @input="getInput"
                                :disabled="sub.status === 2"
                                @keyup.enter="handleEditClick('', index + '_' + i)"
                            />
                        </td>
                        <td>
                            <del v-if="sub.isDeleted">{{ sub.relatedProductCount }}</del>
                            <p v-else>{{ sub.relatedProductCount }}</p>
                        </td>
                        <td class="text-center">
                            <div v-if="sub.isDeleted">
                                <base-button
                                    type="success" :outline="true"
                                    :row-id="index + '_' + i" size="sm"
                                    :disabled="sub.status === 2"
                                    @click="showModalSingle('restore', index + '_' + i)">
                                    <b-spinner small type="grow" v-if="sub.status === 2"/>
                                    恢复
                                </base-button>
                            </div>
                            <div v-else>
                                <base-button
                                    type="primary" :outline="true"
                                    :row-id="index + '_' + i" size="sm"
                                    :disabled="sub.status !== 1"
                                    @click="handleEditClick">
                                    <b-spinner small type="grow" v-if="sub.status === 2"/>
                                    更新
                                </base-button>
                                <base-button
                                    type="warning" :outline="true"
                                    :row-id="index + '_' + i" size="sm"
                                    :disabled="sub.status === 2"
                                    @click="showModalSingle('softDelete', index + '_' + i)">
                                    <b-spinner small type="grow" v-if="sub.status === 2"/>
                                    删除
                                </base-button>
                            </div>
                        </td>
                    </tr>
                </template>
                </tbody>
            </table>
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
import {
    handleChangePage,
    handleGetTableData,
    handleSelectedValueChange,
    handleShowConfirmModal,
    handleModalConfirmClick,
    handleUpdateTableRow,
    handleSubmitTableRow,
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
            view: 'shelfView',
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
        ...mapActions(['getTable', 'updateViewComponent', 'updateTableSubRowData', 'submitUpdateData', 'submitUpdateDeleteMarker', 'submitDeleteId', "updateCommonSelectSubValue", "increaseRequestingTasksCount", "decreaseRequestingTasksCount"]),
        showModalSingle(mode, index) {
            this.arrOperatingRows = [index]
            const objTmp = {
                restore: {
                    header: '确定是否恢复该条信息？',
                    heading: '正在恢复一条货架信息',
                },
                softDelete: {
                    header: '确定是否删除该条信息？',
                    heading: '正在删除一条货架信息'
                }
            }
            let subIndex
            [index, subIndex] = index.split('_')
            const {sub} = this.shelfView.table.data[index]
            objTmp.body = `货架名称：${sub[subIndex].shelf}。相关商品数量：${sub[subIndex].relatedProductCount}`
            handleShowConfirmModal(this, mode, objTmp)
        },
        requestTableData() {
            handleGetTableData(this)
        },
        getInput(index, value) {
            if (this.arrOperatingRows.length !== 1 || this.arrOperatingRows[0] !== index) this.arrOperatingRows = [index]
            handleUpdateTableRow(this, index, {status: 1, shelf: value})
        },
        handleEditClick(e, index) {
            handleSubmitTableRow(this, index, ['shelf'])
        },
        handleModalConfirmClick() {
            handleModalConfirmClick(this)
        },
        changePage(value) {
            handleChangePage(this, value)
        }

        // requestTableData() {
        //     handleGetTableData(this, 'shelfView')
        // },
        // getInput(index, value) {
        //     handleUpdateTableSubRow(this, 'shelfView', index, 'shelfName', value)
        // },
        // handleEditClick(e, index) {
        //     handleSubmitTableSubRow(this, 'shelfView', index, ['shelfName'])
        // },
        // handleConfirmClick() {
        //     handleConfirmDeleteTableSubRow(this, 'shelfView')
        // },
        // changePage(value) {
        //     handleChangePage(this, 'shelfView', value)
        // },
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
        }
    },
    watch: {
        'shelfView.table.select.selectedValue.value': {
            handler: function (newVal, oldVal) {
                handleSelectedValueChange(newVal, oldVal, this, 'shelfView')
            }
        }
    }
}
</script>

<style scoped>

</style>
