<template>
    <div>
        <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
            <div class="row">
                <DriverForm style="margin-top: 20px;"/>
            </div>
        </base-header>
        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col">
                    <DriverTable title="司机详情"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import DriverForm from "@/components/MyComponents/DriverForm";
import DriverTable from "@/views/Tables/DriverTable";
export default {
name: "Driver",
    components: {DriverTable, DriverForm}
}
</script>

<style scoped>

</style>
