## 项目部署指南

你要有一个
 * 1.微信小程序的账号，
 * 2.百度ocr应用。
### 首先 你需要配置你的云开发
在储存里建立一个images的文件夹
![输入图片说明](https://images.gitee.com/uploads/images/2020/0217/200214_a33be369_1791536.png "屏幕截图.png")

### 其次 你需要配置你的百度应用账号以及修改开发环境名

· 这里有两个选择，一个是使用百度的sdk。一个是使用微信微服务，我推荐后者，因为啥呢。用户体验好
路径：cloudfunctions/token/conf
配置百度ocr的应用信息。
const args = {
  APP_ID:"*******",
  API_KEY:"***********************************",
  SECRET_KEY:"********************************"
}

配置微服务的方法
在https://developers.weixin.qq.com/community/servicemarket/detail/000ce4cec24ca026d37900ed551415
购买即可

路径:/project.config.json
配置你的appid

路径:/miniprogram/app.js
配置微信云开发环境ID
wx.cloud.init({
  env: '你的环境ID',
  traceUser: true,
})


### 然后在微信公众平台后台填加一个微信同声传译的插件
![输入图片说明](https://images.gitee.com/uploads/images/2020/0217/203515_c3f03382_1791536.png "屏幕截图.png")



### 导入项目，你就可以使用了。

嘻嘻(*^__^*) 嘻嘻