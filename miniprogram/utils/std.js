/**
 * 
 * LeeTool - JS - Uni版本
 * 低效的 - 自定义常用方法封装库
 * 更新时间： 2019 年11月15日16: 23: 23
 * 这是一个懒人使用的js工具， 大部分的方法都是配置好的。 有一些都不需要传任何参数。
 * 我们不追求很高的自定义。 我们只为了简单高效的写外包项目。 所以这是一个wbjs。
 * 请先引用这个js。 才能使用
 * 引入方法:
 * import std from "../../utils/std.js" 
 * 
 **/

/* 静态类 */
const host = "https://ncov-api.werty.cn:2021/"
const plugin = requirePlugin("WechatSI")
/* 请求封装 */
function re(url, datas, type) {
  return new Promise((resolve, reject) => {
    console.log(url, datas, type)
    wx.cloud.callFunction({
      name: 'cloud',
      data: {
        options: Object.assign({
          url: url,
          // url: host + url,
          method: type || 'GET',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
        }, datas)
      },
      success: res => {
        // let data = JSON.parse(res.result.body)
        resolve(JSON.parse(res.result.body));
      },
      fail: err => {
        console.error(err.data)
        reject(err.data);
      }
    })
  });
}

function Voice(e) {
  plugin.textToSpeech({
    lang: 'zh_CN',
    content: e || '没有找到内容',
    success: resTrans => {
      wx.playBackgroundAudio({
        dataUrl: resTrans.filename,
        title: '',
      })
    },
  })

}

function toast(e) {
  wx.showToast({
    title: e || '错误',
    duration: 2000,
    icon: 'none'
  })
}

/* 拼接数据，因为老是记不住这个 */

function acc(arr1, arr2) {
  if (arr2) {
    return (arr1 || []).concat(arr2 || [])
  } else {
    toast('没有更多了...')
  }
}

/* 延迟3秒后退出 */
function sellpBcak() {
  setTimeout(function() {
    back()
  }, 3 * 579);
}

/* 云开发返回临时图片地址的方法 */

function upImage() {

}

/* 输入时间戳,转日期时间*/
function toTimes(e) {
  if (e < 1546272000000) {
    var date = new Date(e * 1000);
  } else {
    var date = new Date(e);
  }
  let [y, m, d] = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
  let [h, mm, s] = [date.getHours(), date.getMinutes(), date.getSeconds()]
  m = m < 10 ? ("0" + m) : m;
  d = d < 10 ? ("0" + d) : d;
  h = h < 10 ? ("0" + h) : h;
  mm = mm < 10 ? ("0" + mm) : mm;
  s = s < 10 ? ("0" + s) : s;
  return y + "年" + m + "月" + d + '日' + h + '时' + mm + '分';
}

/* 获取时间戳*/
function getTime() {
  return Date.parse(new Date());
}

function randomNum(minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10);
      break;
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
      break;
    default:
      return 0;
      break;
  }
}
export default {
  Voice,
  re,
  randomNum,
  upImage,
  toast,
  getTime,
  acc,
  sellpBcak,
  toTimes
}