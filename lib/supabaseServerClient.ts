// lib/supabaseServerClient.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers'; // Next.jsからcookies関数をインポート

// cookies() の返り値の型 (TypeScriptがPromiseとして解釈している場合、Promise<ActualStoreType>となる)
type CookieStoreSourceType = ReturnType<typeof cookies>;

// Awaited<T> を使って、CookieStoreSourceTypeがPromiseだった場合に解決された型を取得
// もしPromiseでなければ、そのままの型となる
type ResolvedCookieStoreType = Awaited<CookieStoreSourceType>;

export function createClient(cookieStoreSource: CookieStoreSourceType) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: async (name: string) => {
          // cookieStoreSource が Promise の場合、ここで解決される
          const store: ResolvedCookieStoreType = await cookieStoreSource;
          return store.get(name)?.value;
        },
        set: async (name: string, value: string, options: CookieOptions) => {
          const store: ResolvedCookieStoreType = await cookieStoreSource;
          // 'set' メソッドの存在を型ガードで確認
          // ResolvedCookieStoreType が RequestCookies | ReadonlyRequestCookies のような
          // ユニオン型になることを想定し、書き込み可能な場合にのみ set を呼び出す
          if ('set' in store && typeof store.set === 'function') {
            store.set({ name, value, ...options });
          } else {
            // 読み取り専用ストアでsetが呼ばれた場合の処理 (エラーは発生させないことが多い)
            // console.warn(`Cookie store is read-only or 'set' method is not available. Could not set cookie: ${name}`);
          }
        },
        remove: async (name: string, options: CookieOptions) => {
          const store: ResolvedCookieStoreType = await cookieStoreSource;
          // 'delete' メソッドの存在を確認 (RequestCookies にはある)
          if ('delete' in store && typeof store.delete === 'function') {
            // Next.js の RequestCookies は options を取らない delete もあるため、必要に応じて調整
            (store as any).delete({ name, ...options });
          } else if ('set' in store && typeof store.set === 'function') {
            // 'delete' がない場合のフォールバックとして、値を空にして 'set' を使用
            store.set({ name, value: '', ...options });
          } else {
            // console.warn(`Cookie store is read-only or 'delete'/'set' method is not available. Could not remove cookie: ${name}`);
          }
        },
      },
    }
  );
}