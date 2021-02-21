import {
    requestAddColor,
    requestAddCustomer, requestAddDriver,
    requestAddProduct,
    requestAddSale,
    requestAddShelf,
    requestAddSupplier, requestAddUser,
    requestAddWarehouse,
    requestDeleteColor,
    requestDeleteCustomer, requestDeleteDriver,
    requestDeleteProduct,
    requestDeleteShelf,
    requestDeleteSupplier, requestDeleteUser,
    requestDeleteWarehouse, requestLogin,
    requestQueryCascadingWarehouseShelfOptions,
    requestQueryCodeOptions,
    requestQueryColor,
    requestQueryColorOptions,
    requestQueryCustomer,
    requestQueryCustomerOptions, requestQueryDriver, requestQueryDriverOptions,
    requestQueryOperatorOptions,
    requestQueryProduct,
    requestQueryProductOptions,
    requestQuerySaleHistory,
    requestQuerySaleProduct,
    requestQueryShelf,
    requestQueryShelfOptions,
    requestQuerySupplier,
    requestQuerySupplierOptions, requestQueryUser,
    requestQueryWarehouse,
    requestQueryWarehouseOptions,
    requestUpdateColor,
    requestUpdateCustomer, requestUpdateDriver,
    requestUpdateProduct,
    requestUpdateShelf,
    requestUpdateSupplier, requestUpdateUser,
    requestUpdateWarehouse
} from "@/api";

