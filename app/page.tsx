// app/page.tsx
"use client";

import { useAuth } from "@/components/AuthProvider";
import Link from "next/link";

export default function HomePage() {
  const { user, signOut, session } = useAuth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">ようこそ！</h1>
        {session ? (
          <div>
            <p className="text-lg text-gray-700 mb-4">
              こんにちは、{user?.email || "ユーザー"}さん！
            </p>
            <button
              onClick={signOut}
              className="px-6 py-2 font-semibold text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              ログアウト
            </button>
          </div>
        ) : (
          <div>
            <p className="text-lg text-gray-700 mb-4">ログインしていません。</p>
            <Link
              href="/login"
              className="px-6 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              ログイン
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}