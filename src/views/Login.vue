<template>
    <div class="row justify-content-center">
        <div class="col-lg-5 col-md-7">
            <div class="card bg-secondary shadow border-0">
                <div class="card-body px-lg-5 py-lg-5">
                    <div class="text-center text-muted mb-4">
                        <small>请登陆</small>
                    </div>
                    <form role="form">
                        <base-input class="input-group-alternative mb-3"
                                    placeholder="用户名"
                                    addon-left-icon="ni ni-badge"
                                    name="username"
                                    @input="getInput"
                                    v-model="model.username"
                                    :disabled="loginView.form.isLoading">
                        </base-input>

                        <base-input class="input-group-alternative"
                                    placeholder="密码"
                                    type="password"
                                    addon-left-icon="ni ni-lock-circle-open"
                                    name="password"
                                    @input="getInput"
                                    v-model="model.password"
                                    :disabled="loginView.form.isLoading"
                                    @keypress.enter="handleClick">
                        </base-input>

                        <base-checkbox class="custom-control-alternative" v-model="checked">
                            <span class="text-muted">记住我</span>
                        </base-checkbox>
                        <div class="text-center">
                            <base-button type="primary" class="my-4" @click="handleClick" :disabled="loginView.form.isLoading">
                                <b-spinner small type="grow" v-if="loginView.form.isLoading"/>
                                登陆
                            </base-button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {mapActions, mapState} from "vuex";
import {validateInputAlphaBetAndNumber} from "@/functions/utils";
import {funcComputeAlertLevel} from "@/functions";

export default {
    name: 'login',
    data: () => (
        {
            model: {
                username: '',
                password: ''
            },
            checked: false
        }
    ),
    methods: {
        ...mapActions(['login']),
        getInput(key, value) {
            this.model[key] = validateInputAlphaBetAndNumber(value)
        },
        handleClick() {
            if (this.model.username === '' || this.model.password === '') {
                this.$notify({
                    type: 'danger',
                    title: '用户名或密码不能为空'
                })
                return
            }
            this.login(this.model).then(() => {
                const {err_code} = this.loginView
                this.$notify({
                    type: funcComputeAlertLevel(err_code),
                    title: this.loginView.message
                })
                if (err_code === 0) {
                    if (this.checked) {
                        localStorage.setItem('qianhengma_stock_management_token', this.loginView.token)
                        localStorage.setItem('qianhengma_stock_management_name', this.loginView.name)
                        localStorage.setItem('qianhengma_stock_management_user_level', this.loginView.level)
                    }
                    this.$router.replace('/dashboard')
                }
            })
        }
    },
    computed: {
        ...mapState(['loginView'])
    }
}
</script>
<style>
</style>
