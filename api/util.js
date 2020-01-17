import { wxPromisify } from '../config'
const ajax = wxPromisify(uni.request)

// 测试环境
const baseUrl = 'http://192.168.8.122:19001/'
// 正式环境
// const baseUrl = ''


const utils = class {

  /**
   * 获取token
   */
  async _getToken() {
    const accessToken = uni.getStorageSync('accessToken')
    const visitorToken = uni.getStorageSync('visitorToken')

    if (accessToken) {
      return accessToken
    }
    if (visitorToken) {
      return visitorToken
    }

    const response = await ajax({
      method: 'GET',
      url: `${baseUrl}genera/init`
    })

    if (response.data.success) {
      const visitorToken = response.data.data.visitorToken
      uni.setStorageSync('visitorToken', visitorToken)
      return visitorToken
    }
  }

  /**
   * 判断对象是否空
   * @param {object} obj
   */
  isNotEmptyObject(obj) {
    if (typeof obj === 'string') {
      if (obj.length > 0) {
        return true
      } else {
        return false
      }
    } else if (typeof obj === 'number') {
      return true
    } else if (typeof obj === 'Object') {
      if (obj.length > 0) {
        return true
      } else {
        return false
      }
    } else if (typeof obj === 'null') {
      return false
    } else if (typeof obj === 'undefined') {
      return false
    }
  }

  /**
   *  处理head中的token传参格式
   * @returns {string}
   */
  async getCustomHeader() {
    const token = await this._getToken()

    const header = {
      'Content-Type': 'application/json;charset=UTF-8',
    }

    // accessToken -> 登录接口使用     visitorToken -> 其他接口使用

    const userId = uni.getStorageSync('userId') // 获取用户登录状态

    // userId ? (header.accessToken = token || '') : (header.visitorToken = token || '')
    header.visitorToken = token || ''
    return header
  }

  /**
   * 获取timestamp
   */
  async getTimestamp() {

    const header = await this.getCustomHeader()

    const response = await ajax({
      method: 'GET',
      url: `${baseUrl}genera/times`,
      header,
    })

    if (response.data.success) {
      uni.setStorageSync('timestamp', new Date().getTime());
      uni.setStorageSync('aptimestamp', response.data.data.timestamp);

      return response.data.data.timestamp
    }
  }

  /**
   * 字符串转二进制
   * @param {*} str 字符串
   */
  strToBinary(str) {
    const result = []
    const list = str.split('')
    const key = 0x7C
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      let binaryByte = item.charCodeAt()
      binaryByte ^= key
      const binaryStr = binaryByte.toString(16)
      result.push(binaryStr)
    }
    return result.join('g')
  }

  /**
   * 计算请求参数中的uuid
   */
  uuid() {
    const s = []
    const hexDigits = '0123456789abcdef'
    for (let i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
    }
    s[14] = '4'
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
    s[8] = s[13] = s[18] = s[23] = '-'

    return s.join('')
  }
}

export const Util = new utils()
