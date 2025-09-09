import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import MdIcon from '@/components/ui/md3-icon';
import { Phone, MessageCircle, Users, ArrowLeft, Video, MoreVertical, Send, Plus } from 'lucide-react';

export type Contact = {
  id: string;
  name: string;
  role: 'ASHA Worker' | 'PHC' | 'Doctor' | 'Health Team';
  phone: string;
  online?: boolean;
  type?: 'individual' | 'group';
};

const CONTACTS: Contact[] = [
  { id: 'c1', name: 'PHC - Rampur', role: 'PHC', phone: '+911801234567', online: true, type: 'group' },
  { id: 'c2', name: 'Dr. Priya Sharma', role: 'Doctor', phone: '+911112223334', online: true, type: 'individual' },
  { id: 'c3', name: 'ASHA - Sunita Devi', role: 'ASHA Worker', phone: '+911234567890', online: false, type: 'individual' },
];

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2);

export default function CommunicationHub(){
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [query, setQuery] = useState('');

  const filtered = CONTACTS.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.role.toLowerCase().includes(query.toLowerCase()));

  if(activeContact){
    return (
      <Card className="material-card">
        <CardHeader className="pb-3 border-b border-divider">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => setActiveContact(null)} aria-label="Back">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">{getInitials(activeContact.name)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="label-large text-text-primary">{activeContact.name}</p>
                <p className="body-small text-text-secondary">{activeContact.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="icon">
                <a href={`tel:${activeContact.phone}`} aria-label={`Call ${activeContact.name}`}>
                  <Phone className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon"><Video className="h-5 w-5" /></Button>
              <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5" /></Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-4 space-y-4 overflow-y-auto">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <p className="body-small text-text-secondary">No messages yet. Use the composer below to send a message to {activeContact.name}.</p>
            </div>
          )}
          {messages.map(m => (
            <div key={m.id} className={`flex ${m.isOwn ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl ${m.isOwn ? 'chat-bubble-outgoing bg-primary text-primary-foreground' : 'chat-bubble-incoming bg-muted text-foreground'}`}>
                {!m.isOwn && <p className="body-small text-text-disabled mb-1">{m.sender}</p>}
                <p className="body-medium">{m.message}</p>
                <p className={`body-small mt-1 ${m.isOwn ? 'text-primary-foreground/70' : 'text-text-disabled'}`}>{m.time}</p>
              </div>
            </div>
          ))}
        </CardContent>

        <div className="p-4 border-t border-divider">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon"><Plus className="h-5 w-5" /></Button>
            <div className="flex-1 relative">
              <Input placeholder={`Message ${activeContact.name}...`} onKeyDown={(e:any)=>{ if(e.key==='Enter'){ const text = e.target.value; if(!text) return; const now = new Date(); setMessages(prev=>[...prev, { id: now.getTime(), sender: 'You', message: text, time: now.toLocaleTimeString(), isOwn: true }]); e.target.value=''; } }} />
            </div>
            <Button onClick={()=>{ /* intentionally simple */ }}><Send className="h-5 w-5" /></Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="material-card">
      <CardHeader className="pb-2">
        <CardTitle className="title-medium flex items-center gap-2"><MessageCircle className="h-5 w-5 text-primary" /> Communication Hub</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="relative">
          <Input placeholder="Search contacts" value={query} onChange={(e:any)=>setQuery(e.target.value)} />
        </div>
        <div className="space-y-2">
          {filtered.map(c=> (
            <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors" onClick={()=>setActiveContact(c)}>
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">{getInitials(c.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="label-medium text-text-primary truncate">{c.name}</p>
                <p className="body-small text-text-secondary">{c.role}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="sm"><a href={`tel:${c.phone}`}> <Phone className="h-4 w-4" /> </a></Button>
                <Button variant="ghost" size="icon" aria-label={`Chat ${c.name}`}><MessageCircle className="h-5 w-5" /></Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
