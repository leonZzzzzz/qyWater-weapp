import http from '../../utils/http.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: 23.099994,
    longitude: 113.324520,
    markers: [{
      id: 1,
      latitude: 23.099994,
      longitude: 113.324520,
      name: 'T.I.T 创意园'
    }],
    covers: [{
      latitude: 23.099994,
      longitude: 113.344520,
      iconPath: '/image/location.png'
    }, {
      latitude: 23.099994,
      longitude: 113.304520,
      iconPath: '/image/location.png'
    }],
    rivers:[],
    userinfo:{},
    memberId:'',
    phone:'',
    name:''
  },
  confirm(){
    wx.navigateTo({
      url: '../check/check',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if(options.name){
      this.setData({phone:options.phone,name:options.name})
    }else{
      var userinfo = wx.getStorageSync('userinfo')
      var memberId = wx.getStorageSync('memberId')
      this.setData({userinfo:userinfo,memberId,name:userinfo.name,phone:userinfo.mobilePhoneNumber})
    }
  },
  
  memberconfirm(){
    // wx.showLoading()
    http.post(`${app.globalData.url}/api/v1/riversMember/apply`, {}, true).then(res => {
      // wx.hideLoading()
      if(res.data.code==20000){
        wx.navigateTo({
          url: '../check/check?status=1',
        })
        wx.requestSubscribeMessage({
          tmplIds: ['iHMpy_l5v9JoiH4tikLRtQK9qS-ZewoRWuviUGrQM5I','wSUn3jM0qrpiF6IedJgMR-CkUGsqTqFx9_tXkrRfz_M'],
          success (res) { 
          }
        })
        
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.mapCtx = wx.createMapContext('myMap')
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