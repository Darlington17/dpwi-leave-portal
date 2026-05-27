// ============================================================
// auth.js
// Handles login, register, logout, and session checking
// ============================================================

import { supabase } from './supabase-config.js'

// ── REGISTER ────────────────────────────────────────────────
export async function registerUser({ fullName, email, password, role, department }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName }   // stored in raw_user_meta_data → picked up by DB trigger
    }
  })
  if (error) return { error }

  // Update the profile row created by the DB trigger with extra fields
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ role, department })
    .eq('id', data.user.id)

  if (profileError) return { error: profileError }
  return { data }
}

// ── LOGIN ────────────────────────────────────────────────────
export async function loginUser({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error }
  return { data }
}

// ── LOGOUT ───────────────────────────────────────────────────
export async function logoutUser() {
  const { error } = await supabase.auth.signOut()
  if (error) console.error('Logout error:', error)
  window.location.href = 'index.html'
}

// ── GET CURRENT USER + PROFILE ───────────────────────────────
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, companies(name, subscription_plan)')
    .eq('id', user.id)
    .single()

  return { user, profile }
}

// ── GUARD: redirect to login if not authenticated ────────────
export async function requireAuth() {
  const result = await getCurrentUser()
  if (!result) {
    window.location.href = 'index.html'
    return null
  }
  return result
}

// ── GUARD: redirect to dashboard if already logged in ────────
export async function redirectIfLoggedIn() {
  const result = await getCurrentUser()
  if (result) {
    window.location.href = 'dashboard.html'
  }
}
