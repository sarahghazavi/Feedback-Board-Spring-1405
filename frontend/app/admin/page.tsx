"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const ADMIN_TOKEN_STORAGE_KEY = "feedback_admin_token";

function getAdminToken() {
    if (typeof window === "undefined") {
        return "";
    }

    return localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) || "";
}

type FeedbackStatus = "submitted" | "in_review" | "resolved";

type Feedback = {
    id: number;
    title: string;
    message: string;
    status: FeedbackStatus;
    created_at: string;
    updated_at: string;
};

const statusLabels: Record<FeedbackStatus, string> = {
    submitted: "ثبت شده",
    in_review: "در حال بررسی",
    resolved: "رسیدگی شده",
};

const statusBadgeClasses: Record<FeedbackStatus, string> = {
    submitted: "border-blue-100 bg-blue-50 text-blue-700",
    in_review: "border-amber-100 bg-amber-50 text-amber-700",
    resolved: "border-emerald-100 bg-emerald-50 text-emerald-700",
};

export default function AdminPage() {
    const router = useRouter();
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState("");

    const stats = useMemo(() => {
        return {
            total: feedbacks.length,
            submitted: feedbacks.filter((item) => item.status === "submitted").length,
            inReview: feedbacks.filter((item) => item.status === "in_review").length,
            resolved: feedbacks.filter((item) => item.status === "resolved").length,
        };
    }, [feedbacks]);

    async function loadFeedbacks() {
        const token = getAdminToken();

        if (!token) {
            router.replace("/login");
            return;
        }

        setIsLoading(true);
        setErrorMessage("");

        try {
            const response = await fetch(`${API_URL}/feedback`, {
                cache: "no-store",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 401) {
                localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
                router.replace("/login");
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to load feedbacks.");
            }

            const data: Feedback[] = await response.json();
            setFeedbacks(data);
        } catch {
            setErrorMessage("خطایی در دریافت فیدبک‌ها رخ داد.");
        } finally {
            setIsLoading(false);
        }
    }

    async function updateStatus(feedbackId: number, status: FeedbackStatus) {
        const token = getAdminToken();

        if (!token) {
            router.replace("/login");
            return;
        }

        setUpdatingId(feedbackId);
        setErrorMessage("");

        try {
            const response = await fetch(`${API_URL}/feedback/${feedbackId}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status }),
            });

            if (response.status === 401) {
                localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
                router.replace("/login");
                return;
            }

            if (!response.ok) {
                throw new Error("Failed to update status.");
            }

            const updatedFeedback: Feedback = await response.json();

            setFeedbacks((currentFeedbacks) =>
                currentFeedbacks.map((feedback) =>
                    feedback.id === feedbackId ? updatedFeedback : feedback
                )
            );
        } catch {
            setErrorMessage("خطایی در تغییر وضعیت رخ داد.");
        } finally {
            setUpdatingId(null);
        }
    }

    useEffect(() => {
        loadFeedbacks();
    }, []);

    return (
        <main className="min-h-screen overflow-hidden bg-[#f8fafc] text-slate-950">
            <div className="pointer-events-none fixed inset-0 -z-10">
                <div className="absolute left-[-10rem] top-[-12rem] h-96 w-96 rounded-full bg-indigo-100/70 blur-3xl" />
                <div className="absolute bottom-[-12rem] right-[-10rem] h-96 w-96 rounded-full bg-sky-100/80 blur-3xl" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:64px_64px] opacity-30" />
            </div>

            <div className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8">
                <header className="mb-10 flex items-center justify-between rounded-3xl border border-white/80 bg-white/80 px-5 py-4 shadow-sm backdrop-blur">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
                            <span className="text-lg">✦</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-950">بردفیدبک</p>
                            <p className="text-xs text-slate-500">پنل مدیریت</p>
                        </div>
                    </Link>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
                                router.push("/login");
                            }}
                            className="rounded-2xl border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 shadow-sm transition hover:bg-red-100"
                        >
                            خروج
                        </button>

                        <Link
                            href="/"
                            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                        >
                            صفحه ثبت فیدبک
                        </Link>
                    </div>
                </header>

                <section className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
                    <div>
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            داشبورد زنده مدیریت فیدبک‌ها
                        </div>

                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                            مدیریت فیدبک‌ها
                        </h1>

                        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                            همه بازخوردهای ثبت‌شده را مشاهده کنید و وضعیت هر مورد را از ثبت
                            اولیه تا بررسی و رسیدگی مدیریت کنید.
                        </p>
                    </div>

                    <button
                        onClick={loadFeedbacks}
                        disabled={isLoading}
                        className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isLoading ? "در حال بروزرسانی..." : "بروزرسانی داده‌ها"}
                    </button>
                </section>

                <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard label="کل فیدبک‌ها" value={stats.total} />
                    <StatCard label="ثبت شده" value={stats.submitted} />
                    <StatCard label="در حال بررسی" value={stats.inReview} />
                    <StatCard label="رسیدگی شده" value={stats.resolved} />
                </section>

                {errorMessage && (
                    <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        {errorMessage}
                    </div>
                )}

                <section className="overflow-hidden rounded-[2rem] border border-white bg-white/90 p-3 shadow-xl shadow-slate-200/80 backdrop-blur">
                    <div className="overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white">
                        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                            <div>
                                <h2 className="font-bold text-slate-950">لیست فیدبک‌ها</h2>
                                <p className="mt-1 text-xs text-slate-500">
                                    مرتب‌شده بر اساس جدیدترین فیدبک
                                </p>
                            </div>

                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                {feedbacks.length} مورد
                            </span>
                        </div>

                        {isLoading ? (
                            <div className="p-8 text-sm text-slate-500">
                                در حال دریافت اطلاعات...
                            </div>
                        ) : feedbacks.length === 0 ? (
                            <div className="p-8 text-sm text-slate-500">
                                هنوز فیدبکی ثبت نشده است.
                            </div>
                        ) : (
                            <>
                                <div className="hidden overflow-x-auto lg:block">
                                    <table className="w-full min-w-[980px] text-right text-sm">
                                        <thead className="bg-slate-50 text-xs text-slate-500">
                                            <tr>
                                                <th className="px-5 py-4 font-semibold">عنوان</th>
                                                <th className="px-5 py-4 font-semibold">پیام</th>
                                                <th className="px-5 py-4 font-semibold">وضعیت</th>
                                                <th className="px-5 py-4 font-semibold">تاریخ ثبت</th>
                                                <th className="px-5 py-4 font-semibold">تغییر وضعیت</th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-slate-100">
                                            {feedbacks.map((feedback) => (
                                                <tr
                                                    key={feedback.id}
                                                    className="align-top transition hover:bg-slate-50/70"
                                                >
                                                    <td className="w-64 px-5 py-5">
                                                        <p className="font-bold text-slate-950">
                                                            {feedback.title}
                                                        </p>
                                                        <p className="mt-1 text-xs text-slate-400">
                                                            #{feedback.id}
                                                        </p>
                                                    </td>

                                                    <td className="max-w-xl px-5 py-5 leading-7 text-slate-600">
                                                        {feedback.message}
                                                    </td>

                                                    <td className="px-5 py-5">
                                                        <StatusBadge status={feedback.status} />
                                                    </td>

                                                    <td className="whitespace-nowrap px-5 py-5 text-slate-500">
                                                        {formatDate(feedback.created_at)}
                                                    </td>

                                                    <td className="px-5 py-5">
                                                        <select
                                                            value={feedback.status}
                                                            disabled={updatingId === feedback.id}
                                                            onChange={(event) =>
                                                                updateStatus(
                                                                    feedback.id,
                                                                    event.target.value as FeedbackStatus
                                                                )
                                                            }
                                                            className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
                                                        >
                                                            <option value="submitted">ثبت شده</option>
                                                            <option value="in_review">در حال بررسی</option>
                                                            <option value="resolved">رسیدگی شده</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="grid gap-3 p-4 lg:hidden">
                                    {feedbacks.map((feedback) => (
                                        <article
                                            key={feedback.id}
                                            className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm"
                                        >
                                            <div className="mb-3 flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="font-bold text-slate-950">
                                                        {feedback.title}
                                                    </p>
                                                    <p className="mt-1 text-xs text-slate-400">
                                                        #{feedback.id} · {formatDate(feedback.created_at)}
                                                    </p>
                                                </div>

                                                <StatusBadge status={feedback.status} />
                                            </div>

                                            <p className="mb-4 text-sm leading-7 text-slate-600">
                                                {feedback.message}
                                            </p>

                                            <select
                                                value={feedback.status}
                                                disabled={updatingId === feedback.id}
                                                onChange={(event) =>
                                                    updateStatus(
                                                        feedback.id,
                                                        event.target.value as FeedbackStatus
                                                    )
                                                }
                                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                <option value="submitted">ثبت شده</option>
                                                <option value="in_review">در حال بررسی</option>
                                                <option value="resolved">رسیدگی شده</option>
                                            </select>
                                        </article>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}

function StatCard({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-3xl border border-white bg-white/90 p-5 shadow-sm backdrop-blur">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950">
                {value}
            </p>
        </div>
    );
}

function StatusBadge({ status }: { status: FeedbackStatus }) {
    return (
        <span
            className={`inline-flex whitespace-nowrap rounded-full border px-3 py-1 text-xs font-bold ${statusBadgeClasses[status]
                }`}
        >
            {statusLabels[status]}
        </span>
    );
}

function formatDate(date: string) {
    return new Intl.DateTimeFormat("fa-IR", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(date));
}