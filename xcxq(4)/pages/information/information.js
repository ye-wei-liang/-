// pages/information/information.js
Page({

  /**
   * Page initial data
   */
  data: {
    identityS: false,
    identityT: false,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    var key=wx.getStorageSync('token');
    var info=wx.getStorageSync('userinfo');
    // console.log(info);
    if(key.identity==1){
      this.setData({
        student_number: key.studentNumber,
        student_name: key.studentName,
        asset_number: key.assetNumber,
        asset_class: key.assetClass,
        station_number: key.stationNumber,
        tel_number: key.telNumber,
        imagesrc: info.avatarUrl,
        username: info.nickName,
        identityS: true,
      })
    }else {
      this.setData({
        teacher_number: key.teacherNumber,
        teacher_name: key.teacherName,
        tel_number: key.telNumber,
        imagesrc: info.avatarUrl,
        username: info.nickName,
        identityT: true,
      })
    }
  },
  formSubmit(e){
    // console.log(e.detail.value);
  },
  exit(){
      // 清除本地用户授权信息
      wx.setStorageSync('userinfo', null);
      // 清除本地token
      wx.setStorageSync('token', null);
      if(wx.getStorageSync('userinfo')==null){
        wx.redirectTo({
          url: '../login/login'        
        })
      }else{
        wx.showToast({
          title: '退出失败',
        })
      }
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