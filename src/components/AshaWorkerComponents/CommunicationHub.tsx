import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import MdIcon from '@/components/ui/md3-icon';

export default function CommunicationHub(){
  const [messages, setMessages] = useState<any[]>([{ id: 'm1', from: 'Coordinator', text: 'Mobile clinic scheduled tomorrow', time: new Date().toLocaleString() }]);
  const [text, setText] = useState('');

  const send = ()=>{
    if(!text) return;
    setMessages(prev=>[{ id: `m${Date.now()}`, from: 'You', text, time: new Date().toLocaleString() }, ...prev]);
    setText('');
  };

  return (
    <Card className="material-card">
      <CardHeader className="pb-3">
        <CardTitle className="title-medium flex items-center gap-2"><MdIcon name="chat" size={18} /> Communication Hub</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          {messages.map(m=> (
            <div key={m.id} className="p-2 rounded-md bg-muted/20">
              <p className="label-small">{m.from} • <span className="text-xs text-text-secondary">{m.time}</span></p>
              <p className="body-small">{m.text}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Input value={text} onChange={(e:any)=>setText(e.target.value)} placeholder="Type message" />
          <Button onClick={send}><MdIcon name="send" size={16} /></Button>
        </div>
      </CardContent>
    </Card>
  );
}
