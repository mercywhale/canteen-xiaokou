const api = require('../../utils/api.js');

Page({
  data: {
    date: '', dateText: '', breakfast: 0, lunch: 0, dinner: 0, detail: []
  },
  onLoad() {
    const date = api.todayStr();
    this.setData({ date, dateText: api.formatDate(date) });
    this.loadData();
  },
  onShow() {
    this.loadData();
  },
  loadData() {
    api.request('/api/summary?date=' + this.data.date).then(data => {
      this.setData({
        breakfast: data.breakfast,
        lunch: data.lunch,
        dinner: data.dinner,
        detail: data.detail
      });
    });
  },
  onDateChange(e) {
    const date = e.detail.value;
    this.setData({ date, dateText: api.formatDate(date) });
    this.loadData();
  },
  setToday() {
    const date = api.todayStr();
    this.setData({ date, dateText: api.formatDate(date) });
    this.loadData();
  }
});
