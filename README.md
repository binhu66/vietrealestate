# VietRealty — Sàn Bất Động Sản Việt Nam

> 越南房产交易平台 / Vietnamese Real Estate Marketplace

模仿 batdongsan.com.vn 构建的全栈越南房产网站，支持越南语、英语、中文三语言。

---

## 项目结构

```
vietrealestate/
├── frontend/          # Next.js 14 + Tailwind CSS
│   ├── src/
│   │   ├── app/                    # 页面路由
│   │   │   ├── page.tsx            # 首页
│   │   │   ├── bat-dong-san/       # 房源列表 + 详情
│   │   │   ├── cho-thue/           # 出租页
│   │   │   ├── thuong-mai/         # 商业地产
│   │   │   ├── ban-do/             # 地图找房
│   │   │   └── admin/              # 管理后台
│   │   ├── components/             # 组件
│   │   │   ├── layout/             # Header, Footer, LocaleProvider
│   │   │   ├── property/           # PropertyCard, SearchBar
│   │   │   └── map/                # PropertyMap (Leaflet)
│   │   ├── i18n/                   # 多语言 (vi/en/zh)
│   │   └── lib/                    # data.ts, address.ts, locale.ts
│   ├── .env.local                  # 本地环境变量
│   └── .env.example                # 环境变量示例
│
├── backend/           # Node.js + Express API
│   ├── src/
│   │   ├── routes/                 # auth, properties, stats, users
│   │   ├── middleware/             # JWT auth, admin guard
│   │   └── data/                   # 示例数据
│   ├── server.js                   # 入口文件
│   ├── .env                        # 本地环境变量
│   └── .env.example                # 环境变量示例
│
└── README.md
```

---

## 快速启动

### 前提条件
- Node.js 18+
- npm 9+

### 1. 启动后端

```bash
cd backend
npm install
cp .env.example .env      # 已自动创建
npm run dev               # http://localhost:4000
```

### 2. 启动前端

```bash
cd frontend
npm install               # 已安装
cp .env.example .env.local  # 已自动创建
npm run dev               # http://localhost:3000
```

---

## 功能特性

### 前台页面

| 路径 | 说明 |
|------|------|
| `/` | 首页：搜索、VIP房源、分类、地图入口 |
| `/bat-dong-san` | 购买列表：筛选、排序、分页 |
| `/bat-dong-san/[id]` | 房源详情：图片轮播、联系方式、地图 |
| `/cho-thue` | 出租列表 |
| `/thuong-mai` | 商业地产（办公室、商铺、仓库、酒店）|
| `/ban-do` | 地图找房（Leaflet + OpenStreetMap）|

### 管理后台 `/admin`

| 路径 | 说明 |
|------|------|
| `/admin` | 登录页 |
| `/admin/dashboard` | 数据概览（统计图表）|
| `/admin/bat-dong-san` | 房源管理（增删改查、排序）|
| `/admin/nguoi-dung` | 用户管理（启用/禁用）|

**Demo 账号：**
- Email: `admin@vietrealestate.vn`
- Password: `admin123`

### 多语言支持

在右上角点击语言切换：
- 🇻🇳 **Tiếng Việt** — 越南语（默认）
- 🇺🇸 **English** — 英语
- 🇨🇳 **中文** — 简体中文

---

## 地图说明

当前使用 **Leaflet + OpenStreetMap**（免费，无需 API Key）。

切换 Google Maps（需付费 API Key）：
1. 在 `frontend/.env.local` 添加：
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_key_here
   ```
2. 参考 `frontend/src/components/map/PropertyMap.tsx` 替换地图实现。

---

## 越南地址数字化

参见 `frontend/src/lib/address.ts`，支持：
- **行政区划层级**: 省/市 → 区/县 → 坊/社
- **GPS 坐标**: 纬度/经度
- **Plus Code**: Google Open Location Code
- **邮政编码**: 越南5位邮编
- **完整地址格式化**: 按越南标准顺序输出

---

## API 接口

后端运行于 `http://localhost:4000`

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/auth/login` | 登录，返回 JWT |
| GET  | `/api/auth/me` | 获取当前用户 |
| GET  | `/api/properties` | 房源列表（支持过滤）|
| GET  | `/api/properties/:id` | 房源详情 |
| POST | `/api/properties` | 新增房源（需 admin）|
| PUT  | `/api/properties/:id` | 修改房源（需 admin）|
| DELETE | `/api/properties/:id` | 删除房源（需 admin）|
| GET  | `/api/stats` | 统计数据（需 admin）|
| GET  | `/api/users` | 用户列表（需 admin）|

**过滤参数** (`GET /api/properties`):
```
?type=ban|thue
&category=can-ho-chung-cu|nha-rieng|...
&city=TP. Hồ Chí Minh
&minPrice=5&maxPrice=20
&minArea=50&maxArea=200
&q=搜索关键词
&page=1&limit=12
```

---

## 技术栈

**前端**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Leaflet + OpenStreetMap (地图)
- Lucide React (图标)

**后端**
- Node.js + Express 5
- JWT 认证 (jsonwebtoken)
- bcryptjs (密码加密)
- CORS

---

## 未来扩展计划

- [ ] 数据库集成（MongoDB / PostgreSQL）
- [ ] 用户注册 + 手机验证（越南号码 OTP）
- [ ] 图片上传（云存储）
- [ ] 支付集成（MoMo、VNPay、ZaloPay）
- [ ] 越南省市区数据完整接入 API
- [ ] 高级地图：划区域搜索、等时圈
- [ ] 移动端 App（React Native）
- [ ] SEO 优化（静态生成）
- [ ] 实时聊天（WebSocket）

---

## 联系

建于 2026 · VietRealty Team
