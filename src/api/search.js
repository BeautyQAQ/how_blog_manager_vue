import request from '@/utils/request'
const group_name = 'search'
const api_name = 'search'
export default {
  searchArticleTitle(keywords) {
    return request({
      url: `/${group_name}/${api_name}/article/title/${keywords}/1/10`,
      method: 'get'
    })
  },
  searchChannel(keywords) {
    return request({
      url: `/${group_name}/${api_name}/channel/${keywords}/1/10`,
      method: 'get'
    })
  },
  searchColumnName(keywords) {
    return request({
      url: `/${group_name}/${api_name}/column/name/${keywords}/1/10`,
      method: 'get'
    })
  },
  searchColumnSummary(keywords) {
    return request({
      url: `/${group_name}/${api_name}/column/name/${keywords}/1/10`,
      method: 'get'
    })
  },
  searchLabel(keywords) {
    return request({
      url: `/${group_name}/${api_name}/label/${keywords}/1/10`,
      method: 'get'
    })
  }
}
