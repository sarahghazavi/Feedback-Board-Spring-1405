"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function HomePage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch(`${API_URL}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("Feedback submission failed.");
      }

      setTitle("");
      setMessage("");
      setSuccessMessage("فیدبک شما با موفقیت ثبت شد.");
    } catch {
      setErrorMessage("خطایی در ثبت فیدبک رخ داد. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main dir="rtl" className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-medium text-blue-600">Feedback Board</p>
            <h1 className="text-3xl font-bold">ثبت فیدبک</h1>
            <p className="mt-3 text-slate-600">
              پیشنهاد، مشکل یا نظر خود را ثبت کنید تا توسط تیم بررسی شود.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            داشبورد مدیریت
          </Link>
        </header>

        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="title" className="mb-2 block text-sm font-medium">
                عنوان فیدبک
              </label>
              <input
                id="title"
                type="text"
                value={title}
                minLength={3}
                maxLength={150}
                required
                onChange={(event) => setTitle(event.target.value)}
                placeholder="مثلاً: مشکل در صفحه ورود"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-medium">
                متن پیام
              </label>
              <textarea
                id="message"
                value={message}
                minLength={5}
                maxLength={2000}
                required
                rows={7}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="جزئیات فیدبک خود را بنویسید..."
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {successMessage && (
              <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "در حال ثبت..." : "ثبت فیدبک"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}