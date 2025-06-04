// app/dashboard/page.tsx
"use client";

import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/login'); // セッションがない場合はログインページへ
    }
  }, [session, router]);

  if (!session) {
    return <p className="text-center mt-10">リダイレクト中...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-4xl font-bold text-blue-600">
          ようこそ、ダッシュボードへ！
        </h1>
        {user && (
          <p className="mt-3 text-xl text-gray-700">
            あなたのメールアドレス: {user.email}
          </p>
        )}
        <p className="mt-3 text-lg text-gray-600">
          ここは認証されたユーザーのみがアクセスできるページです。
        </p>
      </main>
    </div>
  );
}