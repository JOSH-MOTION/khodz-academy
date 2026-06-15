import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// ── Auth Proxy ──
// Renamed from middleware.ts → proxy.ts (Next.js 16 convention)
// Handles session refresh + route protection for student & admin areas.

export async function proxy(request: NextRequest) {
  const { supabase, supabaseResponse } = await updateSession(request)
  const { pathname } = request.nextUrl

  // In development, skip auth enforcement so all pages are navigable for UI review
  if (process.env.NODE_ENV === 'development') {
    return supabaseResponse
  }

  const { data: { user } } = await supabase.auth.getUser()

  // Protect student area (exact path prefix matches — not admin-dashboard)
  const studentPaths = pathname === '/student-dashboard' || pathname.startsWith('/lesson')
  // Protect admin area (exact match only — not admin-dashboard prefix catch-all)
  const adminPath = pathname === '/admin-dashboard'

  if ((studentPaths || adminPath) && !user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Admin role check
  if (adminPath && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/student-dashboard', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
