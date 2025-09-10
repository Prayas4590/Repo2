import React, { useState } from 'react';
import DoctorChatContactsCard, { Contact } from './DoctorChatContactsCard';
import DoctorChatInterface from './DoctorChatInterface';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DoctorCommunicationHub() {
  const [activeContact, setActiveContact] = useState<Contact | null>(null);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Communication Hub</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <DoctorChatContactsCard onChat={(c) => setActiveContact(c)} />
            </div>

            <div className="md:col-span-2">
              {activeContact ? (
                <DoctorChatInterface contact={activeContact} onBack={() => setActiveContact(null)} />
              ) : (
                <div className="rounded-lg border p-6 text-center">
                  <p className="text-sm text-muted-foreground">Select a contact to start chatting or calling.</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
