import http from '../../utils/http.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageurl:'https://qingyuanshuili-1255600302.cos.ap-guangzhou.myqcloud.com',
    month:'2020-09',
    status:'pending',
    startTime:'2020-01',
    recordlist:[],
    pageNum:1,
    applystatus:'',
    showloading:false,
    totals:{}
  },

  //导航
  onGuideTap: function (event) {
    console.log(event)
    var lat = Number(event.currentTarget.dataset.latitude);
    var lon = Number(event.currentTarget.dataset.longitude);
    var bankName = event.currentTarget.dataset.bankname;
    console.log(lat);
    console.log(lon);
    wx.openLocation({
      type: 'gcj02',
      latitude: lat,
      longitude: lon,
      name: bankName,
      scale: 28
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date = new Date();
    var year = date .getFullYear(); //获取完整的年份(4位)
    var mon = date .getMonth()+1; //获取当前月份(0-11,0代表1月)
    mon = mon<10?'0'+mon:mon
    var month = year+'-'+mon
    const {status,pageNum}=this.data
    var applystatus = wx.getStorageSync('userinfo').status
    this.setData({applystatus,month})
    wx.showLoading()
    this.getlist(status,month,pageNum)
    this.gettotal(month)
  },
  //  获取列表
  getlist(status,month,pageNum){
    http.get(`${app.globalData.url}/api/v1/information/pages`, {status,month,pageNum},true).then(res=>{
      wx.hideLoading()
      if(res.data.code==20000){
        var list = res.data.data.list
        var recordlist=this.data.recordlist
        list.forEach(item=>{
          item.pics = item.imgs.split("_")
          recordlist.push(item)
        })
        this.setData({recordlist,showloading:true})
      }
    })
  },
  // 获取总数
  gettotal(month){
    http.get(`${app.globalData.url}/api/v1/information/myAssess`, {month},true).then(res=>{
      wx.hideLoading()
      if(res.data.code==20000){
        this.setData({totals:res.data.data})
      }
    })
  },
  selectDataTime: function(e) {
    console.log('点击确定选择的时间是:',e.detail.value)
    this.setData({month:e.detail.value,recordlist:[],pageNum:1,showloading:false})
    this.getlist(this.data.status,e.detail.value,1)
    this.gettotal(e.detail.value)
  },
  //  切换tab
  changeprograma(e){
    var status = e.currentTarget.dataset.status
    this.setData({status,pageNum:1,recordlist:[],showloading:false})
    this.getlist(status,this.data.month,1)
  },

  // 图片点击放大
  previewImage:function(e){
    console.log(e)
    var imagelist=e.currentTarget.dataset.img
    var imgarray=[]
    imagelist.map(item=>{
      item=this.data.imageurl+item
      imgarray.push(item)
    })
    var current = e.currentTarget.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: imgarray// 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
    const {status,month}=this.data
    this.data.pageNum++
    this.getlist(status,month,this.data.pageNum)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})