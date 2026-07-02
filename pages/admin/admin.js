const api = require('../../utils/api.js');
const app = getApp();

Page({
  data: {
    date: '', dateText: '', stats: []
  },
  onLoad() {
    const date = api.todayStr();
    this.setData({ date, dateText: api.formatDate(date) });
    this.loadStats();
  },
  loadStats() {
    // 统计本月各人订餐次数
    const now = new Date();
    const ym = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0');
    api.request('/api/stats?month=' + ym).then(data => {
      const persons = app.globalData.persons;
      const stats = persons.map(p => data[p] || { breakfast: 0, lunch: 0, dinner: 0 });
      this.setData({ stats: stats.map((s,i) => ({ name: persons[i], ...s })) });
    }).catch(() => {});
  },
  exportDay() {
    const date = this.data.date;
    wx.showLoading({ title: '导出中...' });
    wx.downloadFile({
      url: app.globalData.baseUrl + '/api/export?date=' + date,
      success(res) {
        wx.hideLoading();
        wx.openDocument({
          filePath: res.tempFilePath,
          showMenu: true,
          success() { wx.showToast({ title: '打开成功' }); }
        });
      },
      fail() {
        wx.hideLoading();
        wx.showToast({ title: '导出失败', icon: 'error' });
      }
    });
  },
  exportAll() {
    wx.showLoading({ title: '导出中...' });
    wx.downloadFile({
      url: app.globalData.baseUrl + '/api/export-all',
      success(res) {
        wx.hideLoading();
        wx.openDocument({
          filePath: res.tempFilePath,
          showMenu: true,
          success() { wx.showToast({ title: '打开成功' }); }
        });
      },
      fail() {
        wx.hideLoading();
        wx.showToast({ title: '导出失败', icon: 'error' });
      }
    });
  },
  onDateChange(e) {
    const date = e.detail.value;
    this.setData({ date, dateText: api.formatDate(date) });
  },
  setToday() {
    const date = api.todayStr();
    this.setData({ date, dateText: api.formatDate(date) });
  }
});
