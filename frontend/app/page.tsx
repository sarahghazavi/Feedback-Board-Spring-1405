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
    <main className="min-h-screen overflow-hidden bg-[#f8fafc] text-slate-950">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-[-12rem] top-[-12rem] h-96 w-96 rounded-full bg-indigo-100/70 blur-3xl" />
        <div className="absolute bottom-[-10rem] right-[-10rem] h-96 w-96 rounded-full bg-sky-100/80 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:64px_64px] opacity-30" />
      </div>

      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8">
        <header className="flex items-center justify-between rounded-3xl border border-white/80 bg-white/80 px-5 py-4 shadow-sm backdrop-blur">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
              <span className="text-lg">✦</span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-950">بردفیدبک</p>
              <p className="text-xs text-slate-500">سیستم مدیریت بازخورد</p>
            </div>
          </Link>

          <Link
            href="/login"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            داشبورد مدیریت
          </Link>
        </header>

        <section className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1fr_460px] lg:py-16">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              ثبت و پیگیری فیدبک‌ها
            </div>

            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.25] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              صدای کاربران را بشنو،
              <span className="block bg-gradient-to-l from-indigo-600 to-sky-500 bg-clip-text text-transparent">
                هوشمندتر تصمیم بگیر.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              ایده‌ها، مشکلات و پیشنهادهای خود را ساده و سریع ثبت کنید تا تیم
              بتواند آن‌ها را بررسی، اولویت‌بندی و پیگیری کند.
            </p>

            <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
              <FeatureCard title="سریع" description="ثبت در کمتر از یک دقیقه" />
              <FeatureCard title="شفاف" description="وضعیت هر فیدبک مشخص است" />
              <FeatureCard title="منظم" description="هر بازخورد با وضعیت مشخص" />
            </div>
          </div>

          <section className="rounded-[2rem] border border-white bg-white/90 p-3 shadow-xl shadow-slate-200/80 backdrop-blur">
            <div className="rounded-[1.5rem] border border-slate-100 bg-white p-6 sm:p-8">
              <div className="mb-7">
                <p className="text-sm font-semibold text-indigo-600">
                  ارسال فیدبک
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-950">
                  نظر خود را ثبت کنید
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  فقط عنوان و توضیح کوتاه کافی است. وضعیت اولیه به‌صورت خودکار
                  «ثبت شده» خواهد بود.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="title"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    عنوان
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
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    پیام
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    minLength={5}
                    maxLength={2000}
                    required
                    rows={6}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="جزئیات فیدبک خود را بنویسید..."
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                {successMessage && (
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    {successMessage}
                  </div>
                )}

                {errorMessage && (
                  <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "در حال ثبت..." : "ثبت فیدبک"}
                  <span className="transition group-hover:-translate-x-1">←</span>
                </button>
              </form>
            </div>
          </section>
        </section>

        <footer className="pb-3 text-center text-xs text-slate-400">
          ساخته شده برای مدیریت ساده و سریع بازخوردها
        </footer>
      </div>
    </main>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-white bg-white/80 p-4 shadow-sm backdrop-blur">
      <p className="font-bold text-slate-950">{title}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
    </div>
  );
}