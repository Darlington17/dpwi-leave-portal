// ============================================================
// HOW TO WIRE THESE FILES INTO YOUR EXISTING PORTAL
// ============================================================

// ── STEP 1: Add to every HTML page <head> ───────────────────
// No npm needed. Supabase loads directly from CDN.
// Add this ONE line to <head> in all your HTML files:

/*
<script type="importmap">
  { "imports": { "@supabase/supabase-js": "https://esm.sh/@supabase/supabase-js@2" } }
</script>
*/

// ── STEP 2: Wire your LOGIN form ────────────────────────────
// In your login page, find the SIGN IN button and replace its
// handler with this script tag at the bottom of <body>:

/*
<script type="module">
  import { loginUser, redirectIfLoggedIn } from './auth.js'

  // Redirect if already logged in
  await redirectIfLoggedIn()

  document.querySelector('#loginForm').addEventListener('submit', async (e) => {
    e.preventDefault()
    const email    = document.querySelector('#loginEmail').value
    const password = document.querySelector('#loginPassword').value

    const btn = document.querySelector('#loginBtn')
    btn.textContent = 'Signing in...'
    btn.disabled = true

    const { data, error } = await loginUser({ email, password })

    if (error) {
      alert('Login failed: ' + error.message)
      btn.textContent = 'SIGN IN'
      btn.disabled = false
      return
    }

    window.location.href = 'dashboard.html'
  })
</script>
*/

// ── STEP 3: Wire your REGISTER form ─────────────────────────

/*
<script type="module">
  import { registerUser } from './auth.js'

  document.querySelector('#registerForm').addEventListener('submit', async (e) => {
    e.preventDefault()
    const fullName   = document.querySelector('#regName').value
    const email      = document.querySelector('#regEmail').value
    const password   = document.querySelector('#regPassword').value
    const role       = document.querySelector('#regRole').value
    const department = document.querySelector('#regDept').value

    const { data, error } = await registerUser({ fullName, email, password, role, department })

    if (error) {
      alert('Registration failed: ' + error.message)
      return
    }

    alert('Account created! Check your email to confirm then log in.')
  })
</script>
*/

// ── STEP 4: Protect dashboard pages ─────────────────────────
// Add to the TOP of any page that requires login:

/*
<script type="module">
  import { requireAuth } from './auth.js'

  const { user, profile } = await requireAuth()
  // If not logged in, requireAuth() redirects to index.html automatically

  // Populate the user's name in the sidebar
  document.querySelector('#userNameDisplay').textContent = profile.full_name
  document.querySelector('#userRoleDisplay').textContent = profile.role

  // Show/hide manager-only sections based on role
  if (profile.role === 'employee') {
    document.querySelector('#managerSection')?.classList.add('hidden')
  }
</script>
*/

// ── STEP 5: Wire your LEAVE FORM submit ─────────────────────

/*
<script type="module">
  import { submitLeave, calcWorkingDays } from './leave.js'

  // Auto-calculate working days when dates change
  document.querySelector('#startDate').addEventListener('change', updateDays)
  document.querySelector('#endDate').addEventListener('change', updateDays)

  function updateDays() {
    const start = document.querySelector('#startDate').value
    const end   = document.querySelector('#endDate').value
    if (start && end) {
      const days = calcWorkingDays(start, end)
      document.querySelector('#workingDays').value = days
    }
  }

  document.querySelector('#leaveForm').addEventListener('submit', async (e) => {
    e.preventDefault()

    const { data, error } = await submitLeave({
      leaveType:   document.querySelector('#leaveType').value,
      startDate:   document.querySelector('#startDate').value,
      endDate:     document.querySelector('#endDate').value,
      workingDays: parseInt(document.querySelector('#workingDays').value),
      reason:      document.querySelector('#reason').value
    })

    if (error) {
      alert('Submission failed: ' + error.message)
      return
    }

    alert('Leave application submitted successfully!')
    // Reload applications list
    loadMyLeaves()
  })
</script>
*/

// ── STEP 6: Load applications on dashboard ───────────────────

/*
<script type="module">
  import { getMyLeaves } from './leave.js'

  async function loadMyLeaves() {
    const leaves = await getMyLeaves()
    const tbody  = document.querySelector('#applicationsTable tbody')
    tbody.innerHTML = ''

    leaves.forEach(leave => {
      const statusColor = {
        pending:   '#BA7517',
        approved:  '#0F6E56',
        rejected:  '#993C1D',
        cancelled: '#5F5E5A'
      }[leave.status] || '#333'

      tbody.innerHTML += `
        <tr>
          <td>${leave.id.slice(0,8).toUpperCase()}</td>
          <td>${leave.leave_type}</td>
          <td>${leave.start_date}</td>
          <td>${leave.working_days}</td>
          <td style="color:${statusColor};font-weight:500">${leave.status.toUpperCase()}</td>
          <td>
            ${leave.status === 'pending'
              ? `<button onclick="cancelLeave('${leave.id}')">Cancel</button>`
              : '—'}
          </td>
        </tr>`
    })
  }

  loadMyLeaves()
</script>
*/

// ── STEP 7: Logout button ────────────────────────────────────

/*
<script type="module">
  import { logoutUser } from './auth.js'
  document.querySelector('#logoutBtn').addEventListener('click', logoutUser)
</script>
*/
