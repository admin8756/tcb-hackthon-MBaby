## 项目部署指南

你要有一个
 * 1.微信小程序的账号，
 * 2.百度ocr应用。
### 首先 你需要配置你的云开发
在储存里建立一个images的文件夹
![输入图片说明](https://images.gitee.com/uploads/images/2020/0217/200214_a33be369_1791536.png "屏幕截图.png")

### 其次 你需要配置你的百度应用账号以及修改开发环境名
路径：cloudfunctions/token/conf
配置百度ocr的应用信息。
const args = {
  APP_ID:"*******",
  API_KEY:"***********************************",
  SECRET_KEY:"********************************"
}

路径:/miniprogram/app.js
配置微信云开发环境ID
wx.cloud.init({
  env: '你的环境ID',
  traceUser: true,
})


### 然后在微信公众平台后台填加一个微信同声传译的插件
![输入图片说明](https://images.gitee.com/uploads/images/2020/0217/203515_c3f03382_1791536.png "屏幕截图.png")

### 最后剩下的就交给命运，然后提交微信审核吧。

嘻嘻(*^__^*) 嘻嘻