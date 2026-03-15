"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useApiClient } from "../../../lib/apiClient";
import { useAuth } from "../../../components/AuthProvider";

type Thread = {
  id: string;
  title: string;
  categoryId: string;
  authorId: string;
  createdAt: string;
};

type Post = {
  id: string;
  content: string;
  authorId: string;
  createdAt: string;
};

export default function ThreadPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const api = useApiClient();
  const { user } = useAuth();

  const [thread, setThread] = useState<Thread | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [threadData, postsData] = await Promise.all([
          api.get<Thread>(`/threads/${id}`),
          api.get<Post[]>(`/threads/${id}/posts`),
        ]);
        setThread(threadData);
        setPosts(postsData);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [id]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("You must be signed in to reply.");
      return;
    }
    if (!content.trim()) return;
    setPosting(true);
    try {
      const newPost = await api.post<Post>(
        `/threads/${id}/posts`,
        { content },
        true,
      );
      setPosts((prev) => [...prev, newPost]);
      setContent("");
    } catch (err) {
      alert(`Failed to post reply: ${(err as Error).message}`);
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <p className="text-sm text-slate-400">Loading thread…</p>
    );
  }

  if (error || !thread) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-red-400">
          Failed to load thread: {error ?? "Not found"}
        </p>
        <Link
          href="/"
          className="text-xs text-slate-400 hover:text-slate-200"
        >
          ← Back to categories
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-slate-50">
          {thread.title}
        </h2>
        <p className="text-xs text-slate-500">
          Created {new Date(thread.createdAt).toLocaleString()}
        </p>
        <Link
          href="/"
          className="text-xs text-slate-400 hover:text-slate-200"
        >
          ← Back to categories
        </Link>
      </div>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-slate-200">
          Replies
        </h3>
        <div className="space-y-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="rounded-lg border border-slate-800 bg-slate-900/60 p-3"
            >
              <p className="whitespace-pre-wrap text-sm text-slate-100">
                {post.content}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Posted{" "}
                {new Date(post.createdAt).toLocaleString()}
              </p>
            </article>
          ))}
          {posts.length === 0 && (
            <p className="text-sm text-slate-400">
              No replies yet. Start the conversation.
            </p>
          )}
        </div>
      </section>

      <section className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
        <h3 className="text-sm font-medium text-slate-200">
          Add a reply
        </h3>
        {!user && (
          <p className="mt-2 text-xs text-slate-500">
            You must sign in to reply.
          </p>
        )}
        <form
          onSubmit={onSubmit}
          className="mt-3 space-y-3"
        >
          <textarea
            placeholder="Write your reply…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[120px] rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={!user || posting}
            className="rounded-md bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700"
          >
            {posting ? "Posting…" : "Post reply"}
          </button>
        </form>
      </section>
    </div>
  );
}

