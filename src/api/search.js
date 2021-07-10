import request from '@/utils/request'
const group_name = 'search'
const api_name = 'search'
export default {
  searchArticleTitle(keywords) {
    return request({
      url: `/${group_name}/${api_name}/article/title/${keywords}/1/10`,
      method: 'get'
    })
  }
}
