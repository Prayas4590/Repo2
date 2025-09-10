import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MapPin, Paperclip, User, Calendar } from 'lucide-react';

export interface RequestPatient {
  id: number;
  name: string;
  userId: string;
  age: number;
  gender: string;
  location: string;
  symptoms: string;
  files?: string[]; // mock URLs
}

export interface TreatedRecord {
  id: number;
  name: string;
  age: number;
  gender: string;
  location: string;
  symptoms: string;
  treatment: string;
  medication: string;
  diagnosis: string;
  date: string;
}

const mockRequests: RequestPatient[] = [
  {
    id: 1,
    name: 'Suman Rao',
    userId: 'U-1023',
    age: 34,
    gender: 'Female',
    location: 'Block A, House 21',
    symptoms: 'Fever, vomiting for 2 days',
    files: []
  },
  {
    id: 2,
    name: 'Manish Patel',
    userId: 'U-1102',
    age: 27,
    gender: 'Male',
    location: 'Block C, Near Market',
    symptoms: 'Diarrhea and stomach pain',
    files: ['https://via.placeholder.com/150']
  },
  {
    id: 3,
    name: 'Rita Kumari',
    userId: 'U-1120',
    age: 49,
    gender: 'Female',
    location: 'Block B - School Area',
    symptoms: 'Shortness of breath',
    files: []
  }
];

