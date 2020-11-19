// var fundebug = require('./utils/fundebug.1.2.1.min.js');
// fundebug.init({
//   apikey: '5dae6ebd9646bf33af1d8673c34303d97903632013b54299dc28396e58a2bb31'
// })
//app.js
import http from '/utils/http.js'
App({
  onLaunch(e) {
    console.log('app onLaunch');
    if (e.scene == 1036) {
      console.log(e.query.jumpType)
      this.jumpType = e.query.jumpType || '/pages/calendar/calendar'
    }
  },
  onShow() {
    console.log('app onShow')
    this.userLogin()
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function(res) {
        // 请求完新版本信息的回调
        // console.log(res.hasUpdate)
      })
      updateManager.onUpdateReady(function() {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success(res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            }
          }
        })
      })
      updateManager.onUpdateFailed(function() {
        // 新版本下载失败
      })
    }
  },
  userLogin() {
    this.getsession()
    
  },
  // 获取sessionid
  getsession(){
    wx.login({
      success: rej => {
        http.post(`${this.globalData.url}/api/v1/member/authorize`, {code:rej.code}).then(res=>{
          if(res.data.code==20000){
            wx.setStorageSync('sessionId', res.data.data.sessionId)
            wx.setStorageSync('memberId', res.data.data.memberId)
            if(res.data.data.memberId){
              this.getuserinfo()
            }
          }
        })
      }
    })
  },
  // 获取个人信息
  getuserinfo(){
    http.get(`${this.globalData.url}/api/v1/riversMember/myInfo`, {},true).then(res=>{
      if(res.data.code==20000){
        wx.setStorageSync('userinfo', res.data.data.member)
        wx.setStorageSync('qtyResponse', res.data.data.qtyResponse)
        wx.setStorageSync('supervisorQty', res.data.data.supervisorQty)
      }
    })
  },
  apiLogin(code) {
    wx.showLoading({title: '登录中'})
    http.get(`${this.globalData.url}/login.do`, {
      code: code
    }).then(res => {
      console.log('登陆2.。。')
      wx.hideLoading()
      console.log(res.statusCode)
      wx.setStorageSync('code', code)
      if (!(/^2[0-9]{2}/g.test(res.statusCode))) {
        this.errLoginCallback && this.errLoginCallback(err)
        return
      }
      wx.setStorageSync('sessionKeyId', res.data.sessionKeyId)
      // userType 1 新用户 2游客 3 注册用户 4.先生登陆
      let user = res.data.user
      console.log('userType2222', res.data.userType)
      console.log('user', user)
      if (res.data.userType == 3||res.data.userType == 4) { // 已经绑定手机号 注册用户
        console.log(88888)
        wx.setStorageSync('userType', res.data.userType)
        wx.switchTab({
          url: this.jumpType
        })
        this.globalData.userInfo = {
          nickName: user.nickName || '',
          avatarUrl: user.imgUrl || ''
        }
      } else {
        console.log(9999)
        wx.setStorageSync('userType', res.data.userType)
        res.data.loginCode = code
        this.userInfoReadyCallback && this.userInfoReadyCallback(res.data)
      }
    })
    .catch(err => {
      this.errLoginCallback && this.errLoginCallback(err)
    })
  },
  
  login(callback) {
    wx.login({
      success: rej => {
        http.get(`${this.globalData.url}/login.do`, {
          code: rej.code
        }).then(res => {
          console.log('登陆1111')
          wx.setStorageSync('sessionKeyId', res.data.sessionKeyId);
          callback(res)
        })
        .catch(err => {
          this.errLoginCallback && this.errLoginCallback(err)
        })
      }
    })
  },
  
  globalData: {
    userInfo: {},
    url: 'https://sl.wego168.com/qingdaofu',
    // url: 'http://118.89.24.103/qingdaofu',
  },
})
