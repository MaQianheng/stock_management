import mutations from "../store/mutations"
import state from "@/store/state"
import store from "../store/"
import router from "@/router"

export const funcComputeAlertLevel = (err_code) => {
    let type
    switch (err_code) {
        case -1:
            type = "info"
            break
        case 0:
            type = "success"
            break
        case 1:
            type = "warning"
            break
        case 2:
            type = "danger"
            break
        default:
            type = "primary"
            break
    }
    return type
}

export const funcArrIndexToStrId = (that, objKV) => {
    const {arrOperatingRows, view} = that
    let str = ""
    let isSub = typeof arrOperatingRows[0] === 'string'
    // if (typeof arrOperatingRows[0] === 'string') isSub = true
    for (let i = 0; i < arrOperatingRows.length; i++) {
        let index
        let _id
        if (isSub) {
            let subIndex
            [index, subIndex] = arrOperatingRows[i].split('_').map(Number)
            _id = that[view].table.data[index].sub[subIndex]._id
            if (objKV) that.updateTableSubRowData({view, index, subIndex, objKV})
        } else {
            index = arrOperatingRows[i]
            _id = that[view].table.data[index]._id
            if (objKV) that.updateTableRowData({view, index, objKV})
        }
        i === (arrOperatingRows.length - 1) ? str += _id : str += `${_id},`
    }
    return str
}

export const funcValidateForm = (that, view, objFormKeys) => {
    if (that[view]["form"]["isLoading"]) return
    const {form} = that[view]
    const arrKeys = Object.keys(objFormKeys)
    const arrResult = []
    for (let i = 0; i < arrKeys.length; i++) {
        let key = arrKeys[i]
        let val = objFormKeys[key]
        // 如果当前key非必需并且用户未输入，则跳过
        if ((val.isRequired === false) && (form[key] === "")) continue
        if (key === "phone") {
            let val = form[key]
            // todo: use regex to validate phone
            if (isNaN(val)) {
                that.$notify({
                    type: funcComputeAlertLevel(1),
                    title: `电话格式不正确`
                })
                return {arrKeys: [], isValid: false}
            }
        }
        if (val.isRequired === true) {
            switch (Object.prototype.toString.apply(form[key])) {
                case '[object Object]':
                    if ((Object.keys(form[key])).length === 0) {
                        that.$notify({
                            type: funcComputeAlertLevel(1),
                            title: `${val.str}不能为空`
                        })
                        return {arrKeys: [], isValid: false}
                    }
                    break
                default:
                    if (form[key] === "") {
                        that.$notify({
                            type: funcComputeAlertLevel(1),
                            title: `${val.str}不能为空`
                        })
                        return {arrKeys: [], isValid: false}
                    }
                    break
            }
        }
        arrResult.push(key)
    }
    return {arrKeys: arrResult, isValid: true}
}

export const funcGetTableSelectedValue = (that, view) => {
    const idKey = funcGetLikeIdKey(that[view].table.queryCondition)
    switch (view) {
        case 'warehouseView':
        case 'shelfView':
            return that[view].table.select.selectedValue.value
        case 'customerView':
        case 'supplierView':
            return that[view].table.queryCondition[idKey]
        case 'productView':
            return "0"
        default:
            return that[view].select.selectedValue.value
    }
}

export const handleGetTableData = (that, ifNotify = false) => {
    // view: colorView
    const {view} = that
    if (ifNotify) that.$notify({
        type: funcComputeAlertLevel(-1),
        title: "正在请求表格数据"
    })
    that.updateViewComponent(
        {
            view,
            component: "table",
            objKV: {
                isLoading: true
            }
        }
    )
    that.getTable({view}).then(() => {
        const {err_code, message} = that[view].table
        if (ifNotify || err_code !== 0) that.$notify({
            type: funcComputeAlertLevel(err_code),
            title: message
        })
    })
}

export const funcGetLikeIdKey = (objData) => {
    const arrKeys = Object.keys(objData)
    // row 188
    for (let i = 0; i < arrKeys.length; i++) {
        const key = arrKeys[i]
        if (key.substring(key.length - 2) === 'Id') return key;
        if (key.substring(key.length - 3) === 'Ref' || key.substring(key.length - 3) === '_id') return key;
        // if (key.toLowerCase().indexOf('id') !== -1) return key
    }
    return '_id'
}

