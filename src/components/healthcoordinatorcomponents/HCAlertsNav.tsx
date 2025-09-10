import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertOctagon, Droplets, Activity, Box } from 'lucide-react';
import HCAlertCard, { AlertItem } from './HCAlertCard';
export type { AlertItem } from './HCAlertCard';

const sections: { key: AlertItem['category']; label: string; icon: any }[] = [
  { key: 'outbreak', label: 'Outbreak Alerts', icon: AlertOctagon },
  { key: 'water', label: 'Water Contamination', icon: Droplets },
  { key: 'emergency', label: 'Emergency Assistance', icon: Activity },
  { key: 'supply', label: 'Supply Shortage', icon: Box }
];

const HCAlertsNav: React.FC<{ alerts: AlertItem[] }> = ({ alerts }) => {
  const [active, setActive] = useState<AlertItem['category']>('outbreak');
  const [queryOpen, setQueryOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return alerts.filter(a => a.category === active && `${a.title} ${a.area} ${a.status}`.toLowerCase().includes(query.toLowerCase()));
  }, [alerts, active, query]);

  return (
    <div className="space-y-4">
      {/* Icon-only Tabs: mobile-first grid for equal spacing */}
      <div className="w-full">
        <div className="grid grid-cols-4 gap-2">
          {sections.map((s) => {
            const Icon = s.icon;
            const selected = s.key === active;
            return (
              <button
                key={s.key}
                onClick={() => setActive(s.key)}
                aria-label={s.label}
                title={s.label}
                className={`flex flex-col items-center justify-center h-14 w-full rounded-xl transition-shadow px-1 py-1 ${selected ? 'bg-primary/10 ring-1 ring-primary shadow-sm' : 'bg-card/50 hover:bg-card/80'}`}
              >
                <Icon className={`${selected ? 'text-primary' : 'text-text-secondary'} h-6 w-6`} />
                <span className={`text-xs mt-1 ${selected ? 'text-primary font-medium' : 'text-text-secondary'}`}>{s.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Compact actions row: search icon only and spacing */}
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="search" onClick={() => setQueryOpen(s => !s)}>
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Expandable compact search input (appears when search icon tapped) */}
      {queryOpen && (
        <div className="w-full">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search alerts" />
        </div>
      )}

      {/* List */}
      <div className="grid grid-cols-1 gap-3">
        {filtered.length === 0 ? (
          <div className="p-4 rounded-lg bg-muted/50 text-center">
            <p className="label-medium text-text-primary">No {sections.find(s => s.key === active)?.label} at the moment</p>
            <p className="body-small text-text-secondary mt-1">Checks will appear here when reports arrive.</p>
          </div>
        ) : (
          filtered.map((a) => <HCAlertCard key={a.id} alert={a} />)
        )}
      </div>
    </div>
  );
};

export default HCAlertsNav;
