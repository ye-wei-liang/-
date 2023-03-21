//获取应用实例
const app = getApp()
const coordtransform = require('../lib/coordtransform.js');
// pages/Device/device.js

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
    join:null,
    ocrSign:null,
    textValue: '',
    flag: 0,
    priceUrl:["http://img1.baidu.com/it/u=4159158149,2237302473&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=500"],
   
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
      asset_id: null,
      host_id: null
    })
  },
  

preview(){
  var URL = 'http://127.0.0.1:9000/wechat/getPhotos'+'/'+this.data.tihuoWay;
  // console.log(URL);
  wx.request({
    url: URL,
    method: "GET",
    success: (res)=>{
      this.setData({
        priceUrl: [res.data.imgURL],
      })
    }
  })
    var imageURL=this.data.priceUrl;
    wx.previewImage({
      urls: imageURL,
      success:(res=>{
        console.log(res)
      })
    })
},
bindShowMsg() {
    this.setData({
      select: !this.data.select
    })
},

mySelect(e) {
    var name = e.currentTarget.dataset.name
    this.setData({
      tihuoWay: name,
      select: false
    })
},

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
    that.setData({
      textValue: e.detail.value,
    });
  },

  bindSubmit: function () {
    var that = this;
    if (!this.data.stationCode){
      this.showTips('请输入工位编号');
    } else  if (!this.data.screenCode){
      this.showTips('请输入显示器编号');
    } else if(!this.data.hostCode){
      this.showTips('请输入主机编号');
    }else {
      wx.showModal({
        title: '',
        content: '我确定填写信息无误',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      wx.request({
        url: URL,
        method: "POST",
        data: {
          tihuoWay: that.data.tihuoWay,
          stationCode: that.data.stationCode,
          screenCode: that.data.screenCode,
          hostCode: that.data.hostCode,
          remark: that.data.textValue,
        },
        success: (res)=>{
         console.log(res)
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
          asset_id: res.result,
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
          host_id: res.result,
          flag:0
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
    }
  },
  scanMedia: function() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      success: function (res) {
        var imageFile = res.tempFiles[0];
    
        wx.uploadFile({
          url: 'http://localhost:5000/ocr',
          filePath: imageFile.tempFilePath,
          name: 'image',
          success: function (res) {
            var data = JSON.parse(res.data);
    
            if (data.success) {
              var words = data.words;
              // 在前端UI中显示OCR识别结果
              console.log(words);
            } else {
              var message = data.message;
              // 在前端UI中处理OCR失败的情况
              console.log('OCR失败:', message);
            }
          },
          fail: function (res) {
            // 在前端UI中处理上传失败的情况
            console.log('上传失败:', res);
          }
        });
      }
    });
    
  }


})










