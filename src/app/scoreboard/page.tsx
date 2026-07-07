import { createClient } from "@/utils/supabase/server";
import { Medal, Flame, Skull, Tornado } from "lucide-react";
import ScoreboardList, { ScoreboardItem } from "@/components/ScoreboardList";
import ActivityChart from "@/components/ActivityChart";
import WeekFilter from "@/components/WeekFilter";
import { redirect } from "next/navigation";

export const revalidate = 0; // Vždy fetchnout nová data

interface ScoreboardProps {
  searchParams: Promise<{ week?: string }>;
}

export default async function Scoreboard({ searchParams }: ScoreboardProps) {
  // Await searchParams in Next.js 15+ (if applicable, but safe to do always or access directly if sync in older Next)
  const week = (await searchParams).week || "all";
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch all profiles
  const { data: profiles } = await supabase.from("profiles").select("*");
  // Fetch all farts
  let { data: farts } = await supabase.from("farts_log").select("*");

  if (!profiles || !farts) {
    return (
      <div className="p-8 text-center text-on-surface font-body-md">
        Nepodařilo se načíst data z databáze.
      </div>
    );
  }

  // Define date ranges
  const campStart = new Date(2026, 6, 18); // 18.7.2026
  const week2Start = new Date(2026, 6, 25); // 25.7.2026
  const campEnd = new Date(2026, 7, 1); // 1.8.2026
  campEnd.setHours(23, 59, 59, 999);

  let filterStart = campStart;
  let filterEnd = campEnd;
  let chartDays = 15;
  let chartTitle = "CELÝ TÁBOR (TOP 5 + TY)";

  if (week === "1") {
    filterEnd = new Date(2026, 6, 24, 23, 59, 59, 999);
    chartDays = 7;
    chartTitle = "PRVNÍ TÝDEN (TOP 5 + TY)";
  } else if (week === "2") {
    filterStart = week2Start;
    chartDays = 8; // 25th to 1st is 8 days
    chartTitle = "DRUHÝ TÝDEN (TOP 5 + TY)";
  }

  // Filter farts for leaderboard based on selected week
  farts = farts.filter(f => {
    const d = new Date(f.created_at);
    return d >= filterStart && d <= filterEnd;
  });

  // --- LEADERBOARD LOGIC ---
  const fartCounts: Record<string, number> = {};
  farts.forEach((fart) => {
    fartCounts[fart.user_id] = (fartCounts[fart.user_id] || 0) + 1;
  });

  const allItems: ScoreboardItem[] = profiles.map((p) => {
    const name = p.username || "Neznámý Pirát";
    const initials = name.substring(0, 2).toUpperCase();
    return {
      rank: 0, // will set later
      username: name,
      count: fartCounts[p.id] || 0,
      isCurrentUser: p.id === user.id,
      initials,
      _userId: p.id,
      isOverloaded: false,
    };
  }).sort((a, b) => b.count - a.count);

  // Assign ranks
  allItems.forEach((item, index) => {
    item.rank = index + 1;
  });

  // Top 5
  const top5 = allItems.slice(0, 5);
  
  // Find current user if not in top 5
  const myItem = allItems.find(i => i.isCurrentUser);
  if (myItem && myItem.rank > 5) {
    top5.push(myItem);
  }

  // --- CHART LOGIC ---
  const dailyData: any[] = [];
  const dayNames = ["NE", "PO", "ÚT", "ST", "ČT", "PÁ", "SO"];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < chartDays; i++) {
    const d = new Date(filterStart);
    d.setDate(filterStart.getDate() + i);
    
    const nextDay = new Date(d);
    nextDay.setDate(d.getDate() + 1);

    const dateStr = d.toISOString().split('T')[0];
    const dayName = dayNames[d.getDay()];

    const isToday = d.getTime() === today.getTime();

    // Count farts in this day window
    const dayFarts = farts.filter(f => {
      const fDate = new Date(f.created_at);
      return fDate >= d && fDate < nextDay;
    });

    const dayObj: any = {
      dateStr,
      dayName,
      isToday,
    };

    // Calculate count for each user in top5
    top5.forEach(userItem => {
      const uCount = dayFarts.filter(f => f.user_id === userItem._userId).length;
      dayObj[userItem._userId!] = uCount;
      if (uCount > 14) {
        userItem.isOverloaded = true;
      }
    });

    dailyData.push(dayObj);
  }

  // Pass chart users meta to the client component so it knows what lines to draw
  const chartUsers = top5.map(u => ({
    id: u._userId!,
    name: u.username,
    isCurrentUser: u.isCurrentUser
  }));

  return (
    <main className="flex-grow flex flex-col gap-section-padding overflow-x-hidden mb-24">
      {/* Page Title */}
      <div className="text-center mt-4 mb-2 paper-card p-4 rounded-xl rotate-1 mx-2">
        <h2 className="font-display-lg text-display-lg text-on-surface burned-text flex items-center justify-center gap-2">
          <Medal className="w-8 h-8 text-tertiary-container" fill="currentColor" />
          Prdník Pirátů
          <Medal className="w-8 h-8 text-tertiary-container" fill="currentColor" />
        </h2>
        <p className="font-label-mono text-label-mono text-outline mt-2">KDO JE HRABĚ KÁKULA?</p>
      </div>

      <WeekFilter />

      <ScoreboardList items={top5} />
      <ActivityChart data={dailyData} users={chartUsers} chartTitle={chartTitle} />

      {/* Decorative Elements */}
      <div className="flex justify-center mt-6 opacity-30 gap-6">
        <Flame className="w-10 h-10 text-on-surface rotate-12" />
        <Skull className="w-12 h-12 text-on-surface -rotate-12" />
        <Tornado className="w-10 h-10 text-on-surface rotate-6" />
      </div>
    </main>
  );
}
