import http from '../../utils/http.js'
const app = getApp();
Component({
  properties: {
    url: {
      type: String
    },
    needColor: {
      type: Boolean,
      default: false
    },
    type: {
      type: Number,
      value: 1
    }
  },
  data: {
    year: '',
    time: '10:00',
    styleBgColor: {
      positive: '#e06294',
      negative: '#fd98c0',
      invalid: 'rgba(0,0,0,.5)'
    },
    data: [],
    dataNUm: 0,
    nowIndex: 0,
    domHeight: 0
  },
  ready() {
    this.apiGetList();
    this.setData({
      domHeight: Math.floor(wx.getSystemInfoSync().windowHeight / 2.5)
    })
  },
  methods: {
    /**
     * 获取列表接口
     */
    apiGetList() {
      let data = {
        curPage: 0,
        size: 50
      }
      http.get(`${app.globalData.url}/${this.properties.url}`, data, true).then(res => {
        if (res.data.errCode == 401) {
          app.login(() => {
            this.apiGetList()
          });
        } else if (res.data.errCode == 0) {
          if (res.data.content0.total == 0) return;
          // 截取并追加年、月日、时间
          res.data.content0.rows.forEach((item, index) => {
            let str = res.data.content0.rows[index].measureTime
            let year = str.substr(0, 4),
              monthDay = str.substr(5, 5),
              time = str.substr(11, 5)
            let img = res.data.content0.rows[index].imageUrl == 'undefined' ? '/attachments/assets/img/null.jpg' : res.data.content0.rows[index].imageUrl
            if (item.valueClocation) {
              item.valueClocation_2 = (53.55 - item.valueClocation).toFixed(2)
            }
            res.data.content0.rows[index].year = year
            res.data.content0.rows[index].monthDay = monthDay
            res.data.content0.rows[index].time = time
            res.data.content0.rows[index].fullImg = app.globalData.imgPrefix + img
          })
          wx.setStorageSync('canvasData', res.data.content0.rows)
          this.setData({
            data: res.data.content0.rows,
            dataNum: res.data.content0.total
          })
          this.showYear()
        }
      })
    },
    // 滚动事件
    scrollChange(e) {
      this.showYear(e.detail.scrollTop + 15)
    },
    /**
     * 设置显示年份的方法
     * 根据滚动条位置判断是第几条数据
     * @  滚动条top值
     * @  每行高度
     */
    showYear(top = 0, height = 40) {
      let nowIndex = Math.floor(top / height);
      this.setData({
        nowIndex: nowIndex,
        year: this.data.data[nowIndex].year
      })
    },
  }
})