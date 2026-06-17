"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const ADMIN_TOKEN_STORAGE_KEY = "feedback_admin_token";

export default function LoginPage() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setIsSubmitting(true);
        setErrorMessage("");

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            if (!response.ok) {
                throw new Error("Invalid credentials.");
            }

            const data: { access_token: string; token_type: string } =
                await response.json();

            localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, data.access_token);
            router.push("/admin");
        } catch {
            setErrorMessage("نام کاربری یا رمز عبور اشتباه است.");
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
                            <p className="text-xs text-slate-500">ورود مدیر</p>
                        </div>
                    </Link>

                    <Link
                        href="/"
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                    >
                        صفحه ثبت فیدبک
                    </Link>
                </header>

                <section className="flex flex-1 items-center justify-center py-12">
                    <div className="w-full max-w-md rounded-[2rem] border border-white bg-white/90 p-3 shadow-xl shadow-slate-200/80 backdrop-blur">
                        <div className="rounded-[1.5rem] border border-slate-100 bg-white p-6 sm:p-8">
                            <div className="mb-8">
                                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                                    <span>🔐</span>
                                </div>

                                <p className="text-sm font-semibold text-indigo-600">
                                    پنل مدیریت
                                </p>
                                <h1 className="mt-2 text-2xl font-extrabold text-slate-950">
                                    ورود به داشبورد
                                </h1>
                                <p className="mt-3 text-sm leading-6 text-slate-500">
                                    فقط مدیر سیستم امکان مشاهده فیدبک‌ها و تغییر وضعیت آن‌ها را
                                    دارد.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label
                                        htmlFor="username"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        نام کاربری
                                    </label>
                                    <input
                                        id="username"
                                        type="text"
                                        value={username}
                                        required
                                        onChange={(event) => setUsername(event.target.value)}
                                        placeholder="admin"
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="password"
                                        className="mb-2 block text-sm font-semibold text-slate-700"
                                    >
                                        رمز عبور
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        required
                                        onChange={(event) => setPassword(event.target.value)}
                                        placeholder="رمز عبور مدیر"
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                                    />
                                </div>

                                {errorMessage && (
                                    <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                                        {errorMessage}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSubmitting ? "در حال ورود..." : "ورود به داشبورد"}
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}