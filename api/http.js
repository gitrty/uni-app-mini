import { wxPromisify } from '../config'
const ajax = wxPromisify(uni.request)
const logins = wxPromisify(uni.login)
const showModals = wxPromisify(uni.showModal)
const authorizes = wxPromisify(uni.authorize)
const getImageInfos = wxPromisify(uni.getImageInfo)
const getUserInfos = wxPromisify(uni.getUserInfo)
const saveImageToPhotosAlbums = wxPromisify(uni.saveImageToPhotosAlbum)
const requestPayments = wxPromisify(uni.requestPayment)
import lodash from 'lodash'

import { Util } from './util'

// 测试环境
const baseUrl = 'http://192.168.8.122:19001/'
// 正式环境
// const baseUrl = ''

const request = class {

  /**
   * 序列化参数
   * @param {object} params 参数对象
   * @rerturn {object} 序列化后的新参数对象
   */
  async serializeParams(params = {}) {
    const deepedParams = lodash.cloneDeep(params)

    deepedParams.rand = Util.uuid()

    const timestamp = await Util.getTimestamp() // 获取时间戳
    let appKey = ''
    let appSecret = ''

    // 解析要加密的参数
    for (const key in deepedParams) {
      if (Util.isNotEmptyObject(deepedParams[key])) {
        if (key !== 'appKey' && key !== 'appSecret' && key !== 'timestamp') {
          appKey += key + '-'
          appSecret += key + deepedParams[key]
        }
      } else {
        delete deepedParams[key]
      }
    }

    // 加密参数
    const accessToken = await Util._getToken()

    const mds = Util.strToBinary(appKey.slice(0, appKey.length - 1))
    const mds2 = Util.strToBinary(timestamp + appSecret + accessToken)

    // 设置参数
    deepedParams.appKey = mds
    deepedParams.appSecret = mds2
    deepedParams.timestamp = timestamp

    return deepedParams
  }

  // 1 - get 请求
  async get(url, params = {}) {
    const newParams = await this.serializeParams(params)

    const header = await Util.getCustomHeader()
    url += urlLoader(newParams)

    const { data } = await ajax({
      method: 'GET',
      url: `${baseUrl}${url}`,
      header
    })
    return data.data
  }

  // 2 - post 请求
  async post(url, params = {}) {
    const newParams = await this.serializeParams(params)

    const header = await Util.getCustomHeader()
    url += urlLoader(newParams)
    // console.info(hearder)
    const { data } = await ajax({
      method: 'POST',
      url: `${baseUrl}${url}`,
      header
    })
    return data.data
  }

  // 3 - post请求 传参序列化 : 使用application / x-www-form-urlencoded格式
  async postAplt(url, params = {}) {
    const newParams = await this.serializeParams(params)
    const accessToken = await Util._getToken()

    // let header = null
    // if (uni.getStorageSync('accessToken')) {
    //   header = {
    //     'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    //     'accessToken': accessToken
    //   }
    // } else {
    const header = {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'visitorToken': accessToken
    }
    // }
    // console.info(header)
    const { data } = await ajax({
      method: 'POST',
      url: `${baseUrl}${url}`,
      data: newParams,
      header
    })
    return data.data
  }
}

const utils = class {
  login() {
    return logins({ provider: 'weixin' })
  }
  showModal(object) {
    return showModals(object)
  }
  authorize(scope) {
    return authorizes({ scope })
  }
  getImageInfo(src) {
    return getImageInfos({ src })
  }
  saveImageToPhotosAlbum(filePath) {
    return saveImageToPhotosAlbums({ filePath })
  }
  getUserInfo() {
    return getUserInfos()
  }
  requestPayment(data) {
    return requestPayments(data)
  }
}



const urlLoader = data => `?${Object.keys(data).map(item => `${item}=${data[item]}`).join('&')}`
export const http = new request()
export const util = new utils()
