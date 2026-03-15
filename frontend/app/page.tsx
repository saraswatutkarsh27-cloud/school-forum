"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useApiClient } from "../lib/apiClient";
import { useAuth } from "../components/AuthProvider";

type Category = {
  id: string;
  slug: string;
  name: string;
  description?: string;
};

export default function HomePage() {
  const api = useApiClient();
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.get<Category[]>("/categories");
        setCategories(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-50">
          Categories
        </h2>
        {user && (
          <span className="text-xs text-slate-400">
            Signed in as {user.email}
          </span>
        )}
      </div>
      {loading && (
        <p className="text-sm text-slate-400">Loading categories…</p>
      )}
      {error && (
        <p className="text-sm text-red-400">
          Failed to load categories: {error}
        </p>
      )}
      <div className="space-y-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/c/${cat.slug}`}
            className="block rounded-lg border border-slate-800 bg-slate-900/60 p-4 hover:border-sky-500/60 hover:bg-slate-900"
          >
            <h3 className="font-medium text-slate-50">{cat.name}</h3>
            {cat.description && (
              <p className="mt-1 text-sm text-slate-400">
                {cat.description}
              </p>
            )}
          </Link>
        ))}
        {!loading && !error && categories.length === 0 && (
          <p className="text-sm text-slate-400">
            No categories yet. Create one using the backend API.
          </p>
        )}
      </div>
    </div>
  );
}

