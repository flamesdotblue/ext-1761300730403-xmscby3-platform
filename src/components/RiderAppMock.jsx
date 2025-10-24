import React, { useMemo, useState, useEffect } from 'react';
import { MapPin, Filter, ChevronRight, Star, Phone, CheckSquare, Clock, Route, X, Search, Layers, Target, Sparkles, TriangleAlert, Info, User, Flag, Trophy, ChevronDown, ChevronUp, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const phoneW = 375;
const phoneH = 812;

const orderTypes = [
  { id: 'SIM', label: 'SIM' },
  { id: 'MNP', label: 'MNP' },
  { id: 'Self-KYC', label: 'Self-KYC' },
];

const sampleLeads = [
  { id: 'L1', name: 'Arun Kumar', distance: 0.4, type: 'SIM', slot: '10:30-11:30', payout: 55, coords: { x: 60, y: 120 }, priority: false },
  { id: 'L2', name: 'Neha Singh', distance: 0.9, type: 'MNP', slot: '11:00-12:00', payout: 70, coords: { x: 190, y: 180 }, priority: true },
  { id: 'L3', name: 'Ravi Verma', distance: 1.2, type: 'Self-KYC', slot: '11:30-12:30', payout: 85, coords: { x: 280, y: 140 }, priority: false },
  { id: 'L4', name: 'Pooja Shah', distance: 0.6, type: 'SIM', slot: '12:00-13:00', payout: 50, coords: { x: 100, y: 250 }, priority: false },
  { id: 'L5', name: 'Irfan Ali', distance: 1.8, type: 'Self-KYC', slot: '13:00-14:00', payout: 95, coords: { x: 230, y: 300 }, priority: false },
];

export default function RiderAppMock() {
  const [screen, setScreen] = useState('map');
  const [tier, setTier] = useState('Silver');
  const [radius, setRadius] = useState(1);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [slotFilter, setSlotFilter] = useState('ALL');
  const [selected, setSelected] = useState([]);
  const [bundleOpen, setBundleOpen] = useState(false);
  const [bundleOrders, setBundleOrders] = useState([]);
  const [toast, setToast] = useState(null);
  const [leaderTab, setLeaderTab] = useState('City');
  const [showTierBenefits, setShowTierBenefits] = useState(false);
  const [riderPos, setRiderPos] = useState({ x: 160, y: 360 });
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 'N1', text: 'Bundle created successfully — confirm pickup in 5 mins.', type: 'success', goto: 'route' },
    { id: 'N2', text: "You’ve been promoted to Gold tier!", type: 'promo', goto: 'leaderboard' },
    { id: 'N3', text: 'Order 2431 auto-released due to inactivity.', type: 'warn', goto: 'map' },
  ]);

  // Simulate GPS ripple
  useEffect(() => {
    const i = setInterval(() => {
      setRiderPos(pos => ({ x: pos.x + (Math.random() - 0.5) * 2, y: pos.y + (Math.random() - 0.5) * 2 }));
    }, 1500);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const isGoldHeadstartActive = useMemo(() => {
    // Simplified: assume head-start until 11:30
    const now = new Date();
    const hrs = now.getHours();
    const mins = now.getMinutes();
    const before1130 = hrs < 11 || (hrs === 11 && mins < 30);
    return before1130;
  }, []);

  const visibleLeads = useMemo(() => {
    return sampleLeads.filter(l => {
      if (l.distance > radius) return false;
      if (typeFilter !== 'ALL' && l.type !== typeFilter) return false;
      if (slotFilter !== 'ALL') {
        const slotPrefix = slotFilter.split(':')[0];
        if (!l.slot.startsWith(slotPrefix)) return false;
      }
      // Hide priority to Silver during head-start
      if (l.priority && tier === 'Silver' && isGoldHeadstartActive) return false;
      return true;
    });
  }, [radius, typeFilter, slotFilter, tier, isGoldHeadstartActive]);

  const goldHiddenNote = useMemo(() => {
    const anyHidden = sampleLeads.some(l => l.priority);
    if (anyHidden && tier === 'Silver' && isGoldHeadstartActive) {
      return 'Gold-only leads hidden until 11:30 AM';
    }
    return '';
  }, [tier, isGoldHeadstartActive]);

  const selectedLeads = useMemo(() => sampleLeads.filter(l => selected.includes(l.id)), [selected]);

  function toggleSelect(id) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function handleBundlePull() {
    if (selectedLeads.length === 0) return;
    setBundleOpen(true);
  }

  function confirmBundle() {
    setBundleOrders(selectedLeads);
    setSelected([]);
    setBundleOpen(false);
    setScreen('route');
    setToast({ type: 'success', text: 'Bundle created successfully.' });
  }

  function releaseOrder(id) {
    const ok = window.confirm('Release this order back to pool?');
    if (!ok) return;
    setBundleOrders(prev => prev.filter(o => o.id !== id));
    setToast({ type: 'warn', text: 'Order released due to inactivity.' });
  }

  function goToNotification(n) {
    setScreen(n.goto);
  }

  return (
    <div className="w-full">
      <div className="rounded-2xl border shadow-sm bg-white overflow-hidden">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-900">Interactive Mobile Prototype</h3>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-600">Tier</span>
            <div className="inline-flex rounded-full border overflow-hidden">
              {['Silver','Gold'].map(t => (
                <button key={t} onClick={() => setTier(t)} className={`px-3 py-1 ${tier===t? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}>{t}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="mx-auto" style={{ width: phoneW }}>
            <PhoneFrame screen={screen} setScreen={setScreen} tier={tier}>
              {screen === 'map' && (
                <MapScreen
                  tier={tier}
                  radius={radius}
                  setRadius={setRadius}
                  typeFilter={typeFilter}
                  setTypeFilter={setTypeFilter}
                  slotFilter={slotFilter}
                  setSlotFilter={setSlotFilter}
                  leads={visibleLeads}
                  allLeads={sampleLeads}
                  goldHiddenNote={goldHiddenNote}
                  selected={selected}
                  toggleSelect={toggleSelect}
                  onBundlePull={handleBundlePull}
                  riderPos={riderPos}
                />
              )}
              {screen === 'route' && (
                <RouteScreen
                  orders={bundleOrders}
                  riderPos={riderPos}
                  expandedOrderId={expandedOrderId}
                  setExpandedOrderId={setExpandedOrderId}
                  onRelease={releaseOrder}
                />
              )}
              {screen === 'leaderboard' && (
                <LeaderboardScreen tier={tier} leaderTab={leaderTab} setLeaderTab={setLeaderTab} showTierBenefits={showTierBenefits} setShowTierBenefits={setShowTierBenefits} />
              )}
              {screen === 'notifications' && (
                <NotificationsScreen items={notifications} onOpen={goToNotification} />
              )}
            </PhoneFrame>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {bundleOpen && (
          <BundleModal
            onClose={() => setBundleOpen(false)}
            onConfirm={confirmBundle}
            selected={selectedLeads}
            goldHiddenNote={goldHiddenNote}
            radius={radius}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`fixed bottom-6 right-6 z-50 rounded-lg shadow-lg px-4 py-2 text-sm ${toast.type==='success'?'bg-green-600 text-white': toast.type==='warn'?'bg-yellow-500 text-gray-900':'bg-gray-800 text-white'}`}
          >
            {toast.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PhoneFrame({ children, screen, setScreen, tier }) {
  return (
    <div className="mx-auto rounded-[36px] border bg-gray-50 shadow-inner overflow-hidden" style={{ width: phoneW, height: phoneH }}>
      <div className="h-6 bg-black/80" />
      <div className="h-10 px-4 border-b bg-white flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
          <Sparkles className="h-4 w-4 text-blue-600" /> JHD Rider
        </div>
        <div className="flex items-center gap-3">
          <TierBadge tier={tier} />
          <Bell onClick={() => setScreen('notifications')} className="h-5 w-5 text-gray-700" />
        </div>
      </div>
      <div className="h-[676px] bg-white overflow-hidden">
        <div className="h-full overflow-y-auto no-scrollbar">{children}</div>
      </div>
      <nav className="h-[100px] border-t bg-white flex items-center justify-around">
        <TabButton icon={MapPin} label="Leads" active={screen==='map'} onClick={() => setScreen('map')} />
        <TabButton icon={Route} label="Route" active={screen==='route'} onClick={() => setScreen('route')} />
        <TabButton icon={Trophy} label="Leaderboard" active={screen==='leaderboard'} onClick={() => setScreen('leaderboard')} />
        <TabButton icon={Bell} label="Alerts" active={screen==='notifications'} onClick={() => setScreen('notifications')} />
      </nav>
    </div>
  );
}

function TabButton({ icon: Icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 ${active? 'text-blue-600': 'text-gray-500'} focus:outline-none`}>
      <Icon className="h-5 w-5" />
      <span className="text-[11px]">{label}</span>
    </button>
  );
}

function TierBadge({ tier }) {
  const colors = tier==='Gold' ? 'bg-amber-50 text-amber-700 ring-amber-200' : tier==='Silver' ? 'bg-slate-50 text-slate-700 ring-slate-200' : 'bg-orange-50 text-orange-700 ring-orange-200';
  return (
    <div className={`relative inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] ring-1 ${colors}`}>
      {tier==='Gold' && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-[-2px] rounded-full bg-gradient-to-r from-amber-300/20 via-transparent to-amber-300/20"
        />
      )}
      <Star className="h-3 w-3" fill={tier==='Gold'?'#F59E0B':'none'} />
      <span className="relative z-10 font-semibold">{tier}</span>
    </div>
  );
}

function MapScreen({ tier, radius, setRadius, typeFilter, setTypeFilter, slotFilter, setSlotFilter, leads, allLeads, goldHiddenNote, selected, toggleSelect, onBundlePull, riderPos }) {
  const noLeads = leads.length === 0;
  return (
    <div className="h-full flex flex-col">
      <div className="px-4 pt-3 pb-2 border-b bg-white">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 rounded-xl border px-3 py-2">
            <Search className="h-4 w-4 text-gray-500" />
            <input className="w-full text-sm outline-none" placeholder="Search or filter leads" />
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm"><Filter className="h-4 w-4" /> Filters</button>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
          <Dropdown label={`Radius: ${radius}km`} options={[0.5,1,2]} onSelect={setRadius} display={(v)=>`${v}km`} />
          <Dropdown label={typeFilter==='ALL'? 'Order Type' : typeFilter} options={['ALL', ...orderTypes.map(o=>o.id)]} onSelect={setTypeFilter} />
          <Dropdown label={slotFilter==='ALL'? 'Slot' : slotFilter} options={['ALL','10:','11:','12:','13:']} onSelect={setSlotFilter} />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <button className="inline-flex items-center gap-2 text-sm font-medium text-blue-700"><Target className="h-4 w-4" /> Get More Leads</button>
          <div className="text-[11px] text-gray-500">Tier: {tier}</div>
        </div>
      </div>

      <div className="relative flex-1 bg-[url('https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1200&auto=format&fit=crop')] bg-cover">
        <div className="absolute inset-0 bg-white/10" />
        <div className="absolute inset-0">
          {/* Rider dot */}
          <div className="absolute" style={{ left: riderPos.x, top: riderPos.y }}>
            <div className="h-3 w-3 rounded-full bg-blue-600 ring-4 ring-blue-200" />
          </div>
          {/* Lead markers */}
          {allLeads.map(lead => {
            const hiddenGold = lead.priority && tier==='Silver';
            const shown = leads.some(l => l.id === lead.id);
            if (!shown && !hiddenGold) return null;
            const isSelected = selected.includes(lead.id);
            const color = lead.priority ? 'bg-amber-500' : 'bg-blue-600';
            const ring = isSelected ? 'ring-4 ring-emerald-300' : 'ring-2 ring-white';
            return (
              <button key={lead.id} onClick={() => toggleSelect(lead.id)} className={`absolute rounded-full shadow ${ring}`} style={{ left: lead.coords.x, top: lead.coords.y }}>
                <div className={`h-5 w-5 ${color} rounded-full flex items-center justify-center`}>{lead.priority ? <Star className="h-3 w-3 text-white" /> : <MapPin className="h-3 w-3 text-white" />}</div>
              </button>
            );
          })}
          {/* Loading/empty state */}
          {noLeads && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-lg bg-white/90 px-4 py-2 text-sm text-gray-700 border">No data yet — start completing orders!</div>
            </div>
          )}
        </div>
        {/* Bottom sliding list */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="rounded-t-2xl bg-white border-t shadow-lg p-3 max-h-[50vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-800">Nearby Leads</div>
              {goldHiddenNote && (
                <div className="inline-flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-1"><Info className="h-3 w-3" /> {goldHiddenNote}</div>
              )}
            </div>
            <div className="space-y-2">
              {leads.map(lead => (
                <label key={lead.id} className="flex items-center justify-between rounded-xl border p-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={selected.includes(lead.id)} onChange={() => toggleSelect(lead.id)} className="accent-blue-600" />
                      <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                      {lead.priority && <span className="inline-flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5"><Star className="h-3 w-3" /> Gold</span>}
                    </div>
                    <div className="mt-1 text-[11px] text-gray-600">{lead.distance} km • {lead.type} • Slot {lead.slot}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Payout</div>
                    <div className="text-sm font-semibold text-gray-900">₹{lead.payout}</div>
                  </div>
                </label>
              ))}
              {leads.length===0 && (
                <div className="text-center text-xs text-gray-500 py-6">Fetching nearby leads…</div>
              )}
            </div>
          </div>
        </div>
        {/* Floating bundle button */}
        <div className="absolute right-3 bottom-[52%]">
          <button onClick={onBundlePull} className="inline-flex items-center gap-2 rounded-full bg-blue-600 text-white shadow-lg px-4 py-2 text-sm">
            <CheckSquare className="h-4 w-4" /> Bundle & Pull
          </button>
        </div>
      </div>
    </div>
  );
}

function Dropdown({ label, options, onSelect, display }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(v=>!v)} className="w-full inline-flex items-center justify-between rounded-lg border px-3 py-2 bg-white">
        <span className="truncate">{label}</span>
        <ChevronDown className="h-4 w-4 text-gray-500" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="absolute z-20 mt-1 w-full rounded-lg border bg-white shadow">
            {options.map((opt) => (
              <button key={String(opt)} onClick={() => { onSelect(opt); setOpen(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50">
                {display? display(opt) : String(opt)}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BundleModal({ onClose, onConfirm, selected, goldHiddenNote, radius }) {
  const total = selected.length;
  const estExtra = total>0 ? Math.round(total * 6) : 0;
  return (
    <motion.div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} className="w-full max-w-sm rounded-2xl bg-white shadow-xl overflow-hidden">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-900">{total} nearby orders within {radius} km</div>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-4 space-y-3 max-h-[50vh] overflow-y-auto">
          {selected.map((s) => (
            <div key={s.id} className="flex items-center justify-between rounded-xl border p-3">
              <div>
                <div className="text-sm font-medium text-gray-900">{s.name}</div>
                <div className="text-[11px] text-gray-600">{s.distance} km • {s.type} • Slot {s.slot}</div>
              </div>
              <div className="text-xs font-medium text-gray-800">₹{s.payout}</div>
            </div>
          ))}
          {selected.length === 0 && (
            <div className="text-center text-xs text-gray-500 py-4">No orders selected.</div>
          )}
          <div className="rounded-xl bg-gray-50 border p-3 text-[12px] text-gray-700 flex items-center justify-between">
            <div>Totals: {total} • Est extra time: +{estExtra} mins</div>
            {goldHiddenNote && <div className="inline-flex items-center gap-1 text-amber-700"><TriangleAlert className="h-3 w-3" /> {goldHiddenNote}</div>}
          </div>
        </div>
        <div className="px-4 py-3 border-t flex items-center justify-between">
          <button className="text-sm px-4 py-2 rounded-lg border">View Route</button>
          <button onClick={onConfirm} className="text-sm px-4 py-2 rounded-lg bg-blue-600 text-white">Bundle & Pull</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function RouteScreen({ orders, riderPos, expandedOrderId, setExpandedOrderId, onRelease }) {
  const estTime = orders.length>0 ? Math.max(30, Math.round(orders.length * 20)) : 0;
  const distance = orders.length>0 ? (orders.reduce((acc,o)=>acc+o.distance,0)).toFixed(1) : 0;
  const selfKycCount = orders.filter(o => o.type==='Self-KYC').length;
  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b bg-white flex items-center justify-between">
        <div className="text-sm font-semibold text-gray-900">Your Bundle ({orders.length} Orders)</div>
        <div className="text-[11px] text-gray-600">Est. Time: {estTime} mins • Distance: {distance} km</div>
      </div>
      <div className="relative h-[48%] bg-[url('https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1200&auto=format&fit=crop')] bg-cover">
        <div className="absolute inset-0 bg-white/10" />
        {/* Rider */}
        <div className="absolute" style={{ left: riderPos.x, top: riderPos.y }}>
          <div className="h-3 w-3 rounded-full bg-blue-600 ring-4 ring-blue-200" />
        </div>
        {/* Orders as numbered markers */}
        {orders.map((o, idx) => (
          <button key={o.id} onClick={() => setExpandedOrderId(o.id)} className="absolute -translate-x-1/2 -translate-y-1/2">
            <div className="h-6 w-6 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">{idx+1}</div>
          </button>
        ))}
      </div>
      {selfKycCount>0 && (
        <div className="px-4 py-2 bg-yellow-50 text-yellow-800 text-[12px] border-b flex items-center gap-2"><TriangleAlert className="h-4 w-4" /> {selfKycCount} Self-KYC orders detected — Est onsite time 60 mins.</div>
      )}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {orders.map((o, idx) => (
          <div key={o.id} className={`rounded-xl border p-3 ${expandedOrderId===o.id? 'ring-2 ring-blue-200' : ''}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">{idx+1}</div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{o.name}</div>
                  <div className="text-[11px] text-gray-600">ETA {Math.max(5, Math.round(o.distance*12))} mins • Slot {o.slot} • {o.type}</div>
                </div>
              </div>
              <button className="inline-flex items-center gap-1 text-blue-700 text-sm"><Phone className="h-4 w-4" /> Call</button>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <button className="px-3 py-1.5 text-sm rounded-lg bg-blue-600 text-white">Start Trip</button>
              <button onClick={() => onRelease(o.id)} className="px-3 py-1.5 text-sm rounded-lg border">Release Order</button>
            </div>
          </div>
        ))}
        {orders.length===0 && (
          <div className="text-center text-xs text-gray-500 py-10">No active bundle. Go to Leads to create one.</div>
        )}
      </div>
    </div>
  );
}

function LeaderboardScreen({ tier, leaderTab, setLeaderTab, showTierBenefits, setShowTierBenefits }) {
  const riders = [
    { id: 'R1', name: 'You', points: 580, completion: 94 },
    { id: 'R2', name: 'Harsh', points: 540, completion: 91 },
    { id: 'R3', name: 'Meera', points: 505, completion: 89 },
    { id: 'R4', name: 'Amit', points: 472, completion: 88 },
  ];
  const myStats = { deliveries: 38, ratio: '38/41', avgTime: '22m', crossSell: 7 };
  const [peer, setPeer] = useState(null);
  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b bg-white">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-900">Leaderboard</div>
          <TierBadge tier={tier} />
        </div>
        <div className="mt-2 text-[12px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1 inline-flex items-center gap-2">
          <Star className="h-3 w-3" /> You’re {tier} — {tier==='Gold'? '580 pts | +1 hr head-start active' : '580 pts | Upgrade for early access'}
        </div>
        <div className="mt-3 grid grid-cols-4 text-[12px] rounded-xl border overflow-hidden">
          {['JC','JP','City','State'].map(t => (
            <button key={t} onClick={()=>setLeaderTab(t)} className={`px-3 py-2 ${leaderTab===t? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        <div className="rounded-xl border">
          {riders.map((r, idx) => (
            <div key={r.id} className="flex items-center justify-between px-3 py-2 border-b last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="text-xs w-6 text-center font-semibold text-gray-800">{idx+1}</div>
                <button onClick={() => setPeer(r)} className="text-sm font-medium text-blue-700 hover:underline flex items-center gap-1"><User className="h-4 w-4" /> {r.name}</button>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="text-gray-900 font-semibold">{r.points} pts</div>
                <div className="text-gray-600">{r.completion}%</div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border p-3">
          <div className="text-sm font-semibold text-gray-900 mb-2">My Stats</div>
          <div className="grid grid-cols-4 text-center gap-2">
            <div>
              <div className="text-xs text-gray-500">Deliveries</div>
              <div className="text-sm font-semibold">{myStats.deliveries}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Delivered/Accepted</div>
              <div className="text-sm font-semibold">{myStats.ratio}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Avg Time</div>
              <div className="text-sm font-semibold">{myStats.avgTime}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Cross-sell</div>
              <div className="text-sm font-semibold">{myStats.crossSell}</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border">
          <button onClick={()=>setShowTierBenefits(v=>!v)} className="w-full flex items-center justify-between px-3 py-2">
            <div className="text-sm font-semibold text-gray-900">View Tier Benefits</div>
            {showTierBenefits? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          <AnimatePresence>
            {showTierBenefits && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-3 pb-3 text-[12px] text-gray-700">
                <div className="rounded-lg border p-2 mb-2"><span className="font-semibold text-amber-700">Gold:</span> early access + bonus eligibility</div>
                <div className="rounded-lg border p-2 mb-2"><span className="font-semibold text-slate-700">Silver:</span> standard access</div>
                <div className="rounded-lg border p-2"><span className="font-semibold text-orange-700">Bronze:</span> limited visibility</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {peer && (
          <motion.div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={()=>setPeer(null)}>
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} className="w-full max-w-sm rounded-2xl bg-white shadow-xl overflow-hidden" onClick={e=>e.stopPropagation()}>
              <div className="px-4 py-3 border-b flex items-center gap-2 text-sm font-semibold text-gray-900"><User className="h-4 w-4" /> {peer.name} — Last 7 days</div>
              <div className="p-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border p-2"><div className="text-xs text-gray-500">Deliveries</div><div className="font-semibold">{Math.round(peer.points/15)}</div></div>
                <div className="rounded-lg border p-2"><div className="text-xs text-gray-500">Completion</div><div className="font-semibold">{peer.completion}%</div></div>
                <div className="rounded-lg border p-2"><div className="text-xs text-gray-500">Avg Time</div><div className="font-semibold">{18+Math.round(Math.random()*10)}m</div></div>
                <div className="rounded-lg border p-2"><div className="text-xs text-gray-500">Cross-sell</div><div className="font-semibold">{Math.round(peer.completion/12)}</div></div>
              </div>
              <div className="px-4 py-3 border-t text-right"><button onClick={()=>setPeer(null)} className="px-4 py-2 rounded-lg border text-sm">Close</button></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NotificationsScreen({ items, onOpen }) {
  return (
    <div className="h-full">
      <div className="px-4 py-3 border-b bg-white text-sm font-semibold text-gray-900">Notifications</div>
      <div className="p-3 space-y-2">
        {items.map(n => (
          <button key={n.id} onClick={()=>onOpen(n)} className={`w-full text-left rounded-xl border p-3 flex items-center justify-between hover:bg-gray-50 ${n.type==='success'?'border-emerald-200 bg-emerald-50': n.type==='warn'?'border-yellow-200 bg-yellow-50':'border-blue-200 bg-blue-50'}`}>
            <div className="text-sm text-gray-900">{n.text}</div>
            <ChevronRight className="h-4 w-4 text-gray-500" />
          </button>
        ))}
      </div>
    </div>
  );
}
