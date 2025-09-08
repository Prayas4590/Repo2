import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, CalendarClock, CheckCircle2 } from 'lucide-react';

type Note = { id: string; type: 'visit' | 'response'; text: string; time?: string };

export default function ResponseNotificationsCard() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('comm_notifications');
      const list: Note[] = saved ? JSON.parse(saved) : [
        { id: 'N-1', type: 'response', text: 'ASHA responded to your message', time: '5 min ago' },
        { id: 'N-2', type: 'visit', text: 'Home visit scheduled for tomorrow 10:00 AM', time: '1 hr ago' },
      ];
      setNotes(list);
    } catch {}
  }, []);

  const iconFor = (t: Note['type']) => t === 'visit' ? <CalendarClock className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />;

  return (
    <Card className="material-card">
      <CardHeader className="pb-2">
        <CardTitle className="title-medium flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {notes.map((n) => (
          <div key={n.id} className="p-3 rounded-lg hover:bg-muted/50 transition-colors flex items-center gap-2">
            <Badge variant="outline" className="text-xs">{n.type}</Badge>
            <div className="flex-1 min-w-0">
              <p className="body-medium text-text-primary truncate">{n.text}</p>
              {n.time && <p className="body-small text-text-disabled">{n.time}</p>}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
