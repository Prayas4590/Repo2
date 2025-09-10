import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Activity, CloudRain, Waves, MapPin, Clock } from 'lucide-react';

type CurrentAlert = {
  id: string;
  region: string;
  state: string;
  type: 'Outbreak' | 'Cluster' | 'Water Quality';
  disease: string;
  details: string;
  severity: 'High' | 'Medium' | 'Low';
  time: string;
};

type ForecastAlert = {
  id: string;
  state: string;
  disease: string;
  probability: number; // 0-100
  window: string; // e.g., 'Next 2 weeks'
  drivers: string[];
};

const severityColor = (s: CurrentAlert['severity']) => {
  if (s === 'High') return 'bg-error text-error-foreground';
  if (s === 'Medium') return 'bg-warning text-warning-foreground';
  return 'bg-success text-success-foreground';
};

const currentAlerts: CurrentAlert[] = [
  {
    id: 'a1',
    region: 'Dibrugarh',
    state: 'Assam',
    type: 'Outbreak',
    disease: 'Acute Diarrheal Disease',
    details: 'Spike in water-borne cases reported near Brahmaputra riverine areas.',
    severity: 'High',
    time: '1h ago'
  },
  {
    id: 'a2',
    region: 'Aizawl',
    state: 'Mizoram',
    type: 'Cluster',
    disease: 'Typhoid',
    details: 'School cluster under investigation; probable water contamination.',
    severity: 'Medium',
    time: '3h ago'
  },
  {
    id: 'a3',
    region: 'Imphal West',
    state: 'Manipur',
    type: 'Water Quality',
    disease: 'Coliform contamination',
    details: 'Elevated coliform counts in community handpumps reported.',
    severity: 'Medium',
    time: 'Today'
  },
  {
    id: 'a4',
    region: 'Agartala',
    state: 'Tripura',
    type: 'Outbreak',
    disease: 'Hepatitis A',
    details: 'Case cluster detected post heavy rainfall event.',
    severity: 'Low',
    time: 'Yesterday'
  }
];

const forecastAlerts: ForecastAlert[] = [
  {
    id: 'f1',
    state: 'Assam',
    disease: 'Water-borne diseases',
    probability: 78,
    window: 'Next 2–3 weeks',
    drivers: ['Monsoon rainfall', 'Reported contamination', 'High river level']
  },
  {
    id: 'f2',
    state: 'Meghalaya',
    disease: 'Acute Gastroenteritis',
    probability: 62,
    window: 'Next 2 weeks',
    drivers: ['Intermittent supply', 'Surface runoff']
  },
  {
    id: 'f3',
    state: 'Nagaland',
    disease: 'Typhoid',
    probability: 55,
    window: 'Next 3 weeks',
    drivers: ['Poor chlorination coverage']
  },
  {
    id: 'f4',
    state: 'Arunachal Pradesh',
    disease: 'Jaundice (Hep-A/E)',
    probability: 47,
    window: 'Next 2 weeks',
    drivers: ['Road closures delaying water testing']
  }
];

export default function DoctorAlertsSection() {
  return (
    <section className="space-y-4" id="alerts">
      {/* Header */}
      <Card className="material-card">
        <CardHeader className="pb-2">
          <CardTitle className="title-medium flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-error" />
            Regional Alerts & Forecasts
          </CardTitle>
        </CardHeader>
        <CardContent className="body-medium text-text-secondary">
          Curated, actionable alerts for North-Eastern states with near-term risk outlook.
        </CardContent>
      </Card>

      {/* Current Updates */}
      <Card className="material-card">
        <CardHeader className="pb-2">
          <CardTitle className="title-medium flex items-center gap-2">
            <Activity className="h-5 w-5 text-doctor" />
            Current Updates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentAlerts.map((a) => (
            <div key={a.id} className="p-4 rounded-xl border border-border bg-surface">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="label-medium text-text-primary">{a.type} · {a.disease}</p>
                  <div className="flex items-center gap-2 body-small text-text-secondary mt-0.5">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="truncate">{a.region}, {a.state}</span>
                    <span className="text-divider">•</span>
                    <Clock className="h-3.5 w-3.5" />
                    <span>{a.time}</span>
                  </div>
                </div>
                <Badge className={severityColor(a.severity)}>{a.severity}</Badge>
              </div>
              <p className="body-medium text-text-primary mt-3">{a.details}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Forecast */}
      <Card className="material-card">
        <CardHeader className="pb-2">
          <CardTitle className="title-medium flex items-center gap-2">
            <CloudRain className="h-5 w-5 text-info" />
            Forecast: Water-borne Risk
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {forecastAlerts.map((f) => (
            <div key={f.id} className="p-4 rounded-xl border border-border bg-surface">
              <div className="flex items-center justify-between gap-3">
                <p className="label-medium text-text-primary">{f.state} · {f.disease}</p>
                <span className="label-medium text-info">{f.probability}%</span>
              </div>
              <p className="body-small text-text-secondary">{f.window}</p>
              <div className="h-2 w-full bg-muted rounded-full mt-2">
                <div className="h-2 bg-info rounded-full" style={{ width: `${f.probability}%` }} />
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {f.drivers.map((d, idx) => (
                  <Badge key={idx} variant="outline" className="bg-surface-variant/40">{d}</Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Notes */}
      <Card className="material-card">
        <CardHeader className="pb-2">
          <CardTitle className="title-medium flex items-center gap-2">
            <Waves className="h-5 w-5 text-primary" />
            Water Quality Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="body-medium text-text-secondary">
          Consider chlorination drives, safe water messaging, and rapid testing in high-risk blocks. Coordinate with PHCs and ASHAs for source tracing.
        </CardContent>
      </Card>
    </section>
  );
}
