import React, { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { AlertOctagon, Droplets, Activity, Box } from 'lucide-react';
import HCAlertCard, { AlertItem } from './HCAlertCard';

const sections: { key: AlertItem['category']; label: string; icon: any }[] = [
  { key: 'outbreak', label: 'Outbreak Alerts', icon: AlertOctagon },
  { key: 'water', label: 'Water Contamination', icon: Droplets },
  { key: 'emergency', label: 'Emergency Assistance', icon: Activity },
  { key: 'supply', label: 'Supply Shortage', icon: Box }
];

const HCAlertsNav: React.FC<{ alerts: AlertItem[] }> = ({ alerts }) => {
  const [active, setActive] = useState<AlertItem['category']>('outbreak');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return alerts.filter(a => a.category === active && `${a.title} ${a.area} ${a.status}`.toLowerCase().includes(query.toLowerCase()));
  }, [alerts, active, query]);

  return (
    <div className="space-y-4">
      {/* Tabs: mobile-first horizontal scroll */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {sections.map((s) => {
          const Icon = s.icon;
          const selected = s.key === active;
          return (
            <button
              key={s.key}
              onClick={() => setActive(s.key)}
              className={`flex items-center gap-2 whitespace-nowrap px-3 py-2 rounded-full transition-all ${selected ? 'bg-primary/10 ring-1 ring-primary' : 'bg-card/50 hover:bg-card/80'}`}
            >
              <Icon className={`${selected ? 'text-primary' : 'text-text-secondary'} h-5 w-5`} />
              <span className={`text-sm font-medium ${selected ? 'text-primary' : 'text-text-secondary'}`}>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search and quick filters */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${sections.find(s => s.key === active)?.label || 'alerts'}`} />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <IconButton variant="ghost" size="icon" onClick={() => setQuery('')}>
              <Search className="h-4 w-4" />
            </IconButton>
          </div>
        </div>
      </div>

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
