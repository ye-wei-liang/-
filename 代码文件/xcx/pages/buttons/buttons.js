// pages/buttons/buttons.js
Page({

  /**
   * Page initial data
   */
  data: {
    buttonStyle: ['button','button','button','button','button','button','button','button','button'],
    flag: 0
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {

  },

  click(e) {
    // console.log(e);
    let butID = e.target.id.slice(0,6);
    let buttonId = e.target.id.slice(7,8);
    wx.setStorageSync('labName', butID);
    if(this.data.flag==0){
    
    // console.log(butID);
    // console.log( ['buttonStyle['+buttonId+']']);
    this.setData({
      ['buttonStyle['+buttonId+']']: 'button1'
    });
    this.data.flag=1;
    }else{
    this.setData({
      ['buttonStyle['+buttonId+']']: 'button'
    });
    this.data.flag=0;
    }
    // console.log(this.data.buttonStyle[buttonId]);
    // const query = wx.createSelectorQuery();
    // const element=query.select('#'+butID);
    // console.log(element)
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