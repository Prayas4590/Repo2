import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MdIcon from '@/components/ui/md3-icon';
import { toast } from '@/components/ui/sonner';

// Types
type ParameterSet = Record<string, string | number | null>;

type ManualTest = {
  id: string;
  type: 'manual' | 'iot' | 'lab';
  createdAt: string;
  location: { state: string; district: string; village: string; sourceType?: string };
  parameters: ParameterSet;
  photo?: string | null;
  notes?: string;
  labReportName?: string | null;
  labReportFileName?: string | null;
};

const STORAGE_KEY = 'asha_water_archive_v1';

const STATES = ['Assam','Meghalaya','Manipur','Tripura','Nagaland','Arunachal Pradesh','Mizoram','Sikkim'] as const;
const DISTRICTS: Record<string, string[]> = {
  Assam: ['Kamrup','Barpeta','Dibrugarh','Cachar','Tinsukia','Nagaon'],
  Meghalaya: ['East Khasi Hills','West Garo Hills','Ri-Bhoi'],
  Manipur: ['Imphal West','Thoubal'],
  Tripura: ['West Tripura','South Tripura'],
  Nagaland: ['Dimapur','Kohima'],
  'Arunachal Pradesh': ['Papum Pare','East Siang'],
  Mizoram: ['Aizawl','Lunglei'],
  Sikkim: ['East Sikkim','South Sikkim']
};
const VILLAGES: Record<string, string[]> = {
  Kamrup:['Changsari','Hajo','Mirza'], Barpeta:['Sarthebari','Howly','Sarupeta'], Dibrugarh:['Naharkatia','Moran','Duliajan'], Cachar:['Udharbond','Lakhipur'],
  Tinsukia:['Margherita','Doomdooma'], Nagaon:['Samaguri','Raha'], 'East Khasi Hills':['Mawphlang','Sohra'], 'West Garo Hills':['Tura','Phulbari'], 'Ri-Bhoi':['Nongpoh','Umling'],
  'Imphal West':['Konthoujam','Langthabal'], Thoubal:['Wangjing','Heirok'], 'West Tripura':['Jirania','Bishalgarh'], 'South Tripura':['Belonia','Hrishyamukh'],
  Dimapur:['Chumoukedima','Medziphema'], Kohima:['Sechu-Zubza','Khuzama'], 'Papum Pare':['Doimukh','Banderdewa'],'East Siang':['Ruksin','Pasighat Rural'],
  Aizawl:['Sairang','Durtlang'], Lunglei:['Hnahthial','Lunglei Rural'], 'East Sikkim':['Rangpo','Pakyong'], 'South Sikkim':['Namchi','Ravangla']
};

const DEFAULT_PARAMS = {
  Turbidity: '—',
  TDS: '—',
  pH: '—',
  Temperature: '—',
  Hardness: '—',
  Chlorine: '—',
  Nitrate: '—',
  Ammonia: '—',
  Fluoride: '—',
  Sulphate: '—',
  Iron: '—',
  Arsenic: '—'
};

