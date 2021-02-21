<template>
    <b-card style="margin-bottom: 0; margin-top: 3rem;">
        <!--        <div class="card card-profile shadow">-->
        <div class="row justify-content-center">
            <div class="col-lg-3 order-lg-2">
                <div class="card-profile-image">
                    <a href="#">
                        <img src="img/theme/user_1.png" class="rounded-circle">
                    </a>
                </div>
            </div>
        </div>
        <div class="card-header text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
            <div class="d-flex justify-content-between">
                <base-button size="sm" type="default" class="mr-4" v-b-popover.hover.top="email">
                    <!--                    <a href="mailto:qianhengma@gmail.com" style="color: white;">邮箱</a>-->
                    <a href="" style="color: white;">邮箱</a>
                </base-button>
                <base-button size="sm" type="info" class="float-right" v-b-popover.hover.top="phone">
                    <a :href="'tel:' + phone" style="color: white;">电话</a>
                </base-button>
            </div>
        </div>
        <div class="card-body pt-0 pt-md-4">
<!--            <div class="row">-->
<!--                <div class="col">-->
<!--                    <div class="card-profile-stats d-flex justify-content-center mt-md-5">-->
<!--                        <div class="col-4">-->
<!--                            <span class="heading">未完成</span>-->
<!--                            <span class="description">{{ subTitleCount }}</span>-->
<!--                        </div>-->
<!--                        <div class="col-4">-->
<!--                            <span class="heading">未完成</span>-->
<!--                            <span class="description">{{ subTitleWeight }}</span>-->
<!--                        </div>-->
<!--                        <div class="col-4">-->
<!--                            <span class="heading">未完成</span>-->
<!--                            <span class="description">xxxx</span>-->
<!--                        </div>-->
<!--                    </div>-->
<!--                </div>-->
<!--            </div>-->
            <div class="text-center">
                <h2>
                    {{ dataSource.supplierName }}
                </h2>
                <h3>
                    {{ dataSource.name }}
                </h3>
                <hr class="my-4"/>
                <p>
                    {{ dataSource.remark ? dataSource.remark : '无备注' }}
                </p>
                <!--                    <base-button size="md" type="primary" :outline="true" style="letter-spacing: 0;">编辑</base-button>-->
                <div class="row">
                    <base-button
                        class="col-4"
                        type="primary" :outline="true"
                        :row-id="dataSource.row" size="md"
                        :disabled="dataSource.status === 2"
                        @click="handleClick('edit', dataSource.row)">
                        <b-spinner small type="grow" v-if="dataSource.status === 2"/>
                        编辑
                    </base-button>
                    <div class="col-3"/>
                    <base-button
                        class="col-4"
                        type="danger" :outline="true"
                        :row-id="dataSource.row" size="md"
                        :disabled="dataSource.status === 2"
                        @click="handleClick('delete', dataSource.row)">
                        <b-spinner small type="grow" v-if="dataSource.status === 2"/>
                        删除
                    </base-button>
                </div>
            </div>
        </div>
    </b-card>
</template>

<script>
export default {
    name: "UserInfoCard",
    props: {
        parent: {
            type: String,
            default: 'customer'
        },
        dataSource: {
            type: Object,
            default: () => ({})
        }
    },
    computed: {
        email: function () {
            return this.dataSource.email ? this.dataSource.email : '无'
        },
        phone: function () {
            return this.dataSource.phone ? this.dataSource.phone : '无'
        },
        subTitleCount: function () {
            return this.type === 'customer' ? '收货次数' : '出货次数'
        },
        subTitleWeight: function () {
            return this.type === 'customer' ? '收货总重' : '出货总重'
        }
    },
    methods: {
        handleClick(directive, index) {
            this.$emit('fromInfoCard', directive, index)
        }
    }
}
</script>

<style scoped>

</style>