export const funcGetResetQueryCondition = (queryCondition, value) => {
    const {currentPageCount} = queryCondition
    const obj = {
        currentPageCount
    }
    const idKey = funcGetLikeIdKey(queryCondition)
    obj[idKey] = value ? value : "0"
    return obj
}

export const handleBatchUpdateRow = (that, arrOperatingRows, objUpdateData) => {
    const {view} = that
    let isSub = typeof that.arrOperatingRows[0] === 'string'
    for (let i = 0; i < arrOperatingRows.length; i++) {
        let index
        if (isSub) {
            let subIndex
            [index, subIndex] = arrOperatingRows[i].split('_').map(Number)
            that.updateTableSubRowData({view, index, subIndex, objKV: objUpdateData})
        } else {
            index = arrOperatingRows[i]
            that.updateTableRowData({view, index, objKV: objUpdateData})
        }
    }
}

export const handleReloadTableAndOptionData = (that, view, directive) => {
    let arrRequiredReloadViewTable = []
    let arrRequiredReloadSelect = []
    switch (view) {
        case 'colorView':
            // reload table, select
            arrRequiredReloadSelect = ['colorSelect']
            if (String(that.colorView.table.queryCondition._id) === "0") arrRequiredReloadViewTable = ['colorView']
            break
        case 'warehouseView':
        case 'shelfView':
            arrRequiredReloadSelect = ['warehouseSelect', 'shelfSelect', 'cascadingWarehouseShelfSelect']
            if (String(that.warehouseView.table.queryCondition._id) === "0") arrRequiredReloadViewTable.push('warehouseView')
            if (String(that.shelfView.table.queryCondition.warehouseRef) === "0") arrRequiredReloadViewTable.push('shelfView')
            break
        case 'customerView':
            arrRequiredReloadViewTable = ['customerView']
            arrRequiredReloadSelect = ['customerSelect']
            break
        case 'supplierView':
            arrRequiredReloadViewTable = ['supplierView']
            arrRequiredReloadSelect = ['supplierSelect']
            break
        case 'productView':
            // reload colorView since related
            arrRequiredReloadViewTable = ['productView']
            if (String(that.colorView.table.queryCondition._id) === "0") arrRequiredReloadViewTable.push('colorView')
            break
        case 'saleView':
            // reload productView, shelfView since related
            arrRequiredReloadViewTable = ['saleView', 'productView', 'saleHistoryView', 'dashboardView']
            if (String(that.shelfView.table.queryCondition.warehouseRef) === "0") arrRequiredReloadViewTable.push('shelfView')
            break
        case 'saleHistoryView':
            arrRequiredReloadViewTable = ['saleHistoryView']
            break
        case 'driverView':
            arrRequiredReloadViewTable = ['driverView']
            arrRequiredReloadSelect = ['driverSelect']
            break
        case 'userView':
            arrRequiredReloadViewTable = ['userView']
            break
        default:
            break
    }
    that.increaseRequestingTasksCount(arrRequiredReloadSelect.length + arrRequiredReloadViewTable.length)
    for (let i = 0; i < arrRequiredReloadSelect.length; i++) {
        that.updateViewComponent({
            view: 'commonView',
            component: `${arrRequiredReloadSelect[i]}`,
            objKV: {isLoading: true}
        })
    }
    for (let i = 0; i < arrRequiredReloadViewTable.length; i++) {
        if (arrRequiredReloadViewTable[i] === 'dashboardView') {
            that.updateViewComponent({
                view: arrRequiredReloadViewTable[i],
                component: "table",
                objKV: {isLoading: true,}
            })
            continue
        }
        let {queryCondition, dataCount, perPage} = that[arrRequiredReloadViewTable[i]].table
        let ifLock = false
        let currentPageCount
        if (view === 'warehouseView' && arrRequiredReloadViewTable[i] === 'shelfView') ifLock = true
        if (view === 'shelfView' && arrRequiredReloadViewTable[i] === 'warehouseView') ifLock = true
        if (!ifLock) {
            switch (directive) {
                case 'afterDelete':
                    dataCount -= 1
                    break
                case 'afterSubmit':
                    dataCount += 1
                    // 这时候dataCount为上一次过滤的dataCount
                    currentPageCount = Math.ceil(dataCount / perPage)
                    break
                default:
                    break
            }
        }
        if (view === 'saleView') {
            currentPageCount = queryCondition.currentPageCount
        }
        that.updateViewComponent({
            view: arrRequiredReloadViewTable[i],
            component: "table",
            objKV: {
                isLoading: true,
                queryCondition: {...queryCondition, currentPageCount}
            }
        })
    }
}

