import { useState } from 'react';
import DoctorChatContactsCard, { type DoctorContact } from './ChatContactsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';
import DoctorChatInterface from './ChatInterface';

export default function DoctorCommunicationHub() {
  const [mode, setMode] = useState<'features'|'chat'>('features');
  const [active, setActive] = useState<DoctorContact | null>(null);

  if (mode === 'chat' && active) {
    return (
      <section className="space-y-4" id="communication">
        <DoctorChatInterface contact={active} onBack={() => setMode('features')} />
      </section>
    );
  }

  return (
    <section className="space-y-4" id="communication">
      <Card className="material-card">
        <CardHeader className="pb-2">
          <CardTitle className="title-medium flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            Communication
          </CardTitle>
        </CardHeader>
        <CardContent className="body-medium text-text-secondary">
          Chat or call with ASHA, PHC, or other doctors. Start a conversation to coordinate patient care.
        </CardContent>
      </Card>

      <DoctorChatContactsCard onChat={(c) => { setActive(c); setMode('chat'); }} />
    </section>
  );
}
