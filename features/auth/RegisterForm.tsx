import Link from "next/link";
import { signUpAction } from "@/app/actions/auth";

/** RegisterForm renders the account creation form. */
export function RegisterForm({
  error
}: {
  /** Optional query-string error code mapped to user feedback. */
  error?: string;
}) {
  return (
    <main className="auth-page">
      <section className="auth-panel">
        <p className="eyebrow">Strength Log</p>
        <h1>注册</h1>
        {error ? <p className="form-error">{getErrorMessage(error)}</p> : null}
        <form action={signUpAction} className="auth-form">
          <label>
            邮箱
            <input autoComplete="email" name="email" required type="email" />
          </label>
          <label>
            密码
            <input autoComplete="new-password" name="password" required type="password" />
          </label>
          <button className="primary-button" type="submit">
            创建账户
          </button>
        </form>
        <p className="auth-switch">
          已有账户？<Link href="/login">去登录</Link>
        </p>
      </section>
    </main>
  );
}

/** getErrorMessage maps registration error codes to simple Chinese feedback. */
function getErrorMessage(error: string): string {
  if (error === "missing") {
    return "请填写邮箱和密码。";
  }

  return "注册失败，请检查邮箱或密码。";
}
