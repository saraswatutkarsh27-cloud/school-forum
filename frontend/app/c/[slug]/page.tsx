"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useApiClient } from "../../../lib/apiClient";
import { useAuth } from "../../../components/AuthProvider";
import { FormEvent, useEffect, useState } from "react";

type Thread = {
  id: string;
  title: string;
  authorId: string;
  createdAt: string;
};

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const api = useApiClient();
  const { user } = useAuth();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.get<Thread[]>(
          `/categories/${slug}/threads`,
        );
        setThreads(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [slug]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("You must be signed in to create a thread.");
      return;
    }
    if (!title.trim() || !content.trim()) return;
    setCreating(true);
    try {
      const res = await api.post<{
        thread: Thread;
      }>(
        `/categories/${slug}/threads`,
        { title, initialPostContent: content },
        true,
      );
      setThreads((prev) => [res.thread, ...prev]);
      setTitle("");
      setContent("");
    } catch (err) {
      alert(`Failed to create thread: ${(err as Error).message}`);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-slate-50">
            Category: {slug}
          </h2>
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-slate-200"
          >
            ← Back to categories
          </Link>
        </div>
      </div>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-slate-200">
          Threads
        </h3>
        {loading && (
          <p className="text-sm text-slate-400">Loading threads…</p>
        )}
        {error && (
          <p className="text-sm text-red-400">
            Failed to load threads: {error}
          </p>
        )}
        <div className="space-y-3">
          {threads.map((thread) => (
            <Link
              key={thread.id}
              href={`/thread/${thread.id}`}
              className="block rounded-lg border border-slate-800 bg-slate-900/60 p-3 hover:border-sky-500/60 hover:bg-slate-900"
            >
              <h4 className="text-sm font-medium text-slate-50">
                {thread.title}
              </h4>
              <p className="mt-1 text-xs text-slate-500">
                Created at{" "}
                {new Date(thread.createdAt).toLocaleString()}
              </p>
            </Link>
          ))}
          {!loading && !error && threads.length === 0 && (
            <p className="text-sm text-slate-400">
              No threads yet. Be the first to start a discussion.
            </p>
          )}
        </div>
      </section>

      <section className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
        <h3 className="text-sm font-medium text-slate-200">
          Start a new thread
        </h3>
        {!user && (
          <p className="mt-2 text-xs text-slate-500">
            You must sign in to create a thread.
          </p>
        )}
        <form
          onSubmit={onSubmit}
          className="mt-3 space-y-3"
        >
          <input
            type="text"
            placeholder="Thread title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500"
          />
          <textarea
            placeholder="Write the first post…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[120px] rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={!user || creating}
            className="rounded-md bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700"
          >
            {creating ? "Creating…" : "Create thread"}
          </button>
        </form>
      </section>
    </div>
  );
}