function loadArchive(): ManualTest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ManualTest[];
  } catch { return []; }
}
function saveArchive(items: ManualTest[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
}

export default function WaterMonitoringSection() {
  const [connected, setConnected] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [iotValues, setIotValues] = useState<Record<string,string>>(() => ({ ...DEFAULT_PARAMS } as Record<string,string>));
  const intervalRef = useRef<number | null>(null);
  const labInputRef = useRef<HTMLInputElement | null>(null);
  const manualPhotoRef = useRef<HTMLInputElement | null>(null);

  const [state, setState] = useState<string>('Assam');
  const [district, setDistrict] = useState<string>(DISTRICTS['Assam'][0]);
  const [village, setVillage] = useState<string>(VILLAGES[district]?.[0] || '');
  const [sourceType, setSourceType] = useState<string>('Well');

  useEffect(()=>{ setDistrict(DISTRICTS[state][0]); },[state]);
  useEffect(()=>{ setVillage(VILLAGES[district]?.[0] || ''); },[district]);

  // Archive
  const [archive, setArchive] = useState<ManualTest[]>(() => loadArchive());

  useEffect(()=>{ saveArchive(archive); },[archive]);

  // Simulation
  useEffect(()=>{
    if(simulating){
      intervalRef.current = window.setInterval(()=>{
        const next: Record<string,string> = {} as any;
        next.Turbidity = `${(Math.random()*100).toFixed(1)} NTU`;
        next.TDS = `${(100 + Math.random()*900).toFixed(0)} mg/L`;
        next.pH = `${(6 + Math.random()*2).toFixed(1)}`;
        next.Temperature = `${(20 + Math.random()*10).toFixed(1)} °C`;
        next.Hardness = `${(50 + Math.random()*200).toFixed(0)} mg/L`;
        setIotValues(prev => ({ ...prev, ...next }));
      }, 3000);
    } else {
      if(intervalRef.current) window.clearInterval(intervalRef.current);
    }
    return ()=>{ if(intervalRef.current) window.clearInterval(intervalRef.current); };
  },[simulating]);

  const connectIoT = () => {
    setConnected(true);
    setSimulating(true);
    toast('IoT device connected (simulation)');
  };
  const disconnectIoT = () => {
    setConnected(false);
    setSimulating(false);
    toast('IoT device disconnected');
  };

  const recordFromIoT = () => {
    const item: ManualTest = {
      id: `iot-${Date.now()}`,
      type: 'iot',
      createdAt: new Date().toISOString(),
      location: { state, district, village, sourceType },
      parameters: { ...iotValues },
      photo: null
    };
    setArchive(prev => [item, ...prev]);
    toast('Recorded reading from IoT');
  };

  // Manual form state
  const [manualParams, setManualParams] = useState<Record<string,string>>(() => ({ ...DEFAULT_PARAMS } as Record<string,string>));
  const [manualPhoto, setManualPhoto] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const onManualParamChange = (key:string, val:string) => setManualParams(prev=>({ ...prev, [key]: val }));

  const handlePhoto = (file?: File) => {
    if(!file) return setManualPhoto(null);
    const reader = new FileReader();
    reader.onload = () => setManualPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const submitManual = () => {
    const item: ManualTest = {
      id: `man-${Date.now()}`,
      type: 'manual',
      createdAt: new Date().toISOString(),
      location: { state, district, village, sourceType },
      parameters: { ...manualParams },
      photo: manualPhoto,
      notes
    };
    setArchive(prev=>[item, ...prev]);
    toast('Manual test submitted');
    setManualParams({ ...DEFAULT_PARAMS } as Record<string,string>);
    setManualPhoto(null);
    setNotes('');
  };

  // Lab report upload
  const [labName, setLabName] = useState('');
  const [labFileName, setLabFileName] = useState<string | null>(null);
  const handleLabFile = (file?: File) => { if(!file) return setLabFileName(null); setLabFileName(file.name); };
  const submitLabReport = () => {
    if(!labName || !labFileName){ toast('Provide lab name and upload file'); return; }
    const item: ManualTest = {
      id: `lab-${Date.now()}`,
      type: 'lab',
      createdAt: new Date().toISOString(),
      location: { state, district, village },
      parameters: {},
      photo: null,
      labReportName: labName,
      labReportFileName: labFileName
    };
    setArchive(prev=>[item,...prev]);
    toast('Lab report uploaded');
    setLabName(''); setLabFileName(null);
  };

  const removeArchive = (id:string) => {
    setArchive(prev=>prev.filter(i=>i.id!==id));
    toast('Removed entry');
  };

  const IoTCard = (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-lg bg-asha/10 flex items-center justify-center`}>
            <MdIcon name="sensors" size={20} />
          </div>
          <div>
            <p className="label-large text-text-primary">IoT Device</p>
            <p className="body-small text-text-secondary">Connect a local IoT water sensor (simulated)</p>
          </div>
        </div>
        <div>
          {!connected ? (
            <Button onClick={connectIoT} variant="secondary">Connect</Button>
          ) : (
            <Button onClick={disconnectIoT} variant="destructive">Disconnect</Button>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {Object.keys(DEFAULT_PARAMS).slice(0,5).map((k)=> (
          <div key={k} className="p-3 rounded-lg bg-surface-variant/20 border border-divider">
            <p className="label-small text-text-secondary">{k}</p>
            <p className="title-small text-text-primary mt-1">{iotValues[k] ?? '—'}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Button onClick={recordFromIoT} disabled={!connected} className="flex-1">Record from IoT</Button>
        <Button onClick={()=>{ setIotValues({ ...DEFAULT_PARAMS } as Record<string,string>); toast('Cleared preview'); }} variant="outline">Clear</Button>
      </div>
    </div>
  );

  const ManualForm = (
    <div className="p-4 space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <Select value={state} onValueChange={(v)=>setState(v)}>
          <SelectTrigger className="w-full"><SelectValue placeholder="State" /></SelectTrigger>
          <SelectContent>
            {STATES.map(s=> <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={district} onValueChange={(v)=>setDistrict(v)}>
          <SelectTrigger className="w-full"><SelectValue placeholder="District" /></SelectTrigger>
          <SelectContent>
            {(DISTRICTS[state]||[]).map(d=> <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Select value={village} onValueChange={(v)=>setVillage(v)}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Village" /></SelectTrigger>
          <SelectContent>
            {(VILLAGES[district]||[]).map(v=> <SelectItem key={v} value={v}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sourceType} onValueChange={(v)=>setSourceType(v)}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Source" /></SelectTrigger>
          <SelectContent>
            {['Well','Lake','River','Tap','Tube well'].map(s=> <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div>
        <p className="label-medium">Parameters</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {Object.keys(DEFAULT_PARAMS).map(k=> (
            <div key={k} className="space-y-1">
              <Label className="text-xs">{k}</Label>
              <Input value={manualParams[k] as string} onChange={(e:any)=>onManualParamChange(k, e.target.value)} placeholder={k === 'pH' ? '7.0' : k === 'Temperature' ? '25 °C' : ''} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Upload photo (color test / source)</Label>
        <input type="file" accept="image/*" className="mt-2" onChange={(e)=>handlePhoto(e.target.files?.[0])} />
        {manualPhoto && <img src={manualPhoto} alt="preview" className="mt-2 rounded-lg w-full object-cover h-32" />}
      </div>

      <div>
        <Label>Notes</Label>
        <textarea className="w-full rounded-md border p-2" value={notes} onChange={(e)=>setNotes(e.target.value)} />
      </div>

      <div className="flex gap-2">
        <Button onClick={submitManual} className="flex-1">Submit Test</Button>
        <Button variant="outline" onClick={()=>{ setManualParams({ ...DEFAULT_PARAMS } as Record<string,string>); setManualPhoto(null); setNotes(''); }}>Reset</Button>
      </div>
    </div>
  );

  const LabForm = (
    <div className="p-4 space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <Input placeholder="Lab name" value={labName} onChange={(e:any)=>setLabName(e.target.value)} />
        <div>
          <input type="file" accept=".pdf,.jpg,.png" onChange={(e)=>handleLabFile(e.target.files?.[0])} />
          {labFileName && <p className="body-small mt-1">{labFileName}</p>}
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={submitLabReport} className="flex-1">Upload Report</Button>
        <Button variant="outline" onClick={()=>{ setLabName(''); setLabFileName(null); }}>Clear</Button>
      </div>
    </div>
  );

  const ArchiveView = (
    <div className="p-4 space-y-3">
      {archive.length === 0 && <p className="body-medium text-text-secondary text-center">No submissions yet.</p>}
      {archive.map(item => (
        <div key={item.id} className="p-3 rounded-lg bg-surface-variant/20 border border-divider">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="label-medium text-text-primary">{item.type === 'iot' ? 'IoT Reading' : item.type === 'manual' ? 'On-spot Test' : 'Lab Report'}</p>
              <p className="body-small text-text-secondary mt-1">{new Date(item.createdAt).toLocaleString()}</p>
              <p className="body-small text-text-secondary mt-1">{item.location.village}, {item.location.district}</p>
            </div>
            <div className="text-right">
              <Badge className="bg-muted/10">{item.type}</Badge>
              <div className="mt-2">
                <Button size="sm" variant="ghost" onClick={()=>{ navigator.clipboard?.writeText(JSON.stringify(item)); toast('Copied JSON'); }}>Share</Button>
                <Button size="sm" variant="ghost" onClick={()=>removeArchive(item.id)}>Delete</Button>
              </div>
            </div>
          </div>
          {item.photo && <img src={item.photo} alt="photo" className="mt-3 rounded-md w-full h-36 object-cover" />}
          {item.labReportName && <p className="body-small mt-2">Lab: {item.labReportName} • {item.labReportFileName}</p>}
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-md mx-auto w-full pb-24">
      <Card className="material-card">
        <CardHeader className="pb-3">
          <CardTitle className="title-medium flex items-center gap-2">
            <MdIcon name="water_drop" size={20} className="text-asha" />
            Water Quality Monitoring & Reporting
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full grid grid-cols-3 rounded-none sticky top-0 z-10">
            <button className="text-[11px] py-3">IoT</button>
            <button className="text-[11px] py-3">On-spot</button>
            <button className="text-[11px] py-3">Reports</button>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <div className="mb-2">
                <p className="label-medium">Location (selected)</p>
                <p className="body-small text-text-secondary">{village}, {district}, {state}</p>
              </div>
              {IoTCard}
            </div>

            <div>
              <SectionDivider />
              <div className="mt-2">
                <p className="label-medium">On-spot Water Test</p>
                <p className="body-small text-text-secondary">Use rapid test kit or upload photo of color comparison</p>
                {ManualForm}
              </div>
            </div>

            <div>
              <SectionDivider />
              <div className="mt-2">
                <p className="label-medium">Laboratory Report Upload</p>
                {LabForm}
              </div>
            </div>

            <div>
              <SectionDivider />
              <div className="mt-2">
                <p className="label-medium">Archive</p>
                {ArchiveView}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SectionDivider(){
  return <div className="my-3 border-t border-divider" />;
}
