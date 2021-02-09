<template>
    <datepicker
        :value="date"
        @input="log"
        :min="minDate"
        :max="maxDate"
        :dayStr="dayStr"
    />
</template>

<script>
import * as VueDatepicker from '@livelybone/vue-datepicker';
import '../../../node_modules/@livelybone/vue-datepicker/lib/css/index.scss';
import '../../../node_modules/@livelybone/vue-datepicker/lib/css/index.css';
import {mapActions, mapState} from "vuex";

export default {
    components: {
        'datepicker': VueDatepicker.Datepicker
    },
    mounted() {
        this.date = this.$props.defaultDate
    },
    data: () => (
        {
            dayStr: ['日', '一', '二', '三', '四', '五', '六'],
            date: '' // '2018-06-01',
        }
    ),
    props: {
        defaultDate: {
            type: String
        },
        minDate: {
            type: String
        },
        maxDate: {
            type: String
        },
        queryConditionKey: {
            type: String
        }
    },
    methods: {
        ...mapActions(['updateViewComponent']),
        log(val) {
            this.date = val
            const {queryCondition} = this.saleHistoryView.table
            queryCondition[this.queryConditionKey] = Date.parse(val)
            this.updateViewComponent({
                view: 'saleHistoryView',
                component: "table",
                objKV: {
                    queryCondition
                }
            })
        },
    },
    computed: {
        ...mapState(['saleHistoryView'])
    }
};
</script>
<style>
.datepicker {
    margin-bottom: 10px;
}

.input-wrapper {
    padding: 10px 0 10px 0;
}

.input-wrapper > input {
    width: 100%;
}
</style>
