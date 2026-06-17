"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

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
    submitted: "bg-blue-50 text-blue-700 ring-blue-200",
    in_review: "bg-amber-50 text-amber-700 ring-amber-200",
    resolved: "bg-green-50 text-green-700 ring-green-200",
};

export default function AdminPage() {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    async function loadFeedbacks() {
        setIsLoading(true);
        setErrorMessage("");

        try {
            const response = await fetch(`${API_URL}/feedback`, {
                cache: "no-store",
            });

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
        try {
            const response = await fetch(`${API_URL}/feedback/${feedbackId}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status }),
            });

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
        }
    }

    useEffect(() => {
        loadFeedbacks();
    }, []);

    return (
        <main dir="rtl" className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
            <div className="mx-auto max-w-6xl">
                <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <p className="mb-2 text-sm font-medium text-blue-600">Admin Dashboard</p>
                        <h1 className="text-3xl font-bold">داشبورد مدیریت فیدبک‌ها</h1>
                        <p className="mt-3 text-slate-600">
                            فیدبک‌های ثبت‌شده را مشاهده کنید و وضعیت هرکدام را تغییر دهید.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={loadFeedbacks}
                            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium transition hover:bg-slate-50"
                        >
                            بروزرسانی
                        </button>

                        <Link
                            href="/"
                            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                        >
                            صفحه ثبت فیدبک
                        </Link>
                    </div>
                </header>

                {errorMessage && (
                    <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                        {errorMessage}
                    </div>
                )}

                <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                    {isLoading ? (
                        <div className="p-6 text-slate-600">در حال دریافت اطلاعات...</div>
                    ) : feedbacks.length === 0 ? (
                        <div className="p-6 text-slate-600">هنوز فیدبکی ثبت نشده است.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[900px] text-right text-sm">
                                <thead className="bg-slate-50 text-slate-600">
                                    <tr>
                                        <th className="px-5 py-4 font-medium">عنوان</th>
                                        <th className="px-5 py-4 font-medium">پیام</th>
                                        <th className="px-5 py-4 font-medium">وضعیت فعلی</th>
                                        <th className="px-5 py-4 font-medium">تاریخ ثبت</th>
                                        <th className="px-5 py-4 font-medium">تغییر وضعیت</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-200">
                                    {feedbacks.map((feedback) => (
                                        <tr key={feedback.id} className="align-top">
                                            <td className="px-5 py-4 font-medium">{feedback.title}</td>

                                            <td className="max-w-md px-5 py-4 leading-6 text-slate-600">
                                                {feedback.message}
                                            </td>

                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ring-1 ${statusBadgeClasses[feedback.status]
                                                        }`}
                                                >
                                                    {statusLabels[feedback.status]}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4 text-slate-600">
                                                {new Intl.DateTimeFormat("fa-IR", {
                                                    dateStyle: "medium",
                                                    timeStyle: "short",
                                                }).format(new Date(feedback.created_at))}
                                            </td>

                                            <td className="px-5 py-4">
                                                <select
                                                    value={feedback.status}
                                                    onChange={(event) =>
                                                        updateStatus(
                                                            feedback.id,
                                                            event.target.value as FeedbackStatus
                                                        )
                                                    }
                                                    className="rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
                    )}
                </section>
            </div>
        </main>
    );
}