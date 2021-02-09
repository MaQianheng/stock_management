<template>
    <div class="col-xl-12 order-xl-1">
        <card shadow type="secondary">
            <div slot="header" class="bg-white border-0">
                <div class="row align-items-center">
                    <div class="col-8">
                        <h3 class="mb-0">添加库房/货架</h3>
                    </div>
                </div>
            </div>
            <template>
                <!--                    <h6 class="heading-small text-muted mb-4">库房信息</h6>-->
                <div class="pl-lg-4">
                    <div class="row">
                        <div class="col-lg-6">
                            <base-input alternative=""
                                        label="库房"
                                        placeholder="库房"
                                        input-classes="form-control-alternative"
                                        name="warehouse"
                                        v-model="warehouseView.form.warehouse"
                                        @input="getWarehouseInput"
                                        :disabled="warehouseView.form.isLoading"
                                        @keyup.enter="handleSubmit('warehouse')"
                            />
                        </div>
                        <div class="col-lg-12" style="text-align: right">
                            <base-button type="primary" :outline="true" size="sm"
                                         @click="handleSubmit('warehouse')">添加
                            </base-button>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-6">
                            <label class="form-control-label">库房</label>
                            <v-select :searchable=true
                                      :options="commonView.warehouseSelect.data"
                                      v-model="shelfView.form.select.selectedValue"
                                      :labelSearchPlaceholder="commonView.labelSearchPlaceholder"
                                      :disabled="commonView.warehouseSelect.isLoading"
                            />
                        </div>
                        <div class="col-lg-6">
                            <base-input alternative=""
                                        label="货架"
                                        placeholder="货架"
                                        input-classes="form-control-alternative"
                                        name="shelf"
                                        v-model="shelfView.form.shelf"
                                        @input="getShelfInput"
                                        :disabled="shelfView.form.isLoading"
                                        @keyup.enter="handleSubmit('shelf')"
                            />
                        </div>
                        <div class="col-12" style="text-align: right">
                            <base-button type="primary" :outline="true" size="sm" @click="handleSubmit('shelf')">
                                添加
                            </base-button>
                        </div>
                    </div>
                </div>
            </template>
        </card>
    </div>
</template>

<script>
import VSelect from '@alfsnd/vue-bootstrap-select'
import {mapState, mapActions} from 'vuex'
import {
    handleSubmitForm,
    handleUpdateForm
} from "@/functions";

export default {
    name: "WarehouseForm",
    components: {
        VSelect
    },
    data: () => (
        {
            warehouseFormKeys: {
                warehouse: {
                    isRequired: true,
                    str: '库房'
                }
            },
            shelfFormKeys: {
                warehouseRef: {
                    isRequired: true,
                    str: '库房id'
                },
                shelf: {
                    isRequired: true,
                    str: '货架'
                }
            }
        }
    ),
    methods: {
        ...mapActions(["updateViewComponent", "submitForm", "updateFormSingleData", "updateCommonSelectSubValue", "increaseRequestingTasksCount"]),
        getWarehouseInput(key, value) {
            handleUpdateForm(this, 'warehouseView', key, value)
        },
        getShelfInput(key, value) {
            handleUpdateForm(this, 'shelfView', key, value)
        },
        handleSubmit(key) {
            handleSubmitForm(this, `${key}View`, this[`${key}FormKeys`])
        }
    },
    computed: {
        ...mapState(["warehouseView", "shelfView", "commonView"])
    },
    watch: {
        "shelfView.form.select.selectedValue": {
            handler: function (newVal, oldVal) {
                if (newVal === oldVal) return
                handleUpdateForm(this, 'shelfView', 'warehouseRef', newVal.value)
            }
        }
    }
}
</script>

<style scoped>

</style>
