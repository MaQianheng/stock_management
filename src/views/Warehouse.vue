<template>
    <div>
        <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
            <div class="row">
                <WarehouseForm style="margin-top: 20px;"/>
            </div>
        </base-header>

        <div class="container-fluid mt--7">
            <WarehouseTable title="库房详情"/>
        </div>

        <div class="container-fluid mt--7" style="margin-top: 30px !important;">
            <ShelfTable title="货架详情"/>
        </div>
    </div>
</template>

<script>
import WarehouseTable from "@/views/Tables/WarehouseTable";
import WarehouseForm from "@/components/MyComponents/WarehouseForm";
import ShelfTable from "@/views/Tables/ShelfTable";

export default {
    name: "Other",
    components: {
        ShelfTable,
        WarehouseForm,
        WarehouseTable
    }
}
</script>

<style scoped>

</style>
