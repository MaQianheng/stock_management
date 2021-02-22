import httpRequest from "./http";
export const baseUrl = "http://127.0.0.1:3000"
// export const baseUrl = "http://mjq1958.meibu.com:3000"
// export const baseUrl = "http://192.168.1.20:3000"

// export const requestQueryColor = (queryCondition) => httpRequest(baseUrl + '/test/test400', queryCondition, 'GET')

export const requestLogin = (user) => httpRequest(baseUrl + '/users/login', user, 'POST')
export const requestAddUser = (user) => httpRequest(baseUrl + '/users/add', user, 'POST')


export const requestQueryDashboardData = (queryCondition) => httpRequest(baseUrl + '/dashboard/query', queryCondition, 'GET')


export const requestQueryColorOptions = (queryCondition) => httpRequest(baseUrl + '/color/query_color_options', queryCondition, 'GET')
export const requestQueryWarehouseOptions = (queryCondition) => httpRequest(baseUrl + '/warehouse/query_warehouse_options', queryCondition, 'GET')
export const requestQueryShelfOptions = (queryCondition) => httpRequest(baseUrl + '/shelf/query_shelf_options', queryCondition, 'GET')
export const requestQueryCustomerOptions = (queryCondition) => httpRequest(baseUrl + '/customer/query_customer_options', queryCondition, 'GET')
export const requestQuerySupplierOptions = (queryCondition) => httpRequest(baseUrl + '/supplier/query_supplier_options', queryCondition, 'GET')
export const requestQueryDriverOptions = (queryCondition) => httpRequest(baseUrl + '/driver/query_driver_options', queryCondition, 'GET')
export const requestQueryCodeOptions = (queryCondition) => httpRequest(baseUrl + '/product/query_code_options', queryCondition, 'GET')
export const requestQueryProductOptions = (queryCondition) => httpRequest(baseUrl + '/product/query_product_options', queryCondition, 'GET')
export const requestQueryCascadingWarehouseShelfOptions = (queryCondition) => httpRequest(baseUrl + '/shelf/query_cascading_warehouse_shelf', queryCondition, 'GET')
export const requestQueryOperatorOptions = (queryCondition) => httpRequest(baseUrl + '/users/query_user_options', queryCondition, 'GET')



export const requestAddColor = (color) => httpRequest(baseUrl + '/color/add', color, 'GET')
export const requestAddWarehouse = (warehouse) => httpRequest(baseUrl + '/warehouse/add', warehouse, 'GET')
export const requestAddShelf = (shelf) => httpRequest(baseUrl + '/shelf/add', shelf, 'GET')
export const requestAddCustomer = (customer) => httpRequest(baseUrl + '/customer/add', customer, 'GET')
export const requestAddSupplier = (supplier) => httpRequest(baseUrl + '/supplier/add', supplier, 'GET')
export const requestAddProduct = (product) => httpRequest(baseUrl + '/product/add', product, 'POST')
export const requestAddSale = (sale) => httpRequest(baseUrl + '/sale/add', sale, 'GET')
export const requestAddDriver = (driver) => httpRequest(baseUrl + '/driver/add', driver, 'GET')



export const requestDeleteColor = (colorId) => httpRequest(baseUrl + '/color/delete', colorId, 'GET')
export const requestDeleteWarehouse = (warehouseId) => httpRequest(baseUrl + '/warehouse/delete', warehouseId, 'GET')
export const requestDeleteShelf = (shelfId) => httpRequest(baseUrl + '/shelf/delete', shelfId, 'GET')
export const requestDeleteCustomer = (customerId) => httpRequest(baseUrl + '/customer/delete', customerId, 'GET')
export const requestDeleteSupplier = (supplierId) => httpRequest(baseUrl + '/supplier/delete', supplierId, 'GET')
export const requestDeleteProduct = (productId) => httpRequest(baseUrl + '/product/delete', productId, 'GET')
export const requestDeleteDriver = (driverId) => httpRequest(baseUrl + '/driver/delete', driverId, 'GET')
export const requestDeleteUser = (userId) => httpRequest(baseUrl + '/users/delete', userId, 'GET')



export const requestUpdateColor = (color) => httpRequest(baseUrl + '/color/update', color, 'GET')
export const requestUpdateWarehouse = (warehouse) => httpRequest(baseUrl + '/warehouse/update', warehouse, 'GET')
export const requestUpdateShelf = (shelf) => httpRequest(baseUrl + '/shelf/update', shelf, 'GET')
export const requestUpdateCustomer = (customer) => httpRequest(baseUrl + '/customer/update', customer, 'GET')
export const requestUpdateSupplier = (supplier) => httpRequest(baseUrl + '/supplier/update', supplier, 'GET')
export const requestUpdateProduct = (product) => httpRequest(baseUrl + '/product/update', product, 'POST')
export const requestUpdateDriver = (driver) => httpRequest(baseUrl + '/driver/update', driver, 'GET')
export const requestUpdateUser = (user) => httpRequest(baseUrl + '/users/update', user, 'POST')



export const requestQueryColor = (queryCondition) => httpRequest(baseUrl + '/color/query', queryCondition, 'GET')
export const requestQueryWarehouse = (queryCondition) => httpRequest(baseUrl + '/warehouse/query', queryCondition, 'GET')
export const requestQueryShelf = (queryCondition) => httpRequest(baseUrl + '/shelf/query', queryCondition, 'GET')
export const requestQueryCustomer = (queryCondition) => httpRequest(baseUrl + '/customer/query', queryCondition, 'GET')
export const requestQuerySupplier = (queryCondition) => httpRequest(baseUrl + '/supplier/query', queryCondition, 'GET')
export const requestQueryProduct = (queryCondition) => httpRequest(baseUrl + '/product/query', queryCondition, 'GET')
export const requestQuerySaleProduct = (queryCondition) => httpRequest(baseUrl + '/sale/query_product', queryCondition, 'GET')
export const requestQuerySaleHistory = (queryCondition) => httpRequest(baseUrl + '/sale/query_history', queryCondition, 'GET')
export const requestQueryDriver = (queryCondition) => httpRequest(baseUrl + '/driver/query', queryCondition, 'GET')
export const requestQueryUser = (queryCondition) => httpRequest(baseUrl + '/users/query', queryCondition, 'GET')



export const requestFuzzyQueryCustomerName = (queryCondition) => httpRequest(baseUrl + '/customer/fuzzy_query_customer_name', queryCondition, 'GET')
export const requestFuzzyQuerySupplierName = (queryCondition) => httpRequest(baseUrl + '/supplier/fuzzy_query_supplier_name', queryCondition, 'GET')
export const requestFuzzyQueryDriverName = (queryCondition) => httpRequest(baseUrl + '/driver/fuzzy_query_driver_name', queryCondition, 'GET')
export const requestFuzzyQueryOperatorName = (queryCondition) => httpRequest(baseUrl + '/users/fuzzy_query_operator_name', queryCondition, 'GET')
export const requestFuzzyQueryProductCode = (queryCondition) => httpRequest(baseUrl + '/product/fuzzy_query_product_code', queryCondition, 'GET')
export const requestFuzzyQueryProductName = (queryCondition) => httpRequest(baseUrl + '/product/fuzzy_query_product_name', queryCondition, 'GET')
