/* 定义微信同声传译 */
const plugin = requirePlugin("WechatSI")
/* 定义微信小程序录音管理器 */
const manage = plugin.getRecordRecognitionManager()
/* 引入李生自己的JS框架 */
import std from '../../utils/std.js';
Page({
  /* 数据 */
  data: {
    Lin: '', //这是一个定时器
    where: { //谣言筛选条件
      word: '',
      num: 10, //谣言返回的条数
      page: 1 //谣言的页码。
    },
    count: [], // 每日数据
    news: [], //新闻列表
    newsList: [], // 谣言列表
    imgages: '',
    text: '', //滚动条 默认文字
    size: 40, //滚动条 字体大小
    marqueePace: 5, //滚动速度
    marqueeDistance: 0, //初始滚动距离
    orientation: 'left', //滚动方向
    interval: 50, // 时间间隔
    currentText: '长按按钮后说出您不确定的内容关键字例如：武汉', //语音识别按钮
    copyData: '小宝提醒您，您可以复制别人发的文字，点击这个按钮，即可语音播放', //剪切板的内容
  },
  /* 加载 */
  onLoad(options) {
    let [that, firstOpen] = [this, wx.getStorageSync('firstOpen')]
    // 初始化录音监听事件
    this.initRecord()
    /* 检测用户是否是第一次打开小程序 */
    if (!firstOpen) {
      wx.setStorageSync('firstOpen', true)
      this.toVoice('你好，我是小宝，我可以帮你了解每天疫情的情况。本页面的内容，点击可语音播放。')
    } else {
      this.toVoice('欢迎回来，本页面的内容，点击任何地方都可语音播放,点击红色按钮可识别照片里的文字。')
    }
    /* 检测用户是否在剪切板有内容 */
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
  /* 载入 */
  onReady() {
    /* 获取感染数据 */
    this.getData()
    /* 获取谣言信息 */
    this.checkingRumors()
  },
  /* 显示 */
  onShow() {

  },

  /* 阅读新闻 */
  voiceNews(e) {
    std.toast('播放中...')
    let item = e.currentTarget.dataset.item
    /* 获取文章详情 */
    wx.setClipboardData({
      data: 'https://vp.fact.qq.com/article?id=' + item.id,
    })
    let text = '为您播放的消息属于' + item.explain + '发生于' + item.date + '来自' + item.author + '。标题为：' + item.title + '详细内容如下：' + item.desc + '谣言链接已复制，请粘贴发送给好友吧。'
    this.toVoice(text)
  },
  /* 加载更多的方法 */
  More() {
    this.toVoice('正在加载下一页...')
    this.setData({
      [`where.page`]: this.data.where.page + 1,
    })
    this.checkingRumors()
  },
  /* 播放每日数据 */
  voiceNum() {
    let mun = this.data.count
    std.toast('播放中...')
    let text = '小宝提醒您，积极防护，保护自己。戴口罩，勤洗手。每日数据如下：确诊：' + mun.confirmedCount + '例。疑似：' + mun.suspectedCount + '例。死亡：' + mun.deadCount + '例。治愈' + mun.curedCount + '例。更新时间' + mun.leeTime
    this.toVoice(text)
  },
  /* 播放关于病毒 */
  voiceAbout() {
    std.toast('播放中...')
    let text = '本次新型冠状病毒，潜伏期：一般为 3～7 天，最长不超过 14 天，潜伏期内可能存在传染性，其中无症状病例传染性非常罕见。  易感人群：人群普遍易感。老年人及有基础疾病者感染后病情较重，儿童及婴幼儿也有发病。 宿主：野生动物，可能为中华菊头蝠'
    this.toVoice(text)
  },
  /* 播放视频 */
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
  helpMe() {
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
  playCopy(e) {
    this.toVoice(e.target.id)
  },
  /* 调用腾讯云+百度云Ocr图片 */
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
        } else { //图片没有问题，开始上传
          wx.showLoading({
            title: '上传中...',
            mask: true,
          })
          let Suffix = /\.[^\.]+$/.exec(res.tempFiles[0].path); // 正则匹配找到后缀名
          /* 这里的文件名规则：当前时间戳 + 5位的随机数 + 后缀名 */
          let imgNmae = 'images/' + std.getTime() + '-' + std.randomNum(10000, 99999) + Suffix
          /* 云开发上传图片 */
          wx.cloud.uploadFile({
            cloudPath: imgNmae, // 上传至云端的路径
            filePath: res.tempFiles[0].path, // 小程序临时文件路径
            success: async file => {
              let imgUrl = file.fileID
              that.setData({
                imgages: imgUrl
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
                    arr += result[i].words + '。'
                  }
                  that.setData({
                    words_result: arr
                  })
                  that.toVoice(arr)
                } else {
                  that.toVoice('没有识别到数据...请重新上传')
                }
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

  /* 微信服务ocr图片方法 */
  wxUpImages(e) {
    let that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      success: async(res) => {
        try {
          if (res.tempFiles[0].size >= 4194304) {
            let text = '您上传的文件太大了，请重新上传'
            std.toast(text)
            std.toVoice(text)
            that.setData({
              text
            })
            return false
          }
          wx.showLoading({
            title: '上传中...',
            mask: true,
          })
          let Suffix = /\.[^\.]+$/.exec(res.tempFiles[0].path); // 正则匹配找到后缀名
          const uploadResult = await wx.cloud.uploadFile({
            filePath: res.tempFilePaths[0],
            /* 这里的文件名规则：当前时间戳 + 5位的随机数 + 后缀名 */
            cloudPath: 'images/' + std.getTime() + '-' + std.randomNum(10000, 99999) + Suffix,
          })
          /* 换取文件临时下载地址 */
          const {
            fileList
          } = await wx.cloud.getTempFileURL({
            fileList: [uploadResult.fileID],
          })
          that.setData({
            imgages: [uploadResult.fileID]
          })
          /* 调用微服务 
           * 接口文档地址：          
           * https://developers.weixin.qq.com/community/servicemarket/detail/000ce4cec24ca026d37900ed551415
          */
          const invokeRes = await wx.serviceMarket.invokeService({
            service: 'wx79ac3de8be320b71',
            api: 'OcrAllInOne',
            data: {
              img_url: fileList[0].tempFileURL,
              data_type: 3,
              ocr_type: 8
            },
          })
          wx.hideLoading()
          /* 删除文件,目前先不删除，后期做识别的历史记录*/
          // await wx.cloud.deleteFile({
          //   fileList: [fileID],
          // })
          let datas = JSON.parse(invokeRes.data)
          let result = datas.ocr_comm_res.items;
          if (result.length > 0) {
            let arr = '';
            for (let i = 0; i < result.length; i++) {
              arr += result[i].text + '。'
            }
            that.setData({
              words_result: arr
            })
            that.toVoice(arr)
          } else {
            that.toVoice('没有识别到数据...请重新上传')
          }
          // wx.showModal({
          //   title: 'success',
          //   content: JSON.stringify(invokeRes),
          // })
        } catch (err) {
          console.error('invokeService fail', err)
          wx.showModal({
            title: '扫描失败',
            content: err,
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  /* 开始录音的事件 */
  streamRecord() {
    /* 这里接口搜索功能暂不可用。*/
    std.toast('功能暂不可用')
    this.toVoice('该功能暂不可用..')
    return false
    /* 等可以用的时候注释掉上边的3行代码 */
    manage.start({
      lang: 'zh_CN',
    })
  },
  /* 结束了录音 */
  endStreamRecord() {
    manage.stop()
  },
  /* 录音转文本
     有新的识别内容返回，则会调用此事件
   */
  initRecord() {
    let that = this
    manage.onRecognize = (res) => {
      that.setData({
        currentText: res.result,
      })
    } // 识别结束事件
    manage.onStop = (res) => {
      let text = res.result
      // 用户没有说话
      if (text == '') {
        that.toVoice('没有识别到数据...请再说一次')
        return
      } else {
        this.setData({
          currentText: text,
        })
        that.toVoice('正在查询...')
        // 得到完整识别内容就可以去检测是否是谣言了
        this.checkingRumors(text)
      }
    }
  },
  /* 这里调用天行的数据api */
  checkingRumors(e) {
    /* 封装的请求有问题。请求GET参数的时候必须把参数手动拼接到url里。
    目前没有解决办法，后续再说吧。 */
    let that = this
    std.re('https://api.tianapi.com/txapi/rumour/index?key=172c4a984684752dbc7a2eddc142e785&word=' + e + '&page=' + that.data.where.page + '&num=' + that.data.where.num).then(res => {
      if (res.newslist.length >= 1) {
        let newsList = std.acc(that.data.newsList, res.newslist)
        that.setData({
          newsList
        })
      } else
        that.toVoice('加载失败，请检查网络')
    })
  }
})