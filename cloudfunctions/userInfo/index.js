// 云函数入口文件
const cloud = require('wx-server-sdk')
const request = require('request');
cloud.init()
exports.main = (event, context) => {
  return new Promise((ress, errr) => {
    let data = Object.assign({
      url: 'https://free-api.heweather.net/s6/weather//now?key=a39e11929e12416684ccbe1f95062e2d&location=auto_ip',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
    }, {})
    request(data, (err, res, body) => {
      if (err) return errr(err);
      ress(res,context);
    })
  });
}