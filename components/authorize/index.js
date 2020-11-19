
Component({

  properties: {
    show: {
      type: Boolean,
      default: false
    }
  },

  data: {
    showModel: false
  },

  // 监听器
  observers: {
    'show'(val) {
      this.setData({
        showModel: val
      })
    }
  },

  // 组件所在页面的生命周期--需要基础库2.2.3以上才能生效
  pageLifetimes: {
    show() {
      console.log('authorize组件所在页面的生命周期 onShow')
      if ( !wx.getStorageSync('userType') || wx.getStorageSync('userType') == '1') {
        this.setData({
          showModel: true
        })
      } else {
        this.setData({
          showModel: false
        })
      }
    }
  },

  methods: {
    onCancel() {
      this.setData({
        showModel: false
      })
      this.triggerEvent('onCancel', {showModel: this.data.showModel})
    },

    onConfirm() {
      this.setData({
        showModel: false
      })
      wx.setStorageSync('loginType', 1)
      wx.navigateTo({
        url: '/pages/login/login',
      })
      this.triggerEvent('onconfirm', {showModel: this.data.showModel})
    }
  }
})
