// pages/login/login.js
Page({

  /**
   * Page initial data
   */
  data: {
     // 用户信息
     userInfo: {},
 
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    // 获取存储的用户授权信息
    const userinfo =  wx.getStorageSync('userinfo') || {}
    console.log(Object.keys(userinfo));
    // 判断是否存在已经授权的用户信息
    // if (Object.keys(userinfo).length == 0) {
      this.setData({
        userInfo: userinfo
      })
    // } else {
      // this.setData({
      //   userInfo: userinfo,
      // })
    // }
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {

  },
  getPhoneNumber(e){
    // console.log(e.detail.value)
    let number=e.detail.value
    // console.log(number)
    this.setData({
      phoneNumber: number
    })
    // console.log(this.data)
  },

  getUserProfile(e) {
    // console.log(this.data.phoneNumber)
    let that = this
    // 获取个人信息
    wx.getUserProfile({
      desc: '用于获取用户个人信息',
      success: function (detail) {
        // console.log(that.data.phoneNumber);
        wx.login({
          success: res => {
            var code = res.code; //登录凭证
            // console.log(detail.userInfo)
            wx.request({
              url: 'http://127.0.0.1:9000/wechat/login', //自己的服务接口地址
              method: 'GET',
              header: {
                'Content-Type': 'application/json'
              },
              // 需要传给后端的数据
              data: {
                // encryptedData: detail.encryptedData,
                // iv: detail.iv,
                code: code,
                // userInfo: detail.rawData,
                phoneNumber:that.data.phoneNumber
              },
              
              success: (res) => {
                // console.log("token:", res.data)
                // console.log("userinfo:", that.data)
                // 将用户授权信息存储到本地
                wx.setStorageSync('userinfo', detail.userInfo)
                // 将后端返回的token存储到本地
                wx.setStorageSync('token', res.data)
                // that.setData({
                //   userInfo: that.userInfo,  
                // });
                if(res.data.statusCode == 1){
                  wx.showToast({
                    title: '登录成功',
                  }),
                  wx.switchTab({
                    url: '../asset/asset'        
                  })
                }else {
                  wx.showToast({
                    title: '登录失败',
                  })
                }

          }
        });
      },
      fail: function () {
       wx.showModal({
         content: '取消授权将会影响相关服务，您确定取消授权吗？',
         success (res) {
           if (res.confirm) {
             wx.showToast({
               title: '已取消授权',
               duration: 1500
             })
           } else if (res.cancel) {
             that.getUserProfile()
           }
         }
       })
      }
    })
    
    

  }
    })
  },
  /**
   * Lifecycle function--Called when page hide
   */
  onHide() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  }
})