export const handleFindSelectAndUpdate = (arrOriSelectData, objId) => {
    arrOriSelectData = arrOriSelectData.filter((item) => !(item.value in objId))
    return arrOriSelectData
}

const funcGetNewSelectData = (that, view, componentSelect, action) => {
    const {currentPageCount} = state[view].table.queryCondition
    const {perPage} = state[view].table
    const obj = {}
    let arrOriSelectData = state.commonView[componentSelect].data
    let ifFindToUpdate = false
    let strKeyWord = ""
    if (action === 1) {
        switch (view) {
            case 'colorView':
                strKeyWord = 'color'
                break
            case 'customerView':
            case 'driverView':
            case 'supplierView':
                strKeyWord = 'name'
                break
            case 'warehouseView':
                strKeyWord = 'warehouse'
                break
            case 'shelfView':
                strKeyWord = 'shelf'
                break
        }
    }
    for (let i = 0; i < that.arrOperatingRows.length; i++) {
        const numIndex = that.arrOperatingRows[i]
        const anyTableData = that[view].table.data[numIndex]
        const {_id} = anyTableData
        // restore
        if (action === 1) {
            let objData
            objData = that[view].table.data[numIndex]
            const {_id} = objData
            const text = objData[strKeyWord]
            arrOriSelectData.splice((currentPageCount - 1) * perPage + numIndex, 0, {value: _id, text})
        } else {
            // delete
            if (!ifFindToUpdate) {
                let numSelectIndex = (currentPageCount - 1) * perPage + numIndex
                const value = arrOriSelectData[numSelectIndex] ? arrOriSelectData[numSelectIndex].value : ""
                if (_id !== value) {
                    ifFindToUpdate = true
                    obj[_id] = ""
                    continue
                }
                arrOriSelectData.splice(numSelectIndex, 1)
            } else {
                obj[_id] = ""
            }
        }
    }
    if (ifFindToUpdate) arrOriSelectData = handleFindSelectAndUpdate(arrOriSelectData, obj)
    return arrOriSelectData
}

// 1: +, 2: -
export const handleAfterSoftAction = (that, action) => {
    handleBatchUpdateRow(that, that.arrOperatingRows, {isDeleted: action !== 1, status: 0})
    const {view} = that
    const componentSelect = `${view.substring(0, view.length - 4)}Select`
    const arrOriSelectData = funcGetNewSelectData(that, view, componentSelect, action)
    mutations.UPDATE_SELECT_DATA(state, {component: componentSelect, data: {data: arrOriSelectData}})
}

export const handleUpdateTableRow = (that, index, objKV) => {
    const {view} = that
    let isSub = typeof index === "string"
    if (isSub) {
        let subIndex
        [index, subIndex] = index.split('_')
        store.dispatch('updateTableSubRowData', {view, index, subIndex, objKV})
    } else {
        store.dispatch('updateTableRowData', {view, index, objKV})
    }
}

