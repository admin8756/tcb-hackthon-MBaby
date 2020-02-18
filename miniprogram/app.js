App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      /* 这里填入您的 */
      wx.cloud.init({
        env: 'sellp-9527',
        traceUser: true,
      })
    }
    this.globalData = {}
  }
})
