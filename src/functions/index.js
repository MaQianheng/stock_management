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

export const funcArrIdIndexToStrId = (arrIdIndex, dataSource) => {
    let str = ""
    for (let i = 0; i < arrIdIndex.length; i++) {
        let index = arrIdIndex[i]
        const {_id} = dataSource[index]
        i === (arrIdIndex.length - 1) ? str += _id : str += `${_id},`
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

export const handleGetTableData = (that, view, ifNotify = false) => {
    // view: colorView
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
        if (view === 'warehouseView' && arrRequiredReloadViewTable[i] === 'shelfView') ifLock = true
        if (view === 'shelfView' && arrRequiredReloadViewTable[i] === 'warehouseView') ifLock = true
        if (!ifLock) {
            switch (directive) {
                case 'afterDelete':
                    dataCount -= 1
                    break
                case 'afterSubmit':
                    dataCount += 1
                    break
                default:
                    break
            }
        }
        // 这时候dataCount为上一次过滤的dataCount
        let currentPageCount
        if (view === 'saleView') {
            currentPageCount = queryCondition.currentPageCount
        } else {
            currentPageCount = Math.ceil(dataCount / perPage)
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

export const handleUpdateTableRow = (that, view, index, key, value) => {
    if (value === that[view].table.data[index][key]) return
    const objKV = {
        status: 1
    }
    objKV[key] = value
    that.updateTableRowData({view, index, objKV})
}

export const handleUpdateTableSubRow = (that, view, strIndex, key, value) => {
    const tmp = strIndex.split('_').map(Number)
    const index = tmp[0]
    const subIndex = tmp[1]
    if (value === that[view].table.data[index]['sub'][subIndex][key]) return
    const objKV = {
        status: 1
    }
    objKV[key] = value
    that.updateTableSubRowData({view, index, subIndex, objKV})
}

export const handleSubmitTableRow = (that, view, index, arrKeys) => {
    const objData = that[view].table.data[index]
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
    that.updateTableRowData({view, index, objKV: {status: 2}})
    that.submitUpdateData({view, objUpdateData, index}).then(() => {
        const {err_code, message} = that[view].table
        that.$notify({
            type: funcComputeAlertLevel(err_code),
            title: message
        })
        if (err_code === 0) {
            const select = `${view.substring(0, view.length - 4)}Select`
            if (that.commonView.publicVariable.arrSelect.indexOf(select) !== -1) {
                that.increaseRequestingTasksCount(1)
                that.updateCommonSelectSubValue({
                    key: `${view.substring(0, view.length - 4)}Select`,
                    subKey: 'isLoading',
                    value: true
                })
            }
            let status
            view === 'userView' ? status = 1 : status = 0
            that.updateTableRowData({view, index, objKV: {status}})
        } else {
            that.updateTableRowData({view, index, objKV: {status: 1}})
        }
    })
}

export const handleSubmitTableSubRow = (that, view, strIndex, arrKeys) => {
    const tmp = strIndex.split('_').map(Number)
    const index = tmp[0]
    const subIndex = tmp[1]
    const objData = that[view].table.data[index]
    const objSubData = that[view].table.data[index]['sub'][subIndex]
    if (objSubData.status !== 1) return

    const objUpdateData = {}
    const idKey = funcGetLikeIdKey(objData)
    objUpdateData[idKey] = objData[idKey]

    const subIdKey = funcGetLikeIdKey(objSubData)
    objUpdateData[subIdKey] = objSubData[subIdKey]

    for (let i = 0; i < arrKeys.length; i++) {
        let key = arrKeys[i]
        objUpdateData[key] = objSubData[key]
    }

    that.$notify({
        type: funcComputeAlertLevel(-1),
        title: "正在更新数据"
    })
    that.updateTableSubRowData({view, index, subIndex, objKV: {status: 2}})
    // that.submitUpdateSubData({view, objUpdateData, index, subIndex})

    that.submitUpdateData({view, objUpdateData, index, subIndex}).then(() => {
        const {err_code, message} = that[view].table
        that.$notify({
            type: funcComputeAlertLevel(err_code),
            title: message
        })
        console.log(view)
        if (err_code === 0) {
            that.increaseRequestingTasksCount(1)
            that.updateCommonSelectSubValue({
                key: `${view.substring(0, view.length - 4)}Select`,
                subKey: 'isLoading',
                value: true
            })
            that.updateTableSubRowData({view, index, subIndex, objKV: {status: 0}})
        } else {
            that.updateTableSubRowData({view, index, subIndex, objKV: {status: 1}})
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

export const handleConfirmDeleteTableRow = (that, view) => {
    const _id = funcArrIdIndexToStrId(that.arrDeleteRow, that[view].table.data)
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

export const handleChangePage = (that, view, currentPageCount) => {
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

export const watchHandleSelectedValue = (newVal, oldVal, that, view) => {
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

export const handleLogOut = (that) => {
    localStorage.removeItem('qianhengma_stock_management_token')
    localStorage.removeItem('qianhengma_stock_management_name')
    localStorage.removeItem('qianhengma_stock_management_level')
    that.UPDATE_VIEW({
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
    that.$router.replace('/login')
}
