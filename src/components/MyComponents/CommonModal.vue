<template>
    <modal :show.sync="modals.isShow"
           :gradient="modals.objConfig.gradient"
           modal-classes="modal-danger modal-dialog-centered">
        <h6 slot="header" class="modal-title" id="modal-title-notification">{{ modals.objConfig.header }}</h6>

        <div class="py-3 text-center">
            <i class="ni ni-bell-55 ni-3x"></i>
            <h4 class="heading mt-4">{{ modals.objConfig.heading }}</h4>
            <p>{{ modals.objConfig.body }}</p>
        </div>

        <template slot="footer">
            <base-button :type="modals.objConfig.gradient" @click="handleModalConfirmClick()">确定</base-button>
            <base-button type="secondary" @click="modals.isShow = false">取消</base-button>
        </template>
    </modal>
</template>

<script>
export default {
    name: "CommonModal",
    props: {
        modals: {
            type: Object,
            default: () => ({})
        },
        handleModalConfirmClick: {
            type: Function
        }
    }
}
</script>

<style scoped>

</style>
