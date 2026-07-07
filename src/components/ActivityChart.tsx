"use client";

import { TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

export interface ChartUser {
  id: string;
  name: string;
  isCurrentUser: boolean;
}

interface ActivityChartProps {
  data: any[];
  users: ChartUser[];
  chartTitle?: string;
}

// Pirátská paleta pro různé uživatele (bez aktuálního uživatele, ten má primární barvu)
const COLORS = ["#D4AF37", "#C0C0C0", "#CD7F32", "#8B4513", "#53634F", "#38656A"];

export default function ActivityChart({ data, users, chartTitle = "POSLEDNÍCH 7 DNÍ" }: ActivityChartProps) {
  
  // Nalezení maximální hodnoty pro lepší osu Y
  let maxValue = 0;
  data.forEach(day => {
    users.forEach(u => {
      if (day[u.id] > maxValue) maxValue = day[u.id];
    });
  });

  // Custom Tooltip pro lepší pirátský design
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      // Sort payload to show highest count first
      const sortedPayload = [...payload].sort((a, b) => b.value - a.value);
      
      return (
        <div className="bg-surface-container-high border-2 border-outline shadow-[4px_4px_0px_0px_rgba(115,121,111,0.5)] p-3 rounded-lg z-50">
          <p className="font-label-mono text-label-mono text-outline uppercase border-b-2 border-outline-variant pb-1 mb-2">
            {label}
          </p>
          {sortedPayload.map((entry: any, index: number) => {
            // Ignorujeme nuly v tooltipech, ať to není přecpané, pokud nikdo neprdnul
            if (entry.value === 0) return null;
            return (
              <div key={index} className="flex items-center justify-between gap-4 font-body-sm text-on-surface">
                <span style={{ color: entry.color, fontWeight: entry.dataKey === users.find(u => u.isCurrentUser)?.id ? "bold" : "normal" }}>
                  {entry.name}
                </span>
                <span className="font-bold">{entry.value}</span>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <section className="flex flex-col gap-stack-gap mt-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="font-headline-sm text-headline-sm text-primary flex items-center gap-2">
          <TrendingUp className="w-6 h-6" />
          Aktivita pirátů
        </h3>
      </div>

      <div className="paper-card rounded-xl p-4 flex flex-col gap-4">
        <div className="font-label-mono text-label-mono text-outline uppercase">{chartTitle}</div>

        <div className="h-[250px] w-full relative mt-2 z-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              {/* Pirátská mřížka (jako mapa) */}
              <CartesianGrid strokeDasharray="5 5" stroke="#73796F" strokeOpacity={0.3} vertical={false} />
              
              <XAxis 
                dataKey="dayName" 
                tick={{ fill: "#444742", fontSize: 10, fontFamily: "monospace", fontWeight: "bold" }} 
                axisLine={{ stroke: "#73796F", strokeWidth: 2 }}
                tickLine={{ stroke: "#73796F", strokeWidth: 2 }}
              />
              
              <YAxis 
                allowDecimals={false}
                domain={[0, Math.max(maxValue, 5)]} // Minimálně do 5 pro lepší vzhled na začátku
                tick={{ fill: "#444742", fontSize: 10, fontFamily: "monospace" }} 
                axisLine={false}
                tickLine={false}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              {/* Projdeme uživatele a nakreslíme čáru pro každého */}
              {users.map((u, index) => {
                const isMe = u.isCurrentUser;
                // Barva: Já = zelená primární, ostatní ze seznamu barev
                const color = isMe ? "#006E1C" : COLORS[index % COLORS.length];
                
                return (
                  <Line
                    key={u.id}
                    type="monotone"
                    dataKey={u.id}
                    name={isMe ? "Ty (Já)" : u.name}
                    stroke={color}
                    strokeWidth={isMe ? 4 : 2}
                    dot={{ r: isMe ? 5 : 3, fill: color, strokeWidth: 2, stroke: "#FFF" }}
                    activeDot={{ r: isMe ? 8 : 6 }}
                    isAnimationActive={true}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
