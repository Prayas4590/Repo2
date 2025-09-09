import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';
import MdIcon from '@/components/ui/md3-icon';

// Types
export type AlertRisk = 'low' | 'medium' | 'high';
export type AlertSource = 'Reported cases' | 'AI prediction' | 'Water test' | 'Remote sensor' | 'Authority';

export interface OutbreakAlert {
  id: string;
  disease: string;
  state: string;
  district: string;
  village: string;
  cases: number;
  risk: AlertRisk;
  distanceKm: number;
  updatedAt: string; // ISO
  source: AlertSource;
}

export interface WaterAlert {
  id: string;
  contaminant: string;
  level: string;
  state: string;
  district: string;
  village: string;
  sourceName: string;
  severity: AlertRisk;
  recommendation: string;
  updatedAt: string;
  detectedBy: AlertSource;
}

export interface GuidelineItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

export interface EmergencyInstruction {
  id: string;
  title: string;
  issuedBy: string;
  state: string;
  district: string;
  villages: string[];
  updatedAt: string;
  steps: string[];
  severity: AlertRisk;
}

export type AlertPrefs = {
  pushEnabled: boolean;
  toastEnabled: boolean;
  areas: { state: string; district: string; village: string }[];
  categories: { outbreaks: boolean; water: boolean; emergency: boolean; guidelines: boolean };
  radiusKm: number; // reserved for future geo filtering
};

const PREFS_KEY = 'asha_alert_prefs_v1';

// Northeastern India mock taxonomy
const STATES = [
  'Assam',
  'Meghalaya',
  'Manipur',
  'Tripura',
  'Nagaland',
  'Arunachal Pradesh',
  'Mizoram',
  'Sikkim',
] as const;

const DISTRICTS: Record<(typeof STATES)[number], string[]> = {
  Assam: ['Kamrup', 'Barpeta', 'Dibrugarh', 'Cachar', 'Tinsukia', 'Nagaon'],
  Meghalaya: ['East Khasi Hills', 'West Garo Hills', 'Ri-Bhoi'],
  Manipur: ['Imphal West', 'Thoubal'],
  Tripura: ['West Tripura', 'South Tripura'],
  Nagaland: ['Dimapur', 'Kohima'],
  'Arunachal Pradesh': ['Papum Pare', 'East Siang'],
  Mizoram: ['Aizawl', 'Lunglei'],
  Sikkim: ['East Sikkim', 'South Sikkim'],
};

const VILLAGES: Record<string, string[]> = {
  Kamrup: ['Changsari', 'Hajo', 'Mirza'],
  Barpeta: ['Sarthebari', 'Howly', 'Sarupeta'],
  Dibrugarh: ['Naharkatia', 'Moran', 'Duliajan'],
  Cachar: ['Udharbond', 'Lakhipur'],
  Tinsukia: ['Margherita', 'Doomdooma'],
  Nagaon: ['Samaguri', 'Raha'],
  'East Khasi Hills': ['Mawphlang', 'Sohra'],
  'West Garo Hills': ['Tura', 'Phulbari'],
  'Ri-Bhoi': ['Nongpoh', 'Umling'],
  'Imphal West': ['Konthoujam', 'Langthabal'],
  Thoubal: ['Wangjing', 'Heirok'],
  'West Tripura': ['Jirania', 'Bishalgarh'],
  'South Tripura': ['Belonia', 'Hrishyamukh'],
  Dimapur: ['Chumoukedima', 'Medziphema'],
  Kohima: ['Sechu-Zubza', 'Khuzama'],
  'Papum Pare': ['Doimukh', 'Banderdewa'],
  'East Siang': ['Ruksin', 'Pasighat Rural'],
  Aizawl: ['Sairang', 'Durtlang'],
  Lunglei: ['Hnahthial', 'Lunglei Rural'],
  'East Sikkim': ['Rangpo', 'Pakyong'],
  'South Sikkim': ['Namchi', 'Ravangla'],
};

