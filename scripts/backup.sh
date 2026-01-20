#!/bin/bash

# 数据库备份脚本
# 使用方法: ./scripts/backup.sh

# 配置
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/myblog_$DATE.sql"

# 从环境变量获取数据库连接信息
# DATABASE_URL 格式: postgresql://user:password@host:port/database
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

# 创建备份目录
mkdir -p $BACKUP_DIR

# 执行备份
echo "开始备份数据库..."
PGPASSWORD=$DB_PASS pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -F c -f $BACKUP_FILE

if [ $? -eq 0 ]; then
  echo "备份成功: $BACKUP_FILE"
  
  # 压缩备份文件
  gzip $BACKUP_FILE
  echo "已压缩: ${BACKUP_FILE}.gz"
  
  # 删除 7 天前的备份
  find $BACKUP_DIR -name "*.gz" -mtime +7 -delete
  echo "已清理 7 天前的备份"
else
  echo "备份失败"
  exit 1
fi
