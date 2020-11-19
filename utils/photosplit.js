/**
 * 图片拼接
 * @params {string} canvasId  canvasId
 * @params {object} config  配置数据
 * @params {object} dataList  拼接的数据
 */
function Photosplit(canvasId, dataList, config) {
  this.canvasId = canvasId;
  this.config = config;
  this.dataList = dataList;
  this.ctx = wx.createCanvasContext(canvasId);
};

Photosplit.prototype.createCanvas = function (callback) {
  let that = this;
  that.dataList.map((res, index) => {
    let imgLeft = 0
    // 对齐C线位置----百分比换算成px
    if (res.valueClocation) {
      let percent = ((53.55 - res.valueClocation) / 100)
      // let percent = ((res.valueClocation - 53.55) / 100)
      let pxStr = (res.imageWidth * percent).toFixed(4)
      imgLeft = Number(pxStr)
      console.log(res.imageWidth, res.valueClocation, percent, imgLeft)
    }
    if (imgLeft >= 0) {
      that.ctx.drawImage(res.imageUrl, 60 + imgLeft, index * that.config.imageHeight, that.config.imageWidth - 60, that.config.imageHeight);
      // that.ctx.drawImage(res.imageUrl, imgLeft, 0, res.imageWidth, res.imageHeight, 60, index * that.config.imageHeight, that.config.imageWidth - 60 - imgLeft, that.config.imageHeight);
    } else {
      // that.ctx.drawImage(res.imageUrl, 0, 0, res.imageWidth, res.imageHeight, 60, index * that.config.imageHeight, that.config.imageWidth - 60 + imgLeft, that.config.imageHeight);
      that.ctx.drawImage(res.imageUrl, 60, index * that.config.imageHeight, that.config.imageWidth - 60 + imgLeft, that.config.imageHeight);
    }
    that.ctx.beginPath();
    if (res.type == 1) {
      if (res.lhValue == 1) {
        // 阴性
        that.ctx.setFillStyle('#fd98c0')
      } else if (res.lhValue == 0) {
        // 无效
        that.ctx.setFillStyle('#4c4b48')
      } else {
        // 阳性
        that.ctx.setFillStyle('#e06294')
      }
    } else {
      if (res.lhValue <= 45) {
        // 无效
        that.ctx.setFillStyle('#4c4b48')
      } else {
        // 阳性
        that.ctx.setFillStyle('#e06294')
      }
    }
    that.ctx.fillRect(that.config.imageWidth - 60, index * 40, 60, 40, );
    that.ctx.closePath();

    that.ctx.beginPath();
    that.ctx.setFontSize(12)
    that.ctx.setFillStyle('#ffffff')
    that.ctx.setTextBaseline('bottom')
    if (res.lhValue == 1) {
      that.ctx.fillText('阴性', that.config.imageWidth - 45, index * 40 + 25)
    } else if (res.lhValue == 2) {
      that.ctx.fillText('弱阳', that.config.imageWidth - 45, index * 40 + 25)
    } else if (res.lhValue == 3) {
      that.ctx.fillText('阳性', that.config.imageWidth - 45, index * 40 + 25)
    } else if (res.lhValue == 4) {
      that.ctx.fillText('强阳', that.config.imageWidth - 45, index * 40 + 25)
    } else if (res.lhValue == 0) {
      that.ctx.fillText('无效', that.config.imageWidth - 45, index * 40 + 25)
    } else {
      that.ctx.fillText(res.lhValue + 'LH', that.config.imageWidth - 45, index * 40 + 25)
    }
    that.ctx.closePath();

    that.ctx.beginPath();
    that.ctx.setFillStyle('rgba(0, 0, 0, 0.5)')
    that.ctx.fillRect(60, index * 40, 60, 40, );
    that.ctx.closePath();

    that.ctx.beginPath();
    that.ctx.setFillStyle('#cca955')
    that.ctx.setTextBaseline('top')
    that.ctx.setFontSize(10)
    that.ctx.fillText(res.year, 10, index * 40)
    that.ctx.fillText(res.monthDay, 10, index * 40 + 15)
    that.ctx.closePath();

    that.ctx.beginPath();
    that.ctx.setFontSize(14)
    that.ctx.setFillStyle('#ffffff')
    that.ctx.setTextBaseline('normal')
    that.ctx.fillText(res.time, 70, index * 40 + 25)
    that.ctx.closePath();
  })
  that.ctx.draw(true, () => {
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      canvasId: that.canvasId,
      fileType: 'jpg',
      success: function (res) {
        callback(res.tempFilePath)
      },
      fail: function () {
        wx.showToast({
          title: '图片获取失败',
          icon: 'none'
        })
      }
    })
  })
};

Photosplit.prototype.saveImage = function (tempFilePath) {
  let that = this;
  wx.saveImageToPhotosAlbum({
    filePath: tempFilePath,
    success(res) {
      wx.showToast({
        title: '图片已保存到本地',
        icon: 'none'
      })
    }
  })
};

module.exports = Photosplit;