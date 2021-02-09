export default {
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
            arrSelect: ['colorSelect', 'warehouseSelect', 'shelfSelect', 'cascadingWarehouseShelfSelect'],
            arrView: [],
            requestingTasksCount: 0,
        },
        labelNotFound: "无可选项",
        labelSearchPlaceholder: "请输入搜索内容",
        levelSelect: {
            data: [{value: 0, text: '根级管理员'}, {value: 1, text: '一级管理员'}]
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
        customerSelect: {
            isLoading: false,
            err_code: 0,
            prefix: '客户信息',
            message: "请求成功",
            data: []
        },
        supplierSelect: {
            isLoading: false,
            err_code: 0,
            prefix: '供应商信息',
            message: "请求成功",
            data: []
        },
        codeSelect: {
            isLoading: false,
            err_code: 0,
            prefix: '货号信息',
            message: "请求成功",
            data: []
        },
        productSelect: {
            isLoading: false,
            err_code: 0,
            prefix: '商品信息',
            message: "请求成功",
            data: []
        },
        colorSelect: {
            isLoading: false,
            err_code: 0,
            prefix: '颜色信息',
            message: "请求成功",
            data: []
        },
        colorSelectAll: {
            data: [{value: "0", text: "全部颜色"}]
        },
        warehouseSelect: {
            isLoading: false,
            err_code: 0,
            prefix: '库房信息',
            message: "请求成功",
            data: []
        },
        warehouseSelectAll: {
            data: [{value: "0", text: "全部库房"}]
        },
        shelfSelect: {
            isLoading: false,
            err_code: 0,
            prefix: '货架信息',
            message: "请求成功",
            data: []
        },
        operatorSelect: {
            isLoading: false,
            err_code: 0,
            prefix: '操作人信息',
            message: "请求成功",
            data: []
        }
    },
    colorView: {
        select: {
            selectedValue: {value: "0", text: '正在请求数据'}
        },
        table: {
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
            action: 0,
            operatorRef: '6019fb8c2e2bb3dba3c87354',
            supplierRef: {},
            customerRef: {},
            driverRef: {},
            deliveryFee: 0,
            product: {}
        },
        saleSummary: {},
        table: {
            isLoading: false,
            perPage: 18,
            queryCondition: {
                action: 0,
                code: '',
                name: '',
                colorRef: '',
                currentPageCount: 1
            },
            actionCard: {
                actionSelect: {
                    selectedValue: {value: 0, text: '入库'},
                    data: [{value: 0, text: '入库'}, {value: 1, text: '出库'}]
                },
            },
            data: []
        }
    },
    saleHistoryView: {
        table: {
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
            isLoading: false,
            perPage: 10,
            queryCondition: {
                action: '',
                startedTimeStamp: 1609459200000,
                endedTimeStamp: Date.now() + 24 * 60 * 60 * 1000,
                productCode: '',
                productName: '',
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
    userView: {
        form: {
            username: '',
            password: '',
            name: '',
            level: '',
            levelSelect: {
                selectedValue: {value: 0, text: '根级管理员'}
            }
        },
        table: {
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
