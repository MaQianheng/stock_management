<template>
    <div>
        SaleId {{ $route.params.id }}
    </div>
</template>

<script>
export default {
    name: "SaleHistoryDetail",
    mounted() {
        console.log(this.$route.params.id)
    }
}
</script>

<style scoped>

</style>
