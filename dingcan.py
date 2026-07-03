#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""小口订餐系统 - 一键启动版"""
import json, os, sys, webbrowser
from datetime import date
from flask import Flask, request, jsonify, send_from_directory, Response
from flask_cors import CORS

# 确保依赖安装
try:
    from flask import Flask
    from flask_cors import CORS
except ImportError:
    print("正在安装依赖...")
    os.system(f"{sys.executable} -m pip install flask flask-cors -q")
    from flask import Flask, request, jsonify, send_from_directory, Response
    from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# 数据文件放在程序同目录
DATA_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(DATA_DIR, 'data.json')

PERSONS = [
    "张瑶","钟征祥","吴志强","张汝杰","黄滢",
    "韩艾冰","万梦思","区转开","余晓星","梁杏彤",
    "吴迪勇","林健生","李威","李浩飞","陈淑芳","刘思益"
]

def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

def save_data(data):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/api/persons')
def api_persons():
    return jsonify(PERSONS)

@app.route('/api/order', methods=['GET'])
def api_get_order():
    dt = request.args.get('date', str(date.today()))
    data = load_data()
    record = data.get(dt, {})
    result = {}
    for p in PERSONS:
        result[p] = record.get(p, {"b": False, "l": False, "d": False})
    return jsonify(result)

@app.route('/api/order', methods=['POST'])
def api_save_order():
    body = request.get_json()
    dt = body.get('date', str(date.today()))
    orders = body.get('orders', {})
    data = load_data()
    data[dt] = orders
    save_data(data)
    return jsonify({"ok": True})

@app.route('/api/summary')
def api_summary():
    dt = request.args.get('date', str(date.today()))
    data = load_data()
    record = data.get(dt, {})
    b_count = l_count = d_count = 0
    detail = []
    for p in PERSONS:
        r = record.get(p, {"b": False, "l": False, "d": False})
        if r.get("b"): b_count += 1
        if r.get("l"): l_count += 1
        if r.get("d"): d_count += 1
        detail.append({"name": p, "b": r.get("b", False), "l": r.get("l", False), "d": r.get("d", False)})
    return jsonify({"date": dt, "breakfast": b_count, "lunch": l_count, "dinner": d_count, "detail": detail})

@app.route('/api/history')
def api_history():
    data = load_data()
    dates = sorted(data.keys(), reverse=True)
    result = []
    for dt in dates:
        record = data[dt]
        b = l = d = 0
        for p in PERSONS:
            r = record.get(p, {})
            if r.get("b"): b += 1
            if r.get("l"): l += 1
            if r.get("d"): d += 1
        result.append({"date": dt, "breakfast": b, "lunch": l, "dinner": d})
    return jsonify(result)

@app.route('/api/stats')
def api_stats():
    month = request.args.get('month', str(date.today())[:7])
    data = load_data()
    result = {}
    for p in PERSONS:
        result[p] = {"breakfast": 0, "lunch": 0, "dinner": 0}
    for dt, record in data.items():
        if dt.startswith(month):
            for p in PERSONS:
                r = record.get(p, {})
                if r.get("b"): result[p]["breakfast"] += 1
                if r.get("l"): result[p]["lunch"] += 1
                if r.get("d"): result[p]["dinner"] += 1
    return jsonify(result)

@app.route('/api/export')
def api_export():
    dt = request.args.get('date', str(date.today()))
    data = load_data()
    record = data.get(dt, {})
    csv = '\uFEFF姓名,早餐,午餐,晚餐\n'
    b = l = d = 0
    for p in PERSONS:
        r = record.get(p, {})
        if r.get("b"): b += 1
        if r.get("l"): l += 1
        if r.get("d"): d += 1
        csv += f'{p},{r.get("b","") and "✓"},{r.get("l","") and "✓"},{r.get("d","") and "✓"}\n'
    csv += f'合计,{b},{l},{d}\n'
    return Response(csv, mimetype='text/csv; charset=utf-8',
                    headers={'Content-Disposition': f'attachment; filename=dingcan_{dt}.csv'})

@app.route('/api/export-all')
def api_export_all():
    data = load_data()
    csv = '\uFEFF日期,姓名,早餐,午餐,晚餐\n'
    for dt in sorted(data.keys()):
        record = data[dt]
        for p in PERSONS:
            r = record.get(p, {})
            if r.get("b") or r.get("l") or r.get("d"):
                csv += f'{dt},{p},{r.get("b","") and "✓"},{r.get("l","") and "✓"},{r.get("d","") and "✓"}\n'
    return Response(csv, mimetype='text/csv; charset=utf-8',
                    headers={'Content-Disposition': f'attachment; filename=dingcan_all_{date.today()}.csv'})

if __name__ == '__main__':
    import socket
    hostname = socket.gethostname()
    local_ip = socket.gethostbyname(hostname)
    port = 8001
    
    print("=" * 50)
    print("   Dingcan System")
    print("=" * 50)
    print("\n  Service started!")
    print("\n  Local: http://localhost:%d" % port)
    print("  LAN: http://%s:%d" % (local_ip, port))
    print("\n  Send the LAN address to your colleagues!")
    print("\n  Press Ctrl+C to stop")
    print("=" * 50)
    
    app.run(host='0.0.0.0', port=port, debug=False)
