export default {
    dashboardView: {
        table: {
            warehouseSelectedValue: {value: "0", text: '正在请求数据'},
            prefix: '仪表盘',
            data: {
                arrMonthlyInTotalWeight: Array.apply(null, Array(12)).map(() => 0),
                arrMonthlyOutTotalWeight: Array.apply(null, Array(12)).map(() => 0),
                objCustomerInWeight: {},
                objProductInOutWeight: {},
                objWarehouseShelfProductWeight: {}
            },
            isLoading: false
        }
    },
    loginView: {
        err_code: 0,
        message: '',
        name: localStorage.getItem('qianhengma_stock_management_name') ? localStorage.getItem('qianhengma_stock_management_name') : '',
        token: localStorage.getItem('qianhengma_stock_management_token') ? localStorage.getItem('qianhengma_stock_management_token') : '',
        level: localStorage.getItem('qianhengma_stock_management_user_level') ? parseInt(localStorage.getItem('qianhengma_stock_management_user_level')) : -1,
        form: {
            isLoading: false
        }
    },
    commonView: {
        publicVariable: {
            arrSelect: ['colorSelect', 'warehouseSelect', 'shelfSelect', 'cascadingWarehouseShelfSelect', 'customerSelect', 'supplierSelect', 'driverSelect', 'operatorSelect'],
            arrView: [],
            requestingTasksCount: 0,
        },
        labelNotFound: "无可选项",
        labelSearchPlaceholder: "请输入搜索内容",
        levelSelect: {
            data: [{value: 0, text: '一级管理员'}, {value: 1, text: '二级管理员'}]
        },
        cascadingWarehouseShelfSelect: {
            isLoading: false,
            err_code: 0,
            prefix: '级联库房货架信息',
            message: "请求成功",
            data: {
                objCascading: {},
                objShelfWarehouseKV: {}
            }
        },
        colorSelect: {
            isLoading: false,
            err_code: 0,
            prefix: '颜色多选',
            message: "请求成功",
            data: []
        },
        colorSelectAll: {
            data: [{value: 0, text: "全部颜色"}]
        },
        warehouseSelect: {
            isLoading: false,
            err_code: 0,
            prefix: '库房多选',
            message: "请求成功",
            data: []
        },
        warehouseSelectAll: {
            data: [{value: 0, text: "全部库房"}]
        },
        shelfSelect: {
            isLoading: false,
            err_code: 0,
            prefix: '货架多选',
            message: "请求成功",
            data: []
        },
        customerSelect: {
            isLoading: false,
            err_code: 0,
            prefix: '客户多选',
            message: "请求成功",
            data: []
        },
        supplierSelect: {
            isLoading: false,
            err_code: 0,
            prefix: '供应商多选',
            message: "请求成功",
            data: []
        },
        driverSelect: {
            isLoading: false,
            err_code: 0,
            prefix: '司机多选',
            message: "请求成功",
            data: []
        },
        operatorSelect: {
            isLoading: false,
            err_code: 0,
            prefix: '管理员多选',
            message: "请求成功",
            data: []
        },
        operatorSelectAll: {
            data: [{value: 0, text: "全部管理员"}]
        },
        driverSelectAll: {
            data: [{value: 0, text: "全部司机"}]
        },
        supplierSelectAll: {
            data: [{value: 0, text: "全部供应商"}]
        },
        customerSelectAll: {
            data: [{value: 0, text: "全部客户"}]
        },
    },
    colorView: {
        select: {
            selectedValue: {value: "0", text: '正在请求数据'}
        },
        table: {
            prefix: '颜色表单',
            isLoading: false,
            perPage: 10,
            err_code: 0,
            message: "表格数据请求成功",
            queryCondition: {
                _id: "0",
                currentPageCount: 1
            },
            dataCount: 0,
            data: []
        },
        form: {
            isLoading: false,
            color: ""
        }
    },
    warehouseView: {
        table: {
            prefix: '库房表单',
            isLoading: false,
            perPage: 5,
            err_code: 0,
            message: "表格数据请求成功",
            queryCondition: {
                _id: "0",
                currentPageCount: 1
            },
            dataCount: 0,
            data: [],
            select: {
                selectedValue: {value: "0", text: '正在请求数据'}
            }
        },
        form: {
            isLoading: false,
            warehouse: ''
        }
    },
    shelfView: {
        table: {
            prefix: '货架表单',
            isLoading: false,
            perPage: 5,
            err_code: 0,
            message: "表格数据请求成功",
            queryCondition: {
                warehouseRef: "0",
                currentPageCount: 1
            },
            dataCount: 0,
            data: [],
            select: {
                selectedValue: {value: "0", text: '正在请求数据'}
            }
        },
        form: {
            isLoading: false,
            warehouseRef: '0',
            shelf: '',
            select: {
                selectedValue: {value: "0", text: '正在请求数据'},
            }
        }
    },
    customerView: {
        table: {
            prefix: '客户表单',
            isLoading: false,
            perPage: 12,
            err_code: 0,
            message: "表格数据请求成功",
            queryCondition: {
                _id: "0",
                currentPageCount: 1
            },
            dataCount: 0,
            data: []
        },
        form: {
            isLoading: false,
            name: '',
            remark: ''
        }
    },
    supplierView: {
        table: {
            prefix: '供应商表单',
            isLoading: false,
            perPage: 12,
            err_code: 0,
            message: "表格数据请求成功",
            queryCondition: {
                _id: "0",
                currentPageCount: 1
            },
            dataCount: 0,
            data: []
        },
        form: {
            isLoading: false,
            supplierName: '',
            name: '',
            phone: '',
            remark: ''
        }
    },
    productView: {
        table: {
            prefix: '商品表单',
            colorSelect: {
                selectedValue: {value: "0", text: '正在请求数据'}
            },
            warehouseSelect: {
                selectedValue: {value: "0", text: '正在请求数据'}
            },
            shelfSelect: {
                selectedValue: {value: "0", text: '正在请求数据'},
                data: [{value: "0", text: '全部货架'}]
            },
            isLoading: false,
            perPage: 5,
            err_code: 0,
            message: "表格数据请求成功",
            queryCondition: {
                code: '',
                name: '',
                warehouseRef: '',
                colorRef: '',
                shelfRef: '',
                currentPageCount: 1
            },
            dataCount: 0,
            data: []
        },
        form: {
            isLoading: false,
            code: '',
            name: '',
            colorRef: '',
            price: '',
            remark: '',
            colorSelect: {
                selectedValue: {value: "0", text: '正在请求数据'},
                data: []
            },
            productImages: []
        }
    },
    saleView: {
        form: {
            isLoading: false,
            action: 1,
            // operatorRef: '6019fb8c2e2bb3dba3c87354',
            supplierRef: '',
            customerRef: '',
            driverRef: '',
            supplierSelectedValue: {value: "0", text: '正在请求数据'},
            customerSelectedValue: {value: "0", text: '正在请求数据'},
            driverSelectedValue: {value: "0", text: '正在请求数据'},
            deliveryFee: 0,
            product: {}
        },
        saleSummary: {},
        table: {
            prefix: '销售商品表单',
            isLoading: false,
            perPage: 18,
            queryCondition: {
                action: 1,
                code: '',
                name: '',
                colorRef: '',
                currentPageCount: 1
            },
            actionCard: {
                actionSelect: {
                    selectedValue: {value: 1, text: '入库'},
                    data: [{value: 1, text: '入库'}, {value: 2, text: '出库'}]
                },
            },
            data: []
        }
    },
    saleHistoryView: {
        table: {
            prefix: '销售记录表单',
            actionSelect: {
                selectedValue: {value: -1, text: '出/入库'},
                data: [{value: -1, text: '出/入库'}, {value: 0, text: '入库'}, {value: 1, text: '出库'}]
            },
            colorSelect: {
                selectedValue: {value: "0", text: '正在请求数据'}
            },
            warehouseSelect: {
                selectedValue: {value: "0", text: '正在请求数据'}
            },
            shelfSelect: {
                selectedValue: {value: "0", text: '正在请求数据'},
                data: [{value: "0", text: '全部货架'}]
            },
            customerSelect: {
                selectedValue: {value: "0", text: '正在请求数据'}
            },
            supplierSelect: {
                selectedValue: {value: "0", text: '正在请求数据'}
            },
            operatorSelect: {
                selectedValue: {value: "0", text: '正在请求数据'}
            },
            driverSelect: {
                selectedValue: {value: "0", text: '正在请求数据'}
            },
            isLoading: false,
            perPage: 10,
            queryCondition: {
                action: '',
                startedTimeStamp: 1609459200000,
                endedTimeStamp: Date.now() + 24 * 60 * 60 * 1000,
                code: '',
                name: '',
                colorRef: '',
                warehouseRef: '',
                shelfRef: '',
                operatorRef: '',
                driverRef: '',
                currentPageCount: 1
            },
            filter: {
                actionSelect: {
                    selectedValue: {value: 0, text: '入库'},
                    data: [{value: 0, text: '入库'}, {value: 1, text: '出库'}]
                },
            },
            arrData: {}
        },
        saleDetail: {
            isShow: false,
            objData: {}
        }
    },
    driverView: {
        form: {
            isLoading: false,
            name: '',
            phone: '',
            plate: ''
        },
        table: {
            prefix: '司机表单',
            isLoading: false,
            perPage: 10,
            queryCondition: {
                name: '',
                plate: '',
                currentPageCount: 1
            },
            data: []
        }
    },
    operatorView: {
        form: {
            username: '',
            password: '',
            name: '',
            level: '',
            levelSelect: {
                selectedValue: {value: 0, text: '一级管理员'}
            }
        },
        table: {
            prefix: '管理员表单',
            isLoading: false,
            perPage: 10,
            queryCondition: {
                name: '',
                currentPageCount: 1
            },
            data: []
        }
    }
}
