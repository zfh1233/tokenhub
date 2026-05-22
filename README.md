# OpenTokenHub

一个完整的 AI Agent 教程门户网站，支持教程浏览、上传、评论、点赞和管理员审核功能。

## 技术栈

- **前端**: React 18 + Vite + Tailwind CSS + Framer Motion + Zustand
- **后端**: Node.js + Express + MongoDB + Mongoose
- **认证**: JWT + bcrypt
- **文件上传**: Multer

## 快速开始

### 前置条件

- Node.js 18+
- MongoDB 6+

### 1. 安装依赖

```bash
cd server && npm install
cd ../client && npm install
```

### 2. 配置环境变量

在 `server/` 目录下创建 `.env` 文件：

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai-tutorial-portal
JWT_SECRET=your-secret-key
```

### 3. 初始化数据

```bash
cd server && npm run seed
```

这会创建 12 个预置 AI Agent 和一个管理员账号：
- 邮箱: `admin@example.com`
- 密码: `admin123`

### 4. 启动服务

```bash
# 后端 (端口 5000)
cd server && npm run dev

# 前端 (端口 3000)
cd client && npm run dev
```

访问 http://localhost:3000

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/auth/register` | 注册 |
| POST | `/api/auth/login` | 登录 |
| GET | `/api/auth/me` | 当前用户 |
| GET | `/api/agents` | AI Agent 列表 |
| GET | `/api/agents/:id` | Agent 详情 |
| GET | `/api/tutorials` | 教程列表 |
| GET | `/api/tutorials/:id` | 教程详情 |
| POST | `/api/tutorials` | 创建教程 |
| PUT | `/api/tutorials/:id` | 编辑教程 |
| DELETE | `/api/tutorials/:id` | 删除教程 |
| POST | `/api/tutorials/:id/like` | 点赞/取消 |
| GET | `/api/tutorials/:id/comments` | 评论列表 |
| POST | `/api/tutorials/:id/comments` | 发表评论 |
| GET | `/api/admin/tutorials` | 所有教程(管理员) |
| PUT | `/api/admin/tutorials/:id/review` | 审核教程 |
| GET | `/api/admin/users` | 用户列表 |
| PUT | `/api/admin/users/:id/role` | 修改用户角色 |

## 项目结构

```
ai-tutorial-portal/
├── client/          # React 前端
│   └── src/
│       ├── components/   # UI 组件
│       ├── pages/        # 页面组件
│       ├── services/     # API 封装
│       ├── store/        # 状态管理
│       └── hooks/        # 自定义 Hooks
├── server/          # Express 后端
│   └── src/
│       ├── controllers/  # 业务逻辑
│       ├── models/       # 数据模型
│       ├── routes/       # 路由定义
│       ├── middleware/    # 中间件
│       ├── config/       # 配置
│       └── data/         # 种子数据
└── README.md
```

## 功能特性

- Claude 风格 UI，卡片式布局，柔和配色
- 12 个预置 AI Agent 分类（对话/编程/绘画/写作/搜索/音乐/视频）
- Markdown 编辑器编写教程
- 教程详情页自动生成目录导航（TOC）
- 用户注册/登录，JWT 认证
- 教程评论、点赞
- 文件上传（图片/视频）
- 管理员审核教程、管理用户权限
- 响应式设计，支持移动端
