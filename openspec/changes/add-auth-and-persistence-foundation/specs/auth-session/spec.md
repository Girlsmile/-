## ADDED Requirements

### Requirement: 用户可以登录
系统 SHALL 提供基于 Supabase Auth 的邮箱密码登录能力，并在登录成功后建立服务端可读取的会话。

#### Scenario: 登录成功
- **WHEN** 用户提交有效邮箱和密码
- **THEN** 系统 MUST 建立登录会话并跳转到受保护页面

#### Scenario: 登录失败
- **WHEN** 用户提交无效邮箱或密码
- **THEN** 系统 MUST 保持在登录页并展示失败反馈

### Requirement: 用户可以注册
系统 SHALL 提供基于 Supabase Auth 的邮箱密码注册能力，并在注册成功后发送邮箱验证邮件。

#### Scenario: 注册成功
- **WHEN** 用户提交未注册邮箱和有效密码
- **THEN** 系统 MUST 创建新账户并发送验证邮件

#### Scenario: 注册失败
- **WHEN** 用户提交无效注册信息
- **THEN** 系统 MUST 保持在注册页并展示失败反馈

### Requirement: 用户可以重新发送验证邮件
系统 SHALL 提供重新发送邮箱验证邮件的能力。

#### Scenario: 重发成功
- **WHEN** 用户请求重新发送验证邮件
- **THEN** 系统 MUST 发送一封新的验证邮件

### Requirement: 受保护页面必须验证会话
系统 SHALL 在访问需要数据读写的页面前验证当前请求是否存在有效登录会话。

#### Scenario: 未登录访问受保护页面
- **WHEN** 未登录用户访问受保护页面
- **THEN** 系统 MUST 跳转到登录页

#### Scenario: 已登录访问受保护页面
- **WHEN** 已登录用户访问受保护页面
- **THEN** 系统 MUST 允许访问并使用当前会话中的用户身份

### Requirement: 用户可以登出
系统 SHALL 提供登出能力，并在登出后清除当前会话。

#### Scenario: 登出成功
- **WHEN** 已登录用户执行登出
- **THEN** 系统 MUST 清除会话并跳转到登录页

#### Scenario: 登出后访问受保护页面
- **WHEN** 用户登出后再次访问受保护页面
- **THEN** 系统 MUST 要求重新登录
