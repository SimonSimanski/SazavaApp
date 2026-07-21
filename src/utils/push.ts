import webpush from 'web-push'
import { createAdminClient } from '@/utils/supabase/admin'

let configured = false

function ensureConfigured() {
  if (configured) return
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const privateKey = process.env.VAPID_PRIVATE_KEY
  const subject = process.env.VAPID_SUBJECT || 'mailto:admin@example.com'

  if (!publicKey || !privateKey) {
    throw new Error('Chybí VAPID klíče (NEXT_PUBLIC_VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY)')
  }

  webpush.setVapidDetails(subject, publicKey, privateKey)
  configured = true
}

export interface PushPayload {
  title: string
  body: string
  url?: string
}

/**
 * Rozešle notifikaci všem uloženým odběrům.
 * @param payload obsah notifikace
 * @param exceptUserId nepovinné – tomuto uživateli se notifikace nepošle (např. autor akce)
 */
export async function sendPushToAll(payload: PushPayload, exceptUserId?: string) {
  ensureConfigured()

  const supabase = createAdminClient()

  let query = supabase.from('push_subscriptions').select('id, user_id, subscription')
  if (exceptUserId) {
    query = query.neq('user_id', exceptUserId)
  }

  const { data: subs, error } = await query
  if (error) {
    console.error('Nepodařilo se načíst push odběry:', error.message)
    return { sent: 0, failed: 0 }
  }
  if (!subs || subs.length === 0) {
    return { sent: 0, failed: 0 }
  }

  const body = JSON.stringify(payload)
  const deadIds: string[] = []
  let sent = 0
  let failed = 0

  await Promise.all(
    subs.map(async (row) => {
      try {
        await webpush.sendNotification(row.subscription as webpush.PushSubscription, body)
        sent++
      } catch (err: unknown) {
        failed++
        const statusCode = (err as { statusCode?: number })?.statusCode
        // 404/410 = odběr už neplatí -> smazat
        if (statusCode === 404 || statusCode === 410) {
          deadIds.push(row.id)
        } else {
          console.error('Push se nepodařilo odeslat:', err)
        }
      }
    })
  )

  if (deadIds.length > 0) {
    await supabase.from('push_subscriptions').delete().in('id', deadIds)
  }

  return { sent, failed }
}
