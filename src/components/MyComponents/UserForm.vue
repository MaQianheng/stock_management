<template>
    <div class="col-xl-12 order-xl-1">
        <card shadow type="secondary">
            <div slot="header" class="bg-white border-0">
                <div class="row align-items-center">
                    <div class="col-8">
                        <h3 class="mb-0">添加管理员</h3>
                    </div>
                </div>
            </div>
            <template>
                <div class="pl-lg-4">
                    <div class="row">
                        <div class="col-lg-6">
                            <base-input
                                alternative=""
                                label="用户名"
                                placeholder="用户名"
                                input-classes="form-control-alternative"
                                name="username"
                                v-model="userView.form.username"
                                @input="getInput"
                                :disabled="userView.form.isLoading"/>
                        </div>
                        <div class="col-lg-6">
                            <base-input
                                alternative=""
                                label="密码"
                                placeholder="密码"
                                input-classes="form-control-alternative"
                                name="password"
                                v-model="userView.form.password"
                                @input="getInput"
                                :disabled="userView.form.isLoading"/>
                        </div>
                        <div class="col-lg-6">
                            <base-input
                                alternative=""
                                label="姓名"
                                placeholder="姓名"
                                input-classes="form-control-alternative"
                                name="name"
                                v-model="userView.form.name"
                                @input="getInput"
                                :disabled="userView.form.isLoading"/>
                        </div>
                        <div class="col-lg-6">
                            <label class="form-control-label">管理员等级</label>
                            <v-select
                                :searchable=true
                                :options="commonView.levelSelect.data"
                                v-model="userView.form.levelSelect.selectedValue"
                                :labelSearchPlaceholder="commonView.labelSearchPlaceholder"
                                :disabled="userView.form.isLoading"/>
                        </div>
                        <div class="col-lg-12" style="text-align: right">
                            <base-button type="primary" :outline="true" size="sm" @click="handleSubmit"
                                         :disabled="userView.form.isLoading">
                                <b-spinner small type="grow" v-if="userView.form.isLoading"/>
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
import VSelect from '@alfsnd/vue-bootstrap-select'
import {validateInputAlphaBetAndNumber} from "@/functions/utils";

export default {
    name: "UserForm",
    components: {
        VSelect
    },
    data: () => (
        {
            userFormKeys: {
                username: {
                    isRequired: true,
                    str: '用户名'
                },
                password: {
                    isRequired: true,
                    str: '密码'
                },
                name: {
                    isRequired: true,
                    str: '姓名'
                },
                level: {
                    isRequired: true,
                    str: '等级'
                }
            }
        }
    ),
    methods: {
        ...mapActions(["updateViewComponent", "submitForm", "updateFormSingleData", "updateCommonSelectSubValue", "increaseRequestingTasksCount"]),
        getInput(key, value) {
            if (key === 'username' || key === 'password') value = validateInputAlphaBetAndNumber(value)
            handleUpdateForm(this, 'userView', key, value)
        },
        handleSubmit() {
            handleSubmitForm(this, 'userView', this.userFormKeys)
        }
    },
    computed: {
        ...mapState(['userView', 'commonView'])
    },
    watch: {
        "userView.form.levelSelect.selectedValue.value": {
            handler: function (newVal) {
                this.updateFormSingleData({view: 'userView', key: 'level', value: newVal})
            }
        }
    }
}
</script>

<style scoped>

</style>
