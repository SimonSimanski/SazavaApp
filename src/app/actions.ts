'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function logFart(intensity: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  // Mapování z našeho UI na povolené hodnoty v databázi (low, medium, nuclear)
  const dbIntensity = intensity === 'tichacek' ? 'low' : 'nuclear'

  const { data, error } = await supabase.from('farts_log').insert([
    {
      user_id: user.id,
      intensity: dbIntensity
    }
  ]).select().single()

  if (error) {
    console.error("Fart log error:", error)
    throw new Error('Failed to log fart: ' + error.message)
  }

  return { id: data.id, createdAt: data.created_at, intensity: data.intensity }
}

export async function logPoop(bristolType: number) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase.from('poops_log').insert([
    {
      user_id: user.id,
      bristol_scale: bristolType
    }
  ]).select().single()

  if (error) {
    console.error("Poop log error:", error)
    throw new Error('Failed to log poop: ' + error.message)
  }

  return { id: data.id, createdAt: data.created_at, bristolScale: data.bristol_scale }
}

export async function undoEvent(id: string, type: 'fart' | 'poop') {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  const table = type === 'fart' ? 'farts_log' : 'poops_log'

  // Create an admin client to bypass RLS in case there is no DELETE policy
  const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabaseAdmin
    .from(table)
    .delete()
    .eq('id', id)
    .eq('user_id', user.id) // Ensure users can only delete their own records

  if (error) {
    console.error("Undo error:", error)
    throw new Error('Failed to undo event: ' + error.message)
  }
}
