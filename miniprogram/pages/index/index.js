const plugin = requirePlugin("WechatSI")
const manager = plugin.getRecordRecognitionManager()
import std from '../../utils/std.js';
Page({
  /* 数据 */
  data: {
    Lin: '',
    count: [],
    news: [],
    text: '',
    marqueePace: 5, //滚动速度
    marqueeDistance: 0, //初始滚动距离
    size: 40,
    orientation: 'left', //滚动方向
    interval: 50, // 时间间隔
    adUrl: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1580980135481&di=e9e221cd7969156d06e62f372693fc0a&imgtype=0&src=http%3A%2F%2Fwww.17qq.com%2Fimg_biaoqing%2F48248333.jpeg',
  },
  /* 加载 */
  onLoad(options) {},
  /* 载入 */
  onReady() {
    this.getData()
  },
  /* 显示 */
  onShow() {
    let firstOpen = wx.getStorageSync('firstOpen')
    if (!firstOpen) {
      wx.setStorageSync('firstOpen', true)
      this.toVoice('你好，我是小宝，我可以帮你了解每天疫情的情况。本页面的内容，点击可语音播放。')
    } else {
      this.toVoice('欢迎回来，本页面的内容，点击任何地方都可语音播放。')
    }
  },

  /* 阅读新闻 */
  voiceNews(e) {
    std.toast('播放中...')
    let item = e.currentTarget.dataset.item
    let text = '正在为您播放，' + item.pubDateStr + '来自' + item.infoSource + '的新闻。' + item.title + '详细内容如下：' + item.summary
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
  onShareAppMessage() {},
  /* 获取数据 */
  getData() {
    std.re('original/tx/').then(res => {
      console.log(res.data.newslist[0])
      let count = res.data.newslist[0].desc
      count.leeTime = std.toTimes(count.modifyTime)
      this.setData({
        count,
        news: res.data.newslist[0].news
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
  }
})