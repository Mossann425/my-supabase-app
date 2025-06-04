// lib/supabaseServerClient.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

type CookieStoreSourceType = ReturnType<typeof cookies>;
type ResolvedCookieStoreType = Awaited<CookieStoreSourceType>;

export function createClient(cookieStoreSource: CookieStoreSourceType) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: async (name: string) => {
          const store: ResolvedCookieStoreType = await cookieStoreSource;
          return store.get(name)?.value;
        },
        set: async (name: string, value: string, options: CookieOptions) => {
          const store: ResolvedCookieStoreType = await cookieStoreSource;
          if ('set' in store && typeof store.set === 'function') {
            store.set({ name, value, ...options });
          } else {
            // console.warn(`Cookie store is read-only or 'set' method is not available. Could not set cookie: ${name}`);
          }
        },
        remove: async (name: string, options: CookieOptions) => {
          const store: ResolvedCookieStoreType = await cookieStoreSource;
          // 'set' メソッドを使用してクッキーを削除する (値を空にし、maxAgeを0に設定)
          if ('set' in store && typeof store.set === 'function') {
            store.set({
              name,
              value: '', // 値を空にする
              ...options, // path や domain などの他のオプションを引き継ぐ
              maxAge: 0,  // クッキーを即座に期限切れにする
            });
          } else {
            // console.warn(`Cookie store is read-only or 'set' method is not available. Could not remove cookie: ${name}`);
          }
        },
      },
    }
  );
}