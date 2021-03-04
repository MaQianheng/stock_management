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
            <div class="row align-items-center">
                <div class="row" style="width: 100%; margin-left: 0">
                    <autocomplete
                        class="col-lg-6 col-sm-1"
                        :search="searchCode"
                        placeholder="搜索并选择货号"
                        aria-label="搜索并选择货号"
                        :get-result-value="getCodeResultValue"
                        @submit="handleCodeSubmit"
                        :debounce-time="500"
                        style="margin-bottom: 10px;"
                    />
                    <autocomplete
                        class="col-lg-6 col-sm-1"
                        :search="searchName"
                        placeholder="搜索并选择商品名称"
                        aria-label="搜索并选择商品名称"
                        :get-result-value="getNameResultValue"
                        @submit="handleNameSubmit"
                        :debounce-time="500"
                        style="margin-bottom: 10px;"
                    />
                    <v-select :searchable=true
                              class="col-6"
                              :options="commonView.warehouseSelectAll.data"
                              v-model="productView.table.warehouseSelect.selectedValue"
                              :labelSearchPlaceholder="commonView.labelSearchPlaceholder"
                              :disabled="commonView.cascadingWarehouseShelfSelect.isLoading || productView.table.isLoading"
                    />
                    <v-select :searchable=true
                              class="col-6"
                              :options="productView.table.shelfSelect.data"
                              v-model="productView.table.shelfSelect.selectedValue"
                              :labelSearchPlaceholder="commonView.labelSearchPlaceholder"
                              :disabled="commonView.cascadingWarehouseShelfSelect.isLoading || productView.table.isLoading"
                    />
                    <v-select :searchable=true
                              class="col-6"
                              :options="commonView.colorSelectAll.data"
                              v-model="productView.table.colorSelect.selectedValue"
                              :labelSearchPlaceholder="commonView.labelSearchPlaceholder"
                              :disabled="commonView.colorSelect.isLoading || productView.table.isLoading"
                    />
                    <div class="col-12" style="text-align: right">
                        <base-button type="info" :outline="true" size="sm" @click="handleSubmit"
                                     :disabled="productView.table.isLoading">
                            <b-spinner small type="grow" v-if="productView.table.isLoading"/>
                            搜索
                        </base-button>
                    </div>
                </div>
            </div>
        </div>

        <div class="table-responsive" style="max-height: 1000px;">
            <b-skeleton-table
                v-if="productView.table.isLoading"
                :rows="10"
                :columns="columns.length"
                :table-props="{ bordered: true, striped: true }"
            ></b-skeleton-table>
            <table class="table b-table tablesorter table align-items-center table-flush" v-else>
                <thead class="thead-light">
                <tr>
                    <th style="z-index: 999;" class="sticky-top" v-for="column in columns" :key="column">{{
                            column
                        }}
                    </th>
                </tr>
                </thead>
                <tbody class="list">
                <template v-for="(item, index) in productView.table.data">
                    <tr v-for="(sub, i) in item.sub" :key="index + '' + i">
                        <td v-if="i===0" :rowspan="item.sub.length">
                            {{ item.code }}
                        </td>
                        <td v-if="i===0" :rowspan="item.sub.length">
                            <div class="align-items-center">
                                <ImageZoomModal :image-src="imageSrc(item.imageURLs)" image-height="120px;"/>
                            </div>
                        </td>
                        <td v-if="i===0" :rowspan="item.sub.length">
                            {{ item.name }}
                        </td>
                        <td v-if="i===0" :rowspan="item.sub.length">
                            {{ item.colorRef.text }}
                        </td>
                        <td v-if="i===0" :rowspan="item.sub.length">
                            {{ item.price }}
                        </td>
                        <td>{{ sub.warehouse }}</td>
                        <td>{{ sub.shelf }}</td>
                        <td>{{ sub.remainingWeight }}</td>
                        <td>{{ sub.soldWeight }}</td>
                        <td v-if="i===0" :rowspan="item.sub.length" v-html="item.remark"
                            style="text-align: left !important;"></td>
                        <td v-if="i===0" :rowspan="item.sub.length">
                            <base-button type="primary" :outline="true" size="sm"
                                         :disabled="item.status === 2"
                                         @click="handleEditClick(index)">
                                <b-spinner small type="grow" v-if="item.status === 2"/>
                                编辑
                            </base-button>
                            <base-button type="warning" :outline="true" size="sm"
                                         :disabled="item.status === 2"
                                         @click="handleDeleteClick(index)">
                                <b-spinner small type="grow" v-if="item.status === 2"/>
                                删除
                            </base-button>
                        </td>
                    </tr>
                </template>
                </tbody>
            </table>
        </div>
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
                    label="货号"
                    placeholder="货号"
                    input-classes="form-control-alternative"
                    class="col-6"
                    style="text-align: left;"
                    name="code"
                    v-model="modals.dataSource.code"
                    @input="getInput"
                />
                <base-input
                    type="text"
                    label="名称"
                    placeholder="名称"
                    input-classes="form-control-alternative"
                    class="col-6"
                    style="text-align: left;"
                    name="name"
                    v-model="modals.dataSource.name"
                    @input="getInput"
                />
                <div class="form-group col-6 has-label">
                    <label class="form-control-label">颜色</label>
                    <v-select
                        :searchable=true
                        :options="commonView.colorSelect.data"
                        v-model="modals.dataSource.colorRef"
                        :labelSearchPlaceholder="commonView.labelSearchPlaceholder"/>
                </div>
                <base-input
                    type="text"
                    label="价格"
                    placeholder="价格"
                    input-classes="form-control-alternative"
                    class="col-6"
                    style="text-align: left;"
                    name="price"
                    v-model="modals.dataSource.price"
                    @input="getInput"
                />
            </div>
            <div class="col-12">
                <yimo-vue-editor v-html="modals.dataSource.remark" @input="updateRemark"/>
            </div>
            <div class="row" style="margin-top: 15px;">
                <div class="img-upload" @click="handleChangeImageClick">
                    <img v-show="modals.dataSource.imageURLs[0]" :src="base64ImageSrc"/>
                    <i v-show="!modals.dataSource.imageURLs[0]" class="ni ni-cloud-upload-96"></i>
                    <i v-show="modals.dataSource.imageURLs[0]"
                       class="ni ni-fat-remove"
                       @click.stop="handleRemoveImgClick"/>
                    <input type="file" style="display: none;" ref="inputFile" @change="onChangeImage" accept="image/*">
                </div>
            </div>
            <template slot="footer">
                <base-button type="primary" @click="handleConfirmUpdateClick">保存</base-button>
                <base-button type="secondary" @click="handleCancelUpdateClick">取消</base-button>
            </template>
        </modal>
        <div class="card-footer d-flex justify-content-end"
             :class="type === 'dark' ? 'bg-transparent': ''">
            <base-pagination :per-page="perPage" :total=tableDataCount :value=currentPage @input="changePage"/>
        </div>
    </div>
