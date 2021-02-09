<template>
    <div>
        <base-header class="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
                     style="min-height: 600px; background-image: url(img/theme/supplier.jpg); background-size: cover; background-position: center top;">
            <!-- Mask -->
            <span class="mask bg-gradient-success opacity-8"></span>
            <!-- Header container -->
            <div class="container-fluid d-flex align-items-center">
                <div class="row">
                    <div class="col-lg-12">
                        <h1 class="display-2 text-white">供应商信息</h1>
                    </div>
                </div>
            </div>
        </base-header>

        <div class="container-fluid mt--7">
            <div class="row">
                <div class="col-xl-12 order-xl-1">
                    <card shadow type="secondary">
                        <div slot="header" class="bg-white border-0">
                            <div class="row align-items-center">
                                <div class="col-8">
                                    <h3 class="mb-0">添加供应商</h3>
                                </div>
                            </div>
                        </div>
                        <SupplierForm/>
                    </card>
                </div>
            </div>

            <SupplierTable/>

        </div>
    </div>
</template>

<script>
import SupplierForm from "@/components/MyComponents/SupplierForm";
import SupplierTable from "@/views/Tables/SupplierTable";

export default {
    name: "Supplier",
    components: {
        SupplierTable,
        SupplierForm,
    }
}
</script>

<style scoped>

</style>