const HCPatientsSection: React.FC = () => {
  const [requests, setRequests] = useState<RequestPatient[]>(mockRequests);
  const [archive, setArchive] = useState<TreatedRecord[]>([]);
  const [selected, setSelected] = useState<RequestPatient | null>(null);
  const [formData, setFormData] = useState<Partial<TreatedRecord> | null>(null);

  const openDiagnoseForm = (request: RequestPatient) => {
    setSelected(request);
    setFormData({
      name: request.name,
      age: request.age,
      gender: request.gender,
      location: request.location,
      symptoms: request.symptoms,
      treatment: '',
      medication: '',
      diagnosis: '',
      date: new Date().toISOString().split('T')[0]
    });
    // scroll into view could be handled by UI, keeping simple
  };

  const submitDiagnosis = () => {
    if (!formData) return;
    const newRecord: TreatedRecord = {
      id: Date.now(),
      name: formData.name || 'Unknown',
      age: formData.age || 0,
      gender: (formData.gender as string) || 'Unknown',
      location: formData.location || '',
      symptoms: formData.symptoms || '',
      treatment: formData.treatment || '',
      medication: formData.medication || '',
      diagnosis: formData.diagnosis || '',
      date: formData.date || new Date().toISOString().split('T')[0]
    };

    setArchive(prev => [newRecord, ...prev]);
    // remove request if it existed
    if (selected) {
      setRequests(prev => prev.filter(r => r.id !== selected.id));
    }
    // reset form
    setSelected(null);
    setFormData(null);
  };

  const submitCampTreatment = (e: React.FormEvent) => {
    e.preventDefault();
    // gather form from DOM via controlled inputs below
    if (!formData) return;
    submitDiagnosis();
  };

  return (
    <div className="space-y-6">
      {/* Section 1: Requests */}
      <div>
        <h2 className="title-medium mb-2">Patient Requests</h2>
        <p className="body-small text-text-secondary mb-3">Requests submitted by citizens via the app. Tap Treat to prefill a treatment form.</p>

        <div className="space-y-3">
          {requests.map((r) => (
            <Card key={r.id} className="material-card">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {r.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="label-medium">{r.name} <span className="text-xs text-text-disabled">• {r.userId}</span></h3>
                        <p className="body-small text-text-secondary">{r.age} yrs • {r.gender}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-text-disabled">{new Date().toLocaleString()}</p>
                      </div>
                    </div>

                    <p className="body-small text-text-primary mt-3">Location</p>
                    <div className="flex items-center gap-2 text-text-disabled">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{r.location}</span>
                    </div>

                    <p className="body-small text-text-primary mt-3">Symptoms</p>
                    <p className="text-sm text-text-secondary">{r.symptoms}</p>

                    {r.files && r.files.length > 0 && (
                      <div className="mt-3 flex items-center gap-2">
                        <Paperclip className="h-4 w-4 text-text-secondary" />
                        <a className="text-sm text-primary underline" href={r.files[0]} target="_blank" rel="noreferrer">View attachment</a>
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-end">
                      <Button size="sm" variant="default" onClick={() => openTreatForm(r)}>Treat</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {requests.length === 0 && (
            <Card className="material-card text-center">
              <CardContent className="p-6">
                <p className="body-medium text-text-secondary">No patient requests at the moment.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Section 2: Treatment Form (prefilled when Treat clicked) */}
      <div>
        <h2 className="title-medium mb-2">Treat Patient (Camp / PHC)</h2>
        <p className="body-small text-text-secondary mb-3">Record treatment provided in camp or primary health center. Fields auto-populate when treating a request.</p>

        <Card className="material-card">
          <CardContent className="p-4">
            <form onSubmit={(e) => { e.preventDefault(); submitCampTreatment(e); }} className="space-y-3">
              <div className="grid grid-cols-1 gap-2">
                <Input value={formData?.name ?? ''} onChange={(e) => setFormData(prev => ({ ...(prev || {}), name: e.target.value }))} placeholder="Name" />
                <div className="flex gap-2">
                  <Input value={String(formData?.age ?? '')} onChange={(e) => setFormData(prev => ({ ...(prev || {}), age: Number(e.target.value) }))} placeholder="Age" />
                  <Input value={formData?.gender ?? ''} onChange={(e) => setFormData(prev => ({ ...(prev || {}), gender: e.target.value }))} placeholder="Gender" />
                </div>
                <Input value={formData?.location ?? ''} onChange={(e) => setFormData(prev => ({ ...(prev || {}), location: e.target.value }))} placeholder="Location" />
                <Input value={formData?.symptoms ?? ''} onChange={(e) => setFormData(prev => ({ ...(prev || {}), symptoms: e.target.value }))} placeholder="Symptoms" />
                <Input value={formData?.treatment ?? ''} onChange={(e) => setFormData(prev => ({ ...(prev || {}), treatment: e.target.value }))} placeholder="Treatment given" />
                <Input value={formData?.medication ?? ''} onChange={(e) => setFormData(prev => ({ ...(prev || {}), medication: e.target.value }))} placeholder="Medication prescribed" />
                <Input value={formData?.diagnosis ?? ''} onChange={(e) => setFormData(prev => ({ ...(prev || {}), diagnosis: e.target.value }))} placeholder="Diagnosis / Disease" />
              </div>

              <div className="flex items-center justify-end">
                <Button type="submit" variant="default">Submit</Button>
                <Button type="button" variant="ghost" className="ml-2" onClick={() => { setFormData(null); setSelected(null); }}>Reset</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Section 3: Archive */}
      <div>
        <h2 className="title-medium mb-2">Archived Records</h2>
        <p className="body-small text-text-secondary mb-3">Completed treatments and submitted records.</p>

        <div className="space-y-3">
          {archive.map((a) => (
            <Card key={a.id} className="material-card">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="label-medium">{a.name}</h3>
                    <p className="body-small text-text-secondary">{a.age} yrs • {a.gender} • {a.location}</p>
                    <p className="text-sm text-text-secondary mt-2">Diagnosis: <span className="font-medium">{a.diagnosis}</span></p>
                    <p className="text-sm text-text-secondary">Treatment: <span className="font-medium">{a.treatment}</span></p>
                    <p className="text-sm text-text-secondary">Medication: <span className="font-medium">{a.medication}</span></p>
                    <p className="text-sm text-text-disabled mt-2">Date: {a.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">Export</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {archive.length === 0 && (
            <Card className="material-card text-center">
              <CardContent className="p-6">
                <p className="body-medium text-text-secondary">No archived records yet.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default HCPatientsSection;
