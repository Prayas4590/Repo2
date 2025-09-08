import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Droplets } from 'lucide-react';
import WaterReportForm, { WaterReport } from './WaterReportForm';
import WaterReportsHistory from './WaterReportsHistory';

export default function WaterSection() {
  const [submitted, setSubmitted] = useState<WaterReport | null>(null);

  return (
    <section className="space-y-4">
      <Card className="material-card">
        <CardHeader className="pb-2">
          <CardTitle className="title-medium flex items-center gap-2">
            <Droplets className="h-5 w-5 text-coordinator" />
            Water Quality Reporting
          </CardTitle>
        </CardHeader>
        <CardContent className="body-medium text-text-secondary">
          Report water quality issues, attach media, tag location, and request an inspection.
        </CardContent>
      </Card>

      <WaterReportForm onSubmitted={setSubmitted} />

      {submitted && (
        <Card className="material-card animate-fade-in">
          <CardHeader className="pb-2">
            <CardTitle className="title-medium flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              Report Submitted
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 body-medium text-text-secondary">
            <p>Report ID: {submitted.id}</p>
            <p>Time: {submitted.time}</p>
            <p>Observed at: {submitted.sourcePlace}</p>
            {submitted.inspection !== 'none' ? (
              <p>Inspection requested: {submitted.inspection === 'asha' ? 'ASHA Worker' : 'Health Team'}</p>
            ) : (
              <p>No inspection requested.</p>
            )}
          </CardContent>
        </Card>
      )}

      <WaterReportsHistory />
    </section>
  );
}
