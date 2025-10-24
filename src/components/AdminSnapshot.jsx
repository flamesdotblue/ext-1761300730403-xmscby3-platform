import React from 'react';
import { Gauge, Settings, TrendingUp, Timer, PackageOpen } from 'lucide-react';

export default function AdminSnapshot() {
  return (
    <div className="w-full">
      <div className="rounded-2xl border shadow-sm bg-white overflow-hidden">
        <div className="px-5 py-4 border-b flex items-center gap-2">
          <Settings className="h-4 w-4 text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-900">Admin Snapshot (Read-only)</h3>
        </div>
        <div className="p-5 grid grid-cols-1 gap-5">
          <div className="rounded-xl border bg-gradient-to-br from-gray-50 to-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-500">Head-start Configuration</div>
                <div className="mt-1 text-sm text-gray-800">Gold tier early access: 60 minutes</div>
                <div className="text-xs text-gray-500">Gold-only leads visible to Silver riders after 11:30 AM</div>
              </div>
              <Timer className="h-5 w-5 text-blue-600" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <StatCard icon={TrendingUp} label="Gold pickup %" value="72%" sub="Last 7 days" />
            <StatCard icon={PackageOpen} label="Auto-released leads" value="38" sub="24h" />
            <StatCard icon={Gauge} label="Avg bundle size" value="2.3" sub="Week to date" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
          <div className="mt-1 text-xl font-semibold text-gray-900">{value}</div>
          <div className="text-xs text-gray-500">{sub}</div>
        </div>
        <Icon className="h-5 w-5 text-blue-600" />
      </div>
    </div>
  );
}
