import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login({ onSwitch }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (err) {
      setError(err.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-soft border border-sand-100 space-y-5">
        <div className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-ink-500">
            Agent AI-Pilot
          </p>
          <h1 className="font-display text-3xl">Sign In</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm uppercase tracking-[0.2em] text-ink-500">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-sand-50 border border-sand-100 text-base"
              placeholder="you@email.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm uppercase tracking-[0.2em] text-ink-500">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-sand-50 border border-sand-100 text-base"
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="text-sm text-rose-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-ink-900 text-white text-base font-medium disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <button
          type="button"
          onClick={onSwitch}
          className="w-full h-12 rounded-xl border border-sand-100 text-ink-700 text-base font-medium"
        >
          Create Account
        </button>
      </div>
    </section>
  );
}
