# 数据入库与登录基础能力探索

## 探索范围

本次只探索技术实现边界，不实现代码。

目标能力：

- 数据从浏览器 `localStorage` 迁移到服务端数据库。
- 每条用户数据必须能按登录用户区分。
- 提供基础登录、会话保持和登出能力。
- 为后续 OpenSpec proposal 提供技术依据。

## 当前状态

当前项目是静态单页应用：

- 页面入口：`index.html`
- 样式：`styles.css`
- 主要逻辑：`app.js`
- 数据来源：`app.js` 内置 `seedEntries`
- 持久化：`localStorage`，key 为 `strength-log-v1`
- 主题持久化：`localStorage`，key 为 `strength-log-theme`

关键代码位置：

- `app.js` 的 `loadEntries()` 从 `localStorage` 读取数据。
- `app.js` 的 `saveEntries()` 写入 `localStorage`。
- `app.js` 的 `entryForm` submit 回调只在前端数组 `entries` 里新增记录。
- `app.js` 的 `deleteEntry(id)` 只删除本地数组并重新写回 `localStorage`。
- 渲染统计、日历、趋势图和列表都依赖同一个前端内存数组 `entries`。

当前数据流：

```text
┌──────────────┐
│ seedEntries  │
└──────┬───────┘
       │ fallback
       ▼
┌──────────────┐       read/write       ┌──────────────┐
│ entries 内存 │ ◀────────────────────▶ │ localStorage │
└──────┬───────┘                         └──────────────┘
       │
       ▼
┌──────────────────────────────┐
│ 日历 / 统计 / 趋势 / 记录列表 │
└──────────────────────────────┘
```

## 推荐技术方向

推荐先迁移到：

- Next.js App Router
- TypeScript
- PostgreSQL/Supabase
- Prisma
- Supabase Auth
- Vercel

原因：

- 当前静态页无法安全持有数据库写入凭据。
- 用户区分和登录必须依赖服务端会话或可信后端。
- Next.js 可以把 UI、Server Actions、Route Handlers 和受保护页面放在同一项目里渐进迁移。
- Supabase 可以同时提供 PostgreSQL 和认证能力，降低早期自建认证成本。
- Prisma 适合作为应用侧数据模型和迁移管理层。

## 技术边界拆分

### 1. 项目运行时迁移

先从静态文件迁移为 Next.js 项目。

边界：

- 保留现有 UI 视觉和主要交互。
- 把 `index.html` 拆为页面组件。
- 把 `app.js` 中的数据处理逻辑拆为纯函数和数据访问层。
- 把浏览器 DOM 直写改为 React 状态驱动渲染。

不建议在纯静态页上直接接数据库，因为会暴露服务端凭据。

### 2. 认证与用户区分

基础方案：

- 使用 Supabase Auth 邮箱密码登录。
- 服务端通过 cookie 读取 session。
- 所有读写请求从 session 中解析 `user.id`。
- 数据表通过 `user_id` 关联用户。

用户区分原则：

- 前端不传可信 `user_id`。
- 后端从当前 session 获取用户身份。
- 创建数据时由服务端写入 `user_id`。
- 查询、更新、删除必须按 `user_id` 过滤。

认证流：

```text
┌──────────┐      submit       ┌────────────────┐
│ 登录表单 │ ────────────────▶ │ Supabase Auth  │
└──────────┘                   └───────┬────────┘
                                       │ session cookie
                                       ▼
┌────────────────────────────────────────────────┐
│ Next.js Server Component / Server Action / API │
└────────────────────┬───────────────────────────┘
                     │ resolve user.id
                     ▼
              ┌──────────────┐
              │ PostgreSQL   │
              └──────────────┘
```

### 3. 数据模型

基础入库只需要支持粗粒度记录，先不要急着拆成动作库。

建议第一阶段模型：

```text
┌──────────────┐        1:N        ┌──────────────────┐
│ users/auth   │ ────────────────▶ │ workout_entries  │
└──────────────┘                   └──────────────────┘
                                      id
                                      user_id
                                      trained_on
                                      type
                                      content
                                      created_at
                                      updated_at
```

说明：

- `users/auth` 由 Supabase Auth 管理。
- `workout_entries.user_id` 关联认证用户。
- `trained_on` 使用日期，不使用时间戳表示训练日。
- `type` 可先用字符串或枚举。
- `content` 保留当前自由文本记录方式，降低迁移成本。

