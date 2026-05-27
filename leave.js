// ============================================================
// leave.js
// All leave application database operations
// ============================================================

import { supabase } from './supabase-config.js'

// ── SUBMIT LEAVE APPLICATION ─────────────────────────────────
export async function submitLeave({ leaveType, startDate, endDate, workingDays, reason }) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: { message: 'Not logged in' } }

  // Get employee's company_id from profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('company_id')
    .eq('id', user.id)
    .single()

  const { data, error } = await supabase
    .from('leave_applications')
    .insert({
      company_id:   profile.company_id,
      employee_id:  user.id,
      leave_type:   leaveType,
      start_date:   startDate,
      end_date:     endDate,
      working_days: workingDays,
      reason:       reason,
      status:       'pending'
    })
    .select()
    .single()

  return { data, error }
}

// ── GET MY LEAVE APPLICATIONS ────────────────────────────────
export async function getMyLeaves() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('leave_applications')
    .select('*')
    .eq('employee_id', user.id)
    .order('created_at', { ascending: false })

  if (error) { console.error(error); return [] }
  return data
}

// ── GET ALL LEAVES FOR MY COMPANY (managers/HR admin) ────────
export async function getCompanyLeaves() {
  const { data, error } = await supabase
    .from('leave_applications')
    .select(`
      *,
      profiles!employee_id (full_name, department, role)
    `)
    .order('created_at', { ascending: false })

  if (error) { console.error(error); return [] }
  return data
}

// ── GET PENDING APPROVALS (for managers) ─────────────────────
export async function getPendingApprovals() {
  const { data, error } = await supabase
    .from('leave_applications')
    .select(`
      *,
      profiles!employee_id (full_name, department)
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (error) { console.error(error); return [] }
  return data
}

// ── APPROVE / REJECT (inline, not via email) ─────────────────
export async function updateLeaveStatus(applicationId, status) {
  const { data: { user } } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('leave_applications')
    .update({
      status,
      approved_by: user.id,
      approved_at: new Date().toISOString()
    })
    .eq('id', applicationId)
    .select()
    .single()

  return { data, error }
}

// ── CANCEL MY LEAVE ───────────────────────────────────────────
export async function cancelLeave(applicationId) {
  const { data, error } = await supabase
    .from('leave_applications')
    .update({ status: 'cancelled' })
    .eq('id', applicationId)
    .select()
    .single()

  return { data, error }
}

// ── GET LEAVE BALANCE SUMMARY ─────────────────────────────────
export async function getLeaveBalance() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('leave_balance_annual, leave_balance_sick')
    .eq('id', user.id)
    .single()

  return profile
}

// ── HELPER: calculate working days between two dates ─────────
export function calcWorkingDays(startDate, endDate) {
  let count = 0
  const start = new Date(startDate)
  const end   = new Date(endDate)
  const cur   = new Date(start)
  while (cur <= end) {
    const day = cur.getDay()
    if (day !== 0 && day !== 6) count++
    cur.setDate(cur.getDate() + 1)
  }
  return count
}
