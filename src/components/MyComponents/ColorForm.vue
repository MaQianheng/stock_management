<template>
    <div class="col-xl-12 order-xl-1">
        <card shadow type="secondary">
            <div slot="header" class="bg-white border-0">
                <div class="row align-items-center">
                    <div class="col-8">
                        <h3 class="mb-0">添加颜色</h3>
                    </div>
                </div>
            </div>
            <template>
                <form @submit.prevent>
                    <!--                    <h6 class="heading-small text-muted mb-4">颜色信息</h6>-->
                    <div class="pl-lg-4">
                        <div class="row">
                            <div class="col-lg-6">
                                <base-input alternative=""
                                            label="颜色"
                                            placeholder="颜色"
                                            input-classes="form-control-alternative"
                                            name="color"
                                            v-model="colorView.form.color"
                                            @input="getInput"
                                            :disabled="colorView.form.isLoading"
                                            @keyup.enter="handleSubmit"
                                />
                            </div>
                            <div class="col-lg-12" style="text-align: right">
                                <base-button type="primary" :outline="true" size="sm" @click="handleSubmit"
                                             :disabled="colorView.form.isLoading">
                                    <b-spinner small type="grow" v-if="colorView.form.isLoading"/>
                                    提交
                                </base-button>
                            </div>
                        </div>
                    </div>
                </form>
            </template>
        </card>
    </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import {BSpinner} from 'bootstrap-vue'
import {
    handleSubmitForm,
    handleUpdateForm,
} from "@/functions";

export default {
    name: "ColorForm",
    components: {
        BSpinner
    },
    data: () => (
        {
            colorFormKeys: {
                color: {
                    isRequired: true,
                    str: '颜色'
                }
            }
        }
    ),
    methods: {
        ...mapActions(["updateViewComponent", "submitForm", "updateFormSingleData", "updateCommonSelectSubValue", "increaseRequestingTasksCount"]),
        getInput(key, value) {
            handleUpdateForm(this, 'colorView', key, value)
        },
        handleSubmit() {
            handleSubmitForm(this, 'colorView', this.colorFormKeys)
        }
    },
    computed: {
        ...mapState(["colorView"])
    }
}
</script>

<style scoped>

</style>
