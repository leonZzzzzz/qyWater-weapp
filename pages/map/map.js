import http from '../../utils/http.js'
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude:23.099994,
    longitude:113.324520,
    markers: [
      {
        id: 1,
        latitude: 23.099994,
        longitude: 113.324520,
        name: 'T.I.T 创意园'
      }
    ],
    covers: [{
      latitude: 23.099994,
      longitude: 113.344520,
      iconPath: '/image/location.png'
    }, {
      latitude: 23.099994,
      longitude: 113.304520,
      iconPath: '/image/location.png'
    }],
    address:'',
    location:''
  },
  again_getLocation(){
    let that = this;
    wx.hideLoading()
    // 获取位置信息
    wx.getSetting({
      success: (res) => {
        console.log(res)
        console.log(res.authSetting['scope.userLocation'])
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {//非初始化进入该页面,且未授权
          wx.showModal({
            title: '是否授权当前位置',
            showCancel:false,
            content: '需要获取您的地理位置，请确认授权，否则无法定位您的位置信息',
            success: function (res) {
              console.log(res)
              if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    console.log(dataAu)
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      that.getlocation();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'error',
                        duration: 1000
                      })
                      wx.navigateTo({
                        url: '../packageA/adress/adress',
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined||!res.authSetting['scope.userLocation']) {//初始化进入
          that.getlocation();
        }
        else { //授权后默认加载
          that.getlocation();
        }
      }
    })

  },
  // 获取地理位置
  getlocation(){
    var that = this
    console.log(787878)
    wx.getLocation({
      // type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        console.log('成功',res)
        that.getapis(res.latitude+','+res.longitude)
        //赋值经纬度
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
      },
      fail:function(e){
        console.log('失败',e);
        wx.showToast({
          title: '获取不到您的位置信息，请在系统设置中打开定位服务',
          duration: 1800,
          icon:'none'
        })
        setTimeout(()=>{
          wx.navigateBack({
            delta: 1,
          })
        },2000)
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.again_getLocation()
    this.mapCtx = wx.createMapContext('myMap')
  },
  // 获取经纬度
  getCenterLocation(e) {
    console.log(e)
    var that = this
    that.getapis(e.detail.latitude+','+e.detail.longitude)
    // this.mapCtx.getCenterLocation({
    //   success: function(res){
    //     console.log(res)
    //     that.setData({
    //       latitude: res.latitude,
    //       longitude: res.longitude,
    //     })
    //     that.getapis(res.latitude+','+res.longitude)
    //   }
    // })
  },
  // 获取详细位置
  getapis(location){
    http.get('https://apis.map.qq.com/ws/geocoder/v1/',{location,key:'MWUBZ-6UDES-ZLBO7-6HF7V-GPX2Q-TFBSP'}).then(res=>{
      var result=res.data.result  
      var address=result.address+result.formatted_addresses.recommend
      this.setData({address,location:location,latitude: result.location.lat,longitude: result.location.lng,})
    })
  },
  gosource(){
    var {location,latitude,longitude,address}=this.data
    wx.setStorageSync('address', address)
    wx.setStorageSync('location', location)
    wx.navigateBack()
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
