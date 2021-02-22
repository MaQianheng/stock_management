import axios from 'axios'
import {baseUrl} from "@/api/index";
//data: {k: v}
export default function httpRequest(url, data, type) {
    if (type === 'GET') {
        let paramStr = ''
        if (url === baseUrl + '/sale/add') {
            Object.keys(data).forEach(key => {
                let val
                if (key === 'product') {
                    val = JSON.stringify(data[key])
                } else {
                    val = data[key]
                }
                paramStr += key + '=' + val + '&'
            })
        } else {
            Object.keys(data).forEach(key => {
                paramStr += key + '=' + data[key] + '&'
            })
        }
        if (paramStr) {
            paramStr = paramStr.substring(0, paramStr.length - 1)
        }
        // 使用axios发get请求
        return axios.get(url + '?' + paramStr)
        // return axios.get(`${url}?username=${data.username}&password=${data.password}`)
    } else {
        if ("productImages" in data) {
            const fd = new FormData()
            Object.keys(data).forEach(key => {
                console.log(key, data[key])
                fd.append(key, data[key])
                if (key === "productImages") {
                    for (let i = 0; i < data[key].length; i++) {
                        fd.append(key, data[key][i].file)
                    }
                }

            })
            return axios.post(url, fd, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
        }
        return axios.post(url, data)
    }
}
