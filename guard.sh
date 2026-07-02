#!/bin/bash
# 小口订餐系统守护脚本
while true; do
  if ! curl -s -o /dev/null -w "%{http_code}" http://localhost:8001/ | grep -q 200; then
    echo "$(date): 服务挂了，重启中..."
    lsof -ti:8001 | xargs kill -9 2>/dev/null
    cd /workspace/canteen-miniapp && nohup python3 -u server.py > /tmp/miniapp_server.log 2>&1 &
    sleep 2
    echo "$(date): 重启完成"
  fi
  sleep 30
done
