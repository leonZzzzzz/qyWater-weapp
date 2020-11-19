import http from '../../utils/http.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:' ',
    userinfo:{},
    qtyResponse:{},
    surplus:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userinfo = wx.getStorageSync('userinfo')
    var qtyResponse = wx.getStorageSync('qtyResponse')
    if(userinfo.status==2){
      var surplus = 30-qtyResponse.passedQty
      surplus=surplus<0?0:surplus
      this.setData({surplus})
    }
    this.setData({status:options.status,userinfo,qtyResponse})
  },
  goback(){
    wx.reLaunch({
      url: '../login/login',
    })
  },
  // 重新申请
  reapply(){
    http.post(`${app.globalData.url}/api/v1/riversMember/apply`, {}, true).then(res => {
      wx.hideLoading()
      if(res.data.code==20000){
        wx.showToast({
          title: '您已重新申请，请等待审核',
          icon:'none'
        })
        wx.requestSubscribeMessage({
          tmplIds: ['iHMpy_l5v9JoiH4tikLRtQK9qS-ZewoRWuviUGrQM5I','wSUn3jM0qrpiF6IedJgMR-CkUGsqTqFx9_tXkrRfz_M'],
          success (res) { }
        })
        setTimeout(()=>{
          wx.redirectTo({
            url: '../login/login',
          })
        },1500)
      }
    })
  },
  // 报料
  confirm(){
    wx.navigateTo({
      url: '../feed/feed',
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
    // wx.reLaunch({
    //   url: '../login/login',
    // })
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