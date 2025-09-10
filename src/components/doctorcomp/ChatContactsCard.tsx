import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Phone, MessageCircle, Users } from 'lucide-react';

export type DoctorContact = {
  id: string;
  name: string;
  role: 'ASHA Worker' | 'PHC' | 'Doctor' | 'Health Team' | 'Coordinator' | 'Ambulance' | 'Lab' | 'Pharmacy' | 'Patient';
  phone: string;
  online?: boolean;
  type?: 'individual' | 'group';
};

const contacts: DoctorContact[] = [
  // ASHA Workers
  { id: 'asha1', name: 'ASHA - Sunita Devi', role: 'ASHA Worker', phone: '+911234567890', online: true, type: 'individual' },
  { id: 'asha2', name: 'ASHA - Meera Kumari', role: 'ASHA Worker', phone: '+911234567891', online: false, type: 'individual' },

  // PHC / Health Facilities
  { id: 'phc1', name: 'PHC - Rampur', role: 'PHC', phone: '+911801234567', online: false, type: 'group' },
  { id: 'phc2', name: 'PHC - Bhagalpur', role: 'PHC', phone: '+911801234568', online: true, type: 'group' },

  // Coordinators
  { id: 'coord1', name: 'Coordinator - Rajesh Kumar', role: 'Coordinator', phone: '+919900112233', online: true, type: 'individual' },

  // Doctors
  { id: 'doc1', name: 'Dr. Priya Sharma', role: 'Doctor', phone: '+911112223334', online: true, type: 'individual' },
  { id: 'doc2', name: 'Dr. Arjun Mehta', role: 'Doctor', phone: '+911112223335', online: false, type: 'individual' },
  { id: 'doc3', name: 'Dr. Neha Verma', role: 'Doctor', phone: '+911112223336', online: true, type: 'individual' },

  // Support Services
  { id: 'amb1', name: 'Ambulance - District HQ', role: 'Ambulance', phone: '+911080123456', online: true, type: 'group' },
  { id: 'lab1', name: 'City Diagnostic Lab', role: 'Lab', phone: '+911202345678', online: true, type: 'group' },
  { id: 'pharm1', name: 'MedPlus Pharmacy', role: 'Pharmacy', phone: '+911402223344', online: false, type: 'group' },

  // Community/Patients
  { id: 'team1', name: 'Health Team - Block A', role: 'Health Team', phone: '+911802223344', online: false, type: 'group' },
  { id: 'pat1', name: 'Patient - Rajesh Kumar', role: 'Patient', phone: '+919876543210', online: true, type: 'individual' },
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
