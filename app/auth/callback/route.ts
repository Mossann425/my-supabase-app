// app/auth/callback/route.ts
import { createClient } from '@/lib/supabaseServerClient'; // Supabaseサーバークライアント
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) { // ← `export` されています
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    await supabase.auth.exchangeCodeForSession(code);
  }

  // サインインプロセス完了後のリダイレクト先URL
  // requestUrl.origin は現在のホスト名 (例: http://localhost:3000) を返します
  return NextResponse.redirect(requestUrl.origin);
}