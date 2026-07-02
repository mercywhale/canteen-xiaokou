const api = require('../../utils/api.js');
const app = getApp();

Page({
  data: {
    date: '',
    dateText: '',
    persons: [],
    orders: {},
    avatars: ['#a8edea,#fed6e3','#ffecd2,#fcb69f','#a1c4fd,#c2e9fb','#d4fc79,#96e6a1','#f6d365,#fda085','#89f7fe,#66a6ff']
  },
  onLoad() {
    const persons = app.globalData.persons;
    const date = api.todayStr();
    this.setData({
      persons: persons,
      date: date,
      dateText: api.formatDate(date)
    });
    this.loadOrders();
  },
  onShow() {
    this.loadOrders();
  },
  loadOrders() {
    const date = this.data.date;
    api.request('/api/order?date=' + date).then(data => {
      const orders = {};
      this.data.persons.forEach(p => {
        orders[p] = data[p] || { b: false, l: false, d: false };
      });
      this.setData({ orders });
    });
  },
  toggleMeal(e) {
    const name = e.currentTarget.dataset.name;
    const meal = e.currentTarget.dataset.meal;
    const orders = JSON.parse(JSON.stringify(this.data.orders));
    orders[name][meal] = !orders[name][meal];
    this.setData({ orders });
  },
  saveOrder() {
    wx.showLoading({ title: '保存中...' });
    const date = this.data.date;
    const orders = {};
    this.data.persons.forEach(p => {
      orders[p] = this.data.orders[p];
    });
    api.request('/api/order', 'POST', { date, orders }).then(() => {
      wx.hideLoading();
      wx.showToast({ title: '保存成功', icon: 'success' });
    }).catch(() => {
      wx.hideLoading();
      wx.showToast({ title: '保存失败', icon: 'error' });
    });
  },
  onDateChange(e) {
    const date = e.detail.value;
    this.setData({ date, dateText: api.formatDate(date) });
    this.loadOrders();
  },
  setToday() {
    const date = api.todayStr();
    this.setData({ date, dateText: api.formatDate(date) });
    this.loadOrders();
  }
});
