import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sprout } from 'lucide-react';

export default function Login() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setInfo(''); setBusy(true);
    try {
      const fn = mode === 'signin' ? signIn : signUp;
      const { error } = await fn(email, password);
      if (error) throw error;
      if (mode === 'signup') setInfo('Check your email to confirm your account, then sign in.');
    } catch (e) {
      setErr(e.message || 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-[var(--accent-2)] text-white relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute bottom-10 -left-10 w-72 h-72 rounded-full bg-white/5" />
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-white/15 grid place-items-center backdrop-blur">
            <Sprout size={22} />
          </div>
          <span className="font-display text-2xl font-bold">Habiter</span>
        </div>
        <div className="relative z-10">
          <h1 className="font-display text-5xl font-bold leading-tight mb-4">
            Small acts,<br/>compounded daily.
          </h1>
          <p className="text-white/70 max-w-sm">
            Track the habits that shape who you're becoming. One check-in at a time.
          </p>
        </div>
        <div className="text-xs text-white/50 relative z-10">© Habiter · grow gently</div>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent)] grid place-items-center">
              <Sprout size={20} className="text-white" />
            </div>
            <span className="font-display text-xl font-bold">Habiter</span>
          </div>

          <h2 className="font-display text-3xl font-bold mb-2">
            {mode === 'signin' ? 'Welcome back' : 'Begin your practice'}
          </h2>
          <p className="text-sm text-[var(--muted)] mb-8">
            {mode === 'signin' ? 'Sign in to continue your streak.' : 'Create an account to start tracking.'}
          </p>

          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Email</label>
              <input className="input mt-1" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Password</label>
              <input className="input mt-1" type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            {err && <div className="text-sm text-red-500 bg-red-500/10 px-3 py-2 rounded-lg">{err}</div>}
            {info && <div className="text-sm text-[var(--accent-2)] bg-[var(--accent-2)]/10 px-3 py-2 rounded-lg">{info}</div>}
            <button disabled={busy} className="btn btn-primary w-full">
              {busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <div className="mt-6 text-sm text-center text-[var(--muted)]">
            {mode === 'signin' ? "New here? " : 'Already have an account? '}
            <button onClick={() => { setMode(m => m === 'signin' ? 'signup' : 'signin'); setErr(''); setInfo(''); }} className="text-[var(--accent)] font-semibold hover:underline">
              {mode === 'signin' ? 'Create one' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
