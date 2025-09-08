import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Droplets, CloudRain, Search, Archive } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export type FeedItem = {
  id: string;
  title: string;
  description: string;
  severity: 'low'|'medium'|'high';
  type: 'outbreak'|'water'|'seasonal'|'info';
  location: string;
  time: string;
  status: 'active'|'monitoring'|'resolved'|'scheduled';
};

const sevColor = (s: string) => s === 'high' ? 'bg-error text-error-foreground' : s === 'medium' ? 'bg-warning text-warning-foreground' : 'bg-success text-success-foreground';
const statusColor = (s: string) => s === 'active' ? 'bg-error text-error-foreground' : s === 'monitoring' ? 'bg-warning text-warning-foreground' : s === 'scheduled' ? 'bg-info text-white' : 'bg-success text-success-foreground';
const iconFor = (t: FeedItem['type']) => t === 'water' ? <Droplets className="h-5 w-5" /> : t === 'seasonal' ? <CloudRain className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />;

export default function AlertsRealtimeFeed() {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all'|'active'|'high'|'outbreak'>('all');
  const [items, setItems] = useState<FeedItem[]>([]);

  useEffect(() => {
    const base: FeedItem[] = [
      { id: 'F-1', title: 'Cholera outbreak', description: 'Multiple diarrhea cases reported; ORS and hygiene advised.', severity: 'high', type: 'outbreak', location: 'Block A', time: '2h ago', status: 'active' },
      { id: 'F-2', title: 'Typhoid cases rise', description: 'Fever with abdominal pain trending up in Block C.', severity: 'medium', type: 'outbreak', location: 'Block C', time: '6h ago', status: 'monitoring' },
      { id: 'F-3', title: 'Monsoon hygiene advisory', description: 'Boil water and use mosquito nets during monsoon.', severity: 'low', type: 'seasonal', location: 'All Blocks', time: 'Today', status: 'scheduled' },
    ];

    try {
      const saved = localStorage.getItem('water_reports');
      const reports = saved ? JSON.parse(saved) : [];
      const derived: FeedItem[] = (reports as any[]).slice(0, 3).map((r) => ({
        id: `W-${r.id}`,
        title: 'Water contamination report nearby',
        description: `Issue at ${r.location.village || r.locationFields?.village || r.location}. Details recorded.`,
        severity: (r.severity || 'medium'),
        type: 'water',
        location: `${r.location?.village || r.locationFields?.village || 'Local Area'}`,
        time: r.time || 'recent',
        status: 'monitoring',
      }));
      setItems([...derived, ...base]);
    } catch {
      setItems(base);
    }
  }, []);

  const filtered = useMemo(() => items.filter(it => {
    const matchesSearch = it.title.toLowerCase().includes(search.toLowerCase()) || it.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || (filter === 'active' && it.status === 'active') || (filter === 'high' && it.severity === 'high') || (filter === 'outbreak' && it.type === 'outbreak');
    return matchesSearch && matchesFilter;
  }), [items, search, filter]);

  const archive = (it: FeedItem) => {
    try {
      const saved = localStorage.getItem('alerts_archive');
      const list = saved ? JSON.parse(saved) : [];
      list.unshift({ id: it.id, title: it.title, severity: it.severity, type: it.type, time: it.time });
      localStorage.setItem('alerts_archive', JSON.stringify(list));
      toast({ title: 'Archived', description: 'Alert moved to archive.' });
    } catch {}
  };

  return (
    <Card className="material-card">
      <CardHeader className="pb-2">
        <CardTitle className="title-medium">Real-time Alerts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search alerts..." className="pl-10 border-input" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'All' },
            { id: 'active', label: 'Active' },
            { id: 'high', label: 'High Priority' },
            { id: 'outbreak', label: 'Outbreaks' },
          ].map(tab => (
            <Button key={tab.id} size="sm" variant={filter === tab.id ? 'default' : 'outline'} className="whitespace-nowrap ripple" onClick={() => setFilter(tab.id as any)}>
              {tab.label}
            </Button>
          ))}
        </div>

        {filtered.map((it) => (
          <div key={it.id} className="p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-start gap-3">
              <div className="text-primary mt-0.5">{iconFor(it.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="label-medium text-text-primary">{it.title}</h3>
                  <div className="flex gap-2 flex-shrink-0">
                    <Badge className={sevColor(it.severity)}>{it.severity}</Badge>
                    <Badge className={statusColor(it.status)}>{it.status}</Badge>
                  </div>
                </div>
                <p className="body-medium text-text-secondary">{it.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="body-small text-text-disabled">{it.location} • {it.time}</p>
                  <Button variant="ghost" size="sm" onClick={() => archive(it)}>
                    <Archive className="h-4 w-4 mr-1" /> Archive
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
