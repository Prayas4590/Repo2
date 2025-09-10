import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Stethoscope, MapPin, ClipboardList, Send, ShieldCheck } from 'lucide-react';

const COMMON_SYMPTOMS = [
  'Diarrhea', 'Vomiting', 'Fever', 'Dehydration', 'Abdominal Pain', 'Nausea', 'Fatigue'
];

export default function DoctorReportsSection() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [patientCount, setPatientCount] = useState<number>(0);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [otherSymptoms, setOtherSymptoms] = useState('');
  const [location, setLocation] = useState('Fetching location…');
  const [message, setMessage] = useState('');

  const regNo = useMemo(() => {
    const base = (user?.id || 'NMC')
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase()
      .slice(-6);
    return `NMC-${base}`;
  }, [user?.id]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation('Location not available');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
      },
      () => setLocation('Permission denied'),
      { enableHighAccuracy: false, timeout: 5000 }
    );
  }, []);

  const toggleSymptom = (s: string) => {
    setSymptoms((prev) => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const handleSubmitDaily = () => {
    toast({
      title: 'Daily report submitted',
      description: 'Your patient count and symptoms have been recorded.',
    });
  };

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast({ title: 'Message empty', description: 'Please write a message before sending.', variant: 'destructive' });
      return;
    }
    toast({ title: 'Message sent to authority', description: 'We have forwarded your note.' });
    setMessage('');
  };

  return (
    <section className="space-y-4" id="reports">
      {/* Header */}
      <Card className="material-card">
        <CardHeader className="pb-2">
          <CardTitle className="title-medium flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-doctor" />
            Daily Water-borne Disease Report
          </CardTitle>
        </CardHeader>
        <CardContent className="body-medium text-text-secondary">
          Submit daily patient counts and observations. Doctor details are auto-filled.
        </CardContent>
      </Card>

      {/* Doctor & Report Details */}
      <Card className="material-card">
        <CardHeader className="pb-2">
          <CardTitle className="title-medium flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-primary" />
            Doctor Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="body-small text-text-secondary">Doctor Name</Label>
              <Input value={user?.name || ''} readOnly />
            </div>
            <div>
              <Label className="body-small text-text-secondary">User ID</Label>
              <Input value={user?.id || ''} readOnly />
            </div>
            <div>
              <Label className="body-small text-text-secondary">Registration No.</Label>
              <Input value={regNo} readOnly />
            </div>
            <div>
              <Label className="body-small text-text-secondary">Location</Label>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-text-secondary" />
                <Input value={location} readOnly />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Patient Count */}
      <Card className="material-card">
        <CardHeader className="pb-2">
          <CardTitle className="title-medium">Daily Water-borne Disease Patient Count</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="body-small text-text-secondary">Number of patients reported today</Label>
            <Input type="number" min={0} value={patientCount} onChange={(e) => setPatientCount(parseInt(e.target.value || '0'))} placeholder="0" />
          </div>

          <div>
            <Label className="body-small text-text-secondary mb-2 inline-block">Symptoms observed</Label>
            <div className="grid grid-cols-2 gap-2">
              {COMMON_SYMPTOMS.map((s) => (
                <label key={s} className="flex items-center gap-2 p-2 rounded-lg border border-border cursor-pointer">
                  <Checkbox checked={symptoms.includes(s)} onCheckedChange={() => toggleSymptom(s)} />
                  <span className="body-small">{s}</span>
                </label>
              ))}
            </div>
            <div className="mt-2">
              <Label className="body-small text-text-secondary">Other symptoms / notes</Label>
              <Textarea value={otherSymptoms} onChange={(e) => setOtherSymptoms(e.target.value)} placeholder="Describe other symptoms…" />
            </div>
            {symptoms.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {symptoms.map((s) => (
                  <Badge key={s} variant="outline">{s}</Badge>
                ))}
              </div>
            )}
          </div>

          <Button className="ripple" onClick={handleSubmitDaily}>
            <ShieldCheck className="h-4 w-4 mr-2" /> Submit Daily Report
          </Button>
        </CardContent>
      </Card>

      {/* Important Message */}
      <Card className="material-card">
        <CardHeader className="pb-2">
          <CardTitle className="title-medium">Important Message to Authority</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe field findings (e.g., people unable to visit due to floods, roadblocks, etc.)"
            className="min-h-28"
          />
          <Button className="ripple" onClick={handleSendMessage}>
            <Send className="h-4 w-4 mr-2" /> Send Message
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
