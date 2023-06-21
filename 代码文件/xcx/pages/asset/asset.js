// pages/asset/asset.js
Page({

  /**
   * Page initial data
   */
  data: {
    //存放轮播图数据
    swiperList:[],
  
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    // if(wx.getStorageSync('userinfo')==null){
    //   wx.redirectTo({
    //     url: '../login/login'        
    //   });
    // }
    this.getSwiperList();
   
  },
  //获取轮播图数据
  getSwiperList(){
    wx.request({
      // url: 'https://www.escook.cn/slides',
      url: 'http://127.0.0.1:9000/wechat/getPhotos',
      method: "GET",
      success: (res)=>{
        console.log(res.data),
        this.setData({
          swiperList: res.data
        })
        
      }
    })
  },
  //跳转资产盘点页面
  gotoAssetCheck(){
    wx.navigateTo({
      url: '/pages/identification/identification',
    })
  },
  //跳转定位打卡页面
  gotoPosition(){
    wx.navigateTo({
      url: '/pages/position/position',
    })
  },
    //跳转实验室选择页面
    gotoButtons(){
      wx.navigateTo({
        url: '/pages/buttons/buttons',
      })
    },
     //跳转实验室选择页面
     gotoReports(){
      wx.navigateTo({
        url: '/pages/reports/reports',
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
    var key=wx.getStorageSync('token');
    console.log(key.identity);
    if(key.identity==1)
      key.identity=0;
    else
      key.identity=1;
    this.setData({
      identity: key.identity
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