## Context

当前应用是静态单页结构，数据读写集中在浏览器内存数组与 `localStorage`。该结构没有可信服务端边界，不能安全连接数据库，也不能基于登录身份做用户隔离。

本设计承接：

- `openspec/explore/data-persistence-auth-foundation.md`
- `openspec/changes/add-auth-and-persistence-foundation/proposal.md`

目标技术栈为 Next.js App Router、TypeScript、Supabase Auth、PostgreSQL/Supabase、Prisma、Vercel。

## Goals / Non-Goals

**Goals:**

- 建立可运行的 Next.js/TypeScript 项目结构。
- 接入 Supabase Auth，提供登录、登出、会话保持和受保护页面。
- 接入 PostgreSQL 与 Prisma，提供基础数据入库能力。
- 所有持久化数据按当前登录用户隔离。
- 保留现有核心页面体验，并把数据来源从 `localStorage` 切换到服务端持久化。

**Non-Goals:**

- 不做复杂角色权限。
- 不做多租户组织模型。
- 不做本地旧数据自动导入。
- 不做高级统计重构。
- 不拆分细粒度动作库或复杂训练模板。

## Decisions

### Decision 1: 先迁移到 Next.js，再接数据库

选择 Next.js App Router 作为服务端边界。

原因：

- 静态页面无法安全持有数据库连接串或 service role key。
- Next.js 可以在 Server Component、Server Action 或 Route Handler 中读取 session 并访问数据库。
- 当前 UI 可以逐步迁移为 React 组件，降低一次性重写风险。

替代方案：

| 方案 | 结论 |
| --- | --- |
| 继续静态页 + 直接访问数据库 | 不采用，凭据暴露风险高 |
| 独立 Express API + 静态前端 | 可行，但项目规模早期会增加部署和仓库复杂度 |
| Next.js 一体化 | 采用，前后端边界更集中 |

### Decision 2: 使用 Supabase Auth 管理登录会话

登录能力由 Supabase Auth 提供，Next.js 服务端通过 cookie 解析当前用户。

```text
┌──────────┐
│ 登录表单 │
└────┬─────┘
     ▼
┌────────────────┐
│ Supabase Auth  │
└────┬───────────┘
     │ session cookie
     ▼
┌──────────────────────────┐
│ Next.js auth/session guard │
└────┬─────────────────────┘
     ▼
┌──────────────────────────┐
│ user.id 参与所有数据过滤  │
└──────────────────────────┘
```

替代方案：

| 方案 | 结论 |
| --- | --- |
| 自建邮箱密码登录 | 不采用，密码安全、邮件验证和会话维护成本高 |
| NextAuth/Auth.js | 可行，但当前数据库选择 Supabase 时，Supabase Auth 更直接 |
| Supabase Auth | 采用，能和 Supabase 项目快速集成 |

### Decision 3: Prisma 负责应用侧数据模型与访问层

使用 Prisma 管理应用侧 schema、迁移和 repository。

基础表：

```text
┌──────────────────┐
│ data_entries     │
├──────────────────┤
│ id               │
│ user_id          │
│ occurred_on      │
│ type             │
│ content          │
│ created_at       │
│ updated_at       │
└──────────────────┘
```

关键原则：

- `user_id` 由服务端 session 写入，前端不能提交可信 `user_id`。
- 查询、删除、更新都必须附带当前 `user_id` 过滤。
- repository 不读取 cookie，只接收已经解析出的 `userId`。

### Decision 4: 初期由应用层做用户隔离，后续评估 RLS

第一阶段以 Next.js 服务端守卫和 Prisma 查询过滤保证用户隔离。

原因：

- Prisma 直接连接数据库时不会自动使用 Supabase Auth 用户上下文。
- 先把隔离逻辑集中在服务端数据访问层，便于实现和验证。
- 后续如需要直接从客户端使用 Supabase 数据 API，再补充 Row Level Security。

## Risks / Trade-offs

| Risk | Mitigation |
| --- | --- |
| Prisma 与 Supabase RLS 混用导致权限判断分散 | 第一阶段明确由服务端应用层过滤，RLS 作为后续增强项 |
| 一次性迁移静态页到 Next.js 影响 UI | 先保持同等页面能力，再替换数据来源 |
| 环境变量缺失导致构建或运行失败 | 提供 `.env.example`，实现启动时错误提示 |
| 用户隔离漏加 `user_id` 过滤 | repository 层统一封装，禁止 UI 或 action 直接写 Prisma 查询 |
| 旧 `localStorage` 数据无法立即入库 | 本 change 不做自动导入，后续单独设计导入流程 |

## Migration Plan

1. 建立 Next.js/TypeScript 基础结构和构建脚本。
2. 接入 Supabase Auth 配置、登录页、登出动作和 session guard。
3. 接入 Prisma、数据库连接和基础迁移。
4. 实现用户作用域数据 repository。
5. 把页面的数据列表、新增、删除切换到服务端数据来源。
6. 验证构建、登录保护、数据持久化、用户隔离和登出保护。

Rollback：

- 数据库迁移失败时不切换页面数据来源。
- 认证配置失败时保持未登录拦截，不暴露数据页。
- 如 Next.js 迁移未完成，保留当前静态文件提交历史可回退。

## Open Questions

- Supabase 项目和数据库连接串由谁提供。
- 是否允许新用户自行注册，还是只允许预置账号登录。
- 第一阶段是否需要 `.env.example` 中包含所有部署变量说明。
