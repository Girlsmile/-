# 力训记录

一个用于记录每日力量训练、展示打卡表和训练趋势的个人网站。

## 当前版本

- 已迁移到 Next.js App Router + TypeScript。
- 登录使用 Supabase Auth。
- 数据通过 Prisma 写入 PostgreSQL，并按登录用户隔离。
- 旧版静态文件仍保留为迁移参考。

## 本地运行

```bash
npm install
npm run prisma:generate
npm run dev
```

需要先配置 `.env`，可参考 `.env.example`。

## 验证

```bash
npm test
npm run typecheck
npm run build
```

数据库迁移：

```bash
npm run prisma:migrate
```

生产或远端环境需要提供 Supabase 项目、PostgreSQL 连接串和测试账号后，才能完成登录、登出、用户隔离的人工验证。
