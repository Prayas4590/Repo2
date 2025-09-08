import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FileText, Thermometer, Droplets, AlertTriangle, Plus, Clock } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useRole } from '@/contexts/RoleContext';
import { SymptomsSection, WaterSection } from '@/components/CitizenComponent';

const ReportsPage = () => {
  const [reportType, setReportType] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const location = useLocation();
  const { currentRole } = useRole();
  const [severity, setSeverity] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const recentReports = [
    { id: 1, type: 'Symptom Report', description: 'Fever and headache', severity: 'medium', time: '2 hours ago', status: 'submitted' },
    { id: 2, type: 'Water Quality', description: 'Suspicious water color in Block A', severity: 'high', time: '1 day ago', status: 'investigating' },
    { id: 3, type: 'Symptom Report', description: 'Stomach pain after meal', severity: 'low', time: '3 days ago', status: 'resolved' }
  ];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get('type');
    if (currentRole === 'citizen') {
      setReportType(type === 'water' ? 'water' : 'symptoms');
      return;
    }
    if (type === 'water') setReportType('water');
    else if (type === 'symptoms' || type === 'emergency') setReportType(type);
    else if (!reportType) setReportType('symptoms');
  }, [location.search, currentRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportType || !symptoms || !severity) return;
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({ title: 'Report Submitted', description: 'Your report has been submitted successfully and will be reviewed by health workers.' });
    setReportType('');
    setSymptoms('');
    setSeverity('');
    setLoading(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-error text-error-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-success text-success-foreground';
      case 'investigating': return 'bg-warning text-warning-foreground';
      case 'submitted': return 'bg-info text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const isCitizen = currentRole === 'citizen';

  if (isCitizen) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center py-4">
          <h1 className="headline-medium text-text-primary mb-2">{reportType === 'water' ? 'Report Water Issue' : 'Report Symptoms'}</h1>
          <p className="body-medium text-text-secondary">{reportType === 'water' ? 'Report water quality issues and request inspection' : 'Enable quick symptom reporting and tracking'}</p>
        </div>
        {reportType === 'water' ? <WaterSection /> : <SymptomsSection />}
      </div>
    );
  }

  const reportTypes = [
    { id: 'symptoms', label: 'Health Symptoms', icon: Thermometer, color: 'bg-error/10 text-error' },
    { id: 'water', label: 'Water Quality Issue', icon: Droplets, color: 'bg-coordinator-light text-coordinator' },
    { id: 'emergency', label: 'Health Emergency', icon: AlertTriangle, color: 'bg-warning/10 text-warning' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center py-4">
        <h1 className="headline-medium text-text-primary mb-2">Health Reports</h1>
        <p className="body-medium text-text-secondary">Report symptoms and health concerns</p>
      </div>

      {/* Quick Report Types */}
      <div className="space-y-4">
        <h2 className="title-medium text-text-primary">Report Type</h2>
        <div className="grid gap-3">
          {reportTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Button
                key={type.id}
                variant={reportType === type.id ? 'default' : 'outline'}
                className="h-16 justify-start gap-4 ripple"
                onClick={() => setReportType(type.id)}
              >
                <div className={`w-12 h-12 ${type.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className="label-large">{type.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Report Form */}
      {reportType ? (
        <Card className="material-card">
          <CardHeader className="pb-3">
            <CardTitle className="title-medium flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Submit Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="symptoms" className="label-medium text-text-primary">
                  {reportType === 'symptoms' ? 'Describe Symptoms' : reportType === 'water' ? 'Describe Water Issue' : 'Describe Emergency'}
                </Label>
                <Textarea id="symptoms" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder={reportType === 'symptoms' ? 'fever, headache, nausea...' : reportType === 'water' ? 'water color, smell, taste...' : 'urgent health concern...'} className="min-h-[100px] border-input" required />
              </div>

              {/* Severity */}
              <div className="space-y-2">
                <Label className="label-medium text-text-primary">Severity Level</Label>
                <Select value={severity} onValueChange={setSeverity} required>
                  <SelectTrigger className="border-input"><SelectValue placeholder="Select severity" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">🟢 Mild - Can wait</SelectItem>
                    <SelectItem value="medium">🟡 Moderate - Needs attention</SelectItem>
                    <SelectItem value="high">🔴 Severe - Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <Button type="submit" disabled={loading} className="w-full material-button bg-primary text-primary-foreground hover:bg-primary/90 ripple">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                    Submitting Report...
                  </div>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Submit Report
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : null}

      {/* Recent Reports */}
      <Card className="material-card">
        <CardHeader className="pb-3">
          <CardTitle className="title-medium flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Recent Reports
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentReports.map((report) => (
            <div key={report.id} className="flex items-start gap-3 p-3 hover:bg-muted/50 rounded-lg transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="label-medium text-text-primary">{report.type}</p>
                  <Badge className={getSeverityColor(report.severity)}>{report.severity}</Badge>
                </div>
                <p className="body-small text-text-secondary line-clamp-2">{report.description}</p>
                <p className="body-small text-text-disabled mt-1">{report.time}</p>
              </div>
              <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;
