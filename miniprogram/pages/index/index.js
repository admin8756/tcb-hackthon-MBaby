const plugin = requirePlugin("WechatSI")
const manager = plugin.getRecordRecognitionManager()
import std from '../../utils/std.js';
Page({
  /* 数据 */
  data: {
    Lin: '',
    count: [],
    news: [],
    imgages:'',
    text: '',
    copyData: '小宝提醒您，您可以复制别人发的文字，点击这个按钮，即可语音播放',
    marqueePace: 5, //滚动速度
    marqueeDistance: 0, //初始滚动距离
    size: 40,
    orientation: 'left', //滚动方向
    interval: 50, // 时间间隔
  },
  /* 加载 */
  onLoad(options) {
    let firstOpen = wx.getStorageSync('firstOpen')
    if (!firstOpen) {
      wx.setStorageSync('firstOpen', true)
      this.toVoice('你好，我是小宝，我可以帮你了解每天疫情的情况。本页面的内容，点击可语音播放。')
    } else {
      this.toVoice('欢迎回来，本页面的内容，点击任何地方都可语音播放,点击红色按钮可识别照片里的文字。')
    }
  },
  /* 载入 */
  onReady() {
    this.getData()
  },
  /* 显示 */
  onShow() {
    let that = this
    wx.getClipboardData({
      success(res) {
        if (res.data) {
          that.toVoice('小宝检测到您刚才复制了一段话，点击黄色按钮可语音播放')
          that.setData({
            copyData: res.data
          })
        } else {
          return false
        }
      }
    })
  },

  /* 阅读新闻 */
  voiceNews(e) {
    std.toast('播放中...')
    let item = e.currentTarget.dataset.item
    let text = '正在为您播放，' + item.pubDateStr + '来自' + item.infoSource + '的报道。' + item.title + '详细内容如下：' + item.summary
    this.toVoice(text)
  },
  noMore() {
    this.toVoice('刷新完成...')
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
    this.setData({
      news: [],
    })
    this.getData()
  },
  /* 播放每日数据 */
  voiceNum() {
    let mun = this.data.count
    std.toast('播放中...')
    let text = '小宝提醒您，积极防护，保护自己。戴口罩，勤洗手。每日数据如下：确诊：' + mun.confirmedCount + '例。疑似：' + mun.suspectedCount + '例。死亡：' + mun.deadCount + '例。治愈' + mun.curedCount + '例。更新时间' + mun.leeTime
    this.toVoice(text)
  },
  voiceAbout() {
    std.toast('播放中...')
    let text = '本次新型冠状病毒，潜伏期：一般为 3～7 天，最长不超过 14 天，潜伏期内可能存在传染性，其中无症状病例传染性非常罕见。  易感人群：人群普遍易感。老年人及有基础疾病者感染后病情较重，儿童及婴幼儿也有发病。 宿主：野生动物，可能为中华菊头蝠'
    this.toVoice(text)
  },
  stop() {
    std.toast('播放视频中...')
    this.toVoice('播放视频中..')
  },
  /* 隐藏 */
  onHide() {},
  /* 卸载 */
  onUnload() {},
  /* 下拉 */
  onPullDownRefresh() {},
  /* 触底 */
  onReachBottom() {},
  /* 分享 */
  onShareAppMessage() {
    return {
      title: '老年人都需要的小工具',
      path: '/pages/index/index'
    }
  },
  /* 软件帮助 */
  helpMe(){
    this.toVoice('只要点击任何地方都可以语音播报，红色按钮可以识别图片里的字， 遇到看不懂的字，复制到软件里。点击黄色按钮就可以直接播放了，爱你呦..')
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  /* 获取数据 */
  getData() {
    std.re('https://ncov-api.werty.cn:2021/original/tx/').then(res => {
      let count = res.newslist[0].desc
      count.leeTime = std.toTimes(count.modifyTime)
      this.setData({
        count,
        news: res.newslist[0].news
      })
    })
  },
  /* 统一触发方法 */
  toVoice(e) {
    clearInterval(this.data.Lin);
    this.setData({
      text: e,
      marqueeDistance: 0,
    })
    this.calculation()
    std.Voice(e)
  },
  /* 滚动计算 */
  calculation() {
    let length = this.data.text.length * this.data.size; //文字长度
    let windowWidth = wx.getSystemInfoSync().windowWidth; // 屏幕宽度
    this.setData({
      length,
      windowWidth
    });
    this.runMarquee();
  },
  /* 开始滚动 */
  runMarquee() {
    let that = this;
    this.data.Lin = setInterval(() => {
      //文字一直移动到末端
      if (-that.data.marqueeDistance < that.data.length) {
        that.setData({
          marqueeDistance: that.data.marqueeDistance - that.data.marqueePace,
        });
      } else {
        clearInterval(this.data.Lin);
        that.setData({
          marqueeDistance: that.data.windowWidth
        });
        that.runMarquee();
      }
    }, that.data.interval);
  },
  playCopy(e){
    this.toVoice(e.target.id)
  },
  /* 云开发返回临时图片地址的方法,不管了，不存数据库了 */
  upImage(e) {
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      success(res) {
        if (res.tempFiles[0].size >= 4194304) {
          let text = '您上传的文件太大了，请重新上传'
          std.toast(text)
          std.toVoice(text)
          that.setData({
            text
          })
          return false
        } else {
          wx.showLoading({
            title: '上传中...',
            mask: true,
          })
          let Suffix = /\.[^\.]+$/.exec(res.tempFiles[0].path);
          let imgNmae = 'images/' + std.getTime() + '-' + std.randomNum(10000, 99999) + Suffix
          wx.cloud.uploadFile({
            cloudPath: imgNmae, // 上传至云端的路径
            filePath: res.tempFiles[0].path, // 小程序临时文件路径
            success: file => {
              that.setData({
                imgages:file.fileID
              })
              wx.cloud.callFunction({
                name: 'token',
                data: {
                  fileID: file.fileID
                }
              }).then(res => {
                wx.hideLoading()
                let result = res.result.words_result;
                if (result.length > 0) {
                  let arr = '';
                  for (let i = 0; i < result.length; i++) {
                    arr += result[i].words+'。'
                  }
                  that.setData({
                    words_result: arr
                  })
                  that.toVoice(arr)
                } else {
                  that.toVoice('没有识别到数据...请重新上传')
                }
                //删除图片
                // wx.cloud.deleteFile({
                //   fileList: [id]
                // }).then(res => {
                //   // handle success
                // }).catch(error => {
                //   // handle error
                // })
              }).catch(err => {
                wx.hideLoading()
                console.log(err)
              });
            },
            fail: console.error
          })
        }
      }
    })
  },
})