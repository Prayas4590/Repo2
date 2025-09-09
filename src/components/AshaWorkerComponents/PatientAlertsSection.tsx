import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MdIcon from '@/components/ui/md3-icon';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import InspectionForm from './InspectionForm';
import CommunicationHub from './CommunicationHub';
import ArchiveSection from './ArchiveSection';
import { toast } from '@/components/ui/sonner';

type PatientReport = {
  id: string;
  userId: string;
  name: string;
  age: number;
  gender: string;
  location: string;
  symptoms: string[];
  details?: string;
  image?: string | null;
  status: 'new' | 'accepted' | 'transferred' | 'inspected';
  createdAt: string;
};

const MOCK: PatientReport[] = [
  { id: 'p1', userId: 'C-1001', name: 'Rita Devi', age: 32, gender: 'Female', location: 'Hajo, Kamrup, Assam', symptoms: ['Fever','Diarrhea'], details: 'Started 2 days ago after attending a wedding', image: null, status: 'new', createdAt: new Date().toISOString() },
  { id: 'p2', userId: 'C-1002', name: 'Manoj Kumar', age: 45, gender: 'Male', location: 'Sarthebari, Barpeta, Assam', symptoms: ['Abdominal pain','Vomiting'], details: 'Multiple family members affected', image: null, status: 'new', createdAt: new Date().toISOString() },
  { id: 'p3', userId: 'C-1003', name: 'Laxmi', age: 27, gender: 'Female', location: 'Sohra, East Khasi Hills, Meghalaya', symptoms: ['Fever'], details: 'High temperature, reduced appetite', image: null, status: 'accepted', createdAt: new Date().toISOString() },
];

export default function PatientAlertsSection(){
  const [reports, setReports] = useState<PatientReport[]>(MOCK);
  const [selected, setSelected] = useState<PatientReport | null>(null);
  const [showComm, setShowComm] = useState(false);
  const [archive, setArchive] = useState<PatientReport[]>([]);

  const newCount = useMemo(()=> reports.filter(r=>r.status==='new').length, [reports]);

  const accept = (id:string)=>{
    setReports(prev=> prev.map(r=> r.id===id ? { ...r, status: 'accepted' } : r));
    toast('Request accepted');
  };
  const transfer = (id:string)=>{
    setReports(prev=> prev.map(r=> r.id===id ? { ...r, status: 'transferred' } : r));
    toast('Transferred to another worker');
  };

  const openInspection = (r: PatientReport)=>{
    setSelected(r);
  };

  const onInspectionSubmit = (data:any)=>{
    // mark inspected and move to archive
    setReports(prev=> prev.map(r=> r.id===data.originalId ? { ...r, status: 'inspected' } : r));
    const inspected = reports.find(r=> r.id===data.originalId);
    if(inspected) setArchive(prev=> [{ ...inspected, status: 'inspected' }, ...prev]);
    setSelected(null);
    toast('Inspection submitted');
  };

  return (
    <div className="max-w-md mx-auto w-full pb-24">
      <Card className="material-card">
        <CardHeader className="pb-3">
          <CardTitle className="title-medium flex items-center gap-2">
            <MdIcon name="notification_important" size={20} className="text-asha" />
            Patient Alerts & Inspection Requests
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="label-medium">Incoming Reports</p>
                <p className="body-small text-text-secondary">{newCount} new</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={()=>setShowComm(s=>!s)} aria-label="Communication">
                  <MdIcon name="chat" size={18} />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {reports.map(r=> (
                <div key={r.id} className="p-3 rounded-lg bg-surface-variant/20 border border-divider">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="label-large text-text-primary">{r.name} <span className="text-xs text-text-secondary">({r.userId})</span></p>
                          <p className="body-small text-text-secondary">{r.location} • {r.age} yrs • {r.gender}</p>
                        </div>
                        <Badge className={r.status==='new' ? 'bg-warning/10 text-warning' : r.status==='accepted' ? 'bg-success/10 text-success' : 'bg-muted/10 text-muted'}>{r.status}</Badge>
                      </div>
                      <p className="body-small text-text-secondary mt-2 truncate">Symptoms: {r.symptoms.join(', ')}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <Button size="sm" variant="secondary" onClick={()=> openInspection(r)}>
                      <MdIcon name="medical_services" size={16} className="mr-2" /> Inspect
                    </Button>
                    <Button size="sm" variant="ghost" onClick={()=> accept(r.id)}>
                      <MdIcon name="check_circle" size={16} className="mr-2" /> Accept
                    </Button>
                    <Button size="sm" variant="outline" onClick={()=> transfer(r.id)}>
                      <MdIcon name="swap_horiz" size={16} className="mr-2" /> Transfer
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="ghost"><MdIcon name="visibility" size={16} className="mr-2" />View</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Report — {r.name}</DialogTitle>
                          <DialogDescription>{r.createdAt}</DialogDescription>
                        </DialogHeader>
                        <div className="p-2">
                          <p className="label-medium">Symptoms</p>
                          <p className="body-small text-text-secondary">{r.symptoms.join(', ')}</p>
                          <p className="label-medium mt-2">Details</p>
                          <p className="body-small text-text-secondary">{r.details}</p>
                          {r.image && <img src={r.image} alt="evidence" className="mt-3 w-full h-48 object-cover rounded-md" />}
                        </div>
                        <DialogFooter>
                          <Button variant="secondary" onClick={()=>{ accept(r.id); toast('Accepted'); }}>Accept</Button>
                          <Button variant="outline" onClick={()=>{ transfer(r.id); }}>Transfer</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                  </div>
                </div>
              ))}
            </div>

          </div>
        </CardContent>
      </Card>

      {selected && (
        <div className="px-4 mt-3">
          <Card className="material-card">
            <CardHeader>
              <CardTitle className="title-medium flex items-center gap-2">Fill Inspection Form</CardTitle>
            </CardHeader>
            <CardContent>
              <InspectionForm initial={selected} onSubmit={onInspectionSubmit} onCancel={()=>setSelected(null)} />
            </CardContent>
          </Card>
        </div>
      )}

      {showComm && (
        <div className="px-4 mt-3">
          <CommunicationHub />
        </div>
      )}

      <div className="px-4 mt-4">
        <ArchiveSection entries={archive} onClear={()=>setArchive([])} />
      </div>
    </div>
  );
}
