import { useState } from 'react';
import ChatContactsCard, { type Contact } from './ChatContactsCard';
import VisitSchedulerCard from './VisitSchedulerCard';
import FAQsHelpCard from './FAQsHelpCard';
import EmergencyHotlineCard from './EmergencyHotlineCard';
import ResponseNotificationsCard from './ResponseNotificationsCard';
import ChatInterface from './ChatInterface';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';

export default function ChatSection() {
  const [mode, setMode] = useState<'features'|'chat'>('features');
  const [active, setActive] = useState<Contact | null>(null);

  if (mode === 'chat' && active) {
    return (
      <section className="space-y-4">
        <ChatInterface contact={active} onBack={() => setMode('features')} />
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <Card className="material-card">
        <CardHeader className="pb-2">
          <CardTitle className="title-medium flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            Communication
          </CardTitle>
        </CardHeader>
        <CardContent className="body-medium text-text-secondary">
          Connect with ASHA, PHC, and doctors. Chat or call, request visits, read FAQs, use emergency hotlines, and view responses.
        </CardContent>
      </Card>

      <ChatContactsCard onChat={(c) => { setActive(c); setMode('chat'); }} />
      <VisitSchedulerCard />
      <FAQsHelpCard />
      <EmergencyHotlineCard />
      <ResponseNotificationsCard />
    </section>
  );
}
