<template>
    <div>
        <img alt="Image placeholder"
             :class="imageClass"
             :src="imageSrc"
             :style="imageStyle"
             @click="isShow = true"
        >
        <modal :show.sync="isShow">
            <!--        <h6 slot="header" class="modal-title" id="modal-title-default">{{ files[0] ? files[0].name : '' }}</h6>-->
            <div class="row">
                <img :src="imageSrc" style="box-shadow: 3px 3px 10px; width: 100%;">
            </div>
            <template slot="footer">
                <base-button type="secondary" @click="isShow = false">关闭</base-button>
            </template>
        </modal>
    </div>
</template>

<script>
export default {
    name: "ImageZoomModal",
    data: () => (
        {
            isShow: false
        }
    ),
    props: {
        imageSrc: {
            type: String,
            default: ''
        },
        imageClass: {
            type: String,
            default: ''
        },
        imageHeight: {
            type: String,
            default: ''
        },
        imageWidth: {
            type: String,
            default: ''
        }
    },
    computed: {
        imageStyle() {
            let style = 'cursor: pointer;'
            if (this.imageHeight !== '') style += `height: ${this.imageHeight}`
            if (this.imageWidth !== '') style += `width: ${this.imageWidth}`
            return style
        }
    }
}
</script>

<style scoped>

</style>
