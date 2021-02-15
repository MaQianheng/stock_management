<template>
    <div>
        <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
            <div class="row">
                <ColorForm style="margin-top: 20px;"/>
            </div>
        </base-header>
        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col">
                    <ColorTable title="颜色详情"/>
                </div>
            </div>
        </div>
<!--        <spinner :is-loading="isLoading"/>-->
    </div>
</template>

<script>
import ColorForm from "@/components/MyComponents/ColorForm";
import ColorTable from "@/views/Tables/ColorTable";
// import Spinner from "@/components/MyComponents/Spinner";

export default {
    name: "Color",
    components: {
        ColorTable,
        ColorForm,
        // Spinner
    }
}
</script>

<style scoped>

</style>
