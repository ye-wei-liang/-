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
    console.log(key);
    if(key.identity==1){
      this.setData({
        student_number: key.studentNumber,
        student_name: key.studentName,
        // asset_number: key.assetNumber,
        // asset_class: key.assetClass,
        screen_code: key.screenCode,
        host_code: key.hostCode,
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
    console.log(e.detail.value);
    var key=wx.getStorageSync('token');
    if(key.identity==1){
      let {student_number,student_name,screen_code, host_code, station_number, tel_number} = e.detail.value;  
      wx.request({
        url: 'http://127.0.0.1:9000/wechat/updateInfo',
        method: "POST",
        data: {
          studentNumber: student_number,
          studentName: student_name,
          screenCode: screen_code,
          hostCode: host_code,
          stationNumber: station_number,
          telNumber: tel_number,
        },
        success: (res)=>{
         console.log(res);
         wx.showToast({
          title: '提交成功！',
         });
         this.setData({
          student_number: res.studentNumber,
          student_name: res.studentName,
          screen_code: res.screenCode,
          host_code: res.hostCode,
          station_number: res.stationNumber,
          tel_number: res.telNumber,
        });
        },
        fail: (res)=>{
          wx.showToast({
           title: '提交失败！',
          });
         }
      });
    }else{
      let { teacher_number,teacher_name,tel_number} = e.detail.value;  
      wx.request({
        url: URL,
        method: "POST",
        data: {
          teacher_number: teacher_number,
          teacher_name:teacher_name,
          tel_number: tel_number,
        },
        success: (res)=>{
          wx.showToast({
            title: '提交成功！',
           });
          this.setData({
            teacher_number: teacher_number,
            teacher_name:teacher_name,
            tel_number: tel_number,
          })
        },
        fail: (res)=>{
          wx.showToast({
           title: '提交失败！',
          });
         }
      });
    }
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
  scancode: function(e) {
    var that = this;
    console.log(e.currentTarget.dataset.code);
    var name=e.currentTarget.dataset.code;
    if(name=='screen_code'){
      wx: wx.scanCode({
        // onlyFromCamera: true,
        scanType: [],
        success: function(res) {
          that.setData({
            screen_code: res.result,
         
          })
        },
        fail: function(res) {},
        complete: function(res) {},
      })
    }else if(name=='host_code'){
      wx: wx.scanCode({
        // onlyFromCamera: true,
        scanType: [],
        success: function(res) {
          that.setData({
            host_code: res.result,
            station_number: res.stationNumber,
          })
        },
        fail: function(res) {},
        complete: function(res) {},
      })
    }else {
      wx: wx.scanCode({
        // onlyFromCamera: true,
        scanType: [],
        success: function(res) {
          that.setData({
            station_number: res.result,
          })
        },
        fail: function(res) {},
        complete: function(res) {},
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