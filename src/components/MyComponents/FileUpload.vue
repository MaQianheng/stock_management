<template>
    <div class="col-12">
        <label class="form-control-label">上传图片</label>

        <div v-show="$refs.upload && $refs.upload.dropActive" class="drop-active">
            <h3>拖拽松开上传</h3>
        </div>
        <div class="upload" v-show="!isOption">
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                    <tr>
                        <th>编号</th>
                        <th>缩略图</th>
                        <th>名称</th>
                        <th>宽度</th>
                        <th>高度</th>
                        <th>大小</th>
<!--                        <th>速度</th>-->
<!--                        <th>状态</th>-->
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-if="!files.length">
                        <td colspan="9">
                            <div class="text-center p-5">
                                <h4>拖拽文件<br/>或者</h4>
                                <label :for="name" class="btn btn-lg btn-primary">选择图片</label>
                            </div>
                        </td>
                    </tr>
                    <tr v-for="(file, index) in files" :key="file.id">
                        <td>{{ index }}</td>
                        <td>
                            <img class="td-image-thumb" v-if="file.thumb" :src="file.thumb"/>
                            <span v-else>No Image</span>
                        </td>
                        <td>
                            <div class="filename">
                                {{ file.name }}
                            </div>
<!--                            <div class="progress" v-if="file.active || file.progress !== '0.00'">-->
<!--                                <div-->
<!--                                    :class="{'progress-bar': true, 'progress-bar-striped': true, 'bg-danger': file.error, 'progress-bar-animated': file.active}"-->
<!--                                    role="progressbar" :style="{width: file.progress + '%'}">{{ file.progress }}%-->
<!--                                </div>-->
<!--                            </div>-->
                        </td>
                        <td>{{ file.width || 0 }}</td>
                        <td>{{ file.height || 0 }}</td>
                        <td>{{ file.size | formatSize }}</td>
<!--                        <td>{{ file.speed | formatSize }}</td>-->

