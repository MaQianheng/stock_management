<template>
    <b-card style="margin-bottom: 0; margin-top: 3rem;">
        <div class="row justify-content-center">
            <div class="col-lg-3 order-lg-2">
                <div class="card-profile-image">
                    <b-skeleton-icon
                        icon="person-fill"
                        :icon-props="{ fontScale: 5, variant: 'dark' }"
                    ></b-skeleton-icon>
                </div>
            </div>
        </div>
        <div class="card-body pt-0 pt-md-4">
            <div class="row">
                <div class="col">
                    <div class="card-profile-stats d-flex justify-content-center mt-md-5">
                        <div class="col-4">
                            <b-skeleton animation="throb" width="100%"/>
                            <span class="description">收货次数</span>
                        </div>
                        <div class="col-4">
                            <b-skeleton animation="throb" width="100%"/>
                            <span class="description">收货总重</span>
                        </div>
                        <div class="col-4">
                            <b-skeleton animation="throb" width="100%"/>
                            <span class="description">xxxx</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="text-center">
                <h3>
                    <b-skeleton animation="throb" width="100%"/>
                </h3>
                <hr class="my-4"/>
                <p style="overflow: scroll; height: 100px;">
                    <b-skeleton animation="throb" width="85%"/>
                    <b-skeleton animation="throb" width="55%"/>
                    <b-skeleton animation="throb" width="70%"/>
                </p>
                <div class="row" style="padding: 0 10px;">
                    <b-skeleton size="md" type="button" class="col-4"/>
                    <div class="col-4"/>
                    <b-skeleton type="button" class="col-4"/>
                </div>
            </div>
        </div>
        <!--        </div>-->
    </b-card>

</template>

<script>
import {BSkeleton, BSkeletonIcon} from 'bootstrap-vue'

export default {
    name: "IsLoadingCard",
    components: {
        BSkeleton,
        BSkeletonIcon
    }
}
</script>

<style scoped>

</style>
