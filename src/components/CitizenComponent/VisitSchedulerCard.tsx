import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CalendarDays, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export type VisitRequest = {
  id: string;
  kind: 'clinic' | 'home';
  date: string;
  time: string;
  reason: string;
};

export default function VisitSchedulerCard() {
  const [kind, setKind] = useState<'clinic' | 'home' | ''>('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kind || !date || !time || !reason) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const req: VisitRequest = { id: `VR-${Date.now()}`, kind: kind as 'clinic'|'home', date, time, reason };
    try {
      const saved = localStorage.getItem('visit_requests');
      const list = saved ? JSON.parse(saved) : [];
      list.unshift(req);
      localStorage.setItem('visit_requests', JSON.stringify(list));
      const notified = localStorage.getItem('comm_notifications');
      const notes = notified ? JSON.parse(notified) : [];
      notes.unshift({ id: `N-${Date.now()}`, type: 'visit', text: `${kind === 'home' ? 'Home visit' : 'Clinic appointment'} requested for ${date} ${time}` });
      localStorage.setItem('comm_notifications', JSON.stringify(notes));
    } catch {}
    toast({ title: 'Request Sent', description: kind === 'home' ? 'Home visit requested. You will be notified.' : 'Appointment request sent. You will be notified.' });
    setKind(''); setDate(''); setTime(''); setReason('');
    setLoading(false);
  };

  return (
    <Card className="material-card">
      <CardHeader className="pb-2">
        <CardTitle className="title-medium flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          Schedule Appointment / Request Home Visit
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-3">
          <div className="space-y-2">
            <Label className="label-medium text-text-primary">Type</Label>
            <Select value={kind} onValueChange={(v: 'clinic'|'home') => setKind(v)} required>
              <SelectTrigger className="border-input"><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="clinic">Clinic Appointment</SelectItem>
                <SelectItem value="home">Home Visit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="label-medium text-text-primary">Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border-input" required />
            </div>
            <div className="space-y-2">
              <Label className="label-medium text-text-primary">Time</Label>
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="border-input" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="label-medium text-text-primary">Reason / Notes</Label>
            <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Briefly describe your concern" className="min-h-[80px] border-input" required />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button type="submit" disabled={loading || kind !== 'clinic'} className="ripple" variant="default">
              <CalendarDays className="h-4 w-4 mr-2" /> {loading && kind==='clinic' ? 'Requesting…' : 'Request Appointment'}
            </Button>
            <Button type="submit" disabled={loading || kind !== 'home'} className="ripple" variant="outline">
              <Home className="h-4 w-4 mr-2" /> {loading && kind==='home' ? 'Requesting…' : 'Request Home Visit'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
