import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';

export default function StatCard({
  label,
  value,
  trend,
  trendDirection = 'up',
  icon: Icon,
  accentColor = '#7656E8',
  softBg = '#F0EBFF',
  sparkData = [],
  demoCaption = 'Demo metric',
}) {
  const isPositive = trendDirection === 'up';

  return (
    <div className="forensic-card p-5 flex flex-col justify-between gap-4">
      <div className="flex items-start justify-between gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: softBg, color: accentColor }}
        >
          <Icon className="w-5 h-5" aria-hidden="true" />
        </div>
        <div
          className={`inline-flex items-center gap-1 text-xs font-medium tabular-nums ${
            isPositive ? 'text-[#22B981]' : 'text-[#367FEA]'
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5" aria-hidden="true" />
          )}
          <span>{trend}</span>
        </div>
      </div>

      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="text-2xl sm:text-[28px] font-bold tracking-tight text-[#172554] tabular-nums leading-none">
            {value}
          </div>
          <div className="mt-1.5 text-[13px] font-medium text-[#64748B] truncate">
            {label}
          </div>
          <div className="mt-0.5 text-[11px] text-[#94A3B8]">{demoCaption}</div>
        </div>

        {sparkData.length > 0 && (
          <div className="w-20 h-11 shrink-0" aria-hidden="true">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData}>
                <defs>
                  <linearGradient id={`spark-${label.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={accentColor} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={accentColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke={accentColor}
                  strokeWidth={2}
                  fill={`url(#spark-${label.replace(/\s+/g, '')})`}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
