<template>
    <div>
        <b-row>
            <b-col cols="12" class="mt-3">
                <b-skeleton-img card-img="top" aspect="3:1" height="200px"></b-skeleton-img>
            </b-col>
        </b-row>
        <b-card>
            <b-skeleton animation="throb" width="100%"/>
            <hr style="margin: 1rem 0;">
            <div>
                <b-skeleton animation="wave" width="85%"/>
                <b-skeleton animation="wave" width="60%"/>
            </div>
            <hr style="margin: 1rem 0;">
            <div class="row" style="padding: 20px; margin: 10px 0;">
                <b-skeleton type="button" class="col-5"></b-skeleton>
                <div class="col-2"/>
                <b-skeleton type="button" class="col-5"></b-skeleton>
            </div>
            <div class="row">
                <div class="col-4" style="text-align: center;">
                    <b-skeleton animation="throb" width="100%"></b-skeleton>
                </div>
                <div class="col-4" style="text-align: center;">
                    <b-skeleton animation="throb" width="100%"></b-skeleton>
                </div>
                <div class="col-4" style="text-align: center;">
                    <b-skeleton animation="throb" width="100%"></b-skeleton>
                </div>
                <div class="col-4" style="text-align: center;">
                    <b-skeleton animation="wave" width="100%"></b-skeleton>
                </div>
                <div class="col-4" style="text-align: center;">
                    <b-skeleton animation="wave" width="100%"></b-skeleton>
                </div>
                <div class="col-4" style="text-align: center;">
                    <b-skeleton animation="wave" width="100%"></b-skeleton>
                </div>
            </div>
        </b-card>
    </div>
</template>

<script>

export default {
    name: "isLoadingProductInfoCard"
}
</script>

<style scoped>

</style>
