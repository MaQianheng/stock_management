import axios from 'axios'
import {baseUrl} from "@/api/index";
//data: {k: v}
export default function httpRequest(url, objQueryCondition, type) {
    if (type === 'GET') {
        let strParam = ''
        const arrKeys = Object.keys(objQueryCondition)
        for (let i = 0; i < arrKeys.length; i++) {
            let strKey = arrKeys[i]
            let anyVal = objQueryCondition[strKey]
            if (!anyVal) continue
            if (url === `${baseUrl}/sale/add` && strKey === 'product') anyVal = JSON.stringify(objQueryCondition[strKey])
            strParam += strKey + '=' + anyVal + '&'
        }
        if (strParam) strParam = strParam.substring(0, strParam.length - 1)
        return axios.get(url + '?' + strParam)
    } else {
        if ("productImages" in objQueryCondition) {
            const fd = new FormData()
            Object.keys(objQueryCondition).forEach(key => {
                fd.append(key, objQueryCondition[key])
                if (key === "productImages") {
                    for (let i = 0; i < objQueryCondition[key].length; i++) {
                        fd.append(key, objQueryCondition[key][i].file)
                    }
                }

            })
            return axios.post(url, fd, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
        }
        return axios.post(url, objQueryCondition)
    }
}
