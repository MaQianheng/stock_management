<template>
    <div>
        <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
            <div class="row">
                <UserForm style="margin-top: 20px;"/>
            </div>
        </base-header>
        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col">
                    <UserTable title="管理员详情"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import UserForm from "@/components/MyComponents/UserForm";
import UserTable from "@/views/Tables/UserTable";
export default {
    name: "User",
    components: {UserTable, UserForm}
}
</script>

<style scoped>

</style>
