import { http } from '../http'

export default {
  // 文章查询列表接口
  selectArticlesByPage: data => http.postAplt(`article/selectArticlesByPage`, data),
}
