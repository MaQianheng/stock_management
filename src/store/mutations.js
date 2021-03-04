import Vue from 'vue'

export default {
    INCREASE_REQUESTING_TASKS_COUNT(state, count) {
        state.commonView.publicVariable.requestingTasksCount += count
    },
    DECREASE_REQUESTING_TASKS_COUNT(state, count) {
        state.commonView.publicVariable.requestingTasksCount -= count
    },
    UPDATE_SELECT_DATA(state, objData) {
        const {component, data} = objData
        if (component === 'cascadingWarehouseShelfSelect') {
            state.commonView.cascadingWarehouseShelfSelect.data.objShelfWarehouseKV = data.objShelfWarehouseKV
            state.commonView.cascadingWarehouseShelfSelect.data.objCascading = data.objCascading
        } else {
            state["commonView"][component] = {...state["commonView"][component], ...data}
        }
        switch (component) {
            // get color data
            case 'colorSelect': {
                state.commonView.colorSelectAll.data = [state.commonView.colorSelectAll.data[0], ...state.commonView.colorSelect.data]
                const textAll = state.commonView.colorSelectAll.data[0].text
                state.colorView.select.selectedValue.text = textAll
                state.productView.table.colorSelect.selectedValue.text = textAll
                state.saleHistoryView.table.colorSelect.selectedValue.text = textAll


                state.productView.form.colorSelect.selectedValue = state.commonView.colorSelect.data[0]
                break
            }
            case 'warehouseSelect': {
                state.commonView.warehouseSelectAll.data = [state.commonView.warehouseSelectAll.data[0], ...state.commonView.warehouseSelect.data]
                const warehouseTextAll = state.commonView.warehouseSelectAll.data[0].text
                const shelfTextAll = "全部货架"
                state.warehouseView.table.select.selectedValue.text = warehouseTextAll
                state.shelfView.table.select.selectedValue.text = warehouseTextAll
                state.productView.table.warehouseSelect.selectedValue.text = warehouseTextAll
                state.saleHistoryView.table.warehouseSelect.selectedValue.text = warehouseTextAll
                state.dashboardView.table.warehouseSelectedValue.text = warehouseTextAll

                state.productView.table.shelfSelect.selectedValue.text = shelfTextAll
                state.saleHistoryView.table.shelfSelect.selectedValue.text = shelfTextAll

                // if (state.shelfView.form.select.selectedValue.value === "0")
                console.log(data)
                state.shelfView.form.select.selectedValue = data.data[0]
                break
            }
            case 'shelfSelect': {
                state.shelfView.form.select.data = data.data
                break
            }
            case 'customerSelect':
            case 'supplierSelect':
            case 'driverSelect': {
                const selectedValue = `${component}edValue`
                const selectAll = `${component}All`
                // state.saleView.form[selectedValue] = data.data[0]

                state.commonView[selectAll].data = [state.commonView[selectAll].data[0], ...state.commonView[component].data]
                state.saleHistoryView.table[component].selectedValue = state.commonView[selectAll].data[0]

                state.saleView.form[selectedValue] = state.commonView[component].data[0]
                break
            }
            case 'operatorSelect': {
                state.commonView.operatorSelectAll.data = [state.commonView.operatorSelectAll.data[0], ...state.commonView.operatorSelect.data]
                state.saleHistoryView.table.operatorSelect.selectedValue.text = state.commonView.operatorSelectAll.data[0].text
                break
            }
            default:
                break
        }
    },
    UPDATE_TABLE_DATA(state, objData) {
        const {view, data} = objData
        state[view]["table"] = {...state[view]["table"], ...data}
    },
    UPDATE_COMMON_SELECT_SUB_VALUE(state, objData) {
        const {key, subKey, value} = objData
        state["commonView"][key][subKey] = value
    },
    UPDATE_FORM_SINGLE_DATA(state, objData) {
        const {view, key, value} = objData
        state[view]["form"][key] = value
    },
    UPDATE_VIEW(state, objData) {
        const {view, objKV} = objData
        state[view] = {...state[view], ...objKV}
    },
    UPDATE_VIEW_COMPONENT(state, objData) {
        const {view, component, objKV} = objData
        // Vue.set(state[view], component, {objKV})
        state[view][component] = {...state[view][component], ...objKV}
    },
    UPDATE_SALE_SUMMARY_SUB(state, objData) {
        const {_id, objSub} = objData
        Vue.set(state.saleView.saleSummary[_id], "sub", objSub)
    },
    UPDATE_TABLE_ROW_DATA(state, objData) {
        const {view, index, objKV} = objData
        let tmp = {...state[view]["table"]["data"][index], ...objKV}
        Vue.set(state[view]["table"]["data"], index, tmp)
    },
    UPDATE__BATCH_TABLE_ROW_DATA(state, objData) {
        console.log(state, objData)
        // const {view, index, objKV} = objData
        // let tmp = {...state[view]["table"]["data"][index], ...objKV}
        // Vue.set(state[view]["table"]["data"], index, tmp)
    },
    UPDATE_TABLE_ROW_SUB_DATA(state, objData) {
        const {view, index, objKV} = objData
        let tmp = {...state[view]["table"]["data"][index].sub, ...objKV}
        Vue.set(state[view]["table"]["data"][index], 'sub', tmp)
    },
    UPDATE_TABLE_SUB_ROW_DATA(state, objData) {
        const {view, index, subIndex, objKV} = objData
        let tmp = {...state[view]["table"]["data"][index]["sub"][subIndex], ...objKV}
        Vue.set(state[view]["table"]["data"][index]["sub"], subIndex, tmp)
    },
    UPDATE_FORM_FEEDBACK_DATA(state, objFeedBackData) {
        const {view, data} = objFeedBackData
        state[view]["form"] = {...state[view]["form"], ...data}
    },
    UPDATE_CASCADING_SHELF(state, objData) {
        const {key, view} = objData
        let val
        if (key === "0") {
            val = []
        } else {
            val = state.commonView.cascadingWarehouseShelfSelect.data.objCascading[key].sub
        }
        state[view].table.shelfSelect.data = [state[view].table.shelfSelect.data[0], ...val]
        state[view].table.shelfSelect.selectedValue = state[view].table.shelfSelect.data[0]
    },
    RESET_FORM_DATA(state, obj) {
        const {view, arrKeys} = obj
        for (let i = 0; i < arrKeys.length; i++) {
            let key = arrKeys[i]
            if (key.substring(key.length - 3) === 'Ref' || key.substring(key.length - 3) === '_id' || key.substring(key.length - 2) === 'Id') continue
            if (view === 'saleView' && key === 'action') continue
            switch (Object.prototype.toString.apply(state[view]["form"][key])) {
                case '[object Number]':
                    state[view]["form"][key] = 0
                    break
                case "[object Array]":
                    state[view]["form"][key] = []
                    break
                case "[object String]":
                    state[view]["form"][key] = ""
                    break
                default:
                    break
            }
        }
    }
}
