"use client";

import { useAuth } from "./AuthProvider";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../firebaseClient";

export function AuthButtons() {
  const { user, loading } = useAuth();

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loading) {
    return <span className="text-xs text-slate-400">Checking auth…</span>;
  }

  if (!user) {
    return (
      <button
        onClick={handleLogin}
        className="rounded-md bg-sky-500 px-3 py-1 text-sm font-medium text-white hover:bg-sky-400"
      >
        Sign in with Google
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-md border border-slate-700 px-3 py-1 text-sm text-slate-200 hover:bg-slate-800"
    >
      Sign out
    </button>
  );
}

