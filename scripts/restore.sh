#!/bin/bash

# 数据库恢复脚本
# 使用方法: ./scripts/restore.sh <backup_file.sql.gz>

if [ -z "$1" ]; then
  echo "使用方法: ./scripts/restore.sh <backup_file.sql.gz>"
  exit 1
fi

BACKUP_FILE=$1

# 从环境变量获取数据库连接信息
if [ -z "$DATABASE_URL" ]; then
  echo "错误: DATABASE_URL 环境变量未设置"
  exit 1
fi

# 解析 DATABASE_URL
DB_USER=$(echo $DATABASE_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
DB_PASS=$(echo $DATABASE_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')

# 检查备份文件
if [ ! -f "$BACKUP_FILE" ]; then
  echo "错误: 备份文件不存在: $BACKUP_FILE"
  exit 1
fi

echo "警告: 这将覆盖现有数据库数据!"
read -p "确定要继续吗? (y/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "开始恢复数据库..."
  
  # 如果是压缩文件，先解压
  if [[ $BACKUP_FILE == *.gz ]]; then
    gunzip -k $BACKUP_FILE
    BACKUP_FILE=${BACKUP_FILE%.gz}
  fi
  
  PGPASSWORD=$DB_PASS pg_restore -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c $BACKUP_FILE
  
  if [ $? -eq 0 ]; then
    echo "恢复成功"
  else
    echo "恢复失败"
    exit 1
  fi
else
  echo "已取消"
fi