// Mock data
const initialOutbreaks: OutbreakAlert[] = [
  {
    id: 'ob1', disease: 'Cholera', state: 'Assam', district: 'Kamrup', village: 'Hajo', cases: 14,
    risk: 'high', distanceKm: 12, updatedAt: new Date().toISOString(), source: 'Reported cases'
  },
  {
    id: 'ob2', disease: 'Typhoid', state: 'Meghalaya', district: 'East Khasi Hills', village: 'Sohra', cases: 9,
    risk: 'medium', distanceKm: 34, updatedAt: new Date().toISOString(), source: 'AI prediction'
  },
  {
    id: 'ob3', disease: 'Acute Diarrheal Disease', state: 'Assam', district: 'Barpeta', village: 'Howly', cases: 21,
    risk: 'high', distanceKm: 28, updatedAt: new Date().toISOString(), source: 'Reported cases'
  },
  {
    id: 'ob4', disease: 'Hepatitis A', state: 'Nagaland', district: 'Dimapur', village: 'Medziphema', cases: 5,
    risk: 'low', distanceKm: 62, updatedAt: new Date().toISOString(), source: 'AI prediction'
  },
];

const initialWater: WaterAlert[] = [
  {
    id: 'wa1', contaminant: 'E. coli', level: 'High', state: 'Assam', district: 'Barpeta', village: 'Sarthebari',
    sourceName: 'Handpump-3, Ward 2', severity: 'high', recommendation: 'Boil water for 20 minutes and use chlorine tablets.',
    updatedAt: new Date().toISOString(), detectedBy: 'Water test'
  },
  {
    id: 'wa2', contaminant: 'Arsenic', level: 'Moderate', state: 'Assam', district: 'Dibrugarh', village: 'Moran',
    sourceName: 'Tube well near school', severity: 'medium', recommendation: 'Avoid source; use alternate community tap.',
    updatedAt: new Date().toISOString(), detectedBy: 'Remote sensor'
  },
  {
    id: 'wa3', contaminant: 'Turbidity', level: 'High', state: 'Meghalaya', district: 'West Garo Hills', village: 'Tura',
    sourceName: 'PHE Tank Line 1', severity: 'high', recommendation: 'Use filtered water; allow sedimentation before use.',
    updatedAt: new Date().toISOString(), detectedBy: 'Reported cases'
  },
];

const initialGuidelines: GuidelineItem[] = [
  { id: 'g1', title: 'Oral Rehydration First', description: 'For diarrhea cases, administer ORS immediately and monitor dehydration signs.', tags: ['diarrhea', 'ADD', 'cholera'] },
  { id: 'g2', title: 'Safe Water Protocol', description: 'Promote boiling water for 20 minutes and using covered containers for storage.', tags: ['water', 'cholera', 'hepatitis A'] },
  { id: 'g3', title: 'Typhoid Prevention', description: 'Encourage handwashing with soap before meals and after toilet use.', tags: ['typhoid'] },
  { id: 'g4', title: 'Flood Response', description: 'Move medical kits to higher ground; distribute chlorine tablets where needed.', tags: ['flood', 'emergency'] },
];

const initialEmergency: EmergencyInstruction[] = [
  {
    id: 'e1', title: 'Flood Advisory - Evacuation Support', issuedBy: 'District Health Officer, Kamrup', state: 'Assam',
    district: 'Kamrup', villages: ['Changsari', 'Hajo'], updatedAt: new Date().toISOString(), severity: 'high',
    steps: [
      'Identify high-risk households near river banks',
      'Distribute ORS, chlorine tablets, and first aid kits',
      'Report daily counts of diarrhea and fever cases by 6 PM',
      'Coordinate with PHC for mobile clinic support'
    ]
  },
  {
    id: 'e2', title: 'Hepatitis A Vaccination Drive', issuedBy: 'CMHO, East Khasi Hills', state: 'Meghalaya',
    district: 'East Khasi Hills', villages: ['Mawphlang', 'Sohra'], updatedAt: new Date().toISOString(), severity: 'medium',
    steps: [
      'Prepare beneficiary list for target villages',
      'Ensure cold-chain readiness and vaccine stock check',
      'Educate households on sanitation during monsoon'
    ]
  }
];

const severityBadge = (risk: AlertRisk) => {
  const map: Record<AlertRisk, string> = {
    high: 'bg-error/10 text-error',
    medium: 'bg-warning/10 text-warning',
    low: 'bg-success/10 text-success',
  };
  return map[risk];
};

