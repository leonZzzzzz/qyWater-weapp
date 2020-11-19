import http from '../../utils/http.js'
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo:{},
    address:'',
    keys:[
      {name:'水体有臭味',check:false},
      {name:'水体颜色不正常',check:false},
      {name:'有污水直排口',check:false},
      {name:'岸线有违章建筑',check:false},
      {name:'岸线有垃圾',check:false},
      {name:'水面有漂浮物',check:false},
      {name:'河面有季节性落叶',check:false},
      {name:'岸线河道有淤泥存放',check:false},
      {name:'其他',check:false},
    ],
    imageurl:'https://qingyuanshuili-1255600302.cos.ap-guangzhou.myqcloud.com',
    attachments:[],
    rivers:[],
    rivername:'',
    riverId:'',
    name:'',
    info:'',
    location:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userinfo=wx.getStorageSync('userinfo')
    this.setData({userinfo})
  },

  onShow: function () {
    var address = wx.getStorageSync('address')
    var location = wx.getStorageSync('location')
    console.log(address)
    if(address){
      this.setData({address,location})
      wx.removeStorageSync('address')
      wx.removeStorageSync('location')
    }
    http.get(`${app.globalData.url}/api/v1/rivers/getList`, {},true).then(res=>{
      this.setData({rivers:res.data.data})
    })
  },

  //上传图片
  uploadpic(){
    var that = this;
    var attachments=that.data.attachments
    wx.chooseImage({
      count: Math.abs(attachments.length - 8), // 最多可以选择的图片张数 8
      sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res) {
        var tempFilePaths = res.tempFilePaths
        that.setData({tempFilePaths})
        var successUp = 0; //成功，初始化为0
        var failUp = 0; //失败，初始化为0
        var length = tempFilePaths.length; //总共上传的数量
        var count = 0; //第几张，初始化为0 
        that.uploadonebyeone(tempFilePaths,successUp,failUp,count,length)
      }
    })
  },
  uploadonebyeone(tempFilePaths,successUp,failUp,count,length){
    var that = this
    var attachments = that.data.attachments
    wx.showLoading()
    wx.uploadFile({
      url: `${app.globalData.url}/api/v1/attachments/images/tencent_cloud`,
      filePath: tempFilePaths[count],
      name: 'file',
      header:{
        'Accept': 'application/json',
        'content-type': 'multipart/form-data',
        // 'WPGSESSID':sessionId
      },
      formData: {
        // 'sessionKeyId':sessionKeyId,
        'file': '(binary)',
        'imageType':'compound'
      },
      success: (res) => {
        if(res.statusCode!='500'){
          successUp++
          let resData=JSON.parse(res.data)
          attachments.push(resData.data.imageUrl)
          that.setData({attachments})
        }else{
          wx.showToast({
            title:'系统错误请联系管理员',
            icon:'none',
            duration: 2000
          })
        }
      },
      fail: (res)=> {
        failUp++
        wx.hideLoading();
      },
      complete:(res)=>{
        count++
        if(count==length){
          wx.hideLoading()
          wx.showToast({
            title: '上传成功',
          })
        }else{
          that.uploadonebyeone(that.data.tempFilePaths,successUp,failUp,count,length)
        }
      }
    });
  },
  //删除图片
  deleteImg (e) {
    let index = e.currentTarget.dataset.index
    let attachments = this.data.attachments;
    attachments.splice(index, 1);
    this.setData({ attachments: attachments });
  },
  getinfo(e){
    var content = e.detail.value
    var len = parseInt(content.length)
    // if(len<5){
    //   wx.showToast({
    //     title: '您输入的内容不能少于5个字',
    //     icon:'none'
    //   })
    // }
    this.setData({info:e.detail.value})
  },
  // 选择关键字
  clicktext(e){
    console.log(e)
    var index= e.currentTarget.dataset.index
    var keys = this.data.keys
    var check = keys[index].check
    keys[index].check = !check
    this.setData({keys})
  },

  // 获取河流
  bindPickerRivers(e){
    var {rivers} = this.data
    var index=e.detail.value
    var rivername= rivers[index].name
    this.setData({rivername,riverId:rivers[index].id})
  },
  confirm(){
    var {address,location,riverId,info,keys,attachments}=this.data
    console.log(attachments)
    if(attachments.length==0){
      wx.showToast({
        title: '请上传图片',
        icon:'none'
      })
      return
    }
    if(!info){
      wx.showToast({
        title: '请输入详细情况',
        icon:'none'
      })
      return
    }else{
      if(info.length<5){
        wx.showToast({
          title: '您输入的内容不能少于5个字',
          icon:'none'
        })
        return
      }
    }
    var axis = location.split(",")
    var keyword = ''
    var imgs = ''
    keys.forEach(item=>{
      if(item.check){
        keyword+=item.name+"/"
      }
    })
    attachments.forEach(item=>{
      imgs+=item+"_"
    })
    keyword=keyword.slice(0,keyword.length-1)
    imgs=imgs.slice(0,imgs.length-1)
    if(!keyword){
      wx.showToast({
        title: '请选择水体描述关键词',
        icon:'none'
      })
      return
    }
    if(!riverId){
      wx.showToast({
        title: '请选择所属河流',
        icon:'none'
      })
      return
    }
    if(!address){
      wx.showToast({
        title: '请选择详细地址',
        icon:'none'
      })
      return
    }
    
    var params = {riverId,address,info,keyword,imgs:imgs,latitude:axis[0],longitude:axis[1]}
    http.post(`${app.globalData.url}/api/v1/information/insert`, params,true).then(res=>{
      if(res.data.code==20000){
        wx.navigateTo({
          url: '../source/source?status='+res.data.data.status,
        })
        wx.requestSubscribeMessage({
          tmplIds: ['iHMpy_l5v9JoiH4tikLRtQK9qS-ZewoRWuviUGrQM5I'],
          success (res) {
            console.log(res)
          }
        })
      }
    })
  },
  gomap(){
    wx.navigateTo({
      url: '../map/map',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.reLaunch({
      url: '../login/login',
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})