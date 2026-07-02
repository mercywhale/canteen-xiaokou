const app = getApp();

function request(path, method, data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: app.globalData.baseUrl + path,
      method: method || 'GET',
      data: data,
      header: { 'Content-Type': 'application/json' },
      success: res => resolve(res.data),
      fail: reject
    });
  });
}

function todayStr() {
  const d = new Date();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
}

function formatDate(dateStr) {
  const d = new Date(dateStr.replace(/-/g, '/'));
  const w = ['日','一','二','三','四','五','六'];
  return d.getFullYear() + '年' + (d.getMonth()+1) + '月' + d.getDate() + '日（周' + w[d.getDay()] + '）';
}

module.exports = { request, todayStr, formatDate };