export const handleSubmitTableRow = (that, index, arrKeys) => {
    const {view} = that
    let isSub = typeof index === "string"
    let subIndex
    if (isSub) [index, subIndex] = index.split('_')
    let objData
    isSub ? objData = state[view].table.data[index].sub[subIndex] : objData = that[view].table.data[index]
    if (objData.status !== 1) return
    const idKey = funcGetLikeIdKey(objData)
    const objUpdateData = {}
    objUpdateData[idKey] = objData[idKey]

    for (let i = 0; i < arrKeys.length; i++) {
        let key = arrKeys[i]
        objUpdateData[key] = objData[key]
    }

    that.$notify({
        type: funcComputeAlertLevel(-1),
        title: "正在更新数据"
    })
    store.dispatch('updateTableRowData', {view, index, objKV: {status: 2}})
    store.dispatch('submitUpdateData', {view, objUpdateData, index}).then(() => {
        const {err_code, message} = state[view].table
        that.$notify({
            type: funcComputeAlertLevel(err_code),
            title: message
        })
        let status = 1
        if (err_code === 0) {
            const select = `${view.substring(0, view.length - 4)}Select`
            if (state.commonView.publicVariable.arrSelect.indexOf(select) !== -1) {
                store.dispatch('increaseRequestingTasksCount', 1)
                store.dispatch('updateCommonSelectSubValue', {
                    key: `${view.substring(0, view.length - 4)}Select`,
                    subKey: 'isLoading',
                    value: true
                })
            }
            if (view !== 'userView') status = 0
        }
        console.log(isSub)
        isSub ? store.dispatch('updateTableSubRowData', {view, index, subIndex, objKV: {status}}) : store.dispatch('updateTableRowData', {view, index, objKV: {status}})
    })
}

export const handleShowConfirmModal = (that, mode, objModalConfig) => {
    switch (mode) {
        case 'restore':
            that.modals.objConfig = {
                mode: 'restore',
                gradient: 'success',
                body: objModalConfig.body,
                ...objModalConfig[mode]
            }
            break
        case 'softDelete':
            that.modals.objConfig = {
                mode: 'softDelete',
                gradient: 'warning',
                body: objModalConfig.body,
                ...objModalConfig[mode]
            }
            break
        default:
            return
    }
    that.modals.isShow = true
}

export const handleModalConfirmClick = (that) => {
    that.modals.isShow = false
    // get strId and update row status
    const strId = funcArrIndexToStrId(that, {status: 2})
    const {view} = that
    let title, action
    switch (that.modals.objConfig.mode) {
        case "restore": {
            title = "正在恢复数据"
            action = 1
            break
        }
        case "softDelete": {
            title = "正在删除数据"
            action = 2
            break
        }
        default:
            return
    }
    that.$notify({
        type: funcComputeAlertLevel(-1),
        title
    })
    that.increaseRequestingTasksCount(1)
    that.submitUpdateDeleteMarker({view, _id: strId, action}).then(() => {
        that.decreaseRequestingTasksCount(1)
        const {err_code, message} = that[view].table
        that.$notify({
            type: funcComputeAlertLevel(err_code),
            title: message
        })
        if (err_code === 0) {
            (view === 'warehouseView' || view === 'shelfView') ? handleReloadTableAndOptionData(that, view, 'afterRestore') : handleAfterSoftAction(that, action)
        } else {
            // delete fail, the row should be still here
            handleBatchUpdateRow(that, that.arrOperatingRows, {status: 0})
        }
    })
}



export const handleDeleteTableRow = (that, view, index) => {
    // todo: <-- multi delete
    that.arrDeleteRow[0] = index
    // todo: multi delete -->
    that.modals.dataSource = that[view].table.data[index]
    that.modals.isShow = true
}

export const handleConfirmSoftDeleteTableRow = (that, view) => {
    const _id = funcArrIndexToStrId(that.arrDeleteRow, that[view].table.data)
    that.modals.isShow = false
    that.$notify({
        type: funcComputeAlertLevel(-1),
        title: "正在删除数据"
    })
    // todo: <-- multi delete
    let index = that.arrDeleteRow[0]
    // todo: multi delete -->
    that.updateTableRowData({view, index, objKV: {status: 2}})
    // todo: 加查询条件，删除完后查询
    that.submitDeleteId({view, _id}).then(() => {
        const {err_code, message} = that[view].table
        that.$notify({
            type: funcComputeAlertLevel(err_code),
            title: message
        })
        if (err_code === 0) {
            handleReloadTableAndOptionData(that, view, 'afterDelete')
        } else {
            // delete fail, the row should be still here
            that.updateTableRowData({view, index, objKV: {status: 0}})
        }
    })
}

