<template>
    <div class="col-xl-12 order-xl-1">
        <card shadow type="secondary" style="margin-top: 20px;">
            <div slot="header" class="bg-white border-0">
                <div class="row align-items-center">
                    <div class="col-8">
                        <h3 class="mb-0">添加商品</h3>
                    </div>
                </div>
            </div>
            <template>
                <!--                    <h6 class="heading-small text-muted mb-4">商品信息</h6>-->
                <div class="pl-lg-4">
                    <div class="row">
                        <div class="col-lg-6">
                            <base-input
                                alternative=""
                                label="货号"
                                placeholder="货号"
                                input-classes="form-control-alternative"
                                name="code"
                                v-model="productView.form.code"
                                @input="getInput"
                                :disabled="productView.form.isLoading"
                            />
                        </div>
                        <div class="col-lg-6">
                            <base-input
                                alternative=""
                                label="名称"
                                placeholder="名称"
                                input-classes="form-control-alternative"
                                name="name"
                                v-model="productView.form.name"
                                @input="getInput"
                                :disabled="productView.form.isLoading"
                            />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-6">
                            <label class="form-control-label">颜色</label>
                            <v-select
                                :searchable=true
                                :options="commonView.colorSelect.data"
                                v-model="productView.form.colorSelect.selectedValue"
                                :labelSearchPlaceholder="commonView.labelSearchPlaceholder"/>
                        </div>
                        <div class="col-lg-6">
                            <base-input
                                type="Number"
                                alternative=""
                                label="价格"
                                placeholder="价格"
                                input-classes="form-control-alternative"
                                name="price"
                                v-model="productView.form.price"
                                @input="getInput"
                                :disabled="productView.form.isLoading"
                            />
                        </div>
                    </div>
                    <hr>
                    <div class="col-12">
                        <label class="form-control-label">备注</label>
                        <yimo-vue-editor v-model="productView.form.remark" @input="updateRemark"/>
                    </div>
                    <hr>
                    <div class="row">
                        <FileUpload/>
                    </div>
                    <div class="col-12" style="text-align: right">
                        <base-button type="primary" :outline="true" size="sm" @click="handleSubmit"
                                     :disabled="productView.form.isLoading">
                            <b-spinner small type="grow" v-if="productView.form.isLoading"/>
                            提交
                        </base-button>
                    </div>
                </div>
            </template>
        </card>
    </div>
</template>

<script>
import VSelect from '@alfsnd/vue-bootstrap-select'
import FileUpload from "@/components/MyComponents/FileUpload";
import {mapActions, mapState} from "vuex";
import {handleSubmitForm, handleUpdateForm} from "@/functions";
import YimoVueEditor from 'yimo-vue-editor'

export default {
    name: "ProductForm",
    components: {
        VSelect,
        FileUpload,
        YimoVueEditor
    },
    data: () => (
        {
            productFormKeys: {
                code: {
                    type: 'String',
                    isRequired: true,
                    str: '货号'
                },
                name: {
                    type: 'String',
                    isRequired: true,
                    str: '名称'
                },
                colorRef: {
                    type: 'String',
                    isRequired: true,
                    str: '颜色id'
                },
                price: {
                    type: 'Number',
                    isRequired: false,
                    str: '价格'
                },
                productImages: {
                    type: 'String',
                    isRequired: false,
                    str: '商品图片'
                },
                remark: {
                    type: 'String',
                    isRequired: false,
                    str: '备注'
                }
            }
        }
    ),
    methods: {
        ...mapActions(["updateViewComponent", "submitForm", "updateFormSingleData", "updateCommonSelectSubValue", "increaseRequestingTasksCount"]),
        getInput(key, value) {
            handleUpdateForm(this, 'productView', key, value)
        },
        handleSubmit() {
            handleSubmitForm(this, 'productView', this.productFormKeys)
        },
        updateRemark(value) {
            this.updateFormSingleData({view: 'productView', key: 'remark', value})
        }
    },
    computed: {
        ...mapState(['productView', 'commonView', 'colorView'])
    },
    watch: {
        "productView.form.colorSelect.selectedValue.value": {
            handler: function (newVal, oldVal) {
                if (newVal === oldVal) return
                this.updateFormSingleData({view: 'productView', key: 'colorRef', value: newVal})
            }
        }
    }
}
</script>

<style scoped>

</style>
