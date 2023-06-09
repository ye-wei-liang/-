//app.js


const AV = require('./utils/av-live-query-weapp-min');

AV.init({
  appId: 'wx9324282e82b73d24',
  appKey: 'X6WstPiEjGHdzoRMqx9JR7lT',
});


App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    });
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    });
    wx.setStorageSync('labName', '');
    wx.getNetworkType({
      success: function(res) {
          const networkType = res.networkType
          //不为none代表有网络
          if ('none' != networkType) {
              wx.showToast({
                  icon: 'none',
                  title: '当前为' + res.networkType + '网络'
              })

          } else {

              wx.showToast({
                  icon: 'none',
                  title: '无网络,请检查网络连接'
              })


          }
      },
  })
  },

  
  globalData: {
  userInfo: null
  },
})