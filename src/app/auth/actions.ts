'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // Supabase auth requires email. We will map username to a dummy email for this simple app
  // or expect the user to provide an email. The design asks for "Jméno piráta" (Username).
  // We will append a domain if it doesn't look like an email.
  let email = formData.get('email') as string
  if (!email.includes('@')) {
    email = `${email.toLowerCase().replace(/[^a-z0-9]/g, '')}@camp-prdnik.local`
  }
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error("Login error:", error)
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  // Zajistíme, že uživatel má profil (pokud ho uživatel vytvořil ručně v Dashboardu)
  const username = email.split('@')[0];
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from('profiles').upsert([
      { id: user.id, username: username }
    ], { onConflict: 'id' });
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // Dynamic import or require for admin client to avoid issues
  const { createAdminClient } = await import('@/utils/supabase/admin')
  const supabaseAdmin = createAdminClient()

  const username = formData.get('username') as string
  let email = formData.get('email') as string
  
  if (!email) {
      email = `${username.toLowerCase().replace(/[^a-z0-9]/g, '')}@camp-prdnik.local`
  }

  const password = formData.get('password') as string

  // Vytvoření uživatele přes Admin API s email_confirm: true (obejde všechny restrikce)
  const { data: adminData, error: adminError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { username: username }
  })

  if (adminError) {
    console.error("Admin Signup error:", adminError)
    redirect(`/register?error=${encodeURIComponent(adminError.message)}`)
  }
  
  // Vytvoříme záznam v tabulce profiles
  if (adminData.user) {
    await supabaseAdmin.from('profiles').upsert([
        { id: adminData.user.id, username: username }
    ], { onConflict: 'id' });
  }

  // Nyní, když je uživatel vytvořen a ověřen, přihlásíme ho normálně přes klienta,
  // aby Next.js nastavil cookies pro relaci prohlížeče.
  const { error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (loginError) {
    console.error("Auto-login po registraci selhal:", loginError)
    redirect(`/login?error=${encodeURIComponent('Účet vytvořen, ale přihlášení selhalo. Zkus to ručně.')}`)
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
