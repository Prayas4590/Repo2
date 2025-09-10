import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Phone, MessageCircle, Users } from 'lucide-react';

export type DoctorContact = {
  id: string;
  name: string;
  role: 'ASHA Worker' | 'PHC' | 'Doctor' | 'Health Team';
  phone: string;
  online?: boolean;
  type?: 'individual' | 'group';
};

const contacts: DoctorContact[] = [
  { id: 'c1', name: 'ASHA - Sunita Devi', role: 'ASHA Worker', phone: '+911234567890', online: true, type: 'individual' },
  { id: 'c2', name: 'PHC - Rampur', role: 'PHC', phone: '+911801234567', online: false, type: 'group' },
  { id: 'c3', name: 'Dr. Priya Sharma', role: 'Doctor', phone: '+911112223334', online: true, type: 'individual' },
];

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

type Props = { onChat?: (contact: DoctorContact) => void };

export default function DoctorChatContactsCard({ onChat }: Props) {
  return (
    <Card className="material-card">
      <CardHeader className="pb-2">
        <CardTitle className="title-medium flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          Chat or Call
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {contacts.map((c) => (
          <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {c.type === 'group' ? <Users className="h-5 w-5" /> : getInitials(c.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="label-medium text-text-primary truncate">{c.name}</p>
              <p className="body-small text-text-secondary">{c.role}</p>
            </div>
            <div className="flex items-center gap-2">
              {onChat ? (
                <Button onClick={() => onChat(c)} variant="outline" size="sm" className="ripple">
                  <MessageCircle className="h-4 w-4 mr-1" /> Chat
                </Button>
              ) : (
                <Button asChild variant="outline" size="sm" className="ripple">
                  <a href="#communication" aria-label={`Chat with ${c.name}`}>
                    <MessageCircle className="h-4 w-4 mr-1" /> Chat
                  </a>
                </Button>
              )}
              <Button asChild variant="outline" size="sm" className="ripple">
                <a href={`tel:${c.phone}`} aria-label={`Call ${c.name}`}>
                  <Phone className="h-4 w-4 mr-1" /> Call
                </a>
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
