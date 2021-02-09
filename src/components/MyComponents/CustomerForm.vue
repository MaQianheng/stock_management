<template>
    <form @submit.prevent>
        <h6 class="heading-small text-muted mb-4">客户信息</h6>
        <div class="pl-lg-4">
            <div class="row">
                <div class="col-lg-12">
                    <base-input alternative=""
                                label="姓名"
                                placeholder="姓名"
                                input-classes="form-control-alternative"
                                name="name"
                                v-model="customerView.form.name"
                                @input="getInput"
                                :disabled="customerView.form.isLoading"
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
                            label="备注"
                >
                    <textarea rows="4" class="form-control form-control-alternative"
                              placeholder="备注..."
                              name="remark"
                              :value="customerView.form.remark"
                              @change="getTextArea"
                              :disabled="customerView.form.isLoading"
                    />
                </base-input>
            </div>
        </div>
        <div class="col-12" style="text-align: right">
            <base-button type="primary" :outline="true" size="sm" @click="handleSubmit"
                         :disabled="customerView.form.isLoading">
                <b-spinner small type="grow" v-if="customerView.form.isLoading"/>
                提交
            </base-button>
        </div>
    </form>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import {handleSubmitForm, handleUpdateForm} from "@/functions";

export default {
    name: "CustomerForm",
    data: () => (
        {
            customerFormKeys: {
                name: {
                    isRequired: true,
                    str: '姓名'
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
            handleUpdateForm(this, 'customerView', key, value)
        },
        getTextArea(e) {
            handleUpdateForm(this, 'customerView', 'remark', e.target.value)
        },
        handleSubmit() {
            handleSubmitForm(this, `customerView`, this.customerFormKeys)
        }
    },
    computed: {
        ...mapState(["customerView"])
    }
}
</script>

<style></style>
