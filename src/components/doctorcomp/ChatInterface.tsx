import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Phone, Video, MoreVertical, Users, Send, Plus } from 'lucide-react';
import type { DoctorContact } from './ChatContactsCard';

type Props = { contact: DoctorContact; onBack: () => void };

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

export default function DoctorChatInterface({ contact, onBack }: Props) {
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: contact.name, message: 'Hello! How can I help you?', time: '10:30 AM', isOwn: false },
    { id: 2, sender: 'You', message: 'I would like to schedule a visit.', time: '10:31 AM', isOwn: true },
  ]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    const now = new Date();
    setMessages((m) => [...m, { id: now.getTime(), sender: 'You', message: messageInput, time: now.toLocaleTimeString(), isOwn: true }]);
    setMessageInput('');
  };

  return (
    <Card className="material-card flex flex-col">
      <CardHeader className="pb-3 border-b border-divider">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onBack} aria-label="Back" className="mr-1">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {contact.type === 'group' ? <Users className="h-5 w-5" /> : getInitials(contact.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="label-large text-text-primary">{contact.name}</h3>
              <p className="body-small text-text-secondary">{contact.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="icon">
              <a href={`tel:${contact.phone}`} aria-label="Call">
                <Phone className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl ${message.isOwn ? 'chat-bubble-outgoing bg-primary text-primary-foreground' : 'chat-bubble-incoming bg-muted text-foreground'}`}>
              {!message.isOwn && <p className="body-small text-text-disabled mb-1">{message.sender}</p>}
              <p className="body-medium">{message.message}</p>
              <p className={`body-small mt-1 ${message.isOwn ? 'text-primary-foreground/70' : 'text-text-disabled'}`}>{message.time}</p>
            </div>
          </div>
        ))}
      </CardContent>

      <div className="p-4 border-t border-divider">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Plus className="h-5 w-5" />
          </Button>
          <div className="flex-1 relative">
            <Input value={messageInput} onChange={(e) => setMessageInput(e.target.value)} placeholder="Type your message..." className="pr-12 border-input" onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} />
          </div>
          <Button onClick={handleSendMessage} className="ripple">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
