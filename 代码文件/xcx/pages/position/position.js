// pages/position/position.js
// var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
import QQMapWX from '../../utils/qqmap-wx-jssdk.js'
// var util = require('../../utils/util.js');
import util  from '../../utils/util.js';
var qqmapsdk;

Page({
  

  /**
   * Page initial data
   */
  data: {
    signType:0,//0上班打卡 1下班打卡
    is_out:1,//1办公地点打卡 2外勤打卡
    now_time: '',//当前时间
    nowDate:'',//当前年月日
    nowDay:'',//星期几
    tip:'',//提示 上午好、下午好
    current_address: '',//当前定位地址
    status: 0, //0未打卡 1已打卡
    latlng:[],//经纬度
    now_time_stop: '', //已打卡时间
    area:{},//考勤点多个
    record:[],//打卡记录
    username: '123',
    flag: 0
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    qqmapsdk = new QQMapWX({
      key: 'UIQBZ-7VSWT-2F4X3-LYC7J-OWAM5-OXFMY'
  });
  var info=wx.getStorageSync('userinfo');
  this.getCurrentTime();
  this.setData({
    now_time: this.getTime(),
    nowDate: util.formatTime(new Date()),
    nowDay: util.formatDay(new Date()),
    tip: util.formatSole(),
    // username: info.nickName,
  })

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
    qqmapsdk.search({
      keyword: 'DreamCoders',
      success: function (res) {
          console.log(res);
      },
      fail: function (res) {
          console.log(res);
      },
      complete: function (res) {
      console.log(res);
      },
    });
    this.getLocation();
    this.setData({
      status:0,
      current_address:'',
    })
},
  clockInStart(){
 
      this.setData({
        status: 0, //未打卡
        // record:list,
        // now_time_stop: that.data.now_time,
        current_address: '',
      });
      if(this.data.flag==0){
        this.setData({
          signType: 1
        })
        this.data.flag=1;
      }else{
        this.setData({
          signType: 0
        })
      }
  },
  signTap() {
    var that = this;
    if (!that.data.current_address) {
      return wx.showToast({
        title: '未获取当前定位',
        icon: 'error'
      })
    }
    var list =  that.data.record.concat({'times':that.data.now_time,'address':that.data.current_address});
    wx.vibrateLong();//手机震动提示
    // that.getSignRecord();
    that.setData({
      status: 1, //已打卡
      record:list,
      now_time_stop: that.data.now_time,
    })
    // console.log(list);
    // console.log(that.data.record);
    
    var key=wx.getStorageSync('token');
    if(key.identity==1){
      var {student_number,student_name} = e.detail.value;  
    }
    wx.request({
      url: 'http://127.0.0.1:9000/asset/submit',
      method: "POST",
      data: {
        record:list,//打卡地址信息
        now_time_stop: that.data.now_time,//打卡时间
        student_number: student_number,//学生学号
        student_name: student_name//学生姓名
      },
      success: (res)=>{
      //  console.log(res);
       wx.showToast({
        title: '打卡成功',
        icon: 'success',
        duration: 2000
      });

      },
      fail: (res)=>{
        // console.log(res);
        wx.showToast({
         title: '提交失败！',
         icon: 'error',
         duration: 2000
        });
       }
    })
  },
 
  getCurrentTime: function () {
    var time = setInterval(() => {
      this.setData({
        now_time: this.getTime()
      })
    }, 1000)
  },
  getTime() {
    let dateTime = '';
    let hh = new Date().getHours();
    let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() :
      new Date().getMinutes();
    let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() :
      new Date().getSeconds();
    dateTime = hh + ':' + mf + ':' + ss;
    return dateTime;
  },
 
  // 请求获取定位授权
  getUserAuth: function () {
    return new Promise((resolve, reject) => {
      wx.authorize({
        scope: 'scope.userLocation'
      }).then(() => {
        resolve()
      }).catch(() => {
        let that = this;
        wx.getSetting({
          success: (res) => {
            if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
              wx.showModal({
                title: '请求授权当前位置',
                content: '需要获取您的地理位置，请确认授权',
                success: function (res) {
                  if (res.cancel) {
                    wx.showToast({
                      title: '拒绝授权',
                      icon: 'none',
                      duration: 1000
                    })
                  } else if (res.confirm) {
                    wx.openSetting({
                      success: function (dataAu) {
                        if (dataAu.authSetting["scope.userLocation"] == true) {
                          //再次授权，调用wx.getLocation的API
                          that.getLocation();
                        } else {
                          wx.showToast({
                            title: '授权失败',
                            icon: 'none',
                            duration: 1000
                          })
                        }
                      }
                    })
                  }
                }
              })
            } else if (res.authSetting['scope.userLocation'] == undefined) {
              that.getLocation();
            } else {
              that.getLocation();
            }
          }
        })
      })
    })
  },
 
  getLocation: function () {
    const that = this
		// 实例化腾讯地图API核心类
    const QQMapwx = new QQMapWX({
      key: 'UIQBZ-7VSWT-2F4X3-LYC7J-OWAM5-OXFMY'// KEY必填
    });
    //获取当前位置
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        that.latitude = res.latitude
        that.longitude = res.longitude
        QQMapwx.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function(res) {
            let address = res.result.address + res.result.formatted_addresses.recommend;
            that.getSignRecord();
            that.setData({
              current_address:address,
              latlng:[res.result.location.lat,res.result.location.lng]
            })
          },
          fail: function(res) {
            this.getUserAuth()
            wx.showToast({
              title: '获取定位失败，请打开手机定位，重新进入！',
              icon: 'none'
            });
          }
        })
      },
    })
  },
  // 刷新定位
  refreshAdd() {
    this.getLocation(),
    this.getSignRecord()
  },
 
  //处理打卡记录及判断打卡位置是否办公地点打卡
  getSignRecord: function () {
    var that = this;
    console.log(that.data.latlng);
    var distance = that.getDistance(30.02,103.25,30.565449,103.973457);
    // that.data.latlng[0],that.data.latlng[1],
    // 30.02,103.25
    if(distance > 200000000000000){
      that.setData({
        is_out:2,
      })
    }
  },
 
 
//经纬度距离计算
getDistance:function (lat1, lng1, lat2, lng2, unit = false) {
    var radLat1 = lat1 * Math.PI / 180.0
    var radLat2 = lat2 * Math.PI / 180.0
    var a = radLat1 - radLat2
    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)))
    s = s * 6378.137 // EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000 //输出为公里
    if (unit) { //是否返回带单位
      if (s < 1) { //如果距离小于1km返回m
        s = s.toFixed(3)
        s = s * 1000 + "m"
      } else {
        s = s.toFixed(2)
        s = s + "km"
      }
    } else {
      s = s.toFixed(3)
      s = s * 1000
    }
	return s
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