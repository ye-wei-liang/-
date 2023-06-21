//获取应用实例
const app = getApp()
const coordtransform = require('../lib/coordtransform.js');
// pages/Device/device.js
var util=require('../../utils/util.js');
const AV = require('../../utils/av-live-query-weapp-min');
var crypto = require('../lib/cryptojs/cryptojs.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTopTips: false,
    topTips: '',
    select: false,
    tihuoWay: 'BS425',
    systemVersionIndex: 0,
    stationCode: null,
    screenCode:null,
    hostCode:null,
    ocrSign:null,
    textValue: '',
    flag: 0,
    priceUrl:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var sign = this.generateOCRSign()
    this.setData({
      ocrSign:sign
    })
    console.log("签名:%s", this.data.ocrSign)
  },
  onUnload: function( options) {
    this.setData({
      stationCode: null,
      screenCode:null,
      hostCode:null,
    })
  },
  

preview(){
  // var URL = 'http://127.0.0.1:9000/wechat/getPhotos'+'/'+this.data.tihuoWay;
  // console.log(URL);
  var labName=wx.getStorageSync('labName');
  if(labName==''){
    this.showTips('请选择实验室');
  }
  wx.request({
    url: 'http://127.0.0.1:9000/asset/getMap',
    method: "GET",
    data:{
      tihuoWay: labName
    },
    success: (res)=>{
      this.setData({
        priceUrl: [res.data],
      })
      var imageURL=this.data.priceUrl;
      wx.previewImage({
        urls: imageURL,
        success:(res=>{
          console.log(res)
        })
      })
    },
      fail:(res)=>{
        // console.log(res);
    },
  })
    // var imageURL=this.data.priceUrl;
    // wx.previewImage({
    //   urls: imageURL,
    //   success:(res=>{
    //     console.log(res)
    //   })
    // })
},
// bindShowMsg() {
//     this.setData({
//       select: !this.data.select
//     })
// },