export const handleDeleteTableSubRow = (that, view, strIndex) => {
    // todo: <-- multi delete
    that.arrDeleteRow[0] = strIndex.split('_').map(Number)
    // todo: multi delete -->
    let index = that.arrDeleteRow[0][0]
    let subIndex = that.arrDeleteRow[0][1]
    that.modals.dataSource = that[view].table.data[index]["sub"][subIndex]
    that.modals.isShow = true
}

export const handleConfirmDeleteTableSubRow = (that, view) => {
    let _id = ""
    for (let i = 0; i < that.arrDeleteRow.length; i++) {
        let arrIndex = that.arrDeleteRow[i]
        let index = arrIndex[0]
        let subIndex = arrIndex[1]
        _id += that[view].table.data[index]["sub"][subIndex]["_id"]
    }
    that.modals.isShow = false
    that.$notify({
        type: funcComputeAlertLevel(-1),
        title: "正在删除数据"
    })
    // todo: <-- multi delete
    let index = that.arrDeleteRow[0][0]
    let subIndex = that.arrDeleteRow[0][1]
    // todo: multi delete -->
    that.updateTableSubRowData({view, index, subIndex, objKV: {status: 2}})
    // todo: 加查询条件，删除完后查询
    that.submitDeleteId({view, _id}).then(() => {
        const {err_code, message} = that[view].table
        that.$notify({
            type: funcComputeAlertLevel(err_code),
            title: message
        })
        if (err_code === 0) {
            handleReloadTableAndOptionData(that, view, 'afterDelete')
        } else {
            // delete fail, the row should be still here
            that.updateTableSubRowData({view, index, subIndex, objKV: {status: 0}})
        }
    })
}

export const handleChangePage = (that, currentPageCount) => {
    const {view} = that
    let {queryCondition} = that[view].table
    queryCondition.currentPageCount = currentPageCount
    that.increaseRequestingTasksCount(1)
    // const idKey = funcGetLikeIdKey(that[view].table.queryCondition)
    // queryCondition[idKey] = that[view].table.queryCondition[idKey]
    that.updateViewComponent({
        view,
        component: "table",
        objKV: {
            queryCondition,
            isLoading: true
        }
    })
}

export const handleUpdateForm = (that, view, key, value) => {
    if (value === that[view]["form"][key]) return
    that.updateFormSingleData({view, key, value})
}

export const handleSubmitForm = (that, view, objFormKeys) => {
    // validate form
    let {arrKeys, isValid} = funcValidateForm(that, view, objFormKeys)
    if (!isValid) return
    that.updateFormSingleData({view, key: 'isLoading', value: true})
    that.$notify({
        type: funcComputeAlertLevel(-1),
        title: "正在上传表单"
    })
    that.submitForm({
        view,
        arrKeys
    }).then(() => {
        that.updateFormSingleData({view, key: 'isLoading', value: false})
        const {err_code, message} = that[view].form
        console.log(err_code, message)
        that.$notify({
            type: funcComputeAlertLevel(err_code),
            title: message
        })
        if (err_code === 0) {
            // that.updateViewComponent({view, component: 'table', objKV: {isLoading: true}})
            handleReloadTableAndOptionData(that, view, 'afterSubmit')
            if (view === 'saleView') {
                that.saleView.saleSummary = {}
                that.isShow = false
            }
        }
    })
}

export const handleSelectedValueChange = (newVal, oldVal, that, view) => {
    if (newVal === oldVal) return
    const value = funcGetTableSelectedValue(that, view)
    const queryCondition = funcGetResetQueryCondition(that[view].table.queryCondition, value)
    queryCondition.currentPageCount = 1
    that.increaseRequestingTasksCount(1)
    that.updateViewComponent(
        {
            view,
            component: "table",
            objKV: {
                isLoading: true,
                queryCondition
            }
        }
    )
}

export const handleLogOut = async () => {
    localStorage.removeItem('qianhengma_stock_management_token')
    localStorage.removeItem('qianhengma_stock_management_name')
    localStorage.removeItem('qianhengma_stock_management_level')
    mutations.UPDATE_VIEW(state, {
        view: 'loginView',
        objKV: {
            err_code: 0,
            message: '',
            token: '',
            form: {
                isLoading: false
            }
        }
    })
    if (router.currentRoute.fullPath !== '/login') await router.replace('/login')
}
