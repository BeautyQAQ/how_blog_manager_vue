import request from '@/utils/request'
const group_name = 'article'
const api_name = 'article'
export default {
    //初始化索引
    init() {
        return request({
            url: `/${group_name}/${api_name}/init`,
            method: 'get'
        })
    }
}