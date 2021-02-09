<template>
    <fade-transition :duration="200" origin="center top" mode="out-in">
        <div v-show="isLoading">
            <div class="modal-backdrop" style="opacity: 0.5"/>
            <div class="text-center"
                 style="position: fixed; left: 50%; bottom: 50%; z-index: 1060; opacity: 1;">
                <b-spinner variant="success" type="grow" label="Spinning" style="width: 2rem; height: 2rem;"/>
            </div>
        </div>
    </fade-transition>
</template>

<script>
import {BSpinner} from 'bootstrap-vue'
import {FadeTransition} from 'vue2-transitions'

export default {
    name: "Spinner",
    components: {
        BSpinner,
        FadeTransition
    },
    props: {
        isLoading: {
            type: Boolean,
            default: true
        }
    }
}
</script>

<style scoped>

</style>