Prisma 草案：

```prisma
model WorkoutEntry {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  trainedOn DateTime @map("trained_on") @db.Date
  type      String
  content   String
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@index([userId, trainedOn])
  @@map("workout_entries")
}
```

注意：

- Supabase Auth 的用户表在 `auth.users` schema 中，Prisma 不一定需要直接建 relation。
- 如果要用 Supabase Row Level Security，则必须统一 Prisma 与 Supabase 客户端的权限策略。

### 4. 数据访问层

建议建立独立数据访问边界：

```text
UI Component
    │
    ▼
Server Action / Route Handler
    │
    ▼
auth/session guard
    │
    ▼
WorkoutEntryRepository
    │
    ▼
Prisma / PostgreSQL
```

基础方法：

- `listWorkoutEntries(userId, filters)`
- `createWorkoutEntry(userId, input)`
- `deleteWorkoutEntry(userId, entryId)`
- `updateWorkoutEntry(userId, entryId, input)` 可放到第二阶段

关键约束：

- repository 不读 cookie。
- auth guard 不拼 SQL。
- UI 不直接访问 Prisma。
- 所有写入先做输入校验。

### 5. 本地数据迁移

当前用户已有 `localStorage` 数据。

建议提供一次性导入流程：

```text
登录成功
   │
   ▼
检测 localStorage strength-log-v1
   │
   ├─ 无数据：直接显示数据库数据
   │
   └─ 有数据：提示导入
             │
             ▼
       POST /api/import-local-entries
             │
             ▼
       服务端写入当前 user.id
             │
             ▼
       导入成功后标记或清理本地旧数据
```

导入原则：

- 不自动静默导入，避免重复写入。
- 需要幂等策略，例如按 `legacy_id + user_id` 去重，或导入前展示确认。
- 导入失败不能删除本地数据。

### 6. 部署与环境变量

必要环境变量：

- `DATABASE_URL`
- `DIRECT_URL` 或迁移专用连接串，按部署平台需要决定
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` 只允许服务端使用，如非必要不要引入

部署验证：

- `npm run build` 通过。
- Prisma migration 能在目标数据库执行。
- 未登录访问受保护页面会跳转登录。
- 登录后只能看到当前用户数据。
- 登出后不能继续读取受保护数据。

## 关键风险

| 风险 | 影响 | 建议 |
| --- | --- | --- |
| 直接从前端连接数据库 | 泄露凭据 | 必须通过服务端边界访问数据库 |
| 前端传入 `user_id` | 越权写入或读取 | 服务端从 session 获取用户 |
| localStorage 导入重复 | 数据重复 | 设计幂等导入 |
| Prisma 与 Supabase RLS 混用不清 | 权限判断分散 | 先明确由应用层过滤还是 RLS 兜底 |
| 一次性重构过大 | 回归风险高 | 先迁移运行时和数据层，再迁移统计能力 |

## 可切分的 OpenSpec change

建议不要把所有事情塞进一个 change。

可拆为：

1. `migrate-to-nextjs-foundation`
   - 建立 Next.js/TypeScript 项目结构。
   - 保留当前 UI 和本地数据能力。

2. `add-auth-session-foundation`
   - 接入 Supabase Auth。
   - 增加登录、登出、受保护页面和 session guard。

3. `add-workout-entry-persistence`
   - 接入 PostgreSQL/Prisma。
   - 新增基础数据表、repository 和 CRUD。

4. `import-local-storage-entries`
   - 登录后导入旧 `localStorage` 数据。
   - 处理幂等和失败回退。

如果用户希望先快速看到“入库效果”，也可以合并 2 和 3，但会增加一次变更的验证复杂度。

## 推荐下一步

先创建 proposal，范围建议为：

`add-auth-and-persistence-foundation`

范围包含：

- Next.js 运行时迁移。
- Supabase Auth 登录/登出。
- PostgreSQL/Prisma 基础表。
- 当前记录的登录用户隔离 CRUD。

不包含：

- 动作库结构化拆分。
- 高级统计。
- 多用户社交或共享。
- 复杂权限角色。
- 完整历史数据自动清洗。

验收标准：

- 未登录用户不能访问数据页。
- 登录用户可以新增、查看、删除自己的记录。
- 用户 A 看不到用户 B 的记录。
- 数据刷新页面后仍存在。
- 构建通过。
