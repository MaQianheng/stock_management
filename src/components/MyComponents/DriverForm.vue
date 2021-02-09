<template>
    <div class="col-xl-12 order-xl-1">
        <card shadow type="secondary">
            <div slot="header" class="bg-white border-0">
                <div class="row align-items-center">
                    <div class="col-8">
                        <h3 class="mb-0">添加司机</h3>
                    </div>
                </div>
            </div>
            <template>
                <div class="pl-lg-4">
                    <div class="row">
                        <div class="col-lg-6">
                            <base-input
                                alternative=""
                                label="司机"
                                placeholder="司机"
                                input-classes="form-control-alternative"
                                name="name"
                                v-model="driverView.form.name"
                                @input="getInput"
                                :disabled="driverView.form.isLoading"/>
                        </div>
                        <div class="col-lg-6">
                            <base-input
                                alternative=""
                                label="电话"
                                placeholder="电话"
                                input-classes="form-control-alternative"
                                name="phone"
                                v-model="driverView.form.phone"
                                @input="getInput"
                                :disabled="driverView.form.isLoading"/>
                        </div>
                        <div class="col-lg-6">
                            <base-input
                                alternative=""
                                label="车牌"
                                placeholder="车牌"
                                input-classes="form-control-alternative"
                                name="plate"
                                v-model="driverView.form.plate"
                                @input="getInput"
                                :disabled="driverView.form.isLoading"/>
                        </div>
                        <div class="col-lg-12" style="text-align: right">
                            <base-button type="primary" :outline="true" size="sm" @click="handleSubmit"
                                         :disabled="driverView.form.isLoading">
                                <b-spinner small type="grow" v-if="driverView.form.isLoading"/>
                                提交
                            </base-button>
                        </div>
                    </div>
                </div>
            </template>
        </card>
    </div>
</template>

<script>
import {mapActions, mapState} from "vuex";
import {handleSubmitForm, handleUpdateForm} from "@/functions";
import {validateInputNumber} from "@/functions/utils";

export default {
    name: "DriverForm",
    data: () => (
        {
            driverFormKeys: {
                name: {
                    isRequired: true,
                    str: '司机'
                },
                phone: {
                    isRequired: true,
                    str: '电话'
                },
                plate: {
                    isRequired: true,
                    str: '车牌'
                }
            }
        }
    ),
    methods: {
        ...mapActions(["updateViewComponent", "submitForm", "updateFormSingleData", "updateCommonSelectSubValue", "increaseRequestingTasksCount"]),
        getInput(key, value) {
            if (key === 'phone') value = validateInputNumber(value)
            handleUpdateForm(this, 'driverView', key, value)
        },
        handleSubmit() {
            handleSubmitForm(this, 'driverView', this.driverFormKeys)
        }
    },
    computed: {
        ...mapState(['driverView'])
    }
}
</script>

<style scoped>

</style>
