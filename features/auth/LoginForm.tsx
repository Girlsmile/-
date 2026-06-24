import { signInAction } from "@/app/actions/auth";
import Link from "next/link";

/** LoginForm renders the email/password authentication form. */
export function LoginForm({
  error
}: {
  /** Optional query-string error code mapped to user feedback. */
  error?: string;
}) {
  return (
    <main className="auth-page">
      <section className="auth-panel">
        <p className="eyebrow">Strength Log</p>
        <h1>登录</h1>
        {error ? <p className="form-error">{getErrorMessage(error)}</p> : null}
        <form action={signInAction} className="auth-form">
          <label>
            邮箱
            <input autoComplete="email" name="email" required type="email" />
          </label>
          <label>
            密码
            <input autoComplete="current-password" name="password" required type="password" />
          </label>
          <button className="primary-button" type="submit">
            登录
          </button>
        </form>
        <p className="auth-switch">
          还没有账户？<Link href="/register">去注册</Link>
        </p>
      </section>
    </main>
  );
}

/** getErrorMessage maps auth error codes to simple Chinese feedback. */
function getErrorMessage(error: string): string {
  if (error === "missing") {
    return "请填写邮箱和密码。";
  }

  if (error === "check-email") {
    return "注册成功，请先去邮箱点击验证链接。";
  }

  if (error === "resent") {
    return "验证邮件已重新发送，请查收邮箱。";
  }

  if (error === "unconfirmed") {
    return "邮箱还未验证，请先去邮箱完成验证。";
  }

  return "登录失败，请检查邮箱或密码。";
}
