// pages/reports/reports.js
import dateTimePicker from '../../utils/dateTimePicker.js';


Page({
	data: {
    	estimate_in_time: '',
    	dateTime: null,
    	dateTimeArray: null,
    	startYear: new Date().getFullYear(),
      endYear: new Date().getFullYear() + 10,
      estimate_in_time1: '',
    	dateTime1: null,
    	dateTimeArray1: null,
  },
  
  changeDateTime1(e) {
    this.setData({
      dateTime: e.detail.value
    });
    // console.log( this.data);
    var arr = this.data.dateTime,
      dateArr = this.data.dateTimeArray;
      // console.log(dateArr);
    // arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    
    var estimate_in_time = `${dateArr[0][arr[0]]}-${dateArr[1][arr[1]]}-${dateArr[2][arr[2]]} ${dateArr[3][arr[3]]}:${dateArr[4][arr[4]]}:${dateArr[5][arr[5]]}`;
    this.setData({
      dateTimeArray: dateArr,
      dateTime: arr,
      estimate_in_time,
    });
  },
  changeDateTime2(e) {
    this.setData({
      dateTime1: e.detail.value
    });

    // console.log(e.detail.value);
    var arr = this.data.dateTime1,
      dateArr = this.data.dateTimeArray1;
      console.log(dateArr);
    // arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    
    var estimate_in_time = `${dateArr[0][arr[0]]}-${dateArr[1][arr[1]]}-${dateArr[2][arr[2]]} ${dateArr[3][arr[3]]}:${dateArr[4][arr[4]]}:${dateArr[5][arr[5]]}`;
    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr,
      estimate_in_time1: estimate_in_time,
    });

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
    });
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    wx.downloadFile({
      url: 'http://127.0.0.1:9000/wechat/getPhotos?startTime='+that.data.estimate_in_time+'&endTime='+that.data.estimate_in_time1,
      filePath: wx.env.USER_DATA_PATH + '/123..xlsm',
      success: function (res) {
        var filePath = res.filePath
        wx.openDocument({
            filePath: filePath,
            success: function (res) {
              wx.hideLoading();
            }
        });
        
      },
      fail: function(res) {
        console.log('http://127.0.0.1:9000/wechat/getPhotos?startTime='+that.data.estimate_in_time+'&endTime='+that.data.estimate_in_time1);
      }
    })

  
    // Component({
    //   properties: {
    //     lists: {
    //       type: Array,
    //       value: []
    //     }
    //   },
    //   data: {},
    //   ready: function() { },
    //   methods: {// 判断文件类型
    //     whatFileType(url){
    //       let sr = url.lastIndexOf('.') ;
    //       //  最后一次出现的位置let 
    //       let fileType = url.substr((sr+1)) ;
    //       return fileType;
          
    //     },
    //     onDown(e) {
    //       let fileTypes = ['doc','docx','xls','xlsx','ppt','pptx','pdf'];
    //       let imageTypes = ["jpg", "jpeg", "png"];
    //       let fileType = this.whatFileType(e.target.dataset.fileurl);
    //       let fileId = e.target.dataset.filedwx.showLoading({title: '加载中',});
    //       wx.getSavedFileList({  
    //         // 获取文件列表
    //         success(res) {res.fileList.forEach((val, key) => { 
    //           // 遍历文件列表里的数据// 删除存储的垃圾数据
    //           wx.removeSavedFile({filePath: val.filePath});
    //         })},
    //       });
    //       wx.downloadFile({
    //             url: e.target.dataset.fileurl,
    //             filePath: wx.env.USER_DATA_PATH + "/"+ fileId + "."+fileType,
    //             method: 'GET',
    //             success: function(res){  
    //               if(fileTypes.includes(fileType)){
    //                 wx.openDocument({
    //                   filePath: res.filePath,
    //                   showMenu: true,
    //                   flieType: fileType,
    //                   success: function (res) {
    //                       wx.hideLoading();
    //                       console.log('打开文档成功')
    //                   },
    //                   fail: function(err){
    //                       wx.hideLoading();
    //                       console.log('打开文档失败：', err)
    //                   }
    //                 });
    //               }
    //             },
    //             fail: function (err) {
    //                 wx.hideLoading();
    //                 wx.showToast({title: "下载超时",icon: 'none'});
    //                 console.log('下载失败：', err);
    //             }
    //       })
    //     }
    //   }
    // });
  },
   /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();
    this.setData({
      dateTime: obj.dateTime,
      dateTimeArray: obj.dateTimeArray,
      dateTime1: obj.dateTime,
      dateTimeArray1: obj.dateTimeArray
    });

  },
  onShow: function(options){
  },
})
