// ============================================================
// supabase-config.js
// Add this file to your project root (same folder as index.html)
// ============================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = 'https://tlnomboqhglhbyyxdgwo.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRsbm9tYm9xaGdsaGJ5eXhkZ3dvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MzQwNjIsImV4cCI6MjA5NTQxMDA2Mn0.Eo7we1Qz00mNZ8NJmaDc0qzFwFxoY6KxNntdz-bTGJM'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