<!--                        <td v-if="file.error">{{ file.error }}</td>-->
<!--                        <td v-else-if="file.success">成功</td>-->
<!--                        <td v-else-if="file.active">激活</td>-->
<!--                        <td v-else></td>-->
                        <td>
                            <div class="btn-group">
                                <!--                                <button class="btn btn-secondary btn-sm dropdown-toggle" type="button">-->
                                <!--                                    Action-->
                                <!--                                </button>-->
                                <!--                                <base-button :class="{'dropdown-item': true, disabled: file.active || file.success || file.error === 'compressing' || file.error === 'image parsing'}"-->
                                <!--                                       @click.prevent="file.active || file.success || file.error === 'compressing' ? false : onEditFileShow(file)">Edit</base-button>-->
                                <base-button
                                    type="warning"
                                    @click.prevent="$refs.upload.remove(file)">移除
                                </base-button>
                                <!--                                <div class="dropdown-menu">-->
                                <!--                                    <a :class="{'dropdown-item': true, disabled: file.active || file.success || file.error === 'compressing' || file.error === 'image parsing'}"-->
                                <!--                                       href="#"-->
                                <!--                                       @click.prevent="file.active || file.success || file.error === 'compressing' ? false :  onEditFileShow(file)">Edit</a>-->
                                <!--                                    <a :class="{'dropdown-item': true, disabled: !file.active}" href="#"-->
                                <!--                                       @click.prevent="file.active ? $refs.upload.update(file, {error: 'cancel'}) : false">Cancel</a>-->

                                <!--                                    <a class="dropdown-item" href="#" v-if="file.active"-->
                                <!--                                       @click.prevent="$refs.upload.update(file, {active: false})">Abort</a>-->
                                <!--                                    <a class="dropdown-item" href="#"-->
                                <!--                                       v-else-if="file.error && file.error !== 'compressing' && file.error !== 'image parsing' && $refs.upload.features.html5"-->
                                <!--                                       @click.prevent="$refs.upload.update(file, {active: true, error: '', progress: '0.00'})">Retry-->
                                <!--                                        upload</a>-->
                                <!--                                    <a :class="{'dropdown-item': true, disabled: file.success || file.error === 'compressing' || file.error === 'image parsing'}"-->
                                <!--                                       href="#" v-else-->
                                <!--                                       @click.prevent="file.success || file.error === 'compressing' || file.error === 'image parsing' ? false : $refs.upload.update(file, {active: true})">Upload</a>-->

                                <!--                                    <div class="dropdown-divider"></div>-->
                                <!--                                    <a class="dropdown-item" href="#"-->
                                <!--                                       @click.prevent="$refs.upload.remove(file)">Remove</a>-->
                                <!--                                </div>-->
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <file-upload
                class="btn btn-primary dropdown-toggle"
                :post-action="postAction"
                :extensions="extensions"
                :accept="accept"
                :multiple="multiple"
                :directory="directory"
                :create-directory="createDirectory"
                :size="size || 0"
                :thread="thread < 1 ? 1 : (thread > 5 ? 5 : thread)"
                :headers="headers"
                :data="data"
                :drop="drop"
                :drop-directory="dropDirectory"
                :add-index="addIndex"
                v-model="files"
                @input-filter="inputFilter"
                @input-file="inputFile"
                ref="upload">
                <i class="ni ni-fat-add"></i>
                选择图片
            </file-upload>
            <div class="example-foorer">
                <!--                <div class="footer-status float-right">-->
                <!--                    Drop: {{ $refs.upload ? $refs.upload.drop : false }},-->
                <!--                    Active: {{ $refs.upload ? $refs.upload.active : false }},-->
                <!--                    Uploaded: {{ $refs.upload ? $refs.upload.uploaded : true }},-->
                <!--                    Drop active: {{ $refs.upload ? $refs.upload.dropActive : false }}-->
                <!--                </div>-->

                <!--                <button type="button" class="btn btn-success" v-if="!$refs.upload || !$refs.upload.active"-->
                <!--                        @click.prevent="$refs.upload.active = true">-->
                <!--                    <i class="fa fa-arrow-up" aria-hidden="true"></i>-->
                <!--                    Start Upload-->
                <!--                </button>-->
                <!--                <button type="button" class="btn btn-danger" v-else @click.prevent="$refs.upload.active = false">-->
                <!--                    <i class="fa fa-stop" aria-hidden="true"></i>-->
                <!--                    Stop Upload-->
                <!--                </button>-->
            </div>
        </div>
    </div>
</template>

<script>
import Cropper from 'cropperjs'
import FileUpload from 'vue-upload-component'
import {mapActions, mapState} from "vuex";

