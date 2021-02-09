<template>
    <div></div>
</template>

<script>
import {mapState} from "vuex";


export default {
    name: "RowOperableTable",
    data: () => (
        {
            type: '',
            columns: ['货号', '图片', '名称', '颜色', '价格', '库房', '货架', '库存(KG)', '已售(KG)', '操作'],
            flag: false,
            searchInput: {
                code: "",
                name: ""
            },
            // options: [
            //     {code: 'e0001', label: 'e0001'},
            //     {code: 'e0002', label: 'e0002'},
            //     {code: 'e0003', label: 'e0003'}
            // ],
            addBtnIsDisabled: false,
            labelSearchPlaceholder: "请输入搜索内容",
            options: {
                code: [
                    {value: 'e0001', text: 'e0001'},
                    {value: 'e0002', text: 'e0002'},
                    {value: 'e0003', text: 'e0003'}
                ]
            },
            rowSelectedOption: [],
            tableData: [],
            preData: {
                e0001: {
                    productCode: {
                        selectedValue: {value: 'e0001', text: 'e0001'}
                    },
                    img: 'img/theme/bootstrap.jpg',
                    name: "测试1",
                    color: "蓝色",
                    warehouse: {
                        selectedValue: {value: 'w001', text: '一号库房'},
                        options: [
                            {value: 'w001', text: '一号库房'},
                            {value: 'w002', text: '二号库房'}
                        ]
                    },
                    shelf: {
                        selectedValue: {},
                        options: []
                    },
                    weight: 0,
                    oriWeight: 0,
                    remainingWeight: 0,
                    info: {
                        w001: {
                            s001: {
                                shelfName: '一号货架',
                                oriWeight: 298
                            },
                            s002: {
                                shelfName: '二号货架',
                                oriWeight: 318
                            }
                        },
                        w002: {
                            s001: {
                                shelfName: '一号货架',
                                oriWeight: 980
                            },
                            s003: {
                                shelfName: '三号货架',
                                oriWeight: 892
                            }
                        }
                    }
                },
                e0002: {
                    productCode: {
                        selectedValue: {value: 'e0002', text: 'e0002'}
                    },
                    img: 'img/theme/angular.jpg',
                    name: "测试2",
                    color: "红色",
                    warehouse: {
                        selectedValue: {value: 'w002', text: '二号库房'},
                        options: [
                            {value: 'w002', text: '二号库房'},
                            {value: 'w003', text: '三号库房'}
                        ]
                    },
                    shelf: {
                        selectedValue: {},
                        options: []
                    },
                    weight: 0,
                    oriWeight: 0,
                    remainingWeight: 0,
                    info: {
                        w002: {
                            s004: {
                                shelfName: '四号货架',
                                oriWeight: 490
                            }
                        },
                        w003: {
                            s001: {
                                shelfName: '一号货架',
                                oriWeight: 1980
                            },
                            s003: {
                                shelfName: '六号货架',
                                oriWeight: 230
                            }
                        }
                    }
                },
                e0003: {
                    productCode: {
                        selectedValue: {value: 'e0003', text: 'e0003'}
                    },
                    img: 'img/theme/sketch.jpg',
                    name: "测试3",
                    color: "金色",
                    warehouse: {
                        selectedValue: {value: 'w001', text: '一号库房'},
                        options: [
                            {value: 'w001', text: '一号库房'}
                        ]
                    },
                    shelf: {
                        selectedValue: {},
                        options: []
                    },
                    weight: 0,
                    oriWeight: 0,
                    remainingWeight: 0,
                    info: {
                        w001: {
                            s001: {
                                shelfName: '一号货架',
                                oriWeight: 5800
                            },
                            s004: {
                                shelfName: '四号货架',
                                oriWeight: 2318
                            }
                        }
                    }
                }
            }
        }
    ),
    props: {
        title: String,
        mode: {
            type: String
        }
    },
    watch: {
        tableData: function () {
            this.$emit('fromOperableTable', 'productCount', this.tableData.length)
        }
    },
    computed: {
        ...mapState(["productView", "colorView", "commonView"]),
        isDisableButton: function () {
            return this.options.code.length === 0
        },
        computeColor: function () {
            return this.mode === 'purchase' ? ' color: #fb6340 !important;' : ' color: #5e72e4 !important;'
        }
    },
    methods: {
        optionRollBack(arr) {
            // if ((this.options.code.indexOf(arr) !== -1)) return
            this.options.code.push(arr)
        },
        optionFilter(arr) {
            this.options.code = this.options.code.filter((item) => item.value !== arr.value)
        },
        optionSort(row) {
            // compute shelf options
            let obj = this.tableData[row]
            let warehouseSelectedValue = obj.warehouse.selectedValue.value

            let shelfInfo = obj.info[warehouseSelectedValue]

            let shelfInfoKeys = Object.keys(shelfInfo)
            let shelfOptions = []
            for (let i = 0; i < shelfInfoKeys.length; i++) {
                let key = shelfInfoKeys[i]
                shelfOptions.push({value: shelfInfoKeys[i], text: shelfInfo[key]['shelfName']})
            }
            obj.shelf = {
                selectedValue: shelfOptions[0],
                options: shelfOptions
            }
            let {oriWeight} = obj.info[warehouseSelectedValue][shelfOptions[0].value]
            obj.weight = 0
            obj.oriWeight = oriWeight
            obj.remainingWeight = oriWeight
        },
        handleSelectChange(option, row) {
            switch (option) {
                case 'code': {
                    if (this.flag) {
                        this.flag = false
                        return
                    }
                    // 拿出本行之前选择的值
                    let oldOption = this.rowSelectedOption[row]
                    // 放回去
                    this.optionRollBack(oldOption)
                    // 记录本行选择的新值
                    let newOption = this.tableData[row].productCode.selectedValue
                    // 当选择新值后，则该值不应该再可以被选择。把新值从options.code中移除
                    this.optionFilter(newOption)
                    this.rowSelectedOption[row] = newOption

                    this.tableData[row] = this.preData[newOption.value]
                    this.tableData[row].productCode.selectedValue = newOption
                    break
                }
                case 'warehouse': {
                    this.optionSort(row)
                    break
                }
                case 'shelf': {
                    let warehouseSelectedValue = this.tableData[row].warehouse.selectedValue.value
                    let shelfSelectedValue = this.tableData[row].shelf.selectedValue.value
                    let obj = this.tableData[row]
                    let {oriWeight} = obj.info[warehouseSelectedValue][shelfSelectedValue]
                    obj.weight = 0
                    obj.oriWeight = oriWeight
                    obj.remainingWeight = oriWeight
                    break
                }
                default: {
                    break
                }
            }
        },
        handleRemoveRowClick(row) {
            this.tableData.splice(row, 1)
            // 拿出本行之前选择的值并移除
            let oldOption = this.rowSelectedOption.splice(row, 1)[0]
            // 放回去
            this.optionRollBack(oldOption)
            this.flag = true
        },
        handleAddRowClick(directive) {
            switch (directive) {
                case 'addNewRow': {
                    if (this.options.code.length === 0) return
                    // get and remove 1st option
                    let option = this.options.code.splice(0, 1)[0]
                    // push option into rowSelectedOption(记录每行选中的option)
                    this.rowSelectedOption.push(option)
                    // 根据option.value向tableData添加数据
                    this.tableData.push(this.preData[option.value])

                    let row = this.tableData.length - 1
                    this.optionSort(row)
                    this.tableData[row].productCode.selectedValue = {
                        value: option.value,
                        text: option.value
                    }
                    this.flag = true
                    break
                }
                default: {
                    break
                }
            }
        },
        handleInputChange(row, v) {
            v = parseInt(v)
            if (isNaN(v)) v = 0
            let tmp = this.tableData[row]
            // 重量不可以小于0
            if (v < 0) {
                tmp.weight = 0
                this.$set(this.tableData, row, tmp)
                return
            }
            let reWeight = 0
            switch (this.mode) {
                case 'purchase': {
                    reWeight = tmp.oriWeight + v
                    break
                }
                case 'sell': {
                    // 最大数量不能超过剩余数量
                    reWeight = tmp.oriWeight - v
                    if (reWeight < 0) {
                        tmp.weight = tmp.oriWeight
                        tmp.remainingWeight = 0
                        this.$set(this.tableData, row, tmp)
                        return
                    }
                    break
                }
                default:
                    break
            }
            tmp.weight = v
            tmp.remainingWeight = reWeight
            this.$set(this.tableData, row, tmp)
        }
    }
}
</script>

<style scoped>
.v-select {
    width: 200px !important;
}
</style>
