<template>
    <div class="card shadow sticky-top navbar" style="margin-top: 20px;" ref="filter"
         :class="{ 'navbar--hidden': !showNavbar }">
        <div class="row" style="width: 100%;">
            <autocomplete
                class="col-lg-6 col-sm-1"
                :search="searchCode"
                placeholder="搜索并选择货号"
                aria-label="搜索并选择货号"
                :get-result-value="getCodeResultValue"
                @submit="handleCodeSubmit"
                :debounce-time="500"
                style="margin-bottom: 10px;"
            />
            <autocomplete
                class="col-lg-6 col-sm-1"
                :search="searchName"
                placeholder="搜索并选择商品名称"
                aria-label="搜索并选择商品名称"
                :get-result-value="getNameResultValue"
                @submit="handleNameSubmit"
                :debounce-time="500"
                style="margin-bottom: 10px;"
            />
            <v-select
                :searchable=true
                class="col-lg-6 col-sm-1"
                :options="commonView.colorSelectAll.data"
                v-model="productView.table.colorSelect.selectedValue"
                :labelSearchPlaceholder="commonView.labelSearchPlaceholder"
                :disabled="commonView.colorSelect.isLoading"
            />
            <div class="col-12" style="text-align: right">
                <base-button type="info" :outline="true" size="sm" @click="handleSubmit"
                             :disabled="productView.table.isLoading">搜索
                </base-button>
            </div>
        </div>
    </div>
</template>

<script>
import VSelect from '@alfsnd/vue-bootstrap-select'
import Autocomplete from '@trevoreyre/autocomplete-vue'
import {mapActions, mapState} from "vuex";
import {requestFuzzyQueryProductCode, requestFuzzyQueryProductName} from "@/api";

export default {
    name: "SaleProductFilter",
    components: {
        VSelect,
        Autocomplete
    },
    data: () => (
        {
            showNavbar: true,
            lastScrollPosition: 0,
            oriFilterOffsetTopFromBottom: 0
        }
    ),
    mounted() {
        window.addEventListener('scroll', this.onScroll)
        this.oriFilterOffsetTopFromBottom = this.$refs.filter.offsetTop + this.$refs.filter.offsetHeight
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.onScroll)
    },
    methods: {
        ...mapActions(['updateViewComponent', 'increaseRequestingTasksCount']),
        onScroll() {
            // Get the current scroll position
            const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop
            if ((currentScrollPosition < 0) || (this.$refs.filter.offsetTop < this.oriFilterOffsetTopFromBottom)) {
                return
            }
            // Stop executing this function if the difference between
            // current scroll position and last scroll position is less than some offset
            if (Math.abs(currentScrollPosition - this.lastScrollPosition) < 30) {
                return
            }
            this.showNavbar = currentScrollPosition < this.lastScrollPosition
            this.lastScrollPosition = currentScrollPosition
        },
        searchCode(input) {
            if (input.length === 0) {
                let {queryCondition} = this.saleView.table
                queryCondition.code = ''
                this.updateViewComponent({view: 'saleView', component: 'table', objKV: queryCondition})
                return []
            }
            input = input.toUpperCase()
            return requestFuzzyQueryProductCode({code: input}).then((data) => {
                return data.data.data
            }).catch(() => {
                return ['请求出错']
            })
        },
        getCodeResultValue(result) {
            return result.code
        },
        handleCodeSubmit(result) {
            let {queryCondition} = this.saleView.table
            queryCondition.code = result.code
            this.updateViewComponent({view: 'saleView', component: 'table', objKV: queryCondition})
        },

        searchName(input) {
            if (input.length === 0) {
                let {queryCondition} = this.saleView.table
                queryCondition.name = ''
                this.updateViewComponent({view: 'saleView', component: 'table', objKV: queryCondition})
                return []
            }
            return requestFuzzyQueryProductName({name: input}).then((data) => {
                return data.data.data
            }).catch(() => {
                return ['请求出错']
            })
        },
        getNameResultValue(result) {
            return result.name
        },
        handleNameSubmit(result) {
            let {queryCondition} = this.saleView.table
            queryCondition.name = result.name
            this.updateViewComponent({view: 'saleView', component: 'table', objKV: queryCondition})
        },

        handleSubmit() {
            this.increaseRequestingTasksCount(1)
            const {queryCondition} = this.saleView.table
            queryCondition.currentPageCount = 1
            this.updateViewComponent({
                view: 'saleView',
                component: "table",
                objKV: {
                    isLoading: true,
                    queryCondition
                }
            })
        }
    },
    computed: {
        ...mapState(["commonView", "productView", "saleView"])
    },
    watch: {
        "productView.table.colorSelect.selectedValue.value": {
            handler: function (newVal) {
                const {queryCondition} = this.saleView.table
                queryCondition.colorRef = newVal
                this.updateViewComponent({
                    view: 'saleView',
                    component: "table",
                    objKV: {
                        queryCondition
                    }
                })
            }
        }
    }
}
</script>

<style scoped>
.navbar {
    transform: translate3d(0, 0, 0);
    transition: 0.1s all ease-out;
}

.navbar.navbar--hidden {
    box-shadow: none;
    transform: translate3d(0, -100%, 0);
}
</style>