</template>
<script>
import VSelect from '@alfsnd/vue-bootstrap-select'
import {mapActions, mapState} from "vuex";
import {BSkeletonTable} from 'bootstrap-vue'
import {funcComputeAlertLevel, handleChangePage, handleConfirmSoftDeleteTableRow} from "@/functions";
import {requestFuzzyQueryProductCode, requestFuzzyQueryProductName} from "@/api";
import Autocomplete from '@trevoreyre/autocomplete-vue'
import {baseUrl} from '@/api'
import {validateInputNumber} from "@/functions/utils";
import YimoVueEditor from 'yimo-vue-editor'
import ImageZoomModal from "@/components/MyComponents/ImageZoomModal";

export default {
    name: 'inventory-table',
    components: {
        ImageZoomModal,
        Autocomplete,
        VSelect,
        BSkeletonTable,
        YimoVueEditor
    },
    props: {
        type: {
            type: String
        },
        title: String
    },
    data: () => (
        {
            arrOperatingRow: [],
            arrDeleteRow: [],
            modals: {
                tmpRemark: '',
                dataSource: {
                    row: 0,
                    imageURLs: [],
                    colorSelectedValue: {}
                },
                primary: {
                    isShow: false
                },
                danger: {
                    isShow: false
                }
            },
            columns: ['货号', '图片', '名称', '颜色', '价格', '库房', '货架', '库存(KG)', '已售(KG)', '备注', '操作']
        }
    ),
    methods: {
        ...mapActions(['getTable', 'updateViewComponent', 'updateTableRowData', 'submitUpdateData', 'submitDeleteId', "updateCommonSelectSubValue", "updateCascadingShelf", "updateFormSingleData", "increaseRequestingTasksCount"]),
        getInput(key, value) {
            if (key === 'price') {
                value = validateInputNumber(value)
                if (!value) value = 0
            }
            this.modals.dataSource[key] = value
            // this.updateTableRowData({view: 'productView', index: this.arrOperatingRow[0], objKV})
        },
        updateRemark(v) {
            this.modals.tmpRemark = v
        },
        searchCode(input) {
            if (input.length === 0) {
                let {queryCondition} = this.productView.table
                queryCondition.code = ''
                this.updateViewComponent({view: 'productView', component: 'table', objKV: queryCondition})
                return []
            }
            input = input.toUpperCase()
            return requestFuzzyQueryProductCode({code: input}).then((data) => {
                return data.data.data
            }).catch(() => {
                return ['请求出错']
            })
        },
        getCodeResultValue(result) {
            return result.code
        },
        handleCodeSubmit(result) {
            let {queryCondition} = this.productView.table
            queryCondition.code = result.code
            this.updateViewComponent({view: 'productView', component: 'table', objKV: queryCondition})
        },

        searchName(input) {
            if (input.length === 0) {
                let {queryCondition} = this.productView.table
                queryCondition.name = ''
                this.updateViewComponent({view: 'productView', component: 'table', objKV: queryCondition})
                return []
            }
            return requestFuzzyQueryProductName({name: input}).then((data) => {
                return data.data.data
            }).catch(() => {
                return ['请求出错']
            })
        },
        getNameResultValue(result) {
            return result.name
        },
        handleNameSubmit(result) {
            let {queryCondition} = this.productView.table
            queryCondition.name = result.name
            this.updateViewComponent({view: 'productView', component: 'table', objKV: queryCondition})
        },
        handleSubmit() {
            if (this.productView.table.isLoading) return
            const {queryCondition} = this.productView.table
            const {warehouseRef, shelfRef} = queryCondition
            if (warehouseRef !== "0" && shelfRef === "0") {
                let value = ""
                let {sub} = this.commonView.cascadingWarehouseShelfSelect.data.objCascading[warehouseRef]
                for (let i = 0; i < sub.length; i++) {
                    value += `${sub[i].value}`
                    if (i !== sub.length - 1) value += ','
                }
                queryCondition.shelfRef = value
            }
            queryCondition.currentPageCount = 1
            this.increaseRequestingTasksCount(1)
            this.updateViewComponent({
                view: 'productView',
                component: "table",
                objKV: {
                    queryCondition,
                    isLoading: true
                }
            })
        },

        handleRemoveImgClick() {
            // this.modals.primary.imgIsRemoved = true
            this.$set(this.modals.dataSource, "imageURLs", [])
            this.$refs.inputFile.value = ''
        },
        handleEditClick(index) {
            this.arrOperatingRow[0] = index
            this.modals.dataSource = {...this.productView.table.data[index]}
            this.$set(this.modals.dataSource, 'remark', this.modals.dataSource.remark)
            this.modals.tmpRemark = this.modals.dataSource.remark
            console.log(this.modals.tmpRemark)
            // no ref
            this.modals.dataSource.imageURLs = [...this.productView.table.data[index].imageURLs]
            this.modals.primary.imgIsRemoved = false
            this.modals.primary.isShow = true
        },
        handleCancelUpdateClick() {
            this.modals.primary.isShow = false
            this.$refs.inputFile.value = ''
        },
        handleConfirmUpdateClick() {
            const {dataSource} = this.modals
            const objUpdateData = {}
            const index = this.arrOperatingRow[0]
            const tmp = this.productView.table.data[index]
            objUpdateData._id = dataSource._id
            if (tmp.code !== dataSource.code) objUpdateData.code = dataSource.code
            if (tmp.name !== dataSource.name) objUpdateData.name = dataSource.name
            if (dataSource.colorRef && tmp.colorRef.value !== dataSource.colorRef.value) objUpdateData.colorRef = dataSource.colorRef.value
            if (tmp.price !== dataSource.price) objUpdateData.price = dataSource.price
            if (this.modals.tmpRemark !== dataSource.remark) {
                objUpdateData.remark = this.modals.tmpRemark
                this.modals.tmpRemark = ''
            }
            // remove image
            if (dataSource.imageURLs.length === 0 && tmp.imageURLs.length !== 0) objUpdateData.imageURLs = []
            // change image
            if (this.$refs.inputFile.files.length !== 0) {
                objUpdateData.productImages = this.$refs.inputFile.files[0]
            }
            // if (index > 0) {
            //     console.log(objUpdateData)
            //     return
            // }
            this.modals.primary.isShow = false
            // console.log(index, objUpdateData, this.modals.dataSource)
            // if (dataSource !== {}) {
            //     return
            // }
            this.$notify({
                type: 'info',
                title: "正在更新数据"
            })
            this.updateTableRowData({view: 'productView', index, objKV: {status: 2}})
            this.submitUpdateData({view: 'productView', objUpdateData, index}).then(() => {
                const {err_code, message} = this.productView.table
                this.$notify({
                    type: funcComputeAlertLevel(err_code),
                    title: message
                })
                this.updateTableRowData({view: 'productView', index, objKV: {status: 1}})
                if (err_code === 0) {
                    this.increaseRequestingTasksCount(2)
                    this.updateViewComponent({view: 'productView', component: 'table', objKV: {isLoading: true}})
                    this.updateViewComponent({view: 'colorView', component: 'table', objKV: {isLoading: true}})
                }
            })
        },
        handleDeleteClick(index) {
            this.modals.dataSource = {...this.productView.table.data[index]}
            this.arrDeleteRow[0] = index
            this.modals.danger.isShow = true
        },
        handleConfirmDeleteClick() {
            this.modals.danger.isShow = false
            handleConfirmSoftDeleteTableRow(this, 'productView')
        },
        changePage(value) {
            handleChangePage(this, 'productView', value)
        },
        handleChangeImageClick() {
            this.$refs.inputFile.click()
        },
        onChangeImage() {
            // if (this.$refs.inputFile.files.length <= 0) return
            let file = this.$refs.inputFile.files[0]
            //KB单位,可以获取图片的大小，到时候可以根据图片大小进行选择上传
            let imgSize = file.size / 1024
            console.log(imgSize)
            let reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend = () => {
                // 图片的 base64 格式, 可以直接当成 img 的 src 属性值
                //在这里就可以进行图片地址的获取了，到时候后台上传的图片就是根据这个来的
                //that.uploadImgUrl = dataURL这个就是展示了上传的图片
                // that.uploadImgUrl = reader.result
                this.$set(this.modals.dataSource.imageURLs, 0, reader.result)
            }
        },
        imageSrc: function (imageURLs) {
            if (imageURLs[0]) {
                return `${baseUrl}/images/${imageURLs[0]}`
            }
            return `${baseUrl}/images/product_default.jpeg`
        }
    },
    computed: {
        ...mapState(['productView', 'commonView', 'colorView']),
        colsWithValue() {
            return (row) => {
                return this.columns.filter(column => this.hasValue(row, column))
            }
        },
        rowsLength: function () {
            return this.productView.table.data.length === 0 ? 10 : this.productView.table.data.length
        },
        tableDataCount: function () {
            return this.productView.table.dataCount
        },
        currentPage: function () {
            return this.productView.table.queryCondition.currentPageCount
        },
        perPage: function () {
            return this.productView.table.perPage
        },
        modalHeader: function () {
            return `正在删除一条商品信息`
        },
        modalContent: function () {
            const {dataSource} = this.modals
            return `名称：${dataSource.name}，货号：${dataSource.code}。（会影响相关出入库记录）`
        },
        modalRow: function () {
            return this.modals.dataSource.row
        },
        base64ImageSrc: function () {
            const {imageURLs} = this.modals.dataSource
            if (imageURLs[0]) {
                return imageURLs[0].indexOf('data:image') !== -1 ? imageURLs[0] : `${baseUrl}/images/${imageURLs[0]}`
            }
            return ''
        }
    },
    watch: {
        "productView.table.colorSelect.selectedValue.value": {
            handler: function (newVal, oldVal) {
                if (newVal === oldVal) return
                let {queryCondition} = this.productView.table
                queryCondition.colorRef = newVal
                this.updateViewComponent(
                    {
                        view: 'productView',
                        component: "table",
                        objKV: {
                            queryCondition
                        }
                    }
                )
            }
        },
        "productView.table.warehouseSelect.selectedValue.value": {
            handler: function (newVal) {
                let {queryCondition} = this.productView.table
                queryCondition.warehouseRef = newVal
                queryCondition.shelfRef = "0"
                this.updateViewComponent(
                    {
                        view: 'productView',
                        component: "table",
                        objKV: {
                            queryCondition
                        }
                    }
                )
                this.updateCascadingShelf({key: newVal, view: 'productView'})
            }
        },
        "productView.table.shelfSelect.selectedValue.value": {
            handler: function (newVal, oldVal) {
                if (newVal === oldVal) return
                let {queryCondition} = this.productView.table
                queryCondition.shelfRef = newVal
                this.updateViewComponent(
                    {
                        view: 'productView',
                        component: "table",
                        objKV: {
                            queryCondition
                        }
                    }
                )
            }
        }
    }
}
</script>
<style>
.ni-fat-remove:hover {
    transform: scale(1.1);
    color: #0a0c0d;
}

.img-upload {
    margin: 0 auto;
    position: relative;
    cursor: pointer;
    transition: .5s all;
}

.img-upload > img {
    height: 600px;
    width: 600px;
}

.img-upload:hover {
    transform: translateY(-5px)
}

.img-upload > i:nth-child(2) {
    font-size: 250px;
}

.img-upload > i:nth-child(3) {
    position: absolute;
    right: 5px;
    top: 5px;
    font-size: 25px;
    cursor: pointer;
    transition: .3s all;
    text-shadow: 2px 2px 3px white
}
</style>
