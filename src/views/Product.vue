<template>
    <div>
        <base-header type="gradient-success" class="pb-6 pb-8 pt-5 pt-md-8">
            <div class="row">
                <ProductForm style="margin-top: 20px;"/>
            </div>
        </base-header>

        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col">
                    <ProductTable title="商品详情"/>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
import ProductForm from "@/components/MyComponents/ProductForm";
import ProductTable from "@/views/Tables/ProductTable";

export default {
    name: 'tables',
    components: {
        ProductForm,
        ProductTable
    }
};
</script>
<style></style>