export default {
    components: {
        FileUpload,
    },
    data() {
        return {
            files: [],
            accept: 'image/png,image/gif,image/jpeg,image/webp',
            extensions: 'gif,jpg,jpeg,png,webp',
            // extensions: ['gif', 'jpg', 'jpeg','png', 'webp'],
            // extensions: /\.(gif|jpe?g|png|webp)$/i,
            minSize: 1024,
            size: 1024 * 1024 * 10,
            multiple: false,
            directory: false,
            drop: true,
            dropDirectory: true,
            createDirectory: false,
            addIndex: false,
            thread: 3,
            name: 'file',
            // http://127.0.0.1:8081/upload/put?_csrf_token=xxxxxx#/icon
            postAction: 'http://127.0.0.1:3000/images/add',
            // putAction: '/upload/put',
            headers: {
                'X-Csrf-Token': 'xxxx',
            },
            data: {
                '_csrf_token': 'xxxxxx',
            },
            autoCompress: 1024 * 1024,
            uploadAuto: false,
            isOption: false,
            addData: {
                show: false,
                name: '',
                type: '',
                content: '',
            },
            editFile: {
                show: false,
                name: '',
            }
        }
    },
    methods: {
        ...mapActions(['updateFormSingleData']),
        inputFilter(newFile, oldFile, prevent) {
            if (newFile && !oldFile) {
                // Before adding a file
                // 添加文件前
                // Filter system files or hide files
                // 过滤系统文件 和隐藏文件
                if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
                    return prevent()
                }
                // Filter php html js file
                // 过滤 php html js 文件
                if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
                    return prevent()
                }
                // Automatic compression
                // 自动压缩
                // if (newFile.file && newFile.error === "" && newFile.type.substr(0, 6) === 'image/' && this.autoCompress > 0 && this.autoCompress < newFile.size) {
                //     newFile.error = 'compressing'
                //     const imageCompressor = new ImageCompressor(null, {
                //         convertSize: 1024 * 1024,
                //         maxWidth: 512,
                //         maxHeight: 512,
                //     })
                //     imageCompressor.compress(newFile.file)
                //         .then((file) => {
                //             this.$refs.upload.update(newFile, {error: '', file, size: file.size, type: file.type})
                //         })
                //         .catch((err) => {
                //             this.$refs.upload.update(newFile, {error: err.message || 'compress'})
                //         })
                // }
            }
            if (newFile && newFile.error === "" && newFile.file && (!oldFile || newFile.file !== oldFile.file)) {
                // Create a blob field
                // 创建 blob 字段
                newFile.blob = ''
                let URL = (window.URL || window.webkitURL)
                if (URL) {
                    newFile.blob = URL.createObjectURL(newFile.file)
                }
                // Thumbnails
                // 缩略图
                newFile.thumb = ''
                if (newFile.blob && newFile.type.substr(0, 6) === 'image/') {
                    newFile.thumb = newFile.blob
                }
            }
            // image size
            // image 尺寸
            if (newFile && newFile.error === '' && newFile.type.substr(0, 6) === "image/" && newFile.blob && (!oldFile || newFile.blob !== oldFile.blob)) {
                newFile.error = 'image parsing'
                let img = new Image();
                img.onload = () => {
                    this.$refs.upload.update(newFile, {error: '', height: img.height, width: img.width})
                }
                img.οnerrοr = () => {
                    this.$refs.upload.update(newFile, {error: 'parsing image size'})
                }
                img.src = newFile.blob
            }
        },
        // add, update, remove File Event
        inputFile(newFile, oldFile) {
            if (newFile && oldFile) {
                // update
                if (newFile.active && !oldFile.active) {
                    // beforeSend
                    // min size
                    if (newFile.size >= 0 && this.minSize > 0 && newFile.size < this.minSize) {
                        this.$refs.upload.update(newFile, {error: 'size'})
                    }
                }
                if (newFile.progress !== oldFile.progress) {
                    // progress
                }
                if (newFile.error && !oldFile.error) {
                    // error
                }
                if (newFile.success && !oldFile.success) {
                    // success
                }
            }
            if (!newFile && oldFile) {
                // remove
                if (oldFile.success && oldFile.response.id) {
                    // $.ajax({
                    //   type: 'DELETE',
                    //   url: '/upload/delete?id=' + oldFile.response.id,
                    // })
                }
            }
            // Automatically activate upload
            if (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) {
                if (this.uploadAuto && !this.$refs.upload.active) {
                    this.$refs.upload.active = true
                }
            }
            this.updateFormSingleData({view: 'productView', key: 'productImages', value: this.files})
            // this.$store.dispatch('updateFiles', this.files)
        },
        alert(message) {
            alert(message)
        }
    },
    watch: {
        'editFile.show'(newValue, oldValue) {
            // 关闭了 自动删除 error
            if (!newValue && oldValue) {
                this.$refs.upload.update(this.editFile.id, {error: this.editFile.error || ''})
            }
            if (newValue) {
                this.$nextTick(() => {
                    if (!this.$refs.editImage) {
                        return
                    }
                    let cropper = new Cropper(this.$refs.editImage, {
                        autoCrop: false,
                    })
                    this.editFile = {
                        ...this.editFile,
                        cropper
                    }
                })
            }
        },
        'addData.show'(show) {
            if (show) {
                this.addData.name = ''
                this.addData.type = ''
                this.addData.content = ''
            }
        },
        'productView.form.data._id'() {
            if (this.productView.form.err_code === 0) {
                this.files = []
            }
        }
    },
    computed: {
        ...mapState(['productView'])
    }
}
</script>

<style>
.upload > span::after {
    content: none;
}

.file-uploads-drop > label {
    cursor: pointer;
}

.upload > .table-responsive {
    background-color: #ffffff;
}

.td-image-thumb {
    max-width: 4em;
    max-height: 4em;
}
</style>
