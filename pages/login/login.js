import http from '../../utils/http.js'
const app = getApp()
Page({
  data: {
    ismember:false,
    showmodel:false,
    name:'',
    phone:'',
    userinfo:{},
    nickName:'',
    avatarUrl:'',
    showUserInfo:false,
  },

  // 第一个按钮执行
  source(){
    var memberId = wx.getStorageSync('memberId')
    var userinfo = wx.getStorageSync('userinfo')
    if(memberId){
      if(!userinfo.headImage){
        // wx.showModal({
        //   title:'请先授权昵称和头像',
        //   success:(res=>{
        //     console.log(res)
        //     if(res.confirm){
        //       this.onGotUserInfo()
        //     }
        //   })
        // })
        this.setData({showUserInfo:true})
      }else{
        wx.navigateTo({
          url: '../feed/feed',
        })
      }
    }else{
      this.setData({showmodel:true})
    }
  },
  close(){
    this.setData({showmodel:false,name:'',phone:''})
  },
  // 第二个按钮
  became(){
    var that = this
    var userinfo = wx.getStorageSync('userinfo')
    var memberId = wx.getStorageSync('memberId')
    var supervisorQty = wx.getStorageSync('supervisorQty')
    if(memberId){
      // 已注册未申请
      if(userinfo.status==0){
        if(supervisorQty<8){//还有名额去申请
          wx.navigateTo({
            url: '../supervisor/supervisor',
          })
        }else{
          wx.showToast({
            title: '监督员名额已满',
            icon:'none'
          })
        }
      }else{//已申请
        if(supervisorQty<8){//还有名额去查看审核情况
          wx.navigateTo({
            url: '../check/check?status='+userinfo.status,
          })
        }else{//没有名额了
          if(userinfo.status==2){//已成为监督员可以去查看报料情况
            wx.navigateTo({
              url: '../check/check?status='+userinfo.status,
            })
          }else{//啥也不是
            wx.showToast({
              title: '监督员名额已满',
              icon:'none'
            })
          }
        }
      }
    }else{
      // 未注册
      this.setData({ismember:true})
    }
  },
  gorule(){
    wx.navigateTo({
      url: '../rule/rule',
    })
  },
  memberclose(){
    this.setData({ismember:false,name:'',phone:''})
  },
  UserInfoclose(){
    this.setData({showUserInfo:false})
  },
  // 我要报料获取用户头像昵称并注册会员
  onGotUserInfo(e){
    console.log(77777)
    var that = this
    wx.getSetting({
      success: function(res){
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function(res) {
              if(res.userInfo.nickName){
                that.getUsers(res.userInfo.nickName,res.userInfo.avatarUrl)
              }
            }
          })
        }
      }
    })
  },
  getUsers(appellation,headImage){
    http.post(`${app.globalData.url}/api/v1/member/renewMember`, {appellation,headImage},true).then(res=>{
      if(res.data.code==20000){
        app.getuserinfo()
        wx.showToast({
          title: '您已授权头像和昵称',
          icon:'none'
        })
        setTimeout(()=>{
          wx.navigateTo({
            url: '../feed/feed',
          })
        },1500)
        this.setData({showUserInfo:false})
      }
    })
  },
  onShow() {
    var userinfo = wx.getStorageSync('userinfo')
    var memberId = wx.getStorageSync('memberId')
    if(memberId&&userinfo.name){
      app.getuserinfo()
    }
    this.setData({showmodel:false,ismember:false,name:'',showUserInfo:false})
  },
  onLoad() {
    
  },
  // 获取姓名
  getname(e){
    console.log(e)
    this.setData({name:e.detail.value})
  },
  // 获取用户手机号
  handleGetPhoneNumber(e) {
    console.log(e)
    if (!e.detail.encryptedData) {
     return
    }
    wx.login({
      success: rej => {
        http.post(`${app.globalData.url}/api/v1/member/getPhoneNumber`, {code:rej.code,encryptedData: e.detail.encryptedData,iv: e.detail.iv}, true).then(res => {
          this.setData({phone:res.data.message})
        })
      }
    })
  },
  // 查看报料记录
  mylist(){
    var memberId = wx.getStorageSync('memberId')
    if(memberId){
      wx.navigateTo({
        url: '../record/record',
      })
    }else{
      this.setData({showmodel:true})
    }
  },
  
  // 注册会员确认
  confirm(e) {
    var that = this
    var type=e.currentTarget.dataset.type
    let {name,phone}=that.data
    if(!name){
      wx.showToast({
        title: '请输入您的姓名',
        icon:'none'
      })
      return
    }
    if(!phone){
      wx.showToast({
        title: '请授权您的手机号',
        icon:'none'
      })
      return
    }
    
    // if(type==1){
      wx.requestSubscribeMessage({
        tmplIds: ['Kuu1U_p0hg_Lk7D1GNbQSoaXRyGLdMGnsq5B73r1Ve8'],
        success (res) {
          // if(res.errMsg=="requestSubscribeMessage:ok"){
            wx.showLoading()
            that.register(type,name,phone)
          // }
        },
        fail(err){
          console.log(err)
        }
      })
    // }
  },
  register(type,name,phone){
    wx.login({
      success: rej => {
        http.post(`${app.globalData.url}/api/v1/member/decryptPhone`, {mobile:phone,name:name,code:rej.code}, true).then(res => {
          wx.hideLoading()
          if(res.data.code==20000){
            app.userLogin()
            if(type==1){
              wx.showToast({
                title: '注册成功',
                icon:'none'
              })
            }else{
              // this.memberconfirm()
              var supervisorQty = wx.getStorageSync('supervisorQty')
              if(supervisorQty<8){
                wx.navigateTo({
                  url: '../supervisor/supervisor?name='+name+'&phone='+phone,
                })
              }else{
                wx.showToast({
                  title: '注册成功，监督员名额已满，您已成为志愿者',
                  duration:2000,
                  icon:'none'
                })
              }
            }
            this.setData({ismember:false,showmodel:false ,name:'',phone:''})
          }
        })
      }
    })
  },
  // 申请成为监督员
  memberconfirm(){
    wx.showLoading()
    http.post(`${app.globalData.url}/api/v1/riversMember/apply`, {}, true).then(res => {
      wx.hideLoading()
      if(res.data.code==20000){
        this.setData({ismember:false})
        wx.navigateTo({
          url: '../check/check?status=1',
        })
        wx.requestSubscribeMessage({
          tmplIds: ['iHMpy_l5v9JoiH4tikLRtQK9qS-ZewoRWuviUGrQM5I'],
          success (res) { }
        })
      }
    })
  },

  onUnload() {
    
  },
    /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})