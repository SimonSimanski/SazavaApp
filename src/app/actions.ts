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

  const { error } = await supabase.from('farts_log').insert([
    {
      user_id: user.id,
      intensity: dbIntensity
    }
  ])

  if (error) {
    console.error("Fart log error:", error)
    throw new Error('Failed to log fart: ' + error.message)
  }

  revalidatePath('/')
}

export async function logPoop(bristolType: number) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  const { error } = await supabase.from('poops_log').insert([
    {
      user_id: user.id,
      bristol_scale: bristolType
    }
  ])

  if (error) {
    console.error("Poop log error:", error)
    throw new Error('Failed to log poop: ' + error.message)
  }

  revalidatePath('/')
}
