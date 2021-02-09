<template>
    <div>
        <base-header class="header pb-8 pt-5 pt-lg-8 d-flex align-items-center"
                     style="min-height: 600px; background-image: url(img/theme/profile-cover.jpg); background-size: cover; background-position: center top;">
            <!-- Mask -->
            <span class="mask bg-gradient-success opacity-8"></span>
            <!-- Header container -->
            <div class="container-fluid d-flex align-items-center">
                <div class="row">
                    <div class="col-lg-12">
                        <h1 class="display-2 text-white">客户信息</h1>
                        <!--                        <p class="text-white mt-0 mb-5">This is your profile page. You can see the progress you've made-->
                        <!--                            with your work and manage your projects or assigned tasks</p>-->
                        <!--                        <a href="#!" class="btn btn-info">Edit profile</a>-->
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
                                    <h3 class="mb-0">添加客户</h3>
                                </div>
                            </div>
                        </div>
                        <CustomerForm/>
                    </card>
                </div>
            </div>

            <CustomerTable/>

        </div>
    </div>
</template>
<script>
import CustomerForm from "@/components/MyComponents/CustomerForm";
import CustomerTable from "@/views/Tables/CustomerTable";

export default {
    name: 'user-profile',
    components: {
        CustomerForm,
        CustomerTable
    }
};
</script>
<style></style>
