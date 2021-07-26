import { Message } from 'element-ui';
/**
 *  实现功能
 *  1、默认情况下只禁止空格输入
 *  2、限制只能输入整数
 *  3、限制只能输入整数和小数（价格类）
 *  4、限制只能输入手机号
 *  5、限制最大值和最小值(抛出错误给回调函数)
 */
const addListener = function(el, type, fn) {
  el.addEventListener(type, fn, false)
}
const spaceFilter = function(el) {
  addListener(el, 'blur', () => {
    el.value = el.value.replace(/\s+/, '')
    return;
  })
}
const intFilter = function(el) {
  addListener(el, 'input', () => {
    el.value = el.value.replace(/\D/g, '')
    return;
  })
}
const chinaFilter = function (el) {
  addListener(el,'input',()=>{
    el.value = el.value.replace(/[^\w\.\/]/ig,'')
    return
  })
}
const priceFilter = function(el) {
  addListener(el, 'blur', () => {
    el.value = el.value.replace(/[^\d.]*/g, '')
    if (isNaN(el.value)) {
      el.value = ''
      return;
    }
  })
}
const priceOneFilter = function (el) {
  addListener(el,'input',()=>{
    el.value = el.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '')
    return
  })
}
const specialFilter = function(el) {
  addListener(el, 'blur', () => {
    el.value = el.value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, '')
    return;
  })
}
const phoneFilter = function(el) {
  addListener(el, 'blur', () => {
    if (!el.value) {
      return
    }
    const phoneReg = new RegExp('^(13|14|15|16|17|18|19)[0-9]{9}$')
    if (!phoneReg.test(el.value)) {
      el.value = ''
      Message.error('手机号输入错误')
      return;
    }
  })
}
const urlFilter = function(el) {
  addListener(el, 'blur', () => {
    if (!el.value) {
      return
    }
    const urlReg = /(^#)|(^http(s*):\/\/[^\s]+\.[^\s]+)/
    if (!urlReg.test(el.value)) {
      el.value = ''
      Message.error('url输入错误')
      return;
    }
  })
}
export default {
  bind(el, binding) {
    if (el.tagName.toLowerCase() !== 'input') {
      el = el.getElementsByTagName('input')[0]
    }
    spaceFilter(el)
    switch (binding.arg) {
      case 'int':
        intFilter(el)
        break
      case 'price':
        priceFilter(el)
        break
      case 'special':
        specialFilter(el)
        break
      case 'phone':
        phoneFilter(el)
        break
      case 'url':
        urlFilter(el)
        break
      case 'china':
        chinaFilter(el)
        break
      case 'one':
        priceOneFilter(el)
        break
      default:
        break
    }
  }
}
