const api = require('../../utils/api.js');

Page({
  data: { list: [] },
  onShow() {
    api.request('/api/history').then(data => {
      const list = data.map(d => ({
        ...d,
        dateText: api.formatDate(d.date)
      }));
      this.setData({ list });
    });
  },
  jumpToDate(e) {
    const date = e.currentTarget.dataset.date;
    wx.switchTab({ url: '/pages/summary/summary' });
    // 通过全局变量传递日期
    getApp().globalData.jumpDate = date;
  }
});
