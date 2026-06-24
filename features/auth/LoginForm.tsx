import { signInAction } from "@/app/actions/auth";

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
      </section>
    </main>
  );
}

/** getErrorMessage maps auth error codes to simple Chinese feedback. */
function getErrorMessage(error: string): string {
  if (error === "missing") {
    return "请填写邮箱和密码。";
  }

  return "登录失败，请检查邮箱或密码。";
}
