## ADDED Requirements

### Requirement: 数据必须按登录用户隔离
系统 SHALL 将所有持久化数据绑定到当前登录用户，并禁止用户读取、修改或删除其他用户的数据。

#### Scenario: 查询当前用户数据
- **WHEN** 已登录用户请求数据列表
- **THEN** 系统 MUST 只返回属于当前用户的数据

#### Scenario: 隔离其他用户数据
- **WHEN** 用户 A 与用户 B 都存在数据
- **THEN** 用户 A MUST 无法看到用户 B 的数据

### Requirement: 创建数据时由服务端写入用户身份
系统 SHALL 在创建数据时从服务端会话解析当前用户身份，并由服务端写入 `user_id`。

#### Scenario: 创建数据成功
- **WHEN** 已登录用户提交有效数据
- **THEN** 系统 MUST 创建一条绑定到当前用户的数据记录

#### Scenario: 前端提交用户身份字段
- **WHEN** 请求体包含 `user_id` 或等价身份字段
- **THEN** 系统 MUST 忽略该字段并使用服务端会话中的用户身份

### Requirement: 删除数据必须校验所有权
系统 SHALL 在删除数据前校验目标数据属于当前登录用户。

#### Scenario: 删除自己的数据
- **WHEN** 已登录用户删除属于自己的数据
- **THEN** 系统 MUST 删除该数据并刷新列表

#### Scenario: 删除其他用户数据
- **WHEN** 已登录用户尝试删除不属于自己的数据
- **THEN** 系统 MUST 拒绝删除

### Requirement: 数据刷新后仍然存在
系统 SHALL 将数据保存到 PostgreSQL 数据库，页面刷新或重新登录后数据仍可读取。

#### Scenario: 页面刷新后读取数据
- **WHEN** 已登录用户创建数据后刷新页面
- **THEN** 系统 MUST 从数据库读取并展示该用户的数据
