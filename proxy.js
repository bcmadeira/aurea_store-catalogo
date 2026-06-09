import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function proxy(req) {
    const res = NextResponse.next()

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                get(name) {
                    return req.cookies.get(name)?.value
                },
                set(name, value, options) {
                    res.cookies.set({ name, value, ...options })
                },
                remove(name, options) {
                    res.cookies.set({ name, value: '', ...options })
                },
            },
        }
    )

    const { data: { session } } = await supabase.auth.getSession()

    const estaNoAdmin = req.nextUrl.pathname.startsWith('/admin')
    const estaNoLogin = req.nextUrl.pathname === '/admin/login'

    if (estaNoAdmin && !estaNoLogin && !session) {
        return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    if (estaNoLogin && session) {
        return NextResponse.redirect(new URL('/admin', req.url))
    }

    return res
}

export const config = {
    matcher: ['/admin/:path*'],
}