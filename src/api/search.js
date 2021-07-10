import request from '@/utils/request'
const group_name = 'search'
const api_name = 'search'
export default {
  searchArticleTitle(keywords, page, size) {
    return request({
      url: `/${group_name}/${api_name}/article/title/${keywords}/${page}/${size}`,
      method: 'get'
    })
  }
}