function useLocalPrefs(): [AlertPrefs, (p: AlertPrefs) => void] {
  const [prefs, setPrefs] = useState<AlertPrefs>(() => {
    const saved = localStorage.getItem(PREFS_KEY);
    if (saved) return JSON.parse(saved) as AlertPrefs;
    return {
      pushEnabled: false,
      toastEnabled: true,
      areas: [
        { state: 'Assam', district: 'Kamrup', village: 'Hajo' },
        { state: 'Assam', district: 'Barpeta', village: 'Howly' },
      ],
      categories: { outbreaks: true, water: true, emergency: true, guidelines: true },
      radiusKm: 50,
    };
  });

  useEffect(() => {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  }, [prefs]);

  return [prefs, setPrefs];
}

const SectionHeader = ({ title, icon }: { title: string; icon: string }) => (
  <div className="sticky top-0 z-10 bg-surface px-4 pt-3 pb-2 border-b border-divider">
    <div className="flex items-center gap-2">
      <MdIcon name={icon} size={20} className="text-primary" />
      <span className="title-medium text-text-primary">{title}</span>
    </div>
  </div>
);

export default function AshaAlertsSection() {
  const [prefs, setPrefs] = useLocalPrefs();
  const [tab, setTab] = useState<'outbreaks' | 'water' | 'guidelines' | 'emergency' | 'preferences'>('outbreaks');

  const [outbreaks, setOutbreaks] = useState<OutbreakAlert[]>(initialOutbreaks);
  const [water, setWater] = useState<WaterAlert[]>(initialWater);
  const [guidelines] = useState<GuidelineItem[]>(initialGuidelines);
  const [emergency, setEmergency] = useState<EmergencyInstruction[]>(initialEmergency);

  const intervalRef = useRef<number | null>(null);

  // Filter by selected areas
  const areaFilter = (state: string, district: string, village: string) => {
    if (!prefs.areas.length) return true;
    return prefs.areas.some(a => a.state === state && a.district === district && a.village === village);
  };

  const filteredOutbreaks = useMemo(() => outbreaks.filter(o => areaFilter(o.state, o.district, o.village)), [outbreaks, prefs.areas]);
  const filteredWater = useMemo(() => water.filter(w => areaFilter(w.state, w.district, w.village)), [water, prefs.areas]);
  const filteredEmergency = useMemo(() => emergency.filter(e => e.villages.some(v => prefs.areas.some(a => a.village === v && a.district === e.district && a.state === e.state))), [emergency, prefs.areas]);
  const relevantGuidelines = useMemo(() => {
    const diseases = new Set(filteredOutbreaks.map(o => o.disease.toLowerCase()));
    const tags = new Set<string>();
    diseases.forEach(d => {
      if (d.includes('cholera')) tags.add('cholera');
      if (d.includes('typhoid')) tags.add('typhoid');
      if (d.includes('diarr')) tags.add('diarrhea');
      if (d.includes('hepatitis')) tags.add('hepatitis A');
    });
    return guidelines.filter(g => g.tags.some(t => tags.has(t)) || prefs.categories.guidelines);
  }, [guidelines, filteredOutbreaks, prefs.categories.guidelines]);

  // Simulate real-time alerts
  useEffect(() => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      // Randomly decide to push an alert
      const r = Math.random();
      if (r < 0.5 && prefs.categories.outbreaks) {
        const samples: Omit<OutbreakAlert, 'id' | 'updatedAt'>[] = [
          { disease: 'Acute Diarrheal Disease', state: 'Assam', district: 'Barpeta', village: 'Sarthebari', cases: 6, risk: 'medium', distanceKm: 18, source: 'AI prediction' },
          { disease: 'Cholera', state: 'Meghalaya', district: 'West Garo Hills', village: 'Tura', cases: 4, risk: 'high', distanceKm: 22, source: 'Reported cases' },
          { disease: 'Typhoid', state: 'Assam', district: 'Kamrup', village: 'Changsari', cases: 3, risk: 'low', distanceKm: 9, source: 'AI prediction' },
        ];
        const pick = samples[Math.floor(Math.random() * samples.length)];
        if (areaFilter(pick.state, pick.district, pick.village)) {
          const alert: OutbreakAlert = { id: `ob-${Date.now()}`, updatedAt: new Date().toISOString(), ...pick };
          setOutbreaks(prev => [alert, ...prev].slice(0, 30));
          if (prefs.toastEnabled) toast(`Outbreak: ${pick.disease} in ${pick.village}`, { description: `${pick.cases} cases • ${pick.source}` });
          if (prefs.pushEnabled && 'Notification' in window && Notification.permission === 'granted') {
            try { new Notification(`Outbreak: ${pick.disease} - ${pick.village}`, { body: `${pick.cases} cases • ${pick.source}` }); } catch {}
          }
        }
      } else if (prefs.categories.water) {
        const samples: Omit<WaterAlert, 'id' | 'updatedAt'>[] = [
          { contaminant: 'E. coli', level: 'High', state: 'Assam', district: 'Barpeta', village: 'Howly', sourceName: 'Community tap - Ward 1', severity: 'high', recommendation: 'Boil water and chlorinate before use.', detectedBy: 'Water test' },
          { contaminant: 'Arsenic', level: 'Moderate', state: 'Assam', district: 'Dibrugarh', village: 'Duliajan', sourceName: 'Handpump near Anganwadi', severity: 'medium', recommendation: 'Use alternate source and report to PHC.', detectedBy: 'Remote sensor' },
        ];
        const pick = samples[Math.floor(Math.random() * samples.length)];
        if (areaFilter(pick.state, pick.district, pick.village)) {
          const alert: WaterAlert = { id: `wa-${Date.now()}`, updatedAt: new Date().toISOString(), ...pick };
          setWater(prev => [alert, ...prev].slice(0, 30));
          if (prefs.toastEnabled) toast(`Water alert in ${pick.village}`, { description: `${pick.contaminant} • ${pick.level}` });
          if (prefs.pushEnabled && 'Notification' in window && Notification.permission === 'granted') {
            try { new Notification(`Water alert - ${pick.village}`, { body: `${pick.contaminant} • ${pick.level}` }); } catch {}
          }
        }
      }
    }, 12000); // every 12s

    return () => { if (intervalRef.current) window.clearInterval(intervalRef.current); };
  }, [prefs.categories.outbreaks, prefs.categories.water, prefs.pushEnabled, prefs.toastEnabled]);

  const requestPush = async () => {
    if (!('Notification' in window)) {
      toast('Notifications not supported on this device');
      return;
    }
    const perm = await Notification.requestPermission();
    const enabled = perm === 'granted';
    setPrefs({ ...prefs, pushEnabled: enabled });
    toast(enabled ? 'Push notifications enabled' : 'Push permission denied');
  };

  const addArea = (state: string, district: string, village: string) => {
    const exists = prefs.areas.some(a => a.state === state && a.district === district && a.village === village);
    if (exists) return;
    setPrefs({ ...prefs, areas: [...prefs.areas, { state, district, village }] });
  };

  const removeArea = (i: number) => {
    const next = prefs.areas.slice();
    next.splice(i, 1);
    setPrefs({ ...prefs, areas: next });
  };

  // Controlled selects for adding area
  const [selState, setSelState] = useState<string>('Assam');
  const [selDistrict, setSelDistrict] = useState<string>(DISTRICTS['Assam'][0]);
  const [selVillage, setSelVillage] = useState<string>(VILLAGES[selDistrict][0]);

  useEffect(() => {
    setSelDistrict(DISTRICTS[selState as typeof STATES[number]][0]);
  }, [selState]);
  useEffect(() => {
    const villages = VILLAGES[selDistrict] || [];
    setSelVillage(villages[0]);
  }, [selDistrict]);

  return (
    <div className="max-w-md mx-auto w-full pb-24">
      <Card className="material-card">
        <CardHeader className="pb-3">
          <CardTitle className="title-medium flex items-center gap-2">
            <MdIcon name="health_and_safety" size={20} className="text-asha" />
            Health Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="w-full">
            <TabsList className="w-full grid grid-cols-5 rounded-none sticky top-0 z-10">
              <TabsTrigger value="outbreaks" className="text-[11px] py-3">
                <MdIcon name="coronavirus" size={18} className="mr-1" />
                Outbreaks
              </TabsTrigger>
              <TabsTrigger value="water" className="text-[11px] py-3">
                <MdIcon name="water_drop" size={18} className="mr-1" />
                Water
              </TabsTrigger>
              <TabsTrigger value="guidelines" className="text-[11px] py-3">
                <MdIcon name="campaign" size={18} className="mr-1" />
                Tips
              </TabsTrigger>
              <TabsTrigger value="emergency" className="text-[11px] py-3">
                <MdIcon name="emergency" size={18} className="mr-1" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="preferences" className="text-[11px] py-3">
                <MdIcon name="tune" size={18} className="mr-1" />
                Prefs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="outbreaks" className="p-0">
              <SectionHeader title="Disease Outbreak Alerts" icon="coronavirus" />
              <div className="p-4 space-y-3">
                {filteredOutbreaks.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl bg-surface-variant/20 border border-divider flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${severityBadge(item.risk)}`}>
                      <MdIcon name="coronavirus" size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="label-large text-text-primary truncate">{item.disease}</p>
                        <Badge className={severityBadge(item.risk)}>{item.risk}</Badge>
                      </div>
                      <p className="body-small text-text-secondary mt-1 truncate">
                        {item.village}, {item.district}, {item.state} • {item.cases} cases • {item.source}
                      </p>
                      <p className="body-small text-text-secondary mt-1">Updated {new Date(item.updatedAt).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))}
                {filteredOutbreaks.length === 0 && (
                  <p className="body-medium text-text-secondary text-center py-8">No alerts in selected areas.</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="water" className="p-0">
              <SectionHeader title="Water Contamination Alerts" icon="water_drop" />
              <div className="p-4 space-y-3">
                {filteredWater.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl bg-surface-variant/20 border border-divider flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${severityBadge(item.severity)}`}>
                      <MdIcon name="water_drop" size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="label-large text-text-primary truncate">{item.contaminant} • {item.level}</p>
                        <Badge className={severityBadge(item.severity)}>{item.severity}</Badge>
                      </div>
                      <p className="body-small text-text-secondary mt-1 truncate">
                        {item.sourceName}
                      </p>
                      <p className="body-small text-text-secondary mt-1 truncate">
                        {item.village}, {item.district}, {item.state} • {item.detectedBy}
                      </p>
                      <p className="body-small text-text-secondary mt-1">Updated {new Date(item.updatedAt).toLocaleTimeString()}</p>
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">{item.recommendation}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredWater.length === 0 && (
                  <p className="body-medium text-text-secondary text-center py-8">No water alerts in selected areas.</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="guidelines" className="p-0">
              <SectionHeader title="Preventive Health Guidelines" icon="campaign" />
              <div className="p-4 space-y-3">
                {relevantGuidelines.map((g) => (
                  <div key={g.id} className="p-4 rounded-xl bg-surface-variant/20 border border-divider">
                    <p className="label-large text-text-primary">{g.title}</p>
                    <p className="body-small text-text-secondary mt-1">{g.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {g.tags.map(t => (
                        <Badge key={t} variant="outline" className="text-xs">#{t}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
                {relevantGuidelines.length === 0 && (
                  <p className="body-medium text-text-secondary text-center py-8">No specific tips. Enable categories in Prefs.</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="emergency" className="p-0">
              <SectionHeader title="Emergency Instructions" icon="emergency" />
              <div className="p-4 space-y-3">
                {filteredEmergency.map((e) => (
                  <div key={e.id} className="p-4 rounded-xl bg-surface-variant/20 border border-divider">
                    <div className="flex items-center justify-between">
                      <p className="label-large text-text-primary">{e.title}</p>
                      <Badge className={severityBadge(e.severity)}>{e.severity}</Badge>
                    </div>
                    <p className="body-small text-text-secondary mt-1">
                      {e.issuedBy} • {e.district}, {e.state}
                    </p>
                    <div className="mt-2 space-y-2">
                      {e.steps.map((s, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <MdIcon name="check_circle" size={18} className="text-asha mt-[2px]" />
                          <span className="body-small text-text-primary">{s}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Button size="sm" variant="secondary" onClick={() => toast('Acknowledged', { description: e.title })}>Acknowledge</Button>
                    </div>
                  </div>
                ))}
                {filteredEmergency.length === 0 && (
                  <p className="body-medium text-text-secondary text-center py-8">No active instructions for your areas.</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="preferences" className="p-0">
              <SectionHeader title="Location-based Custom Alerts" icon="tune" />
              <div className="p-4 space-y-5">
                <div className="space-y-3">
                  <p className="label-medium text-text-primary">Delivery</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Switch id="push" checked={prefs.pushEnabled} onCheckedChange={() => requestPush()} />
                      <Label htmlFor="push" className="body-medium">Push notifications</Label>
                    </div>
                    {('Notification' in window) && Notification.permission === 'granted' && prefs.pushEnabled && (
                      <Badge className="bg-success/10 text-success">enabled</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch id="toast" checked={prefs.toastEnabled} onCheckedChange={(v) => setPrefs({ ...prefs, toastEnabled: v })} />
                    <Label htmlFor="toast" className="body-medium">In-app alerts</Label>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="label-medium text-text-primary">Categories</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant={prefs.categories.outbreaks ? 'secondary' : 'outline'} onClick={() => setPrefs({ ...prefs, categories: { ...prefs.categories, outbreaks: !prefs.categories.outbreaks } })}>
                      <MdIcon name="coronavirus" size={18} className="mr-2" />Outbreaks
                    </Button>
                    <Button variant={prefs.categories.water ? 'secondary' : 'outline'} onClick={() => setPrefs({ ...prefs, categories: { ...prefs.categories, water: !prefs.categories.water } })}>
                      <MdIcon name="water_drop" size={18} className="mr-2" />Water
                    </Button>
                    <Button variant={prefs.categories.guidelines ? 'secondary' : 'outline'} onClick={() => setPrefs({ ...prefs, categories: { ...prefs.categories, guidelines: !prefs.categories.guidelines } })}>
                      <MdIcon name="campaign" size={18} className="mr-2" />Guidelines
                    </Button>
                    <Button variant={prefs.categories.emergency ? 'secondary' : 'outline'} onClick={() => setPrefs({ ...prefs, categories: { ...prefs.categories, emergency: !prefs.categories.emergency } })}>
                      <MdIcon name="emergency" size={18} className="mr-2" />Emergency
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="label-medium text-text-primary">Assigned Areas</p>
                  <div className="flex gap-2">
                    <Select value={selState} onValueChange={(v) => setSelState(v)}>
                      <SelectTrigger className="w-[130px]"><SelectValue placeholder="State" /></SelectTrigger>
                      <SelectContent>
                        {STATES.map(s => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                      </SelectContent>
                    </Select>
                    <Select value={selDistrict} onValueChange={(v) => setSelDistrict(v)}>
                      <SelectTrigger className="w-[150px]"><SelectValue placeholder="District" /></SelectTrigger>
                      <SelectContent>
                        {DISTRICTS[selState as typeof STATES[number]].map(d => (<SelectItem key={d} value={d}>{d}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Select value={selVillage} onValueChange={(v) => setSelVillage(v)}>
                      <SelectTrigger className="w-[200px]"><SelectValue placeholder="Village" /></SelectTrigger>
                      <SelectContent>
                        {(VILLAGES[selDistrict] || []).map(v => (<SelectItem key={v} value={v}>{v}</SelectItem>))}
                      </SelectContent>
                    </Select>
                    <Button onClick={() => addArea(selState, selDistrict, selVillage)} className="shrink-0">
                      <MdIcon name="add" size={18} className="mr-1" />Add
                    </Button>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {prefs.areas.map((a, i) => (
                      <div key={`${a.state}-${a.district}-${a.village}`} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-variant/40 border border-divider">
                        <MdIcon name="location_on" size={16} className="text-primary" />
                        <span className="text-xs text-text-primary">{a.village}, {a.district}</span>
                        <Button size="sm" variant="ghost" className="h-6 px-2" onClick={() => removeArea(i)}>
                          <MdIcon name="close" size={16} />
                        </Button>
                      </div>
                    ))}
                    {prefs.areas.length === 0 && <p className="body-small text-text-secondary">No areas selected.</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="label-medium text-text-primary">Radius</p>
                  <p className="body-small text-text-secondary">Currently {prefs.radiusKm} km (for display). Geolocation filters can be enabled later.</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
