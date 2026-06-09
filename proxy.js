import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })

    // Verifica se há sessão ativa
    const { data: { session } } = await supabase.auth.getSession()

    // Se está tentando acessar /admin (mas não /admin/login) sem estar logado
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
    const isLoginRoute = req.nextUrl.pathname === '/admin/login'

    if (isAdminRoute && !isLoginRoute && !session) {
        return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    return res
}

// Define quais rotas o middleware monitora
export const config = {
    matcher: ['/admin/:path*'],
}