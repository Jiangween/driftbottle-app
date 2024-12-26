# 漂流瓶 API 服务

一个基于 Next.js 和 MongoDB 的漂流瓶 API 服务，支持地理位置搜索和标签管理。

## 功能特点

- 创建漂流瓶（支持文本内容）
- 随机获取漂流瓶（支持地理位置和标签筛选）
- 标签统计和管理
- 地理位置支持（基于高德地图）
- TypeScript 支持
- MongoDB 地理空间索引

## 环境要求

- Node.js 18+
- MongoDB 4.4+
- 高德地图 API Key

## 快速开始

1. 克隆项目：

```Bash
git clone https://github.com/Jiangween/driftbottle-app.git
cd driftbottle-app
```

2. 安装依赖：

```Bash
pnpm install
```

3. 配置环境变量：

复制 `.env.template` 到 `.env.local` 并填写配置：

```Bash
MongoDB 连接 URI
MONGODB_URI=your_mongodb_uri_here
高德地图 API Key
AMAP_KEY=your_amap_key_here
```

4. 启动开发服务器：

```Bash
pnpm run dev
```

服务器将在 http://localhost:8080 启动。

## API 接口

### 创建漂流瓶

```Bash
POST /api/bottle
Content-Type: application/json
{
    "content": "漂流瓶内容",
    "type": "text",
    "address": "杭州市西湖区",
    "tags": ["心情", "生活"]
}
```

### 捡漂流瓶

```Bash
POST /api/bottle/pick
Content-Type: application/json
{
    "address": "杭州市",
    "maxDistance": 50000,
    "tags": ["心情", "生活"]
}
```

参数说明：
所有参数都是可选的：
- 不传 address 则随机获取任意位置的漂流瓶
- 不传 tags 则随机获取任意标签的漂流瓶
- maxDistance 默认为 50000（米），最大 500000

### 获取标签统计

GET /api/tags

## 技术栈

- [Next.js](https://nextjs.org/) - React 框架
- [MongoDB](https://www.mongodb.com/) - 数据库
- [Mongoose](https://mongoosejs.com/) - MongoDB ODM
- [TypeScript](https://www.typescriptlang.org/) - 类型系统
- [高德地图 API](https://lbs.amap.com/) - 地理编码服务

## 部署

项目可以部署到 Vercel、Netlify 等平台，或者自托管。确保设置正确的环境变量。

## 许可证

[MIT](LICENSE)