// mySelect(e) {
//     var name = e.currentTarget.dataset.name
//     this.setData({
//       tihuoWay: name,
//       select: false
//     })
// },

  //生成腾讯orc签名
  generateOCRSign:function() {
    var secretId = 'AKIDENL7i9LZVFpV6XoqqsBOTObhhTBlpEZp',
      secretKey = 'IVXN5hHguTtwJdnlYDKxY0GKFAwlQuCI',
      appid = '1256097546',
      pexpired = 86400,
      userid = 0;

    var now = parseInt(Date.now() / 1000),
      rdm = parseInt(Math.random() * Math.pow(2, 32)),
      plainText = 'a=' + appid + '&k=' + secretId + '&e=' + (now + pexpired) + '&t=' + now + '&r=' + rdm + '&u=' + userid + '&f=',
      data = crypto.Crypto.charenc.UTF8.stringToBytes(plainText),
      resBytes = crypto.Crypto.HMAC(crypto.Crypto.SHA1, plainText, secretKey, { asBytes:true}),
      bin = resBytes.concat(data);

    var sign = crypto.Crypto.util.bytesToBase64(bin);
    return sign;
  },

  bindDeviceCodeInput: function (e) {
    this.setData({
      deviceCode: e.detail.value
    })
  },

  bindCompanyCodeInput: function (e) {
    this.setData({
      companyCode: e.detail.value
    })
  },


  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);

    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }

    this.setData({
      radioItems: radioItems
    });
  },


  bindDeviceTypesChange:function(e) {
    this.setData({
      deviceTypeIndex: e.detail.value
    })
  },

  bindDeviceBrandChange: function (e) {
    this.setData({
      brandIndex: e.detail.value
    })
  },

  showTips:function(content) {
    var that = this;
    this.setData({
      showTopTips: true,
      topTips: content
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false,
        topTips: ''
      });
    }, 3000);
  },
  changeContext :function(e){
    this.setData({
      textValue: e.detail.value,
    });
  },

  formSubmit: function (e) {
    var that = this;
    var currentTime=util.formatTime1(new Date());

    // console.log(time);
    let { stationCode,screenCode,hostCode} = e.detail.value;  
    if (!stationCode){
      this.showTips('请输入工位编号');
    } else  if (!screenCode){
      this.showTips('请输入显示器编号');
    } else if(!hostCode){
      this.showTips('请输入主机编号');
    }else {
      // wx.showModal({
      //   title: '',
      //   content: '我确定填写信息无误',
      //   success: function (res) {
      //     if (res.confirm) {
      //       console.log('用户点击确定')
      //     } else if (res.cancel) {
      //       console.log('用户点击取消')
      //     }
      //   }
      // })
      wx.request({
        url: 'http://127.0.0.1:9000/asset/submit',
        method: "POST",
        data: {
          stationCode: stationCode,
          screenCode: screenCode,
          hostCode: hostCode,
          remark: that.data.textValue,
          currentTime: currentTime
        },
        success: (res)=>{
         console.log(res);
         if(res.mark==1){
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000
          });
          that.setData({
            stationCode: '',
            screenCode: '',
            hostCode: '',
            textValue: '',
          })
         }else{
          wx.showToast({
            // title: '失败，'+res.msg+'请勿重复提交',
            title: '请勿重复提交',
            icon: 'error',
            duration: 2000
          });
         }

        },
        fail: (res)=>{
          console.log(res);
          wx.showToast({
           title: '提交失败！',
           icon: 'error',
           duration: 2000
          });
         }
      })
    }


  },

  bindScanClick:function() {
    console.log('照相机拍照')
   var that = this
    //相机拍照
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        // console.log("图片地址:%s", tempFilePaths)
        // console.log("ocrSign：%s", that.data.ocrSign)
        wx.showLoading({
          title: '资产识别中...',
        })
        wx.uploadFile({
          url: 'http://recognition.image.myqcloud.com/ocr/general',
          filePath: tempFilePaths[0],
          name: 'image',
          header:{
            "authorization": that.data.ocrSign ,
          },
          formData:{
            "appid":"1256097546",
          },
          success: function (res) {
            wx.hideLoading();
            var result = JSON.parse(res.data)
            var items = result['data']['items']

            //按照x轴升序排序
            var srotYItems = items.sort(function (a, b) {
              return a.itemcoord.y - b.itemcoord.y
            })
            console.log(srotYItems)
            var flagIndex=null;
            srotYItems.forEach(function(item, index){
              var str = item['itemstring'];
              var iscontain = str.indexOf("蓝月亮") == -1 ? false : true;
              if(iscontain){  
                flagIndex = index;
              }
            });

            if(flagIndex !== null){
              //设备编码标签索引
              var deviceCodeIndex = 0
              if (flagIndex == 0) {
                deviceCodeIndex = flagIndex + 1
              } else {
                //取出距离y轴距离最近的元素的索引
                var offsetToPrev = Math.abs(srotYItems[flagIndex - 1]['itemcoord']['y'] - srotYItems[flagIndex]['itemcoord']['y']);
                var offsetToNext = Math.abs(srotYItems[flagIndex + 1]['itemcoord']['y'] - srotYItems[flagIndex]['itemcoord']['y']);
                deviceCodeIndex = offsetToPrev < offsetToNext ? flagIndex - 1 : flagIndex + 1;
              }
              //得到设备编码，去掉所有空格
              var deviceCode = srotYItems[deviceCodeIndex]["itemstring"].replace(/[ ]/g, "");
              //去除非数字
              deviceCode = deviceCode.replace(/[^\d.]/g, "");
              //公司编码
              var companyCodeIndex = deviceCodeIndex > flagIndex ? deviceCodeIndex + 1 : flagIndex + 1;
              var companyCode = srotYItems[companyCodeIndex]["itemstring"].replace(/[ ]/g, "");
              //将I、l换成1
              companyCode = companyCode.replace(/[Il]/g, "1");
              //型号描述
              var deviceDesc = srotYItems[companyCodeIndex + 1]["itemstring"].replace(/[ ]/g, "");
              var deviceTypeIndex = 0;
              console.log("deviceDesc :%s", deviceDesc)
              that.data.deviceTypes.forEach(function (item, index) {
                console.log(item);
                var iscontain = deviceDesc.indexOf(item) == -1 ? false : true;
                if (iscontain) {
                  deviceTypeIndex = index;
                }
              });

              that.setData({
                deviceCode: deviceCode,
                companyCode: companyCode,
                deviceTypeIndex: deviceTypeIndex
              })
            }else{
              wx.showToast({
                title: '资产识别失败,请手动填写或重新识别',
                icon:'none'
              })
            }

          },
          fail:function(){
            wx.hideLoading();
            wx.showToast({
              title: '资产识别出错，请重新识别',
            })
          }
        })
      }
    })
  },
  tips:function(){
    var that=this;
    wx.showModal({
      title:"提示",
      content: "请先录入显示器资产编号",
      success: function(res) {
        if(res.confirm){
          that.scancode()
        }
      }
    });
  },
  scancode: function() {
    var that = this;
    if(that.data.flag==0){
    wx: wx.scanCode({
      // onlyFromCamera: true,
      scanType: [],
      success: function(res) {
        that.setData({
          screenCode: res.result,
          flag:1
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
    }else{
    wx: wx.scanCode({
      // onlyFromCamera: true,
      scanType: [],
      success: function(res) {
        that.setData({
          hostCode: res.result,
          flag:0
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
    }
  },
  scancode2: function() {
    //点击事件
    const that = this;
    wx.chooseMedia({
      success: (res) => {
        //获取图片的临时路径
        // console.log(res.tempFiles[0].tempFilePath);
        const tempFilePath = res.tempFiles[0].tempFilePath
        //根据官方的要求  用base64字符编码获取图片的内容
        wx.getFileSystemManager().readFile({
          filePath: tempFilePath,
          encoding: 'base64',
          success: function (res) {
            //调用方法
            that.getImgInfo(res.data)
          },
        })
      },
    })
  

  },
  getImgInfo: function (imageData) {
    wx.showLoading({
      title: '识别中...',
    })
    var that = this
    that.getToken().then(res => {
      console.log(res)
      //获取token
      const token = res.data.slice(243,315);
      console.log(token)
      const detectUrl = `https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=${token}` // baiduToken是已经获取的access_Token      
      wx.request({
        url: detectUrl,
        data: {
          image: imageData
        },
        method: 'POST',
        dataType: 'json',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 必须的        
        },
        success: function (res, resolve) {
          console.log(res)
          //将 res.data.words_result数组中的内容加入到words中           
          that.setData({
            stationCode: res.data.words_result[0].words
          })
          console.log(res)
          console.log(res.data.words_result[0].words)
          wx.hideLoading()
        },
        fail: function (res, reject) {
          console.log('get word fail：', res.data);
          wx.hideLoading()
        },
        complete: function () {
          wx.hideLoading()
        }
      })
    })
  },
  // 获取百度access_token  
  getToken: function () {
      return new Promise(resolve => {
        var APIKEY = "hfdzBAtlgwLEi8D6DqWqjpas"
        var SECKEY = "G9oxcRV2eNqPdD1oEVnrAyxefMAke17M"
        var tokenUrl = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${APIKEY}&client_secret=${SECKEY}`
        var that = this;

        console.log(tokenUrl);
        wx.request({
          url: tokenUrl,
          method: 'POST',
          dataType: 'application/json',
          header: {
            'content-type': 'application/json; charset-UTF-8'
            
          },
          success: function (res) { 
            console.log("Token获取成功", res);
            return resolve(res) ;
          
          },
          fail: function (res) {
            console.log("Token获取失败", res);
            return resolve(res)
          }
        })
      })
  },

  


})










