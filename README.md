# VixenAhri Blog

一个基于 Next.js 16 的现代化个人博客系统，支持文章管理、分类标签、媒体库、系统日志等功能。

**博客地址**: [blog.VixenAhri.cn](https://blog.VixenAhri.cn)

## 技术栈

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript
- **UI 组件**: Ant Design 5
- **数据库**: PostgreSQL
- **ORM**: Prisma
- **认证**: NextAuth.js
- **编辑器**: TipTap (富文本编辑器)

## 功能特性

### 前台展示

- 文章列表与详情页
- 分类和标签筛选
- 文章归档页面
- 关于页面
- 文章目录导航（自动生成，支持滚动高亮）
- 评论系统（支持审核）
- 全文搜索
- RSS 订阅 (`/feed.xml`)
- Sitemap 自动生成
- 响应式设计

### 后台管理

- 仪表盘（数据统计、快速操作）
- 文章管理（富文本编辑、分类标签、封面图片）
- 分类管理
- 标签管理
- 媒体库（图片上传、管理）
- 评论管理（审核、删除）
- 访问统计（PV、UV、热门文章、来源分析）
- 网站设置
- 系统日志（操作日志、登录日志）
- 深色/浅色主题切换

## 快速开始

### 环境要求

- Node.js 18+
- PostgreSQL 14+
- pnpm / npm / yarn

### 安装步骤

1. **克隆项目**

```bash
git clone <repository-url>
cd my-blog
```

2. **安装依赖**

```bash
npm install
```

3. **配置环境变量**

复制 `.env.example` 为 `.env` 并修改配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
DATABASE_URL="postgresql://用户名:密码@主机:端口/数据库名"
NEXTAUTH_SECRET="你的密钥"
NEXTAUTH_URL="http://localhost:5177"
```

4. **初始化数据库**

```bash
npx prisma db push
npx prisma generate
npx prisma db seed
```

5. **启动开发服务器**

```bash
npm run dev
```

访问 http://localhost:5177 查看前台，http://localhost:5177/admin 进入后台。

### 默认账号

- 用户名: `Ahri`
- 密码: `Ahri`

## 部署

### Docker 部署 (NAS)

1. **拉取镜像**

```bash
docker pull ghcr.io/你的用户名/my-blog:latest
```

2. **使用 docker-compose 部署**

编辑 `docker-compose.yml`，修改环境变量：

```yaml
environment:
  - DATABASE_URL=postgresql://用户名:密码@数据库地址:5432/myblog
  - NEXTAUTH_SECRET=你的密钥
  - NEXTAUTH_URL=https://blog.vixenahri.cn
```

启动服务：

```bash
docker-compose up -d
```

3. **初始化数据库**

```bash
docker exec -it vixenahri-blog npx prisma db push
docker exec -it vixenahri-blog npx prisma db seed
```

### Vercel 部署

1. Fork 本项目到你的 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量：
   - `DATABASE_URL` - PostgreSQL 连接字符串
   - `NEXTAUTH_SECRET` - 认证密钥
   - `NEXTAUTH_URL` - 网站地址
4. 部署

### GitHub Actions

推送到 `main` 分支会自动构建 Docker 镜像并推送到 GitHub Container Registry。

### 数据库备份

```bash
# 备份
./scripts/backup.sh

# 恢复
./scripts/restore.sh backups/myblog_xxx.sql.gz
```

## 项目结构

```
my-blog/
├── app/                    # Next.js App Router
│   ├── (blog)/            # 前台页面
│   ├── admin/             # 后台管理
│   ├── api/               # API 路由
│   ├── sitemap.ts         # Sitemap 生成
│   ├── robots.ts          # Robots.txt
│   └── feed.xml/          # RSS 订阅
├── components/            # React 组件
├── lib/                   # 工具库
├── prisma/                # Prisma 配置
├── scripts/               # 脚本（备份等）
└── public/                # 静态资源
```

## API 接口

### 前台 API

| 方法 | 路径                     | 说明         |
| ---- | ------------------------ | ------------ |
| GET  | `/api/posts`             | 获取文章列表 |
| GET  | `/api/posts/[slug]`      | 获取文章详情 |
| GET  | `/api/categories`        | 获取分类列表 |
| GET  | `/api/tags`              | 获取标签列表 |
| GET  | `/api/search?q=xxx`      | 搜索文章     |
| GET  | `/api/comments?slug=xxx` | 获取评论     |
| POST | `/api/comments`          | 提交评论     |
| POST | `/api/stats`             | 记录访问     |

### 后台 API

| 方法     | 路径                    | 说明     |
| -------- | ----------------------- | -------- |
| GET/POST | `/api/admin/posts`      | 文章管理 |
| GET/POST | `/api/admin/categories` | 分类管理 |
| GET/POST | `/api/admin/tags`       | 标签管理 |
| GET/POST | `/api/admin/media`      | 媒体管理 |
| GET      | `/api/admin/comments`   | 评论管理 |
| GET      | `/api/admin/stats`      | 访问统计 |
| GET      | `/api/admin/logs`       | 系统日志 |

## 开发命令

```bash
npm run dev          # 开发模式 (端口 5177)
npm run build        # 构建
npm start            # 生产模式
npm run lint         # 代码检查
npx prisma studio    # 数据库管理界面
```

## 许可证

MIT License

## 作者

VixenAhri
