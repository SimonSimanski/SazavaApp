'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { sendPushToAll } from '@/utils/push'

// Popisky velikostí (musí odpovídat výběru v DashboardClient)
const BRISTOL_LABELS: Record<number, string> = {
  7: 'Rozprašovač',
  1: 'Mini bobík',
  2: 'Hrudkovitý klobásek',
  3: 'Klasický jezevčík',
  4: 'Hladké torpédo',
  5: 'Hrabě Kákula (největší)',
}

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

  // Rozeslat notifikaci o Velké akci všem ostatním (chyba pushe nesmí shodit zápis)
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single()

    const name = profile?.username || 'Neznámý Pirát'
    const label = BRISTOL_LABELS[bristolType] || `Bristol ${bristolType}`

    await sendPushToAll(
      {
        title: '💩 Velká akce v táboře!',
        body: `${name} právě zvládl: ${label} (Bristol ${bristolType})`,
        url: '/',
      },
      user.id, // autorovi akce notifikaci neposílat
    )
  } catch (pushErr) {
    console.error('Push notifikace se nepodařila:', pushErr)
  }

  return { id: data.id, createdAt: data.created_at, bristolScale: data.bristol_scale }
}

export async function subscribeToPush(subscription: {
  endpoint: string
  keys: { p256dh: string; auth: string }
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  const { error } = await supabase
    .from('push_subscriptions')
    .upsert(
      {
        user_id: user.id,
        endpoint: subscription.endpoint,
        subscription: subscription,
      },
      { onConflict: 'endpoint' },
    )

  if (error) {
    console.error('Subscribe error:', error)
    throw new Error('Failed to save push subscription: ' + error.message)
  }

  return { ok: true }
}

export async function unsubscribeFromPush(endpoint: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  const { error } = await supabase
    .from('push_subscriptions')
    .delete()
    .eq('endpoint', endpoint)
    .eq('user_id', user.id)

  if (error) {
    console.error('Unsubscribe error:', error)
    throw new Error('Failed to remove push subscription: ' + error.message)
  }

  return { ok: true }
}

export async function saveGameScore(score: number) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  // Ochrana proti nesmyslným hodnotám
  const safeScore = Math.max(0, Math.min(100000, Math.floor(Number(score) || 0)))

  const { data, error } = await supabase.from('game_scores').insert([
    {
      user_id: user.id,
      score: safeScore
    }
  ]).select().single()

  if (error) {
    console.error("Game score error:", error)
    throw new Error('Failed to save game score: ' + error.message)
  }

  return { id: data.id, score: data.score, createdAt: data.created_at }
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
