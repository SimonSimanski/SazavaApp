import { createClient } from '@/utils/supabase/server'
import DashboardClient from '@/components/DashboardClient'

export default async function Home() {
  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  let fartCount = 0
  let poopCount = 0
  let campStatusText = ""

  // Camp dates
  const now = new Date()
  // Note: month is 0-indexed in Date constructor (6 = July, 7 = August)
  const campStart = new Date(2026, 6, 18)
  const campEnd = new Date(2026, 7, 1)
  campEnd.setHours(23, 59, 59, 999)

  if (now < campStart) {
    const diffTime = Math.abs(campStart.getTime() - now.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    campStatusText = `Zbývá ${diffDays} dní do tábora!`
  } else if (now >= campStart && now <= campEnd) {
    const diffTime = Math.abs(now.getTime() - campStart.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1
    campStatusText = `Den ${diffDays} z 15`
  } else {
    campStatusText = "Tábor skončil"
  }

  let latestEvents: any[] = []

  if (user) {
    // Get today's start and end dates
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Fetch farts count for today
    const { count: fCount, error: fError } = await supabase
      .from('farts_log')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', today.toISOString())
      .lt('created_at', tomorrow.toISOString())

    if (!fError && fCount !== null) fartCount = fCount

    // Fetch poops count for today
    const { count: pCount, error: pError } = await supabase
      .from('poops_log')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', today.toISOString())
      .lt('created_at', tomorrow.toISOString())

    if (!pError && pCount !== null) poopCount = pCount

    // Fetch latest 50 farts for local undo buffer
    const { data: latestFarts } = await supabase
      .from('farts_log')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    // Fetch latest 50 poops for local undo buffer
    const { data: latestPoops } = await supabase
      .from('poops_log')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    const farts = (latestFarts || []).map((f) => ({
      id: f.id,
      type: 'fart',
      createdAt: f.created_at,
      intensity: f.intensity
    }))

    const poops = (latestPoops || []).map((p) => ({
      id: p.id,
      type: 'poop',
      createdAt: p.created_at,
      bristolScale: p.bristol_scale
    }))

    // Merge and sort
    latestEvents = [...farts, ...poops]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 50)
  }

  return <DashboardClient initialFartCount={fartCount} initialPoopCount={poopCount} campStatusText={campStatusText} initialLatestEvents={latestEvents} />
}
