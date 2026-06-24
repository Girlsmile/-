## Why

当前应用的数据只保存在浏览器 `localStorage`，无法跨设备持久保存，也无法区分不同用户。现在需要建立服务端可信边界，让数据写入数据库，并通过登录会话保证用户只能访问自己的数据。

本 proposal 基于探索文档：`openspec/explore/data-persistence-auth-foundation.md`。

## What Changes

- 将项目迁移到可承载服务端逻辑的 Next.js/TypeScript 结构，保留现有主要页面体验。
- 接入 Supabase Auth，提供基础登录、登出和服务端会话读取能力。
- 接入 PostgreSQL/Supabase 与 Prisma，建立基础数据表和数据访问层。
- 新增按当前登录用户隔离的数据读写能力，禁止前端传入可信 `user_id`。
- 将新增、列表、删除等基础记录操作从 `localStorage` 切换为服务端持久化。
- 暂不包含本地旧数据自动导入、复杂角色权限、高级统计重构。

```text
┌────────────┐
│ 登录用户   │
└─────┬──────┘
      │ session cookie
      ▼
┌──────────────────────┐
│ Next.js 服务端边界    │
│ auth/session guard   │
└─────┬────────────────┘
      │ user.id
      ▼
┌──────────────────────┐
│ 数据访问层 / Prisma   │
└─────┬────────────────┘
      ▼
┌──────────────────────┐
│ PostgreSQL/Supabase  │
└──────────────────────┘
```

## Capabilities

### New Capabilities

- `auth-session`: 提供登录、登出、会话保持和受保护页面访问能力。
- `user-scoped-persistence`: 提供基于当前登录用户的数据入库、查询和删除能力。

### Modified Capabilities

- 无。

## Impact

- 代码结构：从静态 `index.html`、`app.js`、`styles.css` 迁移到 Next.js App Router 项目结构。
- 数据层：新增 Prisma schema、数据库迁移和用户隔离 repository。
- 认证：新增 Supabase Auth 客户端、服务端 session guard 和登录/登出页面或动作。
- API/服务端动作：新增记录列表、新增、删除等服务端入口。
- 配置：新增环境变量、构建脚本和部署所需配置。
- 验证：需要至少完成构建验证，并人工确认未登录拦截、登录后数据持久化、用户隔离和登出保护。
