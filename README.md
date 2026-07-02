# 小口订餐系统 - 部署说明

## 项目结构

```
canteen-miniapp/
├── app.js / app.json / app.wxss    # 小程序主文件
├── pages/
│   ├── order/     # 订餐页面
│   ├── summary/   # 汇总页面
│   ├── history/   # 历史页面
│   └── admin/     # 管理后台（导出报表）
├── utils/api.js   # API 工具函数
├── server.py      # 后端 API 服务
└── web/           # Web 管理后台
    └── index.html
```

## 一、部署后端（必须）

1. 把 server.py 上传到服务器
2. 安装依赖：`pip install flask flask-cors`
3. 运行：`python server.py`
4. 确保服务器开放 8001 端口

## 二、配置小程序

1. 用微信开发者工具打开 canteen-miniapp 目录
2. 修改 app.js 中的 baseUrl 为你的服务器地址
   `baseUrl: 'http://你的服务器IP:8001'`
3. 在微信公众平台配置 request 合法域名
4. 预览/上传即可

## 三、后台管理

部署后访问 `http://你的服务器IP:8001` 即可打开管理后台

## 人员名单（16人）

张瑶、钟征祥、吴志强、张汝杰、黄滢、韩艾冰、万梦思、
区转开、余晓星、梁杏彤、吴迪勇、林健生、李威、李浩飞、
陈淑芳、刘思益
