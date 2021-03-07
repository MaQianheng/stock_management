export function deepClone(target) {
    // 定义一个变量
    let result;
    // 如果当前需要深拷贝的是一个对象的话
    if (typeof target === 'object') {
        // 如果是一个数组的话
        if (Array.isArray(target)) {
            result = []; // 将result赋值为一个数组，并且执行遍历
            for (let i in target) {
                // 递归克隆数组中的每一项
                result.push(deepClone(target[i]))
            }
            // 判断如果当前的值是null的话；直接赋值为null
        } else if (target === null) {
            result = null;
            // 判断如果当前的值是一个RegExp对象的话，直接赋值
        } else if (target.constructor === RegExp) {
            result = target;
        } else {
            // 否则是普通对象，直接for in循环，递归赋值对象的所有值
            result = {};
            for (let i in target) {
                result[i] = deepClone(target[i]);
            }
        }
        // 如果不是对象的话，就是基本数据类型，那么直接赋值
    } else {
        result = target;
    }
    // 返回最终结果
    return result;
}


export function add0(m) {
    return m < 10 ? '0' + m : m
}

export function getDate(timeStamp, addOneMoreDay = true) {
    if (!timeStamp) timeStamp = Date.now()
    if (addOneMoreDay) timeStamp += 24 * 60 * 60 * 1000
    let time = new Date(timeStamp)
    let y = time.getFullYear();
    let m = time.getMonth() + 1;
    let d = time.getDate();
    return y + '-' + add0(m) + '-' + add0(d);
}

export function getDateTime(timeStamp) {
    if (!timeStamp) timeStamp = Date.now()
    let time = new Date(timeStamp)
    let y = time.getFullYear();
    let m = time.getMonth() + 1;
    let d = time.getDate();
    let h = time.getHours();
    let mm = time.getMinutes();
    let s = time.getSeconds();
    return `${add0(y)}-${add0(m)}-${add0(d)} ${add0(h)}:${add0(mm)}:${add0(s)}`
}

export function validateInputNumber(value) {
    let result = ""
    for (let i = 0; i < value.length; i++) {
        let val = value[i]
        if (isNaN(val)) continue
        result += val
    }
    return result
}

export function validateInputAlphaBetAndNumber(value) {
    return value.replace(/[\W]/g, '')
}

export function sortChinese(arr) { // 参数： 排序的数组
    arr.sort((item1, item2) => (item1.localeCompare(item2, 'zh-CN')))
    return arr
}

export function handleDebounce(func, numDelay) {
    let timeOut = null
    return () => {
        if (timeOut !== null) clearTimeout(timeOut)
        timeOut = setTimeout(() => {
            timeOut = null
            clearTimeout(timeOut)
            func()
        }, numDelay)
    }
}

export function lazyLoadView(AsyncView) {
    const AsyncHandler = () => ({
        // 需要加载的组件 (应该是一个 `Promise` 对象)
        component: AsyncView,
        // 异步组件加载时使用的组件
        loading: require('../components/MyComponents/Spinner').default,
        // 加载失败时使用的组件
        // error: require('@/components/public/RouteError.vue').default,
        // 展示加载时组件的延时时间。默认值是 200 (毫秒)
        delay: 200,
        // 如果提供了超时时间且组件加载也超时了，
        // 则使用加载失败时使用的组件。默认值是：`Infinity`
        timeout: 10000
    });
    return Promise.resolve({
        functional: true,
        render(h, {data, children}) {
            return h(AsyncHandler, data, children);
        }
    });
}
