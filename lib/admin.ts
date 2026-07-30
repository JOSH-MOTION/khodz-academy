import { createClient } from '@/lib/supabase/server'
import type { User } from '@supabase/supabase-js'

type AdminCheck = { ok: true; user: User } | { ok: false; status: 401 | 403 }

/** Verifies the caller is signed in and profiles.role = 'admin'. Use at the
 * top of every /api/admin/* route before touching the service-role client. */
export async function requireAdmin(): Promise<AdminCheck> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, status: 401 }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { ok: false, status: 403 }

  return { ok: true, user }
}
