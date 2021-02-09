<template>
    <form @submit.prevent>
        <h6 class="heading-small text-muted mb-4">供应商信息</h6>
        <div class="pl-lg-4">
            <div class="row">
                <div class="col-lg-12">
                    <base-input alternative=""
                                label="供应商名称"
                                placeholder="供应商名称"
                                input-classes="form-control-alternative"
                                name="supplierName"
                                v-model="supplierView.form.supplierName"
                                @input="getInput"
                                :disabled="supplierView.form.isLoading"
                    />
                </div>
            </div>
            <div class="row">
                <div class="col-lg-6">
                    <base-input alternative=""
                                label="姓名"
                                placeholder="姓名"
                                input-classes="form-control-alternative"
                                name="name"
                                v-model="supplierView.form.name"
                                @input="getInput"
                                :disabled="supplierView.form.isLoading"
                    />
                </div>
                <div class="col-lg-6">
                    <base-input alternative=""
                                label="电话"
                                placeholder="电话"
                                input-classes="form-control-alternative"
                                name="phone"
                                v-model="supplierView.form.phone"
                                @input="getInput"
                                :disabled="supplierView.form.isLoading"
                    />
                </div>
            </div>
        </div>
        <hr class="my-4"/>
        <!-- Description -->
        <h6 class="heading-small text-muted mb-4">其它</h6>
        <div class="pl-lg-4">
            <div class="form-group">
                <base-input alternative=""
                            label="备注">
                    <textarea rows="4" class="form-control form-control-alternative"
                              name="remark"
                              :value="supplierView.form.remark"
                              @change="getTextArea"
                              :disabled="supplierView.form.isLoading"
                              placeholder="备注..."/>
                </base-input>
            </div>
        </div>
        <div class="col-12" style="text-align: right">
            <base-button type="primary" :outline="true" size="sm" @click="handleSubmit"
                         :disabled="supplierView.form.isLoading">
                <b-spinner small type="grow" v-if="supplierView.form.isLoading"/>
                提交
            </base-button>
        </div>
    </form>
</template>

<script>

import {mapActions, mapState} from "vuex";
import {handleSubmitForm, handleUpdateForm} from "@/functions";
import {validateInputNumber} from "@/functions/utils";

export default {
    name: "SupplierForm",
    data: () => (
        {
            // supplierFormKeys: ['supplierName', 'name', 'phone', 'remark'],
            supplierFormKeys: {
                supplierName: {
                    isRequired: true,
                    str: '供应商名称'
                },
                name: {
                    isRequired: true,
                    str: '姓名'
                },
                phone: {
                    isRequired: false,
                    str: '电话'
                },
                remark: {
                    isRequired: false,
                    str: '备注'
                }
            }
        }
    ),
    methods: {
        ...mapActions(["updateViewComponent", "submitForm", "updateFormSingleData", "updateCommonSelectSubValue", "increaseRequestingTasksCount"]),
        getInput(key, value) {
            if (key === 'phone') value = validateInputNumber(value)
            handleUpdateForm(this, 'supplierView', key, value)
        },
        getTextArea(e) {
            handleUpdateForm(this, 'supplierView', 'remark', e.target.value)
        },
        handleSubmit() {
            // this.updateFormSingleData({view: 'supplierView', key: 'isLoading', value: true})
            handleSubmitForm(this, `supplierView`, this.supplierFormKeys)
        }
    },
    computed: {
        ...mapState(["supplierView"])
    }
}
</script>

<style scoped>

</style>
