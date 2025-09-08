import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export type AlertPreferences = {
  outbreaks: boolean;
  water: boolean;
  seasonal: boolean;
  sms: boolean;
  push: boolean;
};

const DEFAULT_PREFS: AlertPreferences = {
  outbreaks: true,
  water: true,
  seasonal: true,
  sms: false,
  push: true,
};

export default function NotificationPreferencesCard() {
  const [prefs, setPrefs] = useState<AlertPreferences>(DEFAULT_PREFS);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('alert_prefs');
      if (saved) setPrefs(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem('alert_prefs', JSON.stringify(prefs)); } catch {}
  }, [prefs]);

  const Row = ({ id, label }: { id: keyof AlertPreferences; label: string }) => (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
      <Label className="label-medium text-text-primary" htmlFor={`pref-${id}`}>{label}</Label>
      <Switch id={`pref-${id}`} checked={prefs[id]} onCheckedChange={(v) => setPrefs({ ...prefs, [id]: v })} />
    </div>
  );

  return (
    <Card className="material-card">
      <CardHeader className="pb-2">
        <CardTitle className="title-medium">Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        <Row id="outbreaks" label="Outbreak notifications (cholera, typhoid, etc.)" />
        <Row id="water" label="Water contamination alerts" />
        <Row id="seasonal" label="Seasonal health warnings (monsoon/flood)" />
        <div className="h-px bg-divider my-1" />
        <Row id="push" label="Device push notifications" />
        <Row id="sms" label="SMS notifications" />
      </CardContent>
    </Card>
  );
}
