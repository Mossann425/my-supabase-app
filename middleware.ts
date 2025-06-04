// middleware.ts
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabaseServerClient' // サーバーサイドのSupabaseクライアント
import { cookies } from 'next/headers'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // 保護したいパスを指定
  const protectedPaths = ['/dashboard'] // 例: /dashboard を保護

  // 現在のパスが保護対象かつ未認証の場合、ログインページへリダイレクト
  if (protectedPaths.some(path => request.nextUrl.pathname.startsWith(path)) && !session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname) // オプション: リダイレクト元を渡す
    return NextResponse.redirect(loginUrl)
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}