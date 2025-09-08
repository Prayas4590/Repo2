import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogPortal, DialogOverlay, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Clock, X } from 'lucide-react';

export type SymptomsReport = {
  id: string;
  reportNo?: string;
  summary: string;
  description?: string;
  selectedSymptoms?: string[];
  severity: 'low' | 'medium' | 'high';
  location: string;
  locationFields?: { village?: string; area?: string; landmark?: string };
  media?: { name: string; size: number; type: string }[];
  time: string;
  createdAt?: string;
  status: 'pending' | 'under review' | 'resolved' | 'submitted';
};

const severityColor = (s: string) => s === 'high' ? 'bg-error text-error-foreground' : s === 'medium' ? 'bg-warning text-warning-foreground' : 'bg-success text-success-foreground';

export default function SymptomsHistory() {
  const hardcoded: SymptomsReport[] = [
    {
      id: 'SR-20250908-001',
      reportNo: 'SR-20250908-001',
      summary: 'Fever, Headache',
      description: 'High fever since last night accompanied by persistent headache and mild nausea.',
      selectedSymptoms: ['Fever', 'Headache', 'Nausea'],
      severity: 'high',
      location: 'Rampur, Ward 5 • Near Temple',
      locationFields: { village: 'Rampur', area: 'Ward 5', landmark: 'Near Temple' },
      media: [{ name: 'thermometer-reading.jpg', size: 245_000, type: 'image/jpeg' }],
      time: 'Sep 8, 2025, 11:15 AM',
      createdAt: '2025-09-08T11:15:00+05:30',
      status: 'submitted',
    },
    {
      id: 'SR-20250907-003',
      reportNo: 'SR-20250907-003',
      summary: 'Diarrhea, Dehydration',
      description: 'Loose motions 4-5 times since morning and signs of dehydration.',
      selectedSymptoms: ['Diarrhea', 'Dehydration'],
      severity: 'medium',
      location: 'Shivpuri, Block A • Handpump 2',
      locationFields: { village: 'Shivpuri', area: 'Block A', landmark: 'Handpump 2' },
      media: [],
      time: 'Sep 7, 2025, 5:40 PM',
      createdAt: '2025-09-07T17:40:00+05:30',
      status: 'under review',
    },
    {
      id: 'SR-20250905-014',
      reportNo: 'SR-20250905-014',
      summary: 'Vomiting',
      description: 'Vomited twice after lunch; no fever. Monitoring at home.',
      selectedSymptoms: ['Vomiting'],
      severity: 'low',
      location: 'Lakshmi Nagar, Street 3 • Near School',
      locationFields: { village: 'Lakshmi Nagar', area: 'Street 3', landmark: 'Near School' },
      media: [{ name: 'doctor-note.pdf', size: 120_000, type: 'application/pdf' }],
      time: 'Sep 5, 2025, 9:05 AM',
      createdAt: '2025-09-05T09:05:00+05:30',
      status: 'resolved',
    },
  ];

  const [items] = useState<SymptomsReport[]>(hardcoded);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<SymptomsReport | null>(null);

  const view = (r: SymptomsReport) => {
    setSelected(r);
    setOpen(true);
  };

  return (
    <Card className="material-card">
      <CardHeader className="pb-3">
        <CardTitle className="title-medium flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Past Reports
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <div className="p-6 text-center rounded-lg border border-dashed border-divider">
            <p className="label-medium text-text-primary mb-1">No past reports</p>
            <p className="body-small text-text-secondary">Submit a symptom report to see it here.</p>
          </div>
        ) : (
          items.map((r) => (
            <div key={r.id} className="p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">{r.reportNo || `SR-${r.id}`}</Badge>
                    <Badge className={severityColor(r.severity)}>{r.severity}</Badge>
                  </div>
                  <p className="label-medium text-text-primary truncate mt-1">Report submitted</p>
                  <p className="body-small text-text-disabled">{r.time}</p>
                </div>
                <Button variant="outline" size="sm" className="ripple" onClick={() => view(r)}>View</Button>
              </div>
            </div>
          ))
        )}
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogPortal>
          <DialogOverlay className="bg-transparent data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
          <DialogPrimitive.Content
            className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg"
          >
            <DialogHeader>
              <DialogTitle>Report Details</DialogTitle>
            </DialogHeader>
            {selected && (
              <div className="grid gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Report No</Label>
                    <Input readOnly value={selected.reportNo || `SR-${selected.id}`} />
                  </div>
                  <div className="space-y-1">
                    <Label>Date & Time</Label>
                    <Input readOnly value={selected.time} />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label>Severity</Label>
                  <div>
                    <Badge className={severityColor(selected.severity)}>{selected.severity}</Badge>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label>Selected Symptoms</Label>
                  <div className="flex flex-wrap gap-2">
                    {(selected.selectedSymptoms && selected.selectedSymptoms.length > 0 ? selected.selectedSymptoms : [selected.summary]).map((s, i) => (
                      <Badge key={i} variant="outline" className="rounded-full">{s}</Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label>Description</Label>
                  <Textarea readOnly value={selected.description || selected.summary} className="min-h-[80px]" />
                </div>

                <div className="space-y-1">
                  <Label>Location</Label>
                  <Input readOnly value={selected.location} />
                </div>

                {selected.media && selected.media.length > 0 && (
                  <div className="space-y-1">
                    <Label>Attached Media</Label>
                    <ul className="list-disc list-inside body-small text-text-secondary">
                      {selected.media.map((m, i) => (
                        <li key={i}>{m.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity data-[state=open]:bg-accent data-[state=open]:text-muted-foreground hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogPrimitive.Content>
        </DialogPortal>
      </Dialog>
    </Card>
  );
}