const objServerErrorFeedBack = {err_code: 1, message: "服务器连接失败", data: []}
export default {
    async login({commit}, objData) {
        const view = 'loginView'
        commit('UPDATE_FORM_SINGLE_DATA', {view, key: 'isLoading', value: true})
        let data
        try {
            data = (await requestLogin(objData)).data
            commit('UPDATE_FORM_SINGLE_DATA', {view, key: 'isLoading', value: false})
            commit('UPDATE_VIEW', {view, objKV: data})
        } catch (err) {
            commit('UPDATE_FORM_SINGLE_DATA', {view, key: 'isLoading', value: false})
            if (err.data) {
                commit('UPDATE_VIEW', {view, objKV: err.data})
            } else {
                commit('UPDATE_VIEW', {view, objKV: objServerErrorFeedBack})
            }
        }
    },
    increaseRequestingTasksCount ({commit}, count) {
        commit('INCREASE_REQUESTING_TASKS_COUNT', count)
    },
    decreaseRequestingTasksCount ({commit}, count) {
        commit('DECREASE_REQUESTING_TASKS_COUNT', count)
    },
    updateCascadingShelf({commit}, objData) {
        commit('UPDATE_CASCADING_SHELF', objData)
    },
    updateCommonSelectSubValue({commit}, objData) {
        commit('UPDATE_COMMON_SELECT_SUB_VALUE', objData)
    },
    updateFormSingleData({commit}, objData) {
        commit('UPDATE_FORM_SINGLE_DATA', objData)
    },
    updateTableRowData({commit}, objData) {
        commit('UPDATE_TABLE_ROW_DATA', objData)
    },
    updateTableRowSubData({commit}, objData) {
        commit('UPDATE_TABLE_ROW_SUB_DATA', objData)
    },
    updateTableSubRowData({commit}, objData) {
        commit('UPDATE_TABLE_SUB_ROW_DATA', objData)
    },
    updateViewComponent({commit}, obj) {
        commit('UPDATE_VIEW_COMPONENT', obj)
    },
    updateSaleSummarySub({commit}, obj) {
        commit('UPDATE_SALE_SUMMARY_SUB', obj)
    },
    async getTable({commit}, objData) {
        const {view} = objData
        let data
        console.log(`requesting ${view}`)
        try {
            switch (view) {
                case 'colorView':
                    data = (await requestQueryColor(this.state.colorView.table.queryCondition)).data
                    break
                case 'warehouseView':
                    data = (await requestQueryWarehouse(this.state.warehouseView.table.queryCondition)).data
                    break
                case 'shelfView':
                    data = (await requestQueryShelf(this.state.shelfView.table.queryCondition)).data
                    break
                case 'customerView':
                    data = (await requestQueryCustomer(this.state.customerView.table.queryCondition)).data
                    break
                case 'supplierView':
                    data = (await requestQuerySupplier(this.state.supplierView.table.queryCondition)).data
                    break
                case "productView":
                    data = (await requestQueryProduct(this.state.productView.table.queryCondition)).data
                    break
                case "saleView":
                    data = (await requestQuerySaleProduct(this.state.saleView.table.queryCondition)).data
                    break
                case "saleHistoryView":
                    data = (await requestQuerySaleHistory(this.state.saleHistoryView.table.queryCondition)).data
                    break
                case "driverView":
                    data = (await requestQueryDriver(this.state.driverView.table.queryCondition)).data
                    break
                case "userView":
                    data = (await requestQueryUser(this.state.userView.table.queryCondition)).data
                    break
                default:
                    return
            }
            commit('UPDATE_TABLE_DATA_AFTER_REQUEST', {view, data})
        } catch (err) {
            if (err.data) {
                commit('UPDATE_TABLE_DATA_AFTER_REQUEST', {view, data: err.data})
            } else {
                commit('UPDATE_TABLE_DATA_AFTER_REQUEST', {view, data: objServerErrorFeedBack})
            }
        }
    },
    async getSelect({commit}, objData) {
        // {view: "xxxView", _id: "0"}
        const {component} = objData
        let data
        console.log(`requesting ${component}`)
        try {
            switch (component) {
                case 'customerSelect':
                    data = (await requestQueryCustomerOptions({_id: '0'})).data
                    break
                case 'supplierSelect':
                    data = (await requestQuerySupplierOptions({_id: '0'})).data
                    break
                case 'driverSelect':
                    data = (await requestQueryDriverOptions({_id: '0'})).data
                    break
                case 'codeSelect':
                    data = (await requestQueryCodeOptions({_id: '0'})).data
                    break
                case 'productSelect':
                    data = (await requestQueryProductOptions({_id: '0'})).data
                    break
                case 'colorSelect':
                    data = (await requestQueryColorOptions({_id: '0'})).data
                    break
                case 'warehouseSelect':
                    data = (await requestQueryWarehouseOptions({_id: '0'})).data
                    break
                case 'shelfSelect':
                    data = (await requestQueryShelfOptions({_id: '0'})).data
                    break
                case 'operatorSelect':
                    data = (await requestQueryOperatorOptions({_id: '0'})).data
                    break
                case 'cascadingWarehouseShelfSelect':
                    data = (await requestQueryCascadingWarehouseShelfOptions({_id: '0'})).data
                    break
                default:
                    return
            }
            commit('UPDATE_SELECT_DATA_AFTER_REQUEST', {component, data})
        } catch (err) {
            if (err.data) {
                commit('UPDATE_SELECT_DATA_AFTER_REQUEST', {component, data: err.data})
            } else {
                commit('UPDATE_SELECT_DATA_AFTER_REQUEST', {component, data: objServerErrorFeedBack})
            }
        }
    },
    async submitForm({commit}, objData) {
        // arrKeys:['shelf'] -> des: only submit necessary value
        const {view, arrKeys} = objData
        const {form} = this.state[view]
        let objSubmitData = {}
        for (let i = 0; i < arrKeys.length; i++) {
            let key = arrKeys[i]
            objSubmitData[key] = form[key]
        }
        let data
        try {
            switch (view) {
                case "colorView":
                    data = (await requestAddColor(objSubmitData)).data
                    break
                case "warehouseView":
                    data = (await requestAddWarehouse(objSubmitData)).data
                    break
                case "shelfView":
                    data = (await requestAddShelf(objSubmitData)).data
                    break
                case "customerView":
                    data = (await requestAddCustomer(objSubmitData)).data
                    break
                case "supplierView":
                    data = (await requestAddSupplier(objSubmitData)).data
                    break
                case "productView":
                    data = (await requestAddProduct(objSubmitData)).data
                    break
                case 'saleView':
                    data = (await requestAddSale(objSubmitData)).data
                    break
                case 'driverView':
                    data = (await requestAddDriver(objSubmitData)).data
                    break
                case 'userView':
                    data = (await requestAddUser(objSubmitData)).data
                    break
                default:
                    return
            }
            // if succ, remove related fields, RESET_FORM_DATA
            if (data.err_code === 0) commit('RESET_FORM_DATA', objData)
            commit('UPDATE_FORM_FEEDBACK_DATA', {view, data})
        } catch (err) {
            if (err.data) {
                commit('UPDATE_FORM_FEEDBACK_DATA', {view, data: err.data})
            } else {
                commit('UPDATE_FORM_FEEDBACK_DATA', {view, data: {...objServerErrorFeedBack}})
            }
        }
    },
    async submitUpdateData({commit}, objData) {
        const {view, objUpdateData, index, subIndex} = objData
        let data
        try {
            switch (view) {
                case "colorView":
                    data = (await requestUpdateColor(objUpdateData)).data
                    break
                case 'warehouseView':
                    data = (await requestUpdateWarehouse(objUpdateData)).data
                    break
                case 'shelfView':
                    data = (await requestUpdateShelf(objUpdateData)).data
                    break
                case 'customerView':
                    data = (await requestUpdateCustomer(objUpdateData)).data
                    break
                case 'supplierView':
                    data = (await requestUpdateSupplier(objUpdateData)).data
                    break
                case 'productView':
                    data = (await requestUpdateProduct(objUpdateData)).data
                    break
                case 'driverView':
                    data = (await requestUpdateDriver(objUpdateData)).data
                    break
                case 'userView':
                    data = (await requestUpdateUser(objUpdateData)).data
                    break
                default:
                    return
            }
            // if succ, remove related fields, RESET_FORM_DATA
            // {view: "colorView", index, arrKeys, arrData}
            commit('UPDATE_TABLE_DATA_AFTER_REQUEST', {view, data})
            subIndex ? commit('UPDATE_TABLE_SUB_ROW_DATA', {view, index, subIndex, objKV: {status: 0}}) : commit('UPDATE_TABLE_ROW_DATA', {view, index, objKV: {status: 0}})
        } catch (err) {
            console.log(view)
            if (err.data) {
                commit('UPDATE_TABLE_DATA_AFTER_REQUEST', {view, data: err.data})
            } else {
                commit('UPDATE_TABLE_DATA_AFTER_REQUEST', {view, data: {...objServerErrorFeedBack, data: []}})
            }
        }
    },
    // todo: 加查询条件，删除完后查询
    async submitDeleteId({commit}, objData) {
        const {view, _id} = objData
        let data
        try {
            switch (view) {
                case "colorView":
                    data = (await requestDeleteColor({_id})).data
                    break
                case "warehouseView":
                    data = (await requestDeleteWarehouse({_id})).data
                    break
                case "shelfView":
                    data = (await requestDeleteShelf({_id})).data
                    break
                case "customerView":
                    data = (await requestDeleteCustomer({_id})).data
                    break
                case "supplierView":
                    data = (await requestDeleteSupplier({_id})).data
                    break
                case "productView":
                    data = (await requestDeleteProduct({_id})).data
                    break
                case "driverView":
                    data = (await requestDeleteDriver({_id})).data
                    break
                case "userView":
                    data = (await requestDeleteUser({_id})).data
                    break
                default:
                    return
            }
            commit('UPDATE_TABLE_DATA_AFTER_REQUEST', {view, data: data})
        } catch (err) {
            if (err.data) {
                commit('UPDATE_TABLE_DATA_AFTER_REQUEST', {view, data: err.data})
            } else {
                commit('UPDATE_TABLE_DATA_AFTER_REQUEST', {view, data: {err_code: 1, message: "服务器连接失败"}})
            }
        }
    }
}
