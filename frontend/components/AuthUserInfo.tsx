"use client";

import { useAuth } from "./AuthProvider";

export function AuthUserInfo() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <span className="text-xs text-slate-500">Not signed in</span>;
  }

  return (
    <div className="flex items-center gap-2">
      {user.photoURL && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={user.photoURL}
          alt={user.displayName ?? "User avatar"}
          className="h-7 w-7 rounded-full border border-slate-700"
        />
      )}
      <div className="flex flex-col text-xs">
        <span className="font-medium text-slate-100">
          {user.displayName ?? "User"}
        </span>
        <span className="text-slate-500">{user.email}</span>
      </div>
    </div>
  );
}

