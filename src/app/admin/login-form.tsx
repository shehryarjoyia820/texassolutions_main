'use client';

import { useActionState } from 'react';
import { login } from './actions';

export function LoginForm() {
  const [error, action, pending] = useActionState(login, '');
  return (
    <form action={action} className="mx-auto mt-10 max-w-sm space-y-4 rounded-2xl border border-line bg-bg-elev p-6">
      <h1 className="font-display text-xl font-semibold">Chatbot admin</h1>
      <div>
        <label htmlFor="admin-password" className="text-sm font-medium">
          Password
        </label>
        <input id="admin-password" name="password" type="password" autoComplete="current-password" required className="mt-1 block min-h-[44px] w-full rounded-xl border border-line bg-bg px-3 text-sm" />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button disabled={pending} className="min-h-[44px] w-full rounded-xl bg-accent font-semibold text-white disabled:opacity-60">
        Sign in
      </button>
    </form>
  );
